
Ext.define('App.store.MedicalRecordStore', {
    requires: [
        'App.view.doctor.MedicalRecordModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.medicalrecordlist',    
    model: 'App.view.doctor.MedicalRecordModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/getmedicalrecordlist',
        reader: {
            type: 'json',
            model: 'App.view.doctor.MedicalRecordModel',
            rootProperty: 'data'
        }
    }
});