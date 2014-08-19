Ext.define('App.view.doctor.TeethSelectionWindow', {
    extend: 'Ext.window.Window',
    xtype: 'form-teethselection-window',
    reference: 'teethSelectionWindow',    
    title: 'Pilih Gigi',
    requires: [
        'App.store.TeethListStore'
    ],
    width: 800,
    minWidth: 800,
    height: 170,
    minHeight: 170,
    layout: 'fit',
    resizable: true,
    modal: true,
    //defaultFocus: 'firstName',
    closeAction: 'hide', 
    initComponent: function () {
        if (!Ext.data.StoreManager.lookup('teethlist')) {
            Ext.create("App.store.TeethListStore", {
                storeId: "teethlist"
            });
        }
        var me = this; 
        window.a = me;
        this.items = [{
            xtype: 'panel',
            reference: 'teethSelectionPanel',
            loader: {
                url: 'getteethlisthtml',
                scripts: true,
                autoLoad: true,
                listeners: {
                    load: function(loader, resp, opt, eopt){
                        this.fireEvent("onTeethWindowReady");
                    },
                    scope: this
                }
            }
        }];
        this.listeners= {
            onTeethWindowReady: "onTeethWindowReady"
        };
        this.callParent();
    }
});