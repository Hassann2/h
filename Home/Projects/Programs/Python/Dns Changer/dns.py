import os
import sys
import time
import ctypes
import psutil
import subprocess
from enum import Enum
from colorama import Fore, Style, init

init(autoreset=True)

class DNSProvider(Enum):
    ADGUARD = 1
    CLOUDFLARE = 2

class DNSConfigurator:
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
        try:
            if not self.is_admin():
                self.run_as_admin()
                sys.exit(0)  # Exit after requesting elevation
            
            self.active_interface = self.get_active_interface()
            if not self.active_interface:
                self.exit_with_error("No active network interface found")
            
            print(f"{Fore.GREEN}Active interface: {self.active_interface}")
            time.sleep(1)
        except Exception as e:
            self.exit_with_error(f"Initialization error: {str(e)}")

    def is_admin(self):
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

    def run_as_admin(self):
        try:
            # Get the absolute path to the script
            script_path = os.path.abspath(sys.argv[0])
            
            # Use ShellExecuteW with proper parameters
            ctypes.windll.shell32.ShellExecuteW(
                None,           # hWnd
                "runas",        # Operation
                sys.executable, # Program
                f'"{script_path}"', # Parameters
                None,           # Directory
                1               # Show command
            )
            return True
        except Exception as e:
            print(f"{Fore.RED}Elevation error: {str(e)}")
            return False

    def get_active_interface(self):
        try:
            stats = psutil.net_if_stats()
            io_counters = psutil.net_io_counters(pernic=True)
            
            for interface, status in stats.items():
                if status.isup and io_counters.get(interface):
                    if io_counters[interface].bytes_recv > 1024:
                        return interface
            return None
        except:
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
            print(f"{Fore.RED}Command failed: {e.stderr}")
            return None

    def set_dns_servers(self, ipv4_servers=None, ipv6_servers=None):
        try:
            # Reset to DHCP first
            self.execute_command(f'netsh interface ipv4 set dnsservers name="{self.active_interface}" source=dhcp')
            self.execute_command(f'netsh interface ipv6 set dnsservers name="{self.active_interface}" source=dhcp')
            time.sleep(1)

            # Set IPv4 DNS
            if ipv4_servers:
                self.execute_command(f'netsh interface ipv4 set dns name="{self.active_interface}" static {ipv4_servers[0]} primary')
                if len(ipv4_servers) > 1:
                    self.execute_command(f'netsh interface ipv4 add dns name="{self.active_interface}" {ipv4_servers[1]} index=2')

            # Set IPv6 DNS
            if ipv6_servers:
                self.execute_command(f'netsh interface ipv6 set dns name="{self.active_interface}" static {ipv6_servers[0]} primary')
                if len(ipv6_servers) > 1:
                    self.execute_command(f'netsh interface ipv6 add dns name="{self.active_interface}" {ipv6_servers[1]} index=2')

            # Flush DNS cache
            self.execute_command("ipconfig /flushdns")
            return True
        except Exception as e:
            print(f"{Fore.RED}DNS configuration error: {str(e)}")
            return False

    def show_menu(self, title, options):
        os.system('cls')
        print(f"{Fore.CYAN}{'=' * 50}")
        print(f"{Fore.YELLOW}{title:^50}")
        print(f"{Fore.CYAN}{'=' * 50}\n")
        for key, option in options.items():
            print(f"{Fore.YELLOW}[{key}] {option['name'] if isinstance(option, dict) else option}")

    def main_menu(self):
        while True:
            try:
                self.show_menu("DNS Configuration Tool", {
                    '1': {'name': 'AdGuard DNS'},
                    '2': {'name': 'Cloudflare DNS'},
                    '3': {'name': 'Reset to Default DNS'},
                    '4': {'name': 'Exit'}
                })
                
                choice = input("\nSelect option: ").strip()
                
                if choice == '1':
                    self.provider_menu(DNSProvider.ADGUARD)
                elif choice == '2':
                    self.provider_menu(DNSProvider.CLOUDFLARE)
                elif choice == '3':
                    if self.set_dns_servers():
                        print(f"{Fore.GREEN}DNS reset successfully!")
                    input("\nPress Enter to continue...")
                elif choice == '4':
                    sys.exit(0)
                else:
                    print(f"{Fore.RED}Invalid choice!")
                    time.sleep(1)
            except KeyboardInterrupt:
                sys.exit(0)
            except Exception as e:
                print(f"{Fore.RED}Error: {str(e)}")
                time.sleep(1)

    def provider_menu(self, provider):
        while True:
            try:
                options = self.DNS_OPTIONS[provider]
                menu_options = {str(k): v for k, v in options.items()}
                menu_options[str(len(options)+1)] = {'name': 'Back'}
                menu_options[str(len(options)+2)] = {'name': 'Exit'}
                
                self.show_menu(f"{provider.name} DNS Options", menu_options)
                
                choice = input("\nSelect DNS option: ").strip()
                
                if choice == str(len(options)+1):
                    return
                elif choice == str(len(options)+2):
                    sys.exit(0)
                elif choice in menu_options:
                    config = options[int(choice)]
                    if self.set_dns_servers(config['ipv4'], config['ipv6']):
                        print(f"{Fore.GREEN}DNS configured successfully!")
                    input("\nPress Enter to continue...")
                else:
                    print(f"{Fore.RED}Invalid choice!")
                    time.sleep(1)
            except KeyboardInterrupt:
                return
            except Exception as e:
                print(f"{Fore.RED}Error: {str(e)}")
                time.sleep(1)

    def exit_with_error(self, message):
        print(f"{Fore.RED}{message}")
        input("Press Enter to exit...")
        sys.exit(1)

if __name__ == "__main__":
    try:
        DNSConfigurator().main_menu()
    except Exception as e:
        print(f"{Fore.RED}Fatal error: {str(e)}")
        input("Press Enter to exit...")
        sys.exit(1)
