Ext.define('App.view.doctor.PatientListController', {
    extend: "Ext.app.ViewController",
    alias: "controller.patientlist",
    init: function() {
        this.control({
            'viewport doctor-patients gridpanel': {
                itemdetailbuttonclick: this.onDetail
            }
        });
    },
    constructor: function() {
        this.callParent(arguments);
    },    
    onDetail: function(){
        this.redirectTo("#doctor-medicalrecord?id=12345");
    },
});
