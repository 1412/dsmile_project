Ext.define('App.view.doctor.MedicalRecord', {
    extend: 'Ext.Container',
    xtype: 'doctor-medicalrecord',
    width: 800,
    requires: [
        'Ext.ux.SlidingPager',
        'App.store.MedicalRecordStore',
        'App.view.doctor.MedicalRecordController'        
    ],
    controller: "medicalrecord",
    layout: {
        type: 'table',
        columns: 3,
        tdAttrs: { style: 'padding: 10px; vertical-align: top;' }
    },
    defaults: {
        xtype: 'gridpanel',
        width: 800,
        height: 450
    },
    //<example>
    themes: {
        classic: {
            percentChangeColumn: {
                width: 75
            }
        },
        neptune: {
            percentChangeColumn: {
                width: 100
            }
        }
    },
    initComponent: function () {
        if (!Ext.data.StoreManager.lookup('medicalrecordlist')) {
            Ext.create("App.store.MedicalRecordStore", {
                storeId: "medicalrecord"
            });
        }
        this.items = [{
            title: 'Daftar Reka Medis Untuk Pasien: ' + "",
            reference: "medicalrecordlistgrid",
            stateful: true,
            collapsible: true,
            multiSelect: true,
            stateId: 'medicalrecordlist',
            height: 450,
            pageSize: 20,
            viewConfig: {
                enableTextSelection: false
            },
            autoLoad: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'textfield',
                    anchor: '100%',
                    fieldLabel: 'No. RM',
                    name: 'norm',
                    reference: "patientnorm",
                },{
                    xtype: 'datefield',
                    anchor: '100%',
                    fieldLabel: 'MR Tanggal',
                    name: 'mr_date',
                    maxValue: new Date(),
                    reference: "mr_datefilter",
                },{
                    iconCls: null,
                    glyph: 59007, 
                    text:'Search',
                    listeners: {
                        click: "onSearchButtonClick"
                    }
                },{
                    iconCls: null,
                    glyph: 59138, 
                    text:'Search',
                    listeners: {
                        click: "onAddButtonClick"
                    }
                }]
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                pageSize: 20,
                store: Ext.data.StoreManager.get("medicalrecord"),
                displayInfo: true,
                plugins: new Ext.ux.SlidingPager()
            },
            store: Ext.data.StoreManager.get("medicalrecord"),
            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                { text: 'No RM', dataIndex: 'norm', flex: 1},
                { text: 'Tanggal', dataIndex: 'date'},
                {
                    text: 'Aksi',
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [{
                        iconCls: 'edit-col',
                        tooltip: 'Lihat dan Update Rekam Medis',
                        handler: function(grid, rowIndex, colIndex) {
                            this.up('grid').fireEvent('itemdetailbuttonclick', grid, rowIndex, colIndex);
                        }
                    }]
                }
            ]
        }];
        this.callParent();
    }
});
