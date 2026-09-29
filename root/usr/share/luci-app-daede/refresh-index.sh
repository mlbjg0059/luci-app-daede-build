#!/bin/sh
# refresh-index.sh - 刷新索引

# 刷新 LuCI 索引
rm -f /tmp/luci-indexcache
rm -f /tmp/luci-modulecache/*

# 重新生成配置
/usr/share/luci-app-daede/gen-dae-config.sh

echo "Index refreshed"