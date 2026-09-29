#!/bin/sh
# daede-firewall-apply.sh - 应用防火墙规则

set -e

# 读取 UCI 配置
ICMP_IGNORE=$(uci -q get daed.main.icmp_echo_ignore_all)
LAN_ISOLATION=$(uci -q get daed.main.lan_isolation)

# 设置 ICMP
sysctl -w net.ipv4.icmp_echo_ignore_all=${ICMP_IGNORE:-0}
echo "net.ipv4.icmp_echo_ignore_all=${ICMP_IGNORE:-0}" >> /etc/sysctl.conf

# 设置 LAN 隔离
if [ "${LAN_ISOLATION:-0}" = "1" ]; then
  iptables -I FORWARD -i br-lan -o br-lan -j DROP 2>/dev/null || true
  ip6tables -I FORWARD -i br-lan -o br-lan -j DROP 2>/dev/null || true
else
  iptables -D FORWARD -i br-lan -o br-lan -j DROP 2>/dev/null || true
  ip6tables -D FORWARD -i br-lan -o br-lan -j DROP 2>/dev/null || true
fi

echo "Firewall rules applied"