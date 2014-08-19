Ext.define('App.store.MedicineListStore', {
    requires: [
        'App.view.doctor.MedicineListModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.medicinelist',    
    model: 'App.view.doctor.MedicineListModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/getmedicinelist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.MedicineListModel',
            rootProperty: 'data'
        }
    }
});