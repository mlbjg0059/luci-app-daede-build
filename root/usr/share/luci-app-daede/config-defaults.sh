#!/bin/sh
# config-defaults.sh - 重置为默认配置

set -e

# 重置 UCI 配置
uci -q batch <<-EOF
	delete daed.main
	set daed.main=daed
	set daed.main.enabled='1'
	set daed.main.graphql_port='2023'
	set daed.main.web_port='8080'
	set daed.main.log_level='info'
	set daed.main.icmp_echo_ignore_all='0'
	set daed.main.lan_isolation='0'
	delete daed.update
	set daed.update=update
	set daed.update.manifest_url='https://gitee.com/dkzkerr/open-daeui/raw/master/daed-update.json'
	commit daed
EOF

# 重新生成配置
/usr/share/luci-app-daede/gen-dae-config.sh

echo "Default configuration restored"