#!/bin/sh
# daed-sub-update.sh - 更新订阅

set -e

UCI_CONFIG="/etc/config/daed"
SCRIPTS_DIR="/usr/share/luci-app-daede"

# 读取所有启用的订阅
SUBSCRIPTIONS=$(uci -q get daed.main.subscriptions 2>/dev/null || echo "")

for sub in $SUBSCRIPTIONS; do
  URL=$(uci -q get "daed.$sub.url")
  NAME=$(uci -q get "daed.$sub.name")
  GROUP=$(uci -q get "daed.$sub.group")
  ENABLED=$(uci -q get "daed.$sub.enabled")

  [ "$ENABLED" = "1" ] || continue
  [ -z "$URL" ] && continue

  echo "Updating subscription: $NAME ($URL)"

  # 下载配置
  YAML=$(wget -qO- "$URL" 2>/dev/null || curl -fsSL "$URL")
  [ -z "$YAML" ] && { echo "Failed to download $URL"; continue; }

  # 转换配置
  CONFIG=$(echo "$YAML" | "$SCRIPTS_DIR/clash2dae.sh" "$NAME" "$GROUP" 2>/dev/null)
  [ -z "$CONFIG" ] && { echo "Failed to convert $NAME"; continue; }

  # 更新 UCI 配置
  uci -q set "daed.$sub.config"="$CONFIG"
  uci -q set "daed.$sub.last_update"="$(date -Iseconds)"
  uci commit daed
done

echo "Subscription update completed"