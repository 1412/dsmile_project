Ext.define('App.view.main.Main', {
    extend: 'Ext.container.Viewport',
    requires:[
    	'App.view.main.Header',
    	'App.view.main.NavigationBreadcrumb',
    	'App.view.main.NavigationTree',
    	'App.view.main.ThemeSwitcher',
    	'App.view.main.ContentPanel',
    	'App.model.User',
        'App.view.main.MainController',
        'App.view.main.MainModel'
    ],
	controller: "main",
    viewModel: "main",
    layout: 'border',
    items: [{
        region: "north",
        xtype: "appHeader"
    }, {
        region: "center",
        xtype: "contentPanel",
        reference: "contentPanel",
        dockedItems: [ {
            xtype: "navigation-breadcrumb",
            reference: "breadcrumb>"
        }]
    }],
    applyState: function(b) {
        this.getController().applyState(b);
    },
    getState: function() {
        return this.getController().getState();
    }
});