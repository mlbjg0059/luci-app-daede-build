#!/bin/sh
# clash2dae.sh - 将 Clash 配置转换为 DAE 配置
# 用法: clash2dae.sh <订阅名称> <策略组名称>

set -e

NAME="$1"
GROUP="$2"
YAML=$(cat)

[ -z "$NAME" ] && { echo "Usage: $0 <name> <group>"; exit 1; }
[ -z "$GROUP" ] && GROUP="proxy"

# 解析 YAML (简化版，实际需要更完整的解析)
# 这里使用简单的解析逻辑，实际生产环境建议使用完整的 YAML 解析器

echo "$YAML" | awk '
BEGIN {
    in_proxies = 0
    in_proxy_groups = 0
    in_rules = 0
}

/^proxies:/ { in_proxies = 1; next }
/^proxy-groups:/ { in_proxies = 0; in_proxy_groups = 1; next }
/^rules:/ { in_proxy_groups = 0; in_rules = 1; next }
/^[^ ]/ { in_proxies = 0; in_proxy_groups = 0; in_rules = 0 }

in_proxies && /^  - name:/ {
    gsub(/^  - name: /, "")
    gsub(/"/, "")
    name = $0
}

/^    server:/ && in_proxies {
    gsub(/^    server: /, "")
    server = $0
}

/^    port:/ && in_proxies {
    gsub(/^    port: /, "")
    port = $0
}

/^    type:/ && in_proxies {
    gsub(/^    type: /, "")
    type = $0
}

/^    password:/ && in_proxies {
    gsub(/^    password: /, "")
    password = $0
}

/^    uuid:/ && in_proxies {
    gsub(/^    uuid: /, "")
    uuid = $0
}

/^    cipher:/ && in_proxies {
    gsub(/^    cipher: /, "")
    cipher = $0
}

/^    network:/ && in_proxies {
    gsub(/^    network: /, "")
    network = $0
}

/^    ws-path:/ && in_proxies {
    gsub(/^    ws-path: /, "")
    ws_path = $0
}

/^    tls:/ && in_proxies {
    gsub(/^    tls: /, "")
    tls = $0
}

/^    skip-cert-verify:/ && in_proxies {
    gsub(/^    skip-cert-verify: /, "")
    skip_cert_verify = $0
}

/^    sni:/ && in_proxies {
    gsub(/^    sni: /, "")
    sni = $0
}

in_proxies && /^    / && /:$/ && !/^(    server|port|type|password|uuid|cipher|network|ws-path|tls|skip-cert-verify|sni):/ {
    # 忽略其他字段
}

in_proxies && /^  -/ && name != "" && server != "" {
    # 输出节点配置
    printf "  - name: \"%s\"\n", name
    printf "    link: \"%s\"\n", generate_link(name, server, port, type, password, uuid, cipher, network, ws_path, tls, skip_cert_verify, sni, uuid)
    printf "    tag: \"%s\"\n", type
    name = ""; server = ""; port = ""; type = ""; password = ""; uuid = ""; cipher = ""; network = ""; ws_path = ""; tls = ""; skip_cert_verify = ""; sni = ""
}

function generate_link(name, server, port, type, password, uuid, cipher, network, ws_path, tls, skip_cert_verify, sni, uuid) {
    if (type == "vmess") {
        return "vmess://" name
    } else if (type == "trojan") {
        return "trojan://" password "@" server ":" port
    } else if (type == "ss" || type == "shadowsocks") {
        return "ss://" cipher ":" password "@" server ":" port
    } else if (type == "vless") {
        return "vless://" uuid "@" server ":" port
    } else if (type == "hysteria2") {
        return "hysteria2://" password "@" server ":" port
    } else if (type == "tuic") {
        return "tuic://" uuid ":" password "@" server ":" port
    }
    return ""
}

END {
    # 输出策略组配置
    if (group_name != "") {
        printf "  - name: \"%s\"\n", group_name
        printf "    policy: \"min\"\n"
        printf "    node_ids: [\"node-1\"]\n"
    }
}
' "$GROUP" <<EOF
$YAML
EOF