Ext.define("App.view.main.ThemeSwitcher", function() {
    var g = location.href.match(/theme=([\w-]+)/), d = location.href.match(/locale=([\w-]+)/);
    g = g && g[1] || "neptune";
    d = d && d[1] || "en";
    if (!Ext.themeName && !!g) {
        var e = g.match(/^([\w-]+)-(?:he)$/);
        Ext.themeName = e ? e[1] : g;
    }
    return {
        extend: "Ext.Container",
        xtype: "themeSwitcher",
        id: "theme-switcher-btn",
        margin: "0 10 0 0",
        layout: "hbox",
        initComponent: function() {
            function b(n, l) {
                var m = Ext.Object.fromQueryString(location.search);
                m[n] = l;
                location.search = Ext.Object.toQueryString(m);
            }
            function c(o, m, n) {
                n = n || "theme";
                var p = o === (n == "theme" ? g : d);
                return {
                    text: m,
                    group: n == "theme" ? "themegroup" : "localegroup",
                    checked: p,
                    handler: function() {
                        if (!p) {
                            if (n == "theme") {
                                b("theme", o);
                            } else {
                                b("locale", o);
                            }
                        }
                    }
                };
            }
            var a = new Ext.menu.Menu({
                items: [ 
                	c("neptune", "Neptune"), 
                	c("neptune-touch", "Neptune Touch"), 
                	c("crisp", "Crisp"), 
                	c("crisp-touch", "Crisp Touch"), 
                	c("classic", "Classic"), 
                	c("gray", "Gray"), 
                	"-", 
                	c("en", "English", "locale"), 
                	c("id", "Indonesian", "locale") ]
            });
            this.items = [ {
                xtype: "component",
                id: "theme-switcher",
                cls: "ks-theme-switcher",
                margin: "0 5 0 0",
                listeners: {
                    scope: this,
                    click: function(j) {
                        a.showBy(this);
                    },
                    element: "el"
                }
            } ];
            this.callParent();
        }
    };
});