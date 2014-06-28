Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    requires: [
    	'Ext.*',
    	'Ext.app.*',
    	'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'App.*'
    ],
    namespace: "App",
    controllers: [
        'Home'
    ],
    init: function() {
        var loc = Ext.Object.fromQueryString(location.search)
    	if ("nocss3" in loc) {
            Ext.supports.CSS3BorderRadius = false;
            Ext.getBody().addCls("x-nbr x-nlg");
        }        
        var store = Ext.create("App.store.Navigation", {
            storeId: "navigation"
        });
        // d.setDefaultToken(store.getRoot().get("id"));
        Ext.setGlyphFontFamily("Pictos");
        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create("Ext.state.CookieProvider"));
    },
    launch: function() {
        var c = Ext.get("splashScreenLoading"), 
            d = Ext.get("splashScreenProgress"), 
            a = Ext.get("splashScreenProgressInner");
        c.update("Creating Interface...");
        d.setStyle("height", "13px");
        a.setStyle("width", "300px");
        this.destroySplash();
    },
    destroySplash: function() {
        var b = this, c = Ext.get("splashScreen");
        Ext.destroy(c);
        console.log("!");
    }
});