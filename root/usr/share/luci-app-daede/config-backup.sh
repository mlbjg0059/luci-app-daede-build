#!/bin/sh
# config-backup.sh - 备份 DAE 配置

BACKUP_DIR="/etc/daed/backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/daed-backup-$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_FILE" -C /etc daed 2>/dev/null

# 保留最近 10 个备份
cd "$BACKUP_DIR"
ls -t daed-backup-*.tar.gz | tail -n +11 | xargs rm -f 2>/dev/null

echo "Backup created: $BACKUP_FILE"