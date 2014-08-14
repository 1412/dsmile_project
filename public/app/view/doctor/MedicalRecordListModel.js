Ext.define('App.view.doctor.MedicalRecordListModel', {
    extend: 'App.model.Base',
    fields: [
       {name: 'norm'},
       {name: 'date', type: 'date',  dateFormat: 'n/j h:ia'}
    ]
});