Ext.define('App.store.DoctorQueueStore', {
    requires: [
        'App.view.doctor.DoctorQueueModel'      
    ],
    extend: 'Ext.data.Store',
    alias: 'store.doctorqueue',    
    model: 'App.view.doctor.DoctorQueueModel',
    pageSize: 50,
    remoteSort: true,
    sorters: [],
    proxy: {
        type: 'ajax',
        url : '/getdoctorqueue',
        reader: {
            type: 'json',
            model: 'App.view.doctor.DoctorQueueModel',
            rootProperty: 'data'
        }
    }
});