Ext.define('App.view.doctor.PatientList', {
    extend: 'Ext.Container',
    xtype: 'doctor-patients',
    width: 800,
    requires: [
        'Ext.ux.SlidingPager',
        'App.store.PatientListStore',
        'App.view.doctor.PatientListController'        
    ],
    controller: "patientlist",
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
        if (!Ext.data.StoreManager.lookup('patientlist')) {
            Ext.create("App.store.PatientListStore", {
                storeId: "patientlist"
            });
        }
        console.log(),
        this.items = [{
            title: 'Daftar Pasien',
            reference: "dpatientlistgrid",
            stateful: true,
            collapsible: true,
            multiSelect: true,
            stateId: 'patientlistgrid',
            height: 450,
            pageSize: 20,
            viewConfig: {
                enableTextSelection: true
            },
            autoLoad: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    iconCls: null,
                    glyph: 59005, 
                    text:'Reload',
                    listeners: {
                        click: "onReloadButtonClick"
                    }
                },{
                    xtype: 'datefield',
                    anchor: '100%',
                    fieldLabel: 'Antrian Tanggal',
                    name: 'queue_date',
                    maxValue: new Date(),
                    reference: "queuedatefilter",
                }]
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                pageSize: 10,
                store: Ext.data.StoreManager.get("patientlist"),
                displayInfo: true,
                plugins: new Ext.ux.SlidingPager()
            },
            store: Ext.data.StoreManager.get("patientlist"),
            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                { text: 'Nama',  dataIndex: 'name' },
                { text: 'Dokter', dataIndex: 'doctor', flex: 1 },
                { text: 'Time', dataIndex: 'time' }
            ]
        }];
        this.callParent();
    }
});
