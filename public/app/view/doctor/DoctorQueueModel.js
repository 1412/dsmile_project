Ext.define('App.view.doctor.DoctorQueueModel', {
    extend: 'App.model.Base',
    fields: [
       {name: 'name'},
       {name: 'doctor'},
       {name: 'time', type: 'date',  dateFormat: 'n/j h:ia'}
    ]
});