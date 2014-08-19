Ext.define('App.view.doctor.MedicalRecordController', {
    extend: "Ext.app.ViewController",
    alias: "controller.medicalrecord",
    requires: [
        'App.view.doctor.MedicalRecordWindow',
        'App.view.doctor.TeethSelectionWindow',
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
        var win = this.lookupReference('medicalRecordFormWindow');        
        if (!win) {
            win = new App.view.doctor.MedicalRecordWindow();
            this.getView().add(win);
        }        
        win.show();
    },            
    showTeethWindow: function(){
        var win = this.lookupReference('teethSelectionWindow');
        if (!win) {
            win = new App.view.doctor.TeethSelectionWindow();
            this.getView().add(win);
        }        
        win.show();        
    },
    onTeethWindowReady: function(panel){
        Ext.select(".teeth-selection-table li").elements.forEach(function(element, index, array) { 
            Ext.get(element).on('click', function(e, t){ 
                this.teethClicked(Ext.get(t));
            }.bind(this));
        }.bind(this));
    },
    teethClicked: function(dom) {
        var tagfield = this.lookupReference('teethselection');
        var values = tagfield.getValue();
        tagfield.addValue(parseInt(dom.getHtml()));
    },
    onFormCancel: function() {
        this.lookupReference('medicalRecordForm').getForm().reset();
        this.lookupReference('medicalRecordFormWindow').hide();
    },    
    onFormSubmit: function() {
        var formPanel = this.lookupReference('medicalRecordForm'),
            form = formPanel.getForm();
        
        if (form.isValid()) {
            // In a real application, this would submit the form to the configured url
            // form.submit();
            form.reset();
            this.lookupReference('medicalRecordFormWindow').hide();
            Ext.MessageBox.alert(
                'Thank you!',
                'Your inquiry has been sent. We will respond as soon as possible.'
            );
        }
    }
});
