Ext.define('App.store.MedicalRecordListStore', {
    requires: [
        'App.view.doctor.MedicalRecordListModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.medicalrecordlist',    
    model: 'App.view.doctor.MedicalRecordListModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/getmedicalrecordlist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.MedicalRecordListModel',
            rootProperty: 'data'
        }
    }
});