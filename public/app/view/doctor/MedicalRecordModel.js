Ext.define('App.view.doctor.MedicalRecordModel', {
    extend: 'App.model.Base',
    fields: [
       {name: 'norm'},
       {name: 'date', type: 'date',  dateFormat: 'n/j h:ia'}
    ]
});