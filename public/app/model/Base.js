Ext.define('App.model.Base', {
    extend: "Ext.data.Model",
    fields: [ {
        name: "id",
        type: "int"
    } ],
    schema: {
        namespace: "Ticket.model",
        proxy: {
            url: "{prefix}/{entityName:uncapitalize}",
            pageParam: "",
            startParam: "",
            limitParam: ""
        }
    }
});
