Ext.define('App.view.doctor.MedicalRecordListController', {
    extend: "Ext.app.ViewController",
    alias: "controller.medicalrecordlist",
    requires: [
        'App.view.doctor.MedicalRecordWindow'
    ],
    init: function() {
        this.control({
            'viewport doctor-medicalrecord gridpanel': {
                itemdetailbuttonclick: this.onDetail
            }
        });
    },
    constructor: function() {
        this.callParent(arguments);
    },    
    onDetail: function(){
        console.log()
        this.showWindow();
    },
    showWindow: function() {
        var win = this.lookupReference('popupWindow');        
        if (!win) {
            win = new App.view.doctor.MedicalRecordWindow();
            this.getView().add(win);
        }
        
        win.show();
    },
    onFormCancel: function() {
        this.lookupReference('windowForm').getForm().reset();
        this.lookupReference('popupWindow').hide();
    },    
    onFormSubmit: function() {
        var formPanel = this.lookupReference('windowForm'),
            form = formPanel.getForm();
        
        if (form.isValid()) {
            // In a real application, this would submit the form to the configured url
            // form.submit();
            form.reset();
            this.lookupReference('popupWindow').hide();
            Ext.MessageBox.alert(
                'Thank you!',
                'Your inquiry has been sent. We will respond as soon as possible.'
            );
        }
    }
});
