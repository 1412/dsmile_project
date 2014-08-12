Ext.define('App.controller.Home', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.view.login.Login',
        'App.store.Navigation',
        'App.view.main.Main',
        'App.view.main.MainMenu',
        'App.view.main.WelcomePanel',
        'App.LoginManager',

        'App.view.logout.Logout',

        'App.view.doctor.DoctorQueue',
        'App.view.doctor.PatientList'
    ],
    stores: [ "MainMenu" ],
    config: {
        control: {
            "navigation-tree": {
                selectionchange: "onTreeNavSelectionChange"
            },
            "navigation-breadcrumb breadcrumb": {
                selectionchange: "onBreadcrumbNavSelectionChange"
            },
            mainmenu: {
                itemclick: "onMainMenuClick"
            }
        },
        refs: {
            viewport: "viewport",
            navigationTree: "navigation-tree",
            navigationBreadcrumb: "navigation-breadcrumb",
            contentPanel: "contentPanel",
            mainmenu: {
                selector: "mainmenu",
                xtype: "mainmenu",
                autoCreate: true
            },
            welcomepanel: {
                selector: "welcomepanel",
                xtype: "welcomepanel",
                autoCreate: true
            }
        },
        routes: {
            "login": {
                action: "enterLoginScreen"
            },
            ":id": {
                action: "handleRoute",
                before: "beforeHandleRoute"
            }
        }
    },
    
    onLaunch: function () {

    },

    start: function(records, operation, success) {
        if (Ext.isIE8) {
            Ext.Msg.alert('Not Supported', 'This application is not supported on Internet Explorer 8. Please use a different browser.');
            return;
        } 
        this.viewport = null;
        this.viewport = new App.view.main.Main();
        this.loadNavigationRecord();
        if (!this.isLogin()) {
            this.redirectTo('login');
            return;
        }
    },

    enterLoginScreen: function(route){
        if (this.isLogin()) {
            this.redirectTo(this._navigationstore.getRoot().get("id"));
            return;
        }
        var session = this.session = new Ext.data.Session();
        if (this.login == null) {
            this.login = new App.view.login.Login({
                session: session,
                autoShow: true,
                listeners: {
                    scope: this,
                    login: "onLogin"
                }
            });
        }        
    },
    
    beforeHandleRoute: function(route, nextick) {
        if (route == 'login') {
            nextick.stop();
            return;
        }
        if (this._navigationstore === undefined) {
            this.redirectTo('');
            nextick.stop();
            return;
        }
        var node = this._navigationstore.getNodeById(route);
        if (!this.isLogin()) {
            this.redirectTo('login');
            nextick.stop();
            return;
        }
        if (node) {
            nextick.resume();
        } else {            
            Ext.Msg.alert("Route Failure", "The view for " + route + " could not be found. Please back to previous available page", function() {
                // e.redirectTo(e.getApplication().getDefaultToken());
            });
            nextick.stop();
        }
    },

    handleRoute: function(I) {
        var z = this, 
        	B = z.getNavigationTree(), 
       	 	D = z.getNavigationBreadcrumb(), 
       	 	w = Ext.StoreMgr.get("navigation"), 
       	 	G = w.getNodeById(I), 
       	 	t = G.get("text"), 
       	 	J = z.getContentPanel(), 
       	 	C = Ext.themeName, 
            W = z.getWelcomepanel(),
       	 	F = z.getMainmenu(),
       	 	v, y, A, x, E, u; 
        if (B && B.isVisible()) {
            B.getSelectionModel().select(G);
            B.getView().focusNode(G);
        } else {
            D.setSelection(G);
        }
        Ext.suspendLayouts();
        if (G.isLeaf()) {
            if (F.ownerCt) {
                J.remove(F, false);
            } else {
                J.removeAll(true);
            }
            J.body.addCls("kitchensink-example");
            A = Ext.ClassManager.getNameByAlias("widget." + I);
            console.log(I)
            console.log(A)
            x = Ext.ClassManager.get(A);
            if (x) {
                E = x.prototype;
                if (E.themes) {
                    E.themeInfo = E.themes[C];
                    if (C === "gray") {
                        E.themeInfo = Ext.applyIf(E.themeInfo || {}, E.themes.classic);
                    } else {
                        if (C !== "neptune" && C !== "classic") {
                            if (C === "crisp-touch") {
                                E.themeInfo = Ext.applyIf(E.themeInfo || {}, E.themes["neptune-touch"]);
                            }
                            E.themeInfo = Ext.applyIf(E.themeInfo || {}, E.themes.neptune);
                        }
                    }
                }
                y = new x();
                if (!F.ownerCt) {
                    J.removeAll(true);
                }
                J.add(y);
            }
            this.updateTitle(G);
            Ext.resumeLayouts(true);
            if (y) {
                if (y.floating) {
                    y.show();
                }
            }
        } else {
            u = z.getMainMenuStore();
            u.removeAll();
            u.add(G.childNodes);
            if (!F.ownerCt) {
                J.removeAll(true);
            }
            J.body.removeCls("kitchensink-example");
            W.setConfig({"html": "Welcome: "+ this.getLoginData().name +" (" + this.getLoginData().role + ")"});
            J.add(W);
            J.add(F);
            this.updateTitle(G);
            Ext.resumeLayouts(true);
        }
    },
    
    onLogin: function (loginController, loginManager, user, records) {
        this.loadNavigationRecord();
        this.login.destroy();
        this.loginManager = loginManager;
        this.user = user;
    },

    onLogout: function (loginController, loginManager, user, records) {
        this.loadNavigationRecord();
        this.loginManager = loginManager;
        this.user = user;
    },
    
    isLogin: function(){
    	var logininfo = Ext.util.Cookies.get("login");
    	try {
    		var data = JSON.parse(Ext.util.Base64.decode(logininfo.replace("%3D", "=")));
    		return true;
    	} catch(e){
    		return false
    	}
    },

    getLoginData: function(){
        var logininfo = Ext.util.Cookies.get("login");
        try {
            var data = JSON.parse(Ext.util.Base64.decode(logininfo.replace("%3D", "=")));
            return data.data;
        } catch(e){
            return {}
        }
    },
    
    updateTitle: function(e) {
        if (typeof(e) == "string") {
            this.getContentPanel().setTitle(e);
            document.title = document.title.split(" - ")[0] + " - " + e;
        } else {
            var g = e.get("text");
            var d = e.isLeaf() ? e.parentNode.get("text") + " - " + g : g;
            this.getContentPanel().setTitle(d);
            document.title = document.title.split(" - ")[0] + " - " + g;
        }        
    },

    loadNavigationRecord: function(records){
        this._navigationstore = Ext.StoreMgr.get("navigation");
        var tree = this.getNavigationTree();
        var breadcrumb = this.getNavigationBreadcrumb();
        var allnode = this._navigationstore.getRoot();
        var mainmenu = this.getMainMenuStore();
        mainmenu.removeAll();
        mainmenu.add(records);
        if (tree && tree.isVisible()) {                                     
            itree.getSelectionModel().select(allnode);   
            tree.getView().focusNode(allnode);
        } else {
            breadcrumb._breadcrumbBar.setSelection(allnode);                    
        };
        this.redirectTo(allnode.get("id"))
    },
    
    onTreeNavSelectionChange: function(g, d) {
        var e = d[0];
        if (e) {
            this.redirectTo(e.getId());
        }
    },
    onBreadcrumbNavSelectionChange: function(c, d) {
        if (d) {
            this.redirectTo(d.getId());
        }
    },
    onMainMenuClick: function(d, c) {
        this.redirectTo(c.getId());
    },
});