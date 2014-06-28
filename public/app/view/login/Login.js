Ext.define('App.view.login.Login', {
    requires: [
        'App.view.login.LoginController',
        'App.view.login.LoginModel',
        'Ext.form.Panel',
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox'
    ],    
    extend: "Ext.window.Window",
    viewModel: "login",
    controller: "login",
    bodyPadding: 10,
    title: "Login - D'smile Klinik",
    closable: false,
    minHeight: 180,
    minWidth: 320, 
    cls: "login",
    items: {
        xtype: "form",
        reference: "form",
        bodyCls: 'noborder-form',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        items: [ {
            xtype: "textfield",
            name: "username",
            bind: "{username}",
            fieldLabel: "Username",
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                specialKey: "onSpecialKey"
            }
        }, {
            xtype: "textfield",
            name: "password",
            inputType: "password",
            fieldLabel: "Password",
            allowBlank: false,
            enableKeyEvents: true,
            cls: "password",
            listeners: {
                specialKey: "onSpecialKey"
            }
        }, {
            xtype: "displayfield",
            hideEmptyLabel: false,
            value: "Enter any non-blank password",
            cls: "hint"
        }]
    },
    buttons: [ {
        text: "Login",
        listeners: {
            click: "onLoginClick"
        }
    } ]
});
