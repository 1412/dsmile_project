Ext.define('App.view.doctor.MedicalRecordWindow', {
    extend: 'Ext.window.Window',
    xtype: 'form-medicalrecord-window',
    reference: 'popupWindow',    
    title: 'Medical Record Pasien XXX, No: #',
    width: 600,
    minWidth: 600,
    height: 400,
    minHeight: 400,
    layout: 'fit',
    resizable: true,
    modal: true,
    //defaultFocus: 'firstName',
    closeAction: 'hide',    
    items: [{
        xtype: 'form',
        autoScroll: true,
        reference: 'windowForm',        
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        bodyPadding: 10,
        fieldDefaults: {
            msgTarget: 'side',
            labelAlign: 'top',
            labelWidth: 100,
            labelStyle: 'font-weight:bold'
        },        
        items: [{
            xtype: 'label',
            text: 'Nama',
            margin: '0 0 10 0'
        }, {
            xtype: 'label',
            text: 'Tanggal',
            margin: '0 0 10 0'
        }, {
            xtype: 'label',
            text: 'Dokter',
            margin: '0 0 10 0'
        }, {
            xtype: 'fieldset',
            title: 'Terapi',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },            
            items: [{
                xtype: 'button',
                text : 'Tambah Terapi'
            }, {
                xtype: 'fieldcontainer',
                labelStyle: 'font-weight:bold;padding:0;',
                layout: 'hbox',
                fieldDefaults: {
                    labelAlign: 'left'
                },
                items: [{
                    xtype: 'combobox',
                    fieldLabel: 'Terapi #1',
                    flex: 1
                }, {
                    xtype     : 'radiofield',
                    boxLabel  : 'Mudah',
                    name      : 'size',
                    inputValue: 'm',
                    id        : 'radio1',
                    margin    : '0 0 0 5'
                }, {
                    xtype     : 'radiofield',
                    boxLabel  : 'Sedang',
                    name      : 'size',
                    inputValue: 'l',
                    id        : 'radio2',
                    margin    : '0 0 0 5'
                }, {
                    xtype     : 'radiofield',
                    boxLabel  : 'Sulit',
                    name      : 'size',
                    inputValue: 'xl',
                    id        : 'radio3',
                    margin    : '0 0 0 5'
                }]
            }, {
                xtype: 'label',
                text: 'Biaya',
                margin: '0 0 10 0'
            }]
        }, {
            xtype: 'fieldset',
            title: 'Obat - obatan',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },            
            items: [{
                xtype: 'button',
                text : 'Tambah Obat'
            }, {
                xtype: 'fieldcontainer',
                labelStyle: 'font-weight:bold;padding:0;',
                layout: 'hbox',
                fieldDefaults: {
                    labelAlign: 'left'
                },
                items: [{
                    xtype: 'combobox',
                    fieldLabel: 'Obat #1',
                    flex: 1
                }]
            }, {
                xtype: 'label',
                text: 'Biaya',
                margin: '0 0 10 0'
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: 'Anamnesa',
            allowBlank: false,
            minLength: 6
        }, {
            xtype: 'textfield',
            fieldLabel: 'Diagnosa',
            allowBlank: false,
            minLength: 6
        }, {
            xtype: 'textfield',
            fieldLabel: 'Tindakan',
            allowBlank: false,
            minLength: 6
        }, {
            xtype: 'textfield',
            fieldLabel: 'Elemen',
            allowBlank: false,
            minLength: 6
        }, {
            xtype: 'button',
            text : 'Form Baru'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Kunjungan Berikutnya',
            allowBlank: false,
            minLength: 6
        }],
        buttons: [{
            text: 'Cancel',
            handler: 'onFormCancel'
        }, {
            text: 'Send',
            handler: 'onFormSubmit'
        }]
    }]
});