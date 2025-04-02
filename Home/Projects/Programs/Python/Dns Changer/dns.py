import os
import sys
import time
import ctypes
import psutil
import subprocess
import threading
from enum import Enum
from tkinter import *
from tkinter import ttk, messagebox

class DNSProvider(Enum):
    ADGUARD = 1
    CLOUDFLARE = 2

class DNSConfiguratorGUI:
    DNS_OPTIONS = {
        DNSProvider.ADGUARD: {
            1: {
                'name': 'Default servers (Block ads/trackers)',
                'ipv4': ('94.140.14.14', '94.140.15.15'),
                'ipv6': ('2a10:50c0::ad1:ff', '2a10:50c0::ad2:ff')
            },
            2: {
                'name': 'Non-filtering servers',
                'ipv4': ('94.140.14.140', '94.140.14.141'),
                'ipv6': ('2a10:50c0::1:ff', '2a10:50c0::2:ff')
            },
            3: {
                'name': 'Family Protection',
                'ipv4': ('94.140.14.15', '94.140.15.16'),
                'ipv6': ('2a10:50c0::bad1:ff', '2a10:50c0::bad2:ff')
            }
        },
        DNSProvider.CLOUDFLARE: {
            1: {
                'name': 'Block malware',
                'ipv4': ('1.1.1.2', '1.0.0.2'),
                'ipv6': ('2606:4700:4700::1112', '2606:4700:4700::1002')
            },
            2: {
                'name': 'Block malware and adult content',
                'ipv4': ('1.1.1.3', '1.0.0.3'),
                'ipv6': ('2606:4700:4700::1113', '2606:4700:4700::1003')
            }
        }
    }

    def __init__(self):
        self.root = None
        self.active_interface = None
        self.selected_option = {}
        self.loading_window = None
        self.check_admin_and_initialize()

    def check_admin_and_initialize(self):
        if not self.is_admin():
            self.run_as_admin()
            sys.exit(0)
        else:
            self.initialize_gui()

    def is_admin(self):
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

    def run_as_admin(self):
        try:
            script_path = os.path.abspath(sys.argv[0])
            ctypes.windll.shell32.ShellExecuteW(
                None,
                "runas",
                sys.executable,
                f'"{script_path}"',
                None,
                1
            )
            return True
        except Exception as e:
            messagebox.showerror("Error", f"Elevation error: {str(e)}")
            return False

    def get_active_interface(self):
        try:
            stats = psutil.net_if_stats()
            io_counters = psutil.net_io_counters(pernic=True)
            
            vpn_keywords = [
                'vpn', 'tunnel', 'mcafee', 'wireguard',
                'openvpn', 'softether', 'zerotier', 'tailscale',
                'pptp', 'l2tp', 'ipsec', 'gre', 'tap-'
            ]

            physical_interfaces = []
            for interface, status in stats.items():
                if any(kw in interface.lower() for kw in vpn_keywords):
                    continue
                
                if status.isup and io_counters.get(interface):
                    traffic = io_counters[interface].bytes_recv + io_counters[interface].bytes_sent
                    if traffic > 1024:
                        physical_interfaces.append((interface, traffic))

            if not physical_interfaces:
                return None

            physical_interfaces.sort(key=lambda x: x[1], reverse=True)
            return physical_interfaces[0][0]
        except Exception as e:
            messagebox.showwarning("Warning", f"Interface detection warning: {str(e)}")
            return None

    def execute_command(self, command):
        try:
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            result = subprocess.run(
                command,
                startupinfo=startupinfo,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            messagebox.showerror("Error", f"Command failed: {e.stderr}")
            return None

    def restart_interface(self):
        try:
            self.execute_command(f'netsh interface set interface "{self.active_interface}" admin=disable')
            time.sleep(3)
            self.execute_command(f'netsh interface set interface "{self.active_interface}" admin=enable')
            time.sleep(5)
            
            stats = psutil.net_if_stats()
            if self.active_interface in stats and stats[self.active_interface].isup:
                return True
            else:
                return False
        except Exception as e:
            messagebox.showerror("Error", f"Error restarting interface: {str(e)}")
            return False

    def set_dns_servers(self, ipv4_servers=None, ipv6_servers=None):
        try:
            self.execute_command(f'netsh interface ipv4 set dnsservers name="{self.active_interface}" source=dhcp')
            self.execute_command(f'netsh interface ipv6 set dnsservers name="{self.active_interface}" source=dhcp')
            time.sleep(1)

            if ipv4_servers:
                self.execute_command(f'netsh interface ipv4 set dns name="{self.active_interface}" static {ipv4_servers[0]} primary')
                if len(ipv4_servers) > 1:
                    self.execute_command(f'netsh interface ipv4 add dns name="{self.active_interface}" {ipv4_servers[1]} index=2')

            if ipv6_servers:
                self.execute_command(f'netsh interface ipv6 set dns name="{self.active_interface}" static {ipv6_servers[0]} primary')
                if len(ipv6_servers) > 1:
                    self.execute_command(f'netsh interface ipv6 add dns name="{self.active_interface}" {ipv6_servers[1]} index=2')

            self.execute_command("ipconfig /flushdns")
            
            if not self.restart_interface():
                messagebox.showwarning("Warning", "DNS settings applied but interface restart failed")
                return False
                
            return True
        except Exception as e:
            messagebox.showerror("Error", f"DNS configuration error: {str(e)}")
            return False

    def initialize_gui(self):
        self.root = Tk()
        self.root.title("DNS Configuration Tool")
        self.root.geometry("650x550")
        self.root.resizable(False, False)
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

        # Imposta l'icona personalizzata
        try:
            icon_path = self.get_icon_path()
            if icon_path and os.path.exists(icon_path):
                self.root.iconbitmap(icon_path)
            else:
                print("Icon file not found, using default icon")
        except Exception as e:
            print(f"Error loading icon: {e}")

        # Configurazione stili
        self.style = ttk.Style()
        self.style.configure('TButton', font=('Helvetica', 12), padding=12)
        self.style.configure('Title.TLabel', font=('Helvetica', 16, 'bold'))
        self.style.configure('Subtitle.TLabel', font=('Helvetica', 12))
        self.style.configure('Option.TRadiobutton', font=('Helvetica', 12), padding=6)
        self.style.configure('Large.TButton', font=('Helvetica', 12), padding=10)

        self.active_interface = self.get_active_interface()
        if not self.active_interface:
            messagebox.showerror("Error", "No active network interface found")
            sys.exit(1)

        self.create_main_frame()
        self.root.mainloop()

    def get_icon_path(self):
        """Restituisce il percorso dell'icona personalizzata"""
        # Cerca l'icona nella stessa directory dello script
        script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        icon_name = "dns_icon.ico"  # Sostituisci con il nome del tuo file .ico
        icon_path = os.path.join(script_dir, icon_name)
        
        # Se non trovata, cerca nella directory corrente
        if not os.path.exists(icon_path):
            icon_path = os.path.join(os.getcwd(), icon_name)
        
        return icon_path if os.path.exists(icon_path) else None

    def create_main_frame(self):
        main_frame = ttk.Frame(self.root, padding=35)
        main_frame.pack(fill=BOTH, expand=True)

        ttk.Label(main_frame, text="DNS Configuration Tool", style='Title.TLabel').pack(pady=20)
        ttk.Label(main_frame, text=f"Active Interface: {self.active_interface}", style='Subtitle.TLabel').pack(pady=10)

        buttons = [
            ("AdGuard DNS", lambda: self.show_provider_options(DNSProvider.ADGUARD)),
            ("Cloudflare DNS", lambda: self.show_provider_options(DNSProvider.CLOUDFLARE)),
            ("Reset to Default DNS", self.reset_dns),
            ("Exit", self.on_close)
        ]

        for text, command in buttons:
            btn = ttk.Button(main_frame, text=text, command=command, width=25, style='Large.TButton')
            btn.pack(pady=12)
            # Aggiungi effetto hover con cursore a mano
            btn.bind("<Enter>", lambda e, b=btn: b.configure(cursor="hand2"))
            btn.bind("<Leave>", lambda e, b=btn: b.configure(cursor=""))

    def show_provider_options(self, provider):
        options_window = Toplevel(self.root)
        options_window.title(f"{provider.name} Options")
        options_window.geometry("500x400")
        options_window.resizable(False, False)
        options_window.grab_set()

        # Imposta la stessa icona per la finestra secondaria
        try:
            icon_path = self.get_icon_path()
            if icon_path and os.path.exists(icon_path):
                options_window.iconbitmap(icon_path)
        except Exception as e:
            print(f"Error loading icon for child window: {e}")

        main_frame = ttk.Frame(options_window, padding=30)
        main_frame.pack(fill=BOTH, expand=True)

        ttk.Label(main_frame, 
                 text=f"Select {provider.name} DNS Option:", 
                 font=('Helvetica', 14, 'bold')).pack(pady=15)

        options = self.DNS_OPTIONS[provider]
        self.selected_option[provider] = IntVar(value=1)

        for idx, config in options.items():
            frame = ttk.Frame(main_frame)
            frame.pack(fill=X, pady=8)
            
            rb = ttk.Radiobutton(
                frame,
                text=config['name'],
                variable=self.selected_option[provider],
                value=idx,
                style='Option.TRadiobutton'
            )
            rb.pack(side=LEFT, anchor=W)

        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(pady=20)
        
        configure_btn = ttk.Button(btn_frame, 
                 text="Configure", 
                 command=lambda: self.apply_configuration(provider, options_window),
                 style='Large.TButton')
        configure_btn.pack(side=LEFT, padx=15)
        configure_btn.bind("<Enter>", lambda e: configure_btn.configure(cursor="hand2"))
        configure_btn.bind("<Leave>", lambda e: configure_btn.configure(cursor=""))
        
        back_btn = ttk.Button(btn_frame, 
                 text="Back", 
                 command=options_window.destroy,
                 style='Large.TButton')
        back_btn.pack(side=LEFT, padx=15)
        back_btn.bind("<Enter>", lambda e: back_btn.configure(cursor="hand2"))
        back_btn.bind("<Leave>", lambda e: back_btn.configure(cursor=""))

    def show_loading(self, title="Processing"):
        self.loading_window = Toplevel(self.root)
        self.loading_window.title(title)
        self.loading_window.geometry("350x150")
        self.loading_window.resizable(False, False)
        
        # Centra la finestra di caricamento
        x = self.root.winfo_x() + (self.root.winfo_width() // 2) - 175
        y = self.root.winfo_y() + (self.root.winfo_height() // 2) - 75
        self.loading_window.geometry(f"+{x}+{y}")
        
        # Imposta l'icona per la finestra di caricamento
        try:
            icon_path = self.get_icon_path()
            if icon_path and os.path.exists(icon_path):
                self.loading_window.iconbitmap(icon_path)
        except Exception as e:
            print(f"Error loading icon for loading window: {e}")
        
        self.loading_window.transient(self.root)
        self.loading_window.grab_set()
        
        main_frame = ttk.Frame(self.loading_window, padding=20)
        main_frame.pack(fill=BOTH, expand=True)
        
        ttk.Label(main_frame, text="Please wait...", font=('Helvetica', 12)).pack(pady=10)
        progress = ttk.Progressbar(main_frame, mode='indeterminate')
        progress.pack(pady=10)
        progress.start()

    def hide_loading(self):
        if self.loading_window:
            self.loading_window.destroy()
            self.loading_window = None

    def apply_configuration(self, provider, window):
        selected = self.selected_option[provider].get()
        config = self.DNS_OPTIONS[provider][selected]
        
        def thread_target():
            self.show_loading("Applying Configuration")
            try:
                success = self.set_dns_servers(config['ipv4'], config['ipv6'])
                self.root.after(0, lambda: self.hide_loading())
                if success:
                    self.root.after(0, lambda: messagebox.showinfo(
                        "Success", 
                        f"DNS configuration applied successfully!\n\n"
                        f"Selected option: {config['name']}\n"
                        f"Interface: {self.active_interface}"
                    ))
            except Exception as e:
                self.root.after(0, lambda: self.hide_loading())
                self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
            finally:
                self.root.after(0, window.destroy)

        threading.Thread(target=thread_target, daemon=True).start()

    def reset_dns(self):
        def thread_target():
            self.show_loading("Resetting DNS")
            try:
                success = self.set_dns_servers()
                self.root.after(0, lambda: self.hide_loading())
                if success:
                    self.root.after(0, lambda: messagebox.showinfo(
                        "Success", 
                        f"DNS reset to default successfully!\n\n"
                        f"Interface: {self.active_interface}"
                    ))
            except Exception as e:
                self.root.after(0, lambda: self.hide_loading())
                self.root.after(0, lambda: messagebox.showerror("Error", str(e)))

        threading.Thread(target=thread_target, daemon=True).start()

    def on_close(self):
        self.root.destroy()
        sys.exit(0)

if __name__ == "__main__":
    try:
        DNSConfiguratorGUI()
    except Exception as e:
        messagebox.showerror("Fatal Error", f"Application crash: {str(e)}")
        sys.exit(1)
