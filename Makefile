include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-daede
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-daede
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=DAE Management Interface (YACD Style)
  DEPENDS:=+luci-base +luci-compat +rpcd +rpcd-mod-rrdns +daed +jshn +jq +curl +wget +iptables +ip6tables +sysctl
endef

define Package/luci-app-daede/description
  Modern YACD-style UI for DAE with system tuning, LAN isolation,
  subscription conversion, and online updates.
endef

define Build/Compile
	# 无需编译，纯解释型
endef

define Package/luci-app-daede/install
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci
	cp -r $(PKG_BUILD_DIR)/htdocs $(1)/usr/lib/lua/luci/
	cp -r $(PKG_BUILD_DIR)/root/* $(1)/
endef

$(eval $(call BuildPackage,luci-app-daede))