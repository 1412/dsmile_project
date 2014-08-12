Ext.define('App.store.PatientListStore', {
    requires: [
        'App.view.doctor.PatientListModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.patientlist',    
    model: 'App.view.doctor.PatientListModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/getpatientlist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.PatientListModel',
            rootProperty: 'data'
        }
    }
});