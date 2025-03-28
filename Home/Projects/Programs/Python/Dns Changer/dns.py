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
                'name': 'Family Protection Server',
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
            self.check_admin_privileges()
            self.active_interface = self.detect_active_interface()
            if not self.active_interface:
                print(f"{Fore.RED}No active network interface found!")
                self.pause_exit()
            print(f"{Fore.GREEN}Active interface: {self.active_interface}")
        except Exception as e:
            print(f"{Fore.RED}Initialization error: {str(e)}")
            self.pause_exit()

    def check_admin_privileges(self):
        try:
            admin = ctypes.windll.shell32.IsUserAnAdmin()
            if not admin:
                print(f"{Fore.YELLOW}Requesting admin privileges...")
                ctypes.windll.shell32.ShellExecuteW(
                    None, 
                    "runas", 
                    sys.executable, 
                    f'"{os.path.abspath(__file__)}"', 
                    None, 
                    1
                )
                sys.exit(0)
        except Exception as e:
            print(f"{Fore.RED}Admin check error: {str(e)}")
            self.pause_exit()

    def detect_active_interface(self):
        try:
            stats = psutil.net_if_stats()
            io_counters = psutil.net_io_counters(pernic=True)
            
            for interface, status in stats.items():
                if status.isup and io_counters.get(interface) and io_counters[interface].bytes_recv > 1000:
                    return interface
            return None
        except Exception as e:
            print(f"{Fore.RED}Interface detection error: {str(e)}")
            return None

    def execute_command(self, command):
        try:
            result = subprocess.run(
                command,
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
            # Reset to DHCP
            self.execute_command(f'netsh interface ipv4 set dnsservers name="{self.active_interface}" source=dhcp')
            self.execute_command(f'netsh interface ipv6 set dnsservers name="{self.active_interface}" source=dhcp')
            
            time.sleep(1)

            # Set IPv4
            if ipv4_servers:
                self.execute_command(f'netsh interface ipv4 set dns name="{self.active_interface}" static {ipv4_servers[0]} primary')
                if len(ipv4_servers) > 1:
                    self.execute_command(f'netsh interface ipv4 add dns name="{self.active_interface}" {ipv4_servers[1]} index=2')

            # Set IPv6
            if ipv6_servers:
                self.execute_command(f'netsh interface ipv6 set dns name="{self.active_interface}" static {ipv6_servers[0]} primary')
                if len(ipv6_servers) > 1:
                    self.execute_command(f'netsh interface ipv6 add dns name="{self.active_interface}" {ipv6_servers[1]} index=2')

            # Flush DNS
            self.execute_command("ipconfig /flushdns")
            return True
        except Exception as e:
            print(f"{Fore.RED}DNS setting error: {str(e)}")
            return False

    def display_menu(self):
        os.system('cls')
        print(f"{Fore.CYAN}=== DNS Configuration Tool ===")
        print(f"{Fore.YELLOW}1. AdGuard DNS")
        print(f"{Fore.YELLOW}2. Cloudflare DNS")
        print(f"{Fore.YELLOW}3. Reset to Default DNS")
        print(f"{Fore.YELLOW}4. Exit")
        print(f"{Fore.CYAN}==============================")

    def handle_choice(self, choice):
        if choice == '1':
            self.handle_provider(DNSProvider.ADGUARD)
        elif choice == '2':
            self.handle_provider(DNSProvider.CLOUDFLARE)
        elif choice == '3':
            if self.set_dns_servers():
                print(f"{Fore.GREEN}DNS reset successfully!")
            else:
                print(f"{Fore.RED}DNS reset failed!")
            self.pause()
        elif choice == '4':
            sys.exit()
        else:
            print(f"{Fore.RED}Invalid choice!")

    def handle_provider(self, provider):
        try:
            while True:
                os.system('cls')
                print(f"{Fore.CYAN}=== {provider.name} Options ===")
                options = self.DNS_OPTIONS[provider]
                
                for key in sorted(options.keys()):
                    print(f"{Fore.YELLOW}{key}. {options[key]['name']}")
                
                print(f"\n{Fore.YELLOW}{len(options)+1}. Back")
                print(f"{Fore.YELLOW}{len(options)+2}. Exit")
                
                choice = input(f"\n{Fore.GREEN}Select option: ")
                
                if choice == str(len(options)+1):
                    return
                elif choice == str(len(options)+2):
                    sys.exit()
                elif choice in map(str, options.keys()):
                    config = options[int(choice)]
                    if self.set_dns_servers(config['ipv4'], config['ipv6']):
                        print(f"{Fore.GREEN}DNS configured successfully!")
                    else:
                        print(f"{Fore.RED}DNS configuration failed!")
                    self.pause()
                else:
                    print(f"{Fore.RED}Invalid option!")
                    time.sleep(1)
        except Exception as e:
            print(f"{Fore.RED}Menu error: {str(e)}")
            self.pause()

    def pause(self):
        input(f"\n{Fore.CYAN}Press Enter to continue...")

    def pause_exit(self):
        input(f"\n{Fore.RED}Press Enter to exit...")
        sys.exit(1)

    def main_loop(self):
        while True:
            try:
                self.display_menu()
                choice = input(f"\n{Fore.GREEN}Enter your choice: ").strip()
                self.handle_choice(choice)
            except KeyboardInterrupt:
                print(f"\n{Fore.RED}Operation cancelled!")
                sys.exit()
            except Exception as e:
                print(f"{Fore.RED}Unexpected error: {str(e)}")
                self.pause_exit()

if __name__ == "__main__":
    try:
        configurator = DNSConfigurator()
        configurator.main_loop()
    except Exception as e:
        print(f"{Fore.RED}Fatal error: {str(e)}")
        input("Press Enter to exit...")
        sys.exit(1)
