Ext.define('App.view.doctor.MedicalRecordWindow', {
    extend: 'Ext.window.Window',
    xtype: 'form-medicalrecord-window',
    reference: 'medicalRecordFormWindow',    
    title: 'Medical Record Pasien XXX,5 No: #',
    requires: [
        'Ext.ux.FieldReplicator',
        'App.store.TherapyListStore',
        'App.store.MedicineListStore',
        'App.store.TeethListStore'
    ],
    width: 600,
    minWidth: 600,
    height: 400,
    minHeight: 400,
    layout: 'fit',
    resizable: true,
    modal: true,
    //defaultFocus: 'firstName',
    closeAction: 'hide', 
    initComponent: function () {
        if (!Ext.data.StoreManager.lookup('therapylist')) {
            Ext.create("App.store.TherapyListStore", {
                storeId: "therapylist"
            });
        }
        if (!Ext.data.StoreManager.lookup('medicinelist')) {
            Ext.create("App.store.MedicineListStore", {
                storeId: "medicinelist"
            });
        }
        if (!Ext.data.StoreManager.lookup('teethlist')) {
            Ext.create("App.store.TeethListStore", {
                storeId: "teethlist"
            });
        }        
        this.items = [{
            xtype: 'form',
            autoScroll: true,
            reference: 'medicalRecordForm',        
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },        
            items: [{
                xtype: 'fieldset',
                title: 'Identitas',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype       : 'textfield',
                    fieldLabel  : 'Nama',
                    readOnly    : true
                }, {
                    xtype       : 'textfield',
                    fieldLabel  : 'Tanggal',
                    readOnly    : true
                }, {
                    xtype       : 'textfield',
                    fieldLabel  : 'Dokter',
                    readOnly    : true
                }]
            }, {
                xtype: 'fieldset',
                title: 'Terapi',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'combobox',
                    fieldLabel: 'Terapi',
                    store: Ext.data.StoreManager.get("therapylist"),
                    displayField: 'name',
                    valueField: 'id',
                    anchor: '0',
                    queryMode: 'remote',
                    plugins: 'fieldreplicator',
                    replicateOn: ['change'],
                    flex: 1,
                    onAfterReplicate: function (clone) {
                        var p = this.up('fieldset');
                        var idx = p.items.indexOf(this);
                        p.insert(idx + 1, {
                            xtype: 'fieldcontainer',
                            labelStyle: 'font-weight:bold;padding:0;',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'left'
                            },                    
                            items: [{
                                fieldLabel: 'Kesulitan',
                                xtype     : 'radiofield',
                                boxLabel  : 'Mudah',
                                name      : 'size',
                                inputValue: 'm'
                            }, {
                                xtype     : 'radiofield',
                                boxLabel  : 'Sedang',
                                name      : 'size',
                                inputValue: 'l',
                                margin    : '0 10 0 10'
                            }, {
                                xtype     : 'radiofield',
                                boxLabel  : 'Sulit',
                                name      : 'size',
                                inputValue: 'xl'
                            }]
                        });
                    }
                }, {
                    xtype       : 'textfield',
                    fieldLabel  : 'Biaya',
                    readOnly    : true
                }]
            }, {
                xtype: 'fieldset',
                title: 'Obat - obatan',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },            
                items: [{
                    xtype: 'combobox',
                    fieldLabel: 'Obat',
                    plugins: 'fieldreplicator',
                    replicateOn: ['change'],
                    store: Ext.data.StoreManager.get("medicinelist"),
                    displayField: 'name',
                    valueField: 'id',
                    anchor: '0',
                    queryMode: 'remote',
                    flex: 1,
                    onAfterReplicate: function (clone) {
                        var p = this.up('fieldset');
                        var idx = p.items.indexOf(this);
                        p.insert(idx + 1, {
                            xtype: 'fieldcontainer',
                            labelStyle: 'font-weight:bold;padding:0;',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'left'
                            },                    
                            items: [{
                                fieldLabel: 'Jumlah',
                                xtype     : 'numberfield',
                                value     : 1,
                                minValue  : 0,
                                maxValue  : 50
                            }]
                        });
                    }
                }, {
                    xtype       : 'textfield',
                    fieldLabel  : 'Biaya',
                    readOnly    : true
                }]
            }, {
                xtype: 'fieldset',
                title: 'Keterangan',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: [{
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
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    flex: 1,
                    fieldDefaults: {
                        labelAlign: 'left'
                    },                    
                    items: [{
                        xtype: 'tagfield',
                        fieldLabel: 'Elemen',
                        store: Ext.data.StoreManager.get("teethlist"),
                        reference: 'teethselection',
                        displayField: 'name',
                        valueField: 'id',
                        filterPickList: true,
                        queryMode: 'remote',
                        publishes: 'value',
                        flex: 1
                    }, {
                        xtype: 'button',
                        text : 'Pilih',
                        handler: 'showTeethWindow'
                    }]                    
                }]
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
        this.callParent();
    }
});