Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    requires: [
    	'Ext.*',
    	'Ext.app.*',
    	'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'App.*',
        'App.view.doctor.*'
    ],
    namespace: "App",
    controllers: [
        'Home'
    ],
    init: function() {        
    },
    launch: function() {              
        var s = Ext.get("splashScreen"),
            c = Ext.get("splashScreenLoading"), 
            d = Ext.get("splashScreenProgress"), 
            a = Ext.get("splashScreenProgressInner"),
            navigation  = Ext.create("App.store.Navigation", {
                storeId: "navigation"
            }),
            loc = Ext.Object.fromQueryString(location.search);
        if ("nocss3" in loc) {
            Ext.supports.CSS3BorderRadius = false;
            Ext.getBody().addCls("x-nbr x-nlg");
        }  
        Ext.setGlyphFontFamily("Pictos");
        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create("Ext.state.CookieProvider"));
        c.update("Creating Interface...");
        a.setStyle("width", "300px");
        navigation.load({
            scope: this,
            callback: function(records, operation, success) {
                var s = Ext.get("splashScreen"),
                    c = Ext.get("splashScreenLoading"), 
                    d = Ext.get("splashScreenProgress"), 
                    a = Ext.get("splashScreenProgressInner");
                c.update("Starting...");
                a.setStyle("width", "400px");
                var c = this.getController('Home', true);
                c.start(records, operation, success);
                s.hide();
            }
        });
    }
});