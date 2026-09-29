#!/bin/sh
# gen-dae-config.sh - 生成 DAE 配置

set -e

DAE_CONFIG="/etc/daed/daed.yaml"
UCI_CONFIG="/etc/config/daed"

# 读取 UCI 配置
ENABLED=$(uci -q get daed.main.enabled)
GRAPQL_PORT=$(uci -q get daed.main.graphql_port)
WEB_PORT=$(uci -q get daed.main.web_port)
LOG_LEVEL=$(uci -q get daed.main.log_level)

cat > "$DAE_CONFIG" <<EOF
# DAE 配置文件 - 由 gen-dae-config.sh 自动生成
# 生成时间: $(date)

daed:
  enabled: $ENABLED
  graphql_port: $GRAPQL_PORT
  web_port: $WEB_PORT
  log_level: $LOG_LEVEL

# 内核参数优化
sysctl:
  fs.file-max: 100000
  net.core.somaxconn: 2048
  net.ipv4.tcp_tw_reuse: 1
  net.ipv4.tcp_fin_timeout: 30
  vm.swappiness: 10

# 防火墙隔离
firewall:
  icmp_echo_ignore_all: 0
  lan_isolation: 0

# 订阅配置
subscriptions: []

# 路由配置
routing:
  rules: []
  fallback: "direct"

# DNS 配置
dns:
  upstreams: []
  rules: []
EOF

# 应用 sysctl
sysctl -p

# 应用防火墙规则
/usr/share/luci-app-daede/daede-firewall-apply.sh

echo "DAE 配置已生成: $DAE_CONFIG"