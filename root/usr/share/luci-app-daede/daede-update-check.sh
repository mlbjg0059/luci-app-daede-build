#!/bin/sh
# daede-update-check.sh - 检查在线更新

set -e

MANIFEST_URL=$(uci -q get daed.update.manifest_url || echo "https://gitee.com/dkzkerr/open-daeui/raw/master/daed-update.json")
TMP_MANIFEST="/tmp/daed-update-manifest.json"

# 下载清单
wget -qO "$TMP_MANIFEST" "$MANIFEST_URL" 2>/dev/null || { echo "Failed to fetch manifest"; exit 1; }

# 解析版本
REMOTE_VERSION=$(jq -r '.version' "$TMP_MANIFEST")
LOCAL_VERSION=$(opkg list-installed daed 2>/dev/null | awk '{print $3}' | head -1)

# 版本比较
version_gt() {
  [ "$1" = "$2" ] && return 1
  local IFS=.
  set -- $1; local a1=$1 a2=$2 a3=$3 a4=$4
  set -- $2; local b1=$1 b2=$2 b3=$3 b4=$4
  [ $a1 -gt $b1 ] && return 0
  [ $a1 -lt $b1 ] && return 1
  [ $a2 -gt $b2 ] && return 0
  [ $a2 -lt $b2 ] && return 1
  [ $a3 -gt $b3 ] && return 0
  [ $a3 -lt $b3 ] && return 1
  [ $a4 -gt $b4 ] && return 0
  return 1
}

if version_gt "$REMOTE_VERSION" "$LOCAL_VERSION"; then
  PACKAGE_URL=$(jq -r '.packageUrl' "$TMP_MANIFEST")
  SHA256=$(jq -r '.sha256' "$TMP_MANIFEST")
  RELEASE_NOTES=$(jq -r '.releaseNotes // ""' "$TMP_MANIFEST")
  echo "UPDATE_AVAILABLE=1"
  echo "VERSION=$REMOTE_VERSION"
  echo "PACKAGE_URL=$PACKAGE_URL"
  echo "SHA256=$SHA256"
  echo "RELEASE_NOTES=$RELEASE_NOTES"
else
  echo "UPDATE_AVAILABLE=0"
fi