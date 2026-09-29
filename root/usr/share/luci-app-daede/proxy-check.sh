#!/bin/sh
# proxy-check.sh - 检查代理连接

TARGET="${1:-https://www.google.com}"
TIMEOUT=5

curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" --proxy "$http_proxy" "$TARGET" 2>/dev/null || echo "000"