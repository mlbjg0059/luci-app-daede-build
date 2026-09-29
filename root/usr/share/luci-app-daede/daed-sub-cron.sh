#!/bin/sh
# daed-sub-cron.sh - 定时更新订阅

/usr/share/luci-app-daede/daed-sub-update.sh >> /var/log/daed-sub-update.log 2>&1