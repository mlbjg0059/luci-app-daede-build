#!/bin/sh
# update-geo.sh - 更新 GeoIP/GeoSite

set -e

GEO_DIR="/usr/share/daed/geo"
mkdir -p "$GEO_DIR"

# 下载 GeoIP
wget -qO "$GEO_DIR/geoip.dat" "https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat" 2>/dev/null || {
    echo "Failed to download geoip.dat"
    exit 1
}

# 下载 GeoSite
wget -qO "$GEO_DIR/geosite.dat" "https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat" 2>/dev/null || {
    echo "Failed to download geosite.dat"
    exit 1
}

echo "GeoIP/GeoSite updated successfully"