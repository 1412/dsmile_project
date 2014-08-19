Ext.define('App.store.TeethListStore', {
    requires: [
        'App.view.doctor.TeethListModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.teethlist',    
    model: 'App.view.doctor.TeethListModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url : '/getteethlist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.TeethListModel',
            rootProperty: 'data'
        }
    }
});