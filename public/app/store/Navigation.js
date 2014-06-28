Ext.define('App.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigation',
    constructor: function(g) {
        var h = this, e = Ext.Object.fromQueryString(location.search);
        h.callParent([ Ext.apply({
            proxy: {
                type: 'ajax',
                url: 'getnavigation'
            },
            root: {
                text: "Dashboard",
                id: "dashboard",
                expanded: true,
                children: h.getNavItems()
            }
        }, g) ]);
    },
    getNavItems: function() {
        return []
    }
});