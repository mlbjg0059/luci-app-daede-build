#!/bin/sh
# update-pkg.sh - 更新软件包

set -e

opkg update
opkg list-upgradable | grep -E "^luci-app-daede|^daed" | while read pkg ver; do
    echo "Upgrading $pkg..."
    opkg upgrade "$pkg"
done

echo "Package update completed"