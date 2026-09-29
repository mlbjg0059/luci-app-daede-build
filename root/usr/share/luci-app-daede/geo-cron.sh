#!/bin/sh
# geo-cron.sh - 定时更新 GeoIP/GeoSite

/usr/share/luci-app-daede/update-geo.sh >> /var/log/daed-geo-update.log 2>&1