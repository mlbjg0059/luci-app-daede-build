# luci-app-daede - DAE Management Interface (YACD Style)

基于 Vue 3 + Pinia + Vue Router + i18n 的现代化 DAE 管理界面，采用 YACD 风格设计。

## 功能特性

- 📊 **实时监控** - 流量统计、连接列表、节点状态
- ⚙️ **系统调优** - 内核参数(sysctl)、防火墙隔离配置
- 🛡️ **局域网隔离** - 全局防护 + 自定义 CIDR 规则
- 📦 **订阅管理** - Clash 订阅导入、转换、管理
- 🔄 **在线更新** - 一键检查更新、下载安装
- 🌐 **国际化** - 中英文切换
- 🎨 **YACD 风格** - 现代化 UI 设计

## 目录结构

```
luci-app-daede/
├── htdocs/
│   └── luci-static/resources/view/daede/
│       ├── app.js                 # 入口文件
│       ├── App.vue                # 根组件
│       ├── router.js              # 路由配置
│       ├── store/                 # Pinia 状态管理
│       │   ├── index.js
│       │   └── modules/
│       │       ├── dae.js         # DAE 核心状态
│       │       ├── system.js      # 系统调优
│       │       ├── network.js     # 局域网隔离
│       │       ├── subscription.js # 订阅管理
│       │       └── update.js      # 在线更新
│       ├── i18n/                  # 国际化
│       │   ├── index.js
│       │   └── locales/
│       │       ├── zh-CN.js
│       │       └── en-US.js
│       ├── api/                   # API 接口封装
│       ├── components/            # 通用组件
│       ├── views/                 # 页面视图
│       ├── utils/                 # 工具函数
│       └── index.html
├── root/
│   ├── etc/
│   │   ├── config/daede           # UCI 默认配置
│   │   └── uci-defaults/90-luci-app-daede-init
│   ├── usr/share/luci-app-daede/  # Shell 脚本
│   │   ├── gen-dae-config.sh
│   │   ├── daed-sub-update.sh
│   │   ├── daede-firewall-apply.sh
│   │   ├── daede-update-check.sh
│   │   ├── clash2dae.sh
│   │   └── ...
│   ├── usr/share/luci/menu.d/     # LuCI 菜单
│   ├── usr/share/rpcd/acl.d/      # RPC 权限
│   └── www/cgi-bin/               # CGI 接口
│       ├── daede-graphql
│       ├── daede-sub
│       ├── daede-sysctl
│       ├── daede-firewall
│       ├── daede-sub-convert
│       └── daede-update
└── Makefile
```

## 安装方法

### 方法 1: 使用 Makefile 编译 (推荐)

```bash
# 在 OpenWrt SDK 中
cd package/
git clone <this-repo> luci-app-daede
make package/luci-app-daede/compile V=s
```

### 方法 2: 直接安装 IPK

```bash
opkg install luci-app-daede_1.0.0-1_x86_64.ipk
```

## 配置说明

### 后端依赖

- `daed` - DAE 核心 (GraphQL API 端口 2023)
- `clash2dae` - 订阅转换工具 (可选)
- `luci-base`, `luci-compat`, `rpcd`, `jq`, `curl`, `wget`

### 前端配置

修改 `htdocs/luci-static/resources/view/daede/utils/yacd-theme.css` 自定义主题色。

### GraphQL 端点

默认连接 `http://192.168.100.1:2023/graphql`，可在设置中修改。

## 开发指南

### 本地开发

```bash
cd htdocs/luci-static/resources/view/daede
npm install
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 添加新页面

1. 在 `views/` 创建新的 `.vue` 文件
2. 在 `router.js` 中添加路由
3. 在 `luci-app-daede.json` 中添加菜单项
4. 在 `luci-app-daede.json` (acl.d) 中添加权限

## API 接口

### GraphQL 代理
- `POST /cgi-bin/daede-graphql` - 代理 DAE 核心 GraphQL

### 系统配置
- `GET /api/system/config` - 获取系统配置
- `POST /api/system/sysctl` - 设置 sysctl 参数
- `POST /api/system/firewall` - 设置防火墙规则

### 订阅管理
- `GET /api/subscriptions` - 获取订阅列表
- `POST /api/subscriptions` - 添加订阅
- `PUT /api/subscriptions/:id` - 更新订阅
- `DELETE /api/subscriptions/:id` - 删除订阅
- `POST /api/subscriptions/convert` - 转换 Clash 订阅

### 在线更新
- `GET /api/update/check` - 检查更新
- `POST /api/update/install` - 安装更新

## 许可证

MIT License