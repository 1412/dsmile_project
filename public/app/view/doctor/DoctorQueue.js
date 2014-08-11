Ext.define('App.view.doctor.DoctorQueue', {
    extend: 'Ext.Container',
    xtype: 'doctor-queue',
    width: 800,
    requires: [
        'App.store.DoctorQueueStore',
        //'App.view.doctor.DoctorQueueController'        
    ],
    layout: {
        type: 'table',
        columns: 3,
        tdAttrs: { style: 'padding: 10px; vertical-align: top;' }
    },
    defaults: {
        xtype: 'gridpanel',
        width: 800,
        height: 450,
        bodyPadding: 10
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
        if (!Ext.data.StoreManager.lookup('doctorqueue')) {
            Ext.create("App.store.DoctorQueueStore", {
                storeId: "doctorqueue"
            });
        }
        console.log(),
        this.items = [{
            title: 'Antrian Pasien',
            stateful: true,
            collapsible: true,
            multiSelect: true,
            stateId: 'doctorqueuegrid',
            height: 350,
            viewConfig: {
                enableTextSelection: true
            },
            autoLoad: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'datefield',
                    anchor: '100%',
                    fieldLabel: 'Antrian Tanggal',
                    name: 'queue_date',
                    maxValue: new Date()  // limited to the current date or prior
                }]
            }],
            store: Ext.data.StoreManager.get("doctorqueue"),
            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                { text: 'Nama',  dataIndex: 'name' },
                { text: 'Doktor', dataIndex: 'doctor', flex: 1 },
                { text: 'Time', dataIndex: 'time' }
            ]
        }];
        this.callParent();
    }
});
