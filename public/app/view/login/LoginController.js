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
        var b = this.lookupReference("form");
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
    onLoginFailure: function() {
        Ext.getBody().unmask();
    },
    onLoginSuccess: function(d) {
        Ext.getBody().unmask();
        this.fireViewEvent("login", this.getView(), d, this.loginManager);
    }
});
