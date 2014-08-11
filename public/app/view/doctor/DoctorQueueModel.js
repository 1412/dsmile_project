Ext.define('App.view.doctor.DoctorQueueModel', {
    extend: 'App.model.Base',
    fields: [
       {name: 'name'},
       {name: 'price', type: 'float'},
       {name: 'change', type: 'float'},
       {name: 'pctChange', type: 'float'},
       {name: 'lastChange', type: 'date',  dateFormat: 'n/j h:ia'}
    ]
});