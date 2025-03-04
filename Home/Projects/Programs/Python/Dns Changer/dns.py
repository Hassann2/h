import os
import psutil
import ctypes
import sys
import time
import random
import string

class App:
    def __init__(self):
        self.animate_intro()
        if self.is_admin():
            self.show_options()
        else:
            ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, __file__, None, 1)

    @staticmethod
    def is_admin():
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False

    @staticmethod
    def get_active_interface():
        interfaces = psutil.net_if_addrs()
        stats = psutil.net_if_stats()
        active_interfaces = [iface for iface, addrs in interfaces.items() if stats[iface].isup]
        return active_interfaces

    @staticmethod
    def get_interface_with_traffic(interfaces):
        for interface in interfaces:
            counters = psutil.net_io_counters(pernic=True)
            if counters[interface].bytes_recv > 0:
                return interface
        return None

    @staticmethod
    def change_dns(dns1, dns2=None, ipv6_dns1=None, ipv6_dns2=None):
        interfaces = App.get_active_interface()
        interface = App.get_interface_with_traffic(interfaces)
        if not interface:
            print("No active interface with traffic found.")
            return

        print(f"Active interface with traffic: {interface}")

        command = f'netsh interface ip set dns name="{interface}" static {dns1}'
        os.system(command)
        if dns2:
            command = f'netsh interface ip add dns name="{interface}" {dns2} index=2'
            os.system(command)

        if ipv6_dns1:
            command = f'netsh interface ipv6 set dnsservers name="{interface}" static {ipv6_dns1}'
            os.system(command)
        if ipv6_dns2:
            command = f'netsh interface ipv6 add dnsservers name="{interface}" {ipv6_dns2} index=2'
            os.system(command)

    def show_options(self):
        while True:
            print("Protect your network by choosing one of these servers:\n")
            print("1. Adguard")
            print("2. Cloudflare")
            print("3. exit\n")
            choice = input("Enter the number of your choice: ")

            if choice == '1':
                self.adguard_options()
            elif choice == '2':
                self.cloudflare_options()
            elif choice == '3':
                sys.exit(0)
            else:
                print("Invalid choice. Exiting.")
                return

    def adguard_options(self):
        while True:
            os.system('cls||clear')
            print("                     ADGUARD                     \n\n")
            print("1. Default servers --> DNS blocks ads and trackers\n")
            print("2. Non-filtering servers --> DNS will not block ads, trackers or other DNS requests, \n   Change your IP and Location\n")
            print("3. Family Protection Server --> DNS will block ads, trackers, adult content \n   and enable Safe Search and Safe Mode where possible\n")
            print("4. back\n")
            print("5. exit")
            choice = input("Enter the number of your choice: ")
            if choice == '1':
                primary_dns = "94.140.14.14"
                secondary_dns = "94.140.15.15"
                primary_ipv6_dns = "2a10:50c0::ad1:ff"
                secondary_ipv6_dns = "2a10:50c0::ad2:ff"
                break
            elif choice == '2':
                primary_dns = "94.140.14.140"
                secondary_dns = "94.140.14.141"
                primary_ipv6_dns = "2a10:50c0::1:ff"
                secondary_ipv6_dns = "2a10:50c0::2:ff"
                break
            elif choice == '3':
                primary_dns = "94.140.14.15"
                secondary_dns = "94.140.15.16"
                primary_ipv6_dns = "2a10:50c0::bad1:ff"
                secondary_ipv6_dns = "2a10:50c0::bad2:ff"
                break
            elif choice == '4':
                os.system('cls||clear')
                return
            elif choice == '5':
                sys.exit(0)
            else:
                print("Invalid choice. Please try again.")

        self.change_dns(primary_dns, secondary_dns, primary_ipv6_dns, secondary_ipv6_dns)

    def cloudflare_options(self):
        while True:
            os.system('cls||clear')
            print("                     CLOUDFLARE                     \n\n")
            print("1. Block malware --> DNS resolvers to block malicious content\n")
            print("2. Block malware and adult content --> DNS resolvers to block malware and adult content\n")
            print("3. back\n")
            print("4. exit")
            choice = input("Enter the number of your choice: ")
            if choice == '1':
                primary_dns = "1.1.1.2"
                secondary_dns = "1.0.0.2"
                primary_ipv6_dns = "2606:4700:4700::1112"
                secondary_ipv6_dns = "2606:4700:4700::1002"
                break
            elif choice == '2':
                primary_dns = "1.1.1.3"
                secondary_dns = "1.0.0.3"
                primary_ipv6_dns = "2606:4700:4700::1113"
                secondary_ipv6_dns = "2606:4700:4700::1003"
                break
            elif choice == '3':
                os.system('cls||clear')
                return
            elif choice == '4':
                sys.exit(0)
            else:
                print("Invalid choice. Please try again.")

        self.change_dns(primary_dns, secondary_dns, primary_ipv6_dns, secondary_ipv6_dns)

    def animate_intro(self):
        print("Initializing DNS Changer...")
        time.sleep(1)
        for i in range(10):
            random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
            print(f"\rLoading... {random_string}", end="")
            time.sleep(0.2)
        print("\nWelcome to the DNS Changer!")

if __name__ == "__main__":
    App()