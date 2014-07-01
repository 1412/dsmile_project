Ext.define('App.view.login.LoginController', {
    extend: "Ext.app.ViewController",
    alias: "controller.login",
    loginText: "Masuk...",
    constructor: function() {
        this.callParent(arguments);
        this.loginManager = new App.LoginManager({
            session: this.session,
            model: "User"
        });
    },
    onSpecialKey: function(c, d) {
        if (d.getKey() === d.ENTER) {
            this.doLogin();
        }
    },
    onLoginClick: function() {
        this.doLogin();
    },
    doLogin: function() {
        var b = this.lookupReference("loginform");
        if (b.isValid()) {
            Ext.getBody().mask(this.loginText);
            this.loginManager.login({
                data: b.getValues(),
                scope: this,
                success: "onLoginSuccess",
                failure: "onLoginFailure"
            });
        }
    },
    onLoginFailure: function(response, resultSet) {
        Ext.getBody().unmask();
        var text = "HTTP Code: " + response.status + ", " + response.statusText +
                ((resultSet === undefined)? "":("<br/><br/>Response: " + resultSet.getRecords()[0].get("data")));
        Ext.Msg.alert('Login Failed', text);
    },
    onLoginSuccess: function(user, records) {
        Ext.getBody().unmask();
        this.fireViewEvent("login", this.getView(), this.loginManager, user, records);
    }
});
