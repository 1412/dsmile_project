Ext.define('App.view.doctor.DoctorQueueController', {
    extend: "Ext.app.ViewController",
    alias: "controller.doctorqueue",
    constructor: function() {
        this.callParent(arguments);
    },
    onReloadButtonClick: function() {
        this.doReload();
    },
    doReload: function() {
        var b = this.lookupReference("doctorqueuegrid");
        console.log(b);
        var s = Ext.data.StoreManager.lookup('doctorqueue');
        console.log(s);
        var f = this.lookupReference('queuedatefilter');
        if (f.isValid()) {
            var v;
            if (f == null) {
                v = "";
            } else {
                v = new Date(f.getValue());
                v = Ext.Date.format(v, "Y-m-d");
            }            
            var p = s.getProxy().setExtraParams({
                time: v
            });
            s.setProxy(p);
            s.load();
        }
    }
});
