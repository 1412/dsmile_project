Ext.define('App.view.logout.Logout', {
    requires: [
        'App.view.logout.LogoutController',
        'App.view.logout.LogoutModel'
    ],
    extend: 'Ext.form.Panel',
    viewModel: "logout",
    controller: "logout",
    xtype: 'logout',
    exampleTitle: 'Logout',    
    themes: {
        classic: {
            labelWidth: 100
        },
        neptune: {
            labelWidth: 120
        },
        gray: {
            labelWidth: 100
        },
        "neptune-touch": {
            labelWidth: 120
        }
    },    
    title: 'Logout',
    frame:true,
    width: 320,
    bodyPadding: 10, 
    items: [{
        xtype: "panel",
        bodyCls: 'noborder',
        html: "Logout and clear data?"
    }],    
    buttons: [{ 
        text:'Logout',        
        listeners: {
            click: "onLogoutClick"
        }
    }, { 
        text:'Back'  ,      
        listeners: {
            click: "onCancelClick"
        }
    }],    
    initComponent: function() {
        this.defaults = {
            anchor: '100%',
            labelWidth: this.themeInfo.labelWidth
        };
        this.listeners = {
            logout: function(){
                App.getApplication().getController('Home').fireEvent('');
            }
        };
        this.callParent();
    }
});
