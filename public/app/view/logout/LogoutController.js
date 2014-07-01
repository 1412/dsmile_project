Ext.define('App.view.logout.LogoutController', {
    extend: "Ext.app.ViewController",
    alias: "controller.logout",
    logoutText: "Keluar...",
    constructor: function() {
        this.callParent(arguments);
        this.loginManager = new App.LoginManager({
            session: this.session,
            model: "User"
        });
    },
    onSpecialKey: function(c, d) {
        if (d.getKey() === d.ENTER) {
            this.doLogout();
        } else if (d.getKey() === d.ESC) {
            this.doCancel();
        }
    },
    onLogoutClick: function() {
        this.doLogout();
    },
    onCancelClick: function() {
        this.doCancel();
    },
    doLogout: function() {
        Ext.getBody().mask(this.loginText);
        this.loginManager.logout({
            scope: this,
            success: "onLogoutSuccess",
            failure: "onLogoutFailure"
        });
    },
    doCancel: function() {
        history.go(-1);
    },
    onLogoutFailure: function(response, resultSet) {
        Ext.getBody().unmask();
        var text = "HTTP Code: " + response.status + ", " + response.statusText +
                ((resultSet === undefined)? "":("<br/><br/>Response: " + resultSet.getRecords()[0].get("data")));
        Ext.Msg.alert('Login Failed', text);
    },
    onLogoutSuccess: function(d) {
        Ext.getBody().unmask();
        this.fireViewEvent("logout", this.getView(), d, this.loginManager);
    }
});
