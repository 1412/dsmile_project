Ext.define('App.store.TherapyListStore', {
    requires: [
        'App.view.doctor.TherapyListModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.therapylist',    
    model: 'App.view.doctor.TherapyListModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/gettherapylist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.TherapyListModel',
            rootProperty: 'data'
        }
    }
});