Ext.define('App.LoginManager', {
    config: {
        model: null,
        session: null
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    applyModel: function(model) {
        return model && Ext.data.schema.Schema.lookupEntity('App.model.' + model);
    },

    login: function(options) {
        Ext.Ajax.request({
            url: 'signin',
            method: 'post',
            params: options.data,
            scope: this,
            callback: this.onLoginReturn,
            original: options
        });
    },
    
    onLoginReturn: function(options, success, response) {
        options = options.original;
        var resultSet;        
        if (success) {        	
            resultSet = this.getModel().getProxy().getReader().read(response);
            if (resultSet.getSuccess()) {
            	var data = resultSet.getRecords()[0];            	          	
            	var user = this.getModel().create(resultSet.getRecords()[0].data.data);
            	var base64 = Ext.util.Base64.encode(JSON.stringify(user));
                Ext.util.Cookies.set("login", base64);
                Ext.callback(options.success, options.scope, user);
                return;
            }
        }        
        Ext.callback(options.failure, options.scope, [response, resultSet]);
    }
});
