Ext.define("App.view.main.WelcomePanel", { 
    extend: "Ext.panel.Panel",
    xtype: "welcomepanel",
    reference: "welcomePanel",
    region: "north",
    bodyCls: "welcomepanel",
    height: 60,
    initComponent: function() {
        this.callParent();
    }
});