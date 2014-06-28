Ext.define("Ticket.view.login.LoginController", {
    extend: "Ext.app.ViewController",
    alias: "controller.login",
    loginText: "Logging in...",
    constructor: function() {
        this.callParent(arguments);
        this.loginManager = new Ticket.LoginManager({
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
        var b = this.getReference("form");
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
        var c = this.getReference("organization").getSelectedRecord();
        this.fireEvent("login", this, d, c, this.loginManager);
    }
});

Ext.define("Ticket.view.login.LoginModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.login",
    data: {
        defaultOrg: 1,
        username: "Don"
    },
    stores: {
        organizations: {
            model: "Organization",
            autoLoad: true,
            isolated: false
        }
    }
});

Ext.define("Ticket.view.login.Login", {
    extend: "Ext.window.Window",
    viewModel: "login",
    controller: "login",
    bodyPadding: 10,
    title: "Login - Ticket App",
    closable: false,
    cls: "login",
    items: {
        xtype: "form",
        reference: "form",
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
        }, {
            xtype: "combobox",
            name: "organization",
            fieldLabel: "Organization",
            reference: "organization",
            queryMode: "local",
            editable: false,
            forceSelection: true,
            displayField: "name",
            valueField: "id",
            bind: {
                store: "{organizations}",
                value: {
                    twoWay: false,
                    bindTo: "{defaultOrg}"
                }
            }
        } ]
    },
    buttons: [ {
        text: "Login",
        listeners: {
            click: "onLoginClick"
        }
    } ]
});

Ext.define("Ticket.model.Base", {
    extend: "Ext.data.Model",
    fields: [ {
        name: "id",
        type: "int"
    } ],
    schema: {
        proxy: {
            url: "{prefix}/{entityName:uncapitalize}",
            pageParam: "",
            startParam: "",
            limitParam: ""
        }
    }
});

Ext.define("Ticket.model.Comment", {
    extend: "Ticket.model.Base",
    fields: [ {
        name: "created",
        type: "date"
    }, {
        name: "lastEdited",
        type: "date"
    }, {
        name: "ticketId",
        reference: {
            parent: "Ticket"
        }
    }, {
        name: "userId",
        reference: "User"
    } ]
});

Ext.define("Ticket.model.TicketOpenSummary", {
    extend: "Ext.data.Model",
    fields: [ "total", {
        name: "date",
        type: "date",
        dateFormat: "Y-m-d"
    } ]
});

Ext.define("Ticket.model.TicketStatusSummary", {
    extend: "Ext.data.Model",
    fields: [ "status", "total" ]
});

Ext.define("Ticket.model.User", {
    extend: "Ticket.model.Base",
    fields: [ "name", {
        name: "organizationId",
        reference: "Organization"
    }, {
        name: "projectId",
        reference: "Project"
    } ],
    manyToMany: "Group"
});

Ext.define("Ticket.model.Project", {
    extend: "Ticket.model.Base",
    fields: [ "name", {
        name: "organizationId",
        reference: "Organization"
    }, {
        name: "leadId",
        unique: true,
        reference: "User"
    } ]
});

Ext.define("Ticket.model.Organization", {
    extend: "Ticket.model.Base",
    fields: [ "name" ]
});

Ext.define("Ticket.model.Group", {
    extend: "Ticket.model.Base",
    fields: [ "name", {
        name: "organizationId",
        reference: "Organization"
    } ],
    manyToMany: "User"
});

Ext.define("Ticket.model.Ticket", {
    extend: "Ticket.model.Base",
    statics: {
        getStatusName: function(b) {
            return this.prototype.statusNames[b];
        }
    },
    fields: [ "status", {
        name: "projectId",
        reference: "Project"
    }, {
        name: "creatorId",
        reference: "User"
    }, {
        name: "assigneeId",
        reference: "User"
    }, {
        name: "created",
        type: "date"
    }, {
        name: "modified",
        type: "date"
    }, {
        name: "modifiedById",
        reference: "User"
    }, {
        name: "statusName",
        depends: "status",
        convert: function(c, d) {
            return this.owner.getStatusName(d.get("status"));
        }
    } ],
    statusNames: {
        1: "Pending",
        2: "Open",
        3: "Closed"
    }
});

Ext.define("Ticket.view.dashboard.DashboardController", {
    extend: "Ext.app.ViewController",
    alias: "controller.dashboard",
    onGridEditClick: function(b) {
        this.fireEvent("edituser", this, b.getWidgetRecord());
    },
    onTicketClick: function(h, l, i, e, k, j) {
        this.viewTicket(j);
    },
    onTicketDblClick: function(d, c) {
        this.viewTicket(c);
    },
    viewTicket: function(b) {
        this.fireEvent("viewticket", this, b);
    },
    onActiveTicketRefreshClick: function() {
        this.getReference("activeTickets").getStore().load();
    },
    renderTicketStatus: function(b) {
        return Ticket.model.Ticket.getStatusName(b);
    }
});

Ext.define("Ticket.view.dashboard.DashboardModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.dashboard",
    formulas: {
        theProject: function(b) {
            return b.projects.selection;
        },
        projectId: function(b) {
            return b.theProject.id;
        },
        hasProject: function(b) {
            return !!b.theProject;
        }
    },
    stores: {
        ticketStatusSummary: {
            fields: [ "id", "g1", "name" ],
            data: [ {
                id: 1,
                g1: 2,
                name: "Item-1"
            }, {
                id: 2,
                g1: 1,
                name: "Item-2"
            }, {
                id: 3,
                g1: 3,
                name: "Item-3"
            }, {
                id: 4,
                g1: 5,
                name: "Item-4"
            }, {
                id: 5,
                g1: 8,
                name: "Item-5"
            } ]
        },
        xticketStatusSummary: {
            model: "TicketStatusSummary",
            autoLoad: true,
            remoteFilter: true,
            filters: [ {
                property: "projectId",
                value: "{projectId}"
            } ]
        },
        ticketOpenSummary: {
            fields: [ "total", "date" ],
            data: function() {
                var h = [], f = Ext.Date, g = f.subtract(new Date(), f.DAY, 20), e;
                for (e = 0; e < 20; ++e) {
                    h.push({
                        total: Ext.Number.randomInt(5, 10),
                        date: g
                    });
                    g = f.add(g, f.DAY, 1);
                }
                return h;
            }()
        },
        xticketOpenSummary: {
            model: "TicketOpenSummary",
            autoLoad: true,
            remoteFilter: true,
            filters: [ {
                property: "projectId",
                value: "{projectId}"
            } ]
        },
        myActiveTickets: {
            model: "Ticket",
            autoLoad: true,
            remoteFilter: true,
            filters: [ {
                property: "assigneeId",
                value: "{currentUser.id}"
            }, {
                property: "projectId",
                value: "{projectId}"
            }, {
                property: "status",
                value: 2
            } ]
        },
        sortedUsers: {
            source: "{projects.selection.users}",
            sorters: [ {
                property: "name",
                direction: "DESC"
            } ]
        }
    }
});

Ext.define("Ticket.view.dashboard.Dashboard", {
    extend: "Ext.panel.Panel",
    alias: "widget.app-dashboard",
    controller: "dashboard",
    viewModel: {
        type: "dashboard"
    },
    bodyPadding: 20,
    bodyCls: "app-dashboard",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    items: [ {
        xtype: "container",
        layout: "hbox",
        items: [ {
            xtype: "component",
            margin: "10 0 20 0",
            cls: "title",
            html: "Project Summary",
            bind: "Project Summary - {theProject.name}"
        } ]
    }, {
        xtype: "container",
        layout: {
            type: "hbox",
            align: "stretch"
        },
        flex: 1,
        items: [ {
            xtpe: "container",
            flex: 1,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [ {
                xtype: "panel",
                flex: 1,
                title: "Ticket Status Summary",
                layout: "fit",
                items: {
                    xtype: "chart",
                    store: {
                        fields: [ "id", "g1", "name" ],
                        data: [ {
                            id: 1,
                            g1: 2,
                            name: "Item-1"
                        }, {
                            id: 2,
                            g1: 1,
                            name: "Item-2"
                        }, {
                            id: 3,
                            g1: 3,
                            name: "Item-3"
                        }, {
                            id: 4,
                            g1: 5,
                            name: "Item-4"
                        }, {
                            id: 5,
                            g1: 8,
                            name: "Item-5"
                        } ]
                    },
                    theme: "Category1",
                    background: "white",
                    interactions: "rotatePie3d",
                    animate: {
                        duration: 500,
                        easing: "easeIn"
                    },
                    series: [ {
                        type: "pie3d",
                        field: "g1",
                        donut: 30,
                        distortion: .6,
                        style: {
                            stroke: "white",
                            opacity: .9
                        }
                    } ]
                }
            }, {
                xtype: "panel",
                flex: 1,
                margin: "20 0 0 0",
                title: "1 Month Ticket Open Summary",
                layout: "fit",
                items: {
                    xtype: "cartesian",
                    store: "ext-empty-store",
                    bind: {
                        store: "{ticketOpenSummary}"
                    },
                    axes: [ {
                        type: "numeric",
                        position: "left",
                        fields: [ "total" ]
                    }, {
                        type: "time",
                        dateFormat: "m/d",
                        position: "bottom",
                        fields: [ "date" ]
                    } ],
                    series: [ {
                        type: "line",
                        axis: "left",
                        xField: "date",
                        yField: "total"
                    } ]
                }
            } ]
        }, {
            xtype: "container",
            flex: 1,
            margin: "0 0 0 40",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [ {
                xtype: "grid",
                reference: "activeTickets",
                flex: 1,
                tbar: [ {
                    text: "Refresh",
                    handler: "onActiveTicketRefreshClick"
                } ],
                listeners: {
                    itemdblclick: "onTicketDblClick"
                },
                title: "My Active Tickets",
                bind: "{myActiveTickets}",
                viewConfig: {
                    emptyText: "You have no active tickets for this project"
                },
                columns: [ {
                    text: "Id",
                    dataIndex: "id",
                    width: 100
                }, {
                    text: "Title",
                    dataIndex: "title",
                    flex: 1
                }, {
                    xtype: "datecolumn",
                    width: 120,
                    text: "Created",
                    dataIndex: "created"
                }, {
                    xtype: "datecolumn",
                    width: 120,
                    text: "Last Modified",
                    dataIndex: "modified"
                }, {
                    xtype: "actioncolumn",
                    width: 20,
                    handler: "onTicketClick",
                    items: [ {
                        tooltip: "View ticket",
                        iconCls: "ticket"
                    } ]
                } ]
            }, {
                xtype: "grid",
                flex: 1,
                title: "Project Members",
                margin: "20 0 0 0",
                bind: {
                    store: "{sortedUsers}",
                    title: "Project Members - Lead: {theProject.lead.name}"
                },
                columns: [ {
                    text: "Name",
                    dataIndex: "name",
                    flex: 1
                }, {
                    xtype: "widgetcolumn",
                    width: 100,
                    widget: {
                        xtype: "button",
                        text: "Edit",
                        listeners: {
                            click: "onGridEditClick"
                        }
                    }
                } ]
            } ]
        } ]
    } ]
});

Ext.define("Ticket.view.ticket.DetailModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.ticketdetail"
});

Ext.define("Ticket.view.ticket.DetailController", {
    extend: "Ext.app.ViewController",
    alias: "controller.ticketdetail",
    onSaveClick: function() {
        var d = this.getReference("form"), c;
        if (d.isValid()) {
            c = this.getViewModel().getData().theTicket;
            Ext.Msg.wait("Saving", "Saving ticket...");
            c.save({
                scope: this,
                callback: this.onComplete
            });
        }
    },
    onComplete: function() {
        Ext.Msg.hide();
        Ext.toast({
            title: "Save",
            html: "Ticket saved successfully",
            align: "t",
            bodyPadding: 10
        });
    }
});

Ext.define("Ticket.view.ticket.Detail", {
    extend: "Ext.panel.Panel",
    alias: "widget.ticketdetail",
    bind: {
        title: "Ticket - {theTicket.id}"
    },
    layout: {
        type: "vbox",
        align: "stretch"
    },
    componentCls: "ticket-detail",
    bodyPadding: 20,
    controller: "ticketdetail",
    viewModel: {
        type: "ticketdetail"
    },
    tbar: [ {
        text: "Save",
        handler: "onSaveClick"
    } ],
    items: [ {
        xtype: "component",
        bind: "{theTicket.title}",
        cls: "title",
        margin: "0 0 20 0"
    }, {
        xtype: "form",
        border: false,
        maxWidth: 600,
        height: 100,
        reference: "form",
        defaults: {
            anchor: "95%"
        },
        items: [ {
            xtype: "textfield",
            fieldLabel: "Title",
            allowBlank: false,
            bind: "{theTicket.title}",
            publishes: [ "value" ]
        }, {
            xtype: "combobox",
            fieldLabel: "Assignee",
            allowBlank: false,
            forceSelection: true,
            queryMode: "local",
            valueField: "id",
            displayField: "name",
            publishes: [ "value" ],
            bind: {
                store: "{theTicket.project.users}",
                value: "{theTicket.assigneeId}"
            }
        }, {
            xtype: "combobox",
            fieldLabel: "Status",
            allowBlank: false,
            forceSelection: true,
            editable: false,
            queryMode: "local",
            valueField: "id",
            displayField: "name",
            publishes: [ "value" ],
            bind: "{theTicket.status}",
            store: {
                fields: [ "id", "name" ],
                data: [ {
                    id: 1,
                    name: "Pending"
                }, {
                    id: 2,
                    name: "Open"
                }, {
                    id: 3,
                    name: "Closed"
                } ]
            }
        } ]
    }, {
        xtype: "component",
        html: "Comments",
        cls: "small-title",
        margin: "20 0"
    }, {
        xtype: "dataview",
        flex: 1,
        bind: "{theTicket.comments}",
        disableSelection: true,
        cls: "comments",
        autoScroll: true,
        emptyText: "There are no comments",
        itemTpl: [ '<div class="header"><span class="created">{created:date("Y-m-d H:i")}</span> - <span class="user">{user.name}</span></div>', '<div class="content">{text}</div>', '<tpl if="xindex !== xcount"><hr /></tpl>' ]
    } ]
});

Ext.define("Ticket.view.ticket.SearchController", {
    extend: "Ext.app.ViewController",
    alias: "controller.ticketsearch",
    onTicketClick: function(h, l, i, e, k, j) {
        this.fireEvent("viewticket", this, j);
    },
    onRefreshClick: function() {
        this.getView().getStore().load();
    },
    renderAssignee: function(e, d, f) {
        return f.getAssignee().get("name");
    },
    renderCreator: function(e, d, f) {
        return f.getCreator().get("name");
    },
    renderStatus: function(b) {
        return Ticket.model.Ticket.getStatusName(b);
    }
});

Ext.define("Ticket.view.ticket.SearchModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.ticketsearch",
    data: {
        defaultStatus: 2
    },
    formulas: {
        defaultUser: function(b) {
            if (b.currentUser.get("projectId") === b.theProject.getId()) {
                return b.currentUser.getId();
            } else {
                return b.theProject.get("leadId");
            }
        }
    },
    stores: {
        tickets: {
            model: "Ticket",
            autoLoad: true,
            remoteFilter: true,
            filters: [ {
                property: "status",
                value: "{statusField.value}"
            }, {
                property: "assigneeId",
                value: "{assigneeField.value}"
            }, {
                property: "projectId",
                value: "{theProject.id}"
            } ]
        },
        statuses: {
            fields: [ "id", "name" ],
            data: [ {
                id: -1,
                name: "-- All --"
            }, {
                id: 1,
                name: "Pending"
            }, {
                id: 2,
                name: "Open"
            }, {
                id: 3,
                name: "Closed"
            } ]
        }
    }
});

Ext.define("Ticket.view.ticket.Search", {
    extend: "Ext.grid.Panel",
    alias: "widget.ticketsearch",
    controller: "ticketsearch",
    viewModel: {
        type: "ticketsearch"
    },
    bind: {
        title: "Search - {theProject.name}",
        store: "{tickets}"
    },
    tbar: [ {
        xtype: "combobox",
        fieldLabel: "User",
        forceSelection: true,
        queryMode: "local",
        displayField: "name",
        valueField: "id",
        autoLoadOnValue: true,
        reference: "assigneeField",
        publishes: [ "value" ],
        bind: {
            store: "{theProject.users}",
            value: "{defaultUser}"
        }
    }, {
        xtype: "combobox",
        fieldLabel: "Status",
        forceSelection: true,
        editable: false,
        displayField: "name",
        valueField: "id",
        reference: "statusField",
        publishes: [ "value" ],
        bind: {
            store: "{statuses}",
            value: "{defaultStatus}"
        }
    }, {
        text: "Refresh",
        handler: "onRefreshClick"
    } ],
    columns: [ {
        text: "ID",
        dataIndex: "id"
    }, {
        text: "Title",
        dataIndex: "title",
        flex: 1
    }, {
        text: "Status",
        dataIndex: "status",
        renderer: "renderStatus"
    }, {
        text: "Assignee",
        renderer: "renderAssignee"
    }, {
        text: "Creator",
        renderer: "renderCreator"
    }, {
        xtype: "datecolumn",
        text: "Created",
        dataIndex: "created"
    }, {
        xtype: "datecolumn",
        text: "Modified",
        dataIndex: "modified"
    }, {
        xtype: "actioncolumn",
        width: 20,
        handler: "onTicketClick",
        items: [ {
            tooltip: "View ticket",
            iconCls: "ticket"
        } ]
    } ]
});

Ext.define("Ticket.view.main.MainController", {
    extend: "Ext.app.ViewController",
    alias: "controller.main",
    listen: {
        controller: {
            dashboard: {
                edituser: "onEditUser",
                viewticket: "onViewTicket"
            },
            ticketsearch: {
                viewticket: "onViewTicket"
            }
        }
    },
    createTab: function(k, j, h) {
        var g = this.getReference("main"), i = k + "_" + j.getId(), l = g.items.getByKey(i);
        if (!l) {
            h.itemId = i;
            h.closable = true;
            l = g.add(h);
        }
        g.setActiveTab(l);
    },
    editUser: function(d) {
        var c = new Ticket.view.user.User({
            viewModel: {
                data: {
                    theUser: d
                }
            }
        });
        c.show();
    },
    onClickUserName: function() {
        var b = this.getViewModel().getData();
        this.editUser(b.currentUser);
    },
    onEditUser: function(d, c) {
        this.editUser(c);
    },
    onProjectSelect: function() {
        var b = this.getReference("main");
        b.setActiveTab(0);
    },
    onProjectSearchClick: function(h, l, i, e, k, j) {
        this.createTab("project", j, {
            xtype: "ticketsearch",
            viewModel: {
                data: {
                    theProject: j
                }
            }
        });
    },
    onViewTicket: function(d, c) {
        this.createTab("ticket", c, {
            xtype: "ticketdetail",
            session: new Ext.data.session.Session({
                data: [ c ]
            }),
            viewModel: {
                data: {
                    theTicket: c
                }
            }
        });
    },
    showBindInspector: function() {
        var b = new Ext.app.bindinspector.Inspector();
    }
});

Ext.define("Ticket.view.main.MainModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.main"
});

Ext.define("Ticket.view.main.Main", {
    extend: "Ext.container.Viewport",
    controller: "main",
    viewModel: {
        type: "main"
    },
    layout: "border",
    items: [ {
        xtype: "container",
        id: "app-header",
        region: "north",
        height: 52,
        layout: {
            type: "hbox",
            align: "middle"
        },
        items: [ {
            xtype: "component",
            id: "app-header-logo",
            listeners: {
                click: "showBindInspector",
                element: "el"
            }
        }, {
            xtype: "component",
            cls: "app-header-text",
            bind: "{currentOrg.name}",
            flex: 1
        }, {
            xtype: "component",
            id: "app-header-username",
            cls: "app-header-text",
            bind: "{currentUser.name}",
            listeners: {
                click: "onClickUserName",
                element: "el"
            },
            margin: "0 10 0 0"
        } ]
    }, {
        region: "west",
        xtype: "grid",
        reference: "projects",
        title: "Projects",
        width: 250,
        split: true,
        collapsible: true,
        selModel: {
            listeners: {
                selectionchange: "onProjectSelect"
            }
        },
        bind: {
            store: "{currentOrg.projects}",
            selection: {
                bindTo: "{currentUser.project}",
                single: true
            }
        },
        columns: [ {
            text: "Name",
            dataIndex: "name",
            flex: 1
        }, {
            xtype: "actioncolumn",
            width: 20,
            handler: "onProjectSearchClick",
            stopSelection: false,
            items: [ {
                tooltip: "Search tickets",
                iconCls: "search"
            } ]
        } ]
    }, {
        xtype: "tabpanel",
        region: "center",
        flex: 1,
        reference: "main",
        items: [ {
            xtype: "app-dashboard",
            title: "Dashboard"
        } ]
    } ]
});

Ext.define("Ticket.LoginManager", {
    config: {
        model: null,
        session: null
    },
    constructor: function(b) {
        this.initConfig(b);
    },
    applyModel: function(b) {
        return b && Ext.data.schema.Schema.lookupEntity(b);
    },
    login: function(b) {
        Ext.Ajax.request({
            url: "/authenticate",
            method: "GET",
            params: b.data,
            scope: this,
            callback: this.onLoginReturn,
            original: b
        });
    },
    onLoginReturn: function(f, h, g) {
        f = f.original;
        var i = this.getSession(), j;
        if (h) {
            j = this.getModel().getProxy().getReader().read(g, {
                recordCreator: i ? i.recordCreator : null
            });
            if (j.getSuccess()) {
                Ext.callback(f.success, f.scope, [ j.getRecords()[0] ]);
                return;
            }
        }
        Ext.callback(f.failure, f.scope, [ g, j ]);
    }
});

Ext.define("Ticket.controller.Root", {
    extend: "Ext.app.Controller",
    loadingText: "Loading...",
    listen: {
        controller: {
            login: {
                login: "onLogin"
            }
        }
    },
    onLaunch: function() {
        if (Ext.isIE8) {
            Ext.Msg.alert("Not Supported", "This example is not supported on Internet Explorer 8. Please use a different browser.");
            return;
        }
        var b = this.session = new Ext.data.session.Session();
        this.login = new Ticket.view.login.Login({
            session: b,
            autoShow: true
        });
    },
    onLogin: function(h, e, f, g) {
        this.login.destroy();
        this.loginManager = g;
        this.organization = f;
        this.user = e;
        this.showUI();
    },
    showUI: function() {
        this.viewport = new Ticket.view.main.Main({
            session: this.session,
            viewModel: {
                data: {
                    currentOrg: this.organization,
                    currentUser: this.user
                }
            }
        });
    },
    getSession: function() {
        return this.session;
    }
});


Ext.define("Ext.ux.ajax.Simlet", function() {
    var i = /([^?#]*)(#.*)?$/, g = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/, f = /^[+-]?\d+$/, j = /^[+-]?\d+\.\d+$/;
    function h(a) {
        var b;
        if (Ext.isDefined(a)) {
            a = decodeURIComponent(a);
            if (f.test(a)) {
                a = parseInt(a, 10);
            } else {
                if (j.test(a)) {
                    a = parseFloat(a);
                } else {
                    if (!!(b = g.test(a))) {
                        a = new Date(Date.UTC(+b[1], +b[2] - 1, +b[3], +b[4], +b[5], +b[6]));
                    }
                }
            }
        }
        return a;
    }
    return {
        alias: "simlet.basic",
        isSimlet: true,
        responseProps: [ "responseText", "responseXML", "status", "statusText" ],
        status: 200,
        statusText: "OK",
        constructor: function(a) {
            Ext.apply(this, a);
        },
        doGet: function(c) {
            var a = this, b = {};
            Ext.Array.forEach(a.responseProps, function(d) {
                if (d in a) {
                    b[d] = a[d];
                }
            });
            return b;
        },
        doPost: function(c) {
            var a = this, b = {};
            Ext.Array.forEach(a.responseProps, function(d) {
                if (d in a) {
                    b[d] = a[d];
                }
            });
            return b;
        },
        doRedirect: function(a) {
            return false;
        },
        exec: function(b) {
            var c = this, e = {}, a = "do" + Ext.String.capitalize(b.method.toLowerCase()), d = c[a];
            if (d) {
                e = d.call(c, c.getCtx(b.method, b.url, b));
            } else {
                e = {
                    status: 405,
                    statusText: "Method Not Allowed"
                };
            }
            return e;
        },
        getCtx: function(a, c, b) {
            return {
                method: a,
                params: this.parseQueryString(c),
                url: c,
                xhr: b
            };
        },
        openRequest: function(a, e, m, d) {
            var n = this.getCtx(a, e), b = this.doRedirect(n), c;
            if (b) {
                c = b;
            } else {
                c = new Ext.ux.ajax.SimXhr({
                    mgr: this.manager,
                    simlet: this,
                    options: m
                });
                c.open(a, e, d);
            }
            return c;
        },
        parseQueryString: function(c) {
            var r = i.exec(c), d = {}, a, b, e, s;
            if (r && r[1]) {
                var m, n = r[1].split("&");
                for (e = 0, s = n.length; e < s; ++e) {
                    if ((m = n[e].split("="))[0]) {
                        a = decodeURIComponent(m.shift());
                        b = h(m.length > 1 ? m.join("=") : m[0]);
                        if (!(a in d)) {
                            d[a] = b;
                        } else {
                            if (Ext.isArray(d[a])) {
                                d[a].push(b);
                            } else {
                                d[a] = [ d[a], b ];
                            }
                        }
                    }
                }
            }
            return d;
        },
        redirect: function(a, c, b) {
            switch (arguments.length) {
              case 2:
                if (typeof c == "string") {
                    break;
                }
                b = c;

              case 1:
                c = a;
                a = "GET";
                break;
            }
            if (b) {
                c = Ext.urlAppend(c, Ext.Object.toQueryString(b));
            }
            return this.manager.openRequest(a, c);
        }
    };
}());

Ext.define("Ext.ux.ajax.DataSimlet", function() {
    function c(a, b) {
        var h = a.direction, g = h && h.toUpperCase() === "DESC" ? -1 : 1;
        return function(m, l) {
            var n = m[a.property], e = l[a.property], f = n < e ? -1 : e < n ? 1 : 0;
            if (f || !b) {
                return f * g;
            }
            return b(m, l);
        };
    }
    function d(h, b) {
        for (var a = b, g = h && h.length; g; ) {
            a = c(h[--g], a);
        }
        return a;
    }
    return {
        extend: "Ext.ux.ajax.Simlet",
        buildNodes: function(n, a) {
            var b = this, q = {
                data: []
            }, i = n.length, o, m, p, r;
            b.nodes[a] = q;
            for (m = 0; m < i; ++m) {
                q.data.push(p = n[m]);
                r = p.text || p.title;
                p.id = a ? a + "/" + r : r;
                o = p.children;
                if (!(p.leaf = !o)) {
                    delete p.children;
                    b.buildNodes(o, p.id);
                }
            }
        },
        fixTree: function(i, j) {
            var a = this, b = i.params.node, h;
            if (!(h = a.nodes)) {
                a.nodes = h = {};
                a.buildNodes(j, "");
            }
            b = h[b];
            if (b) {
                if (a.node) {
                    a.node.sortedData = a.sortedData;
                    a.node.currentOrder = a.currentOrder;
                }
                a.node = b;
                a.data = b.data;
                a.sortedData = b.sortedData;
                a.currentOrder = b.currentOrder;
            } else {
                a.data = null;
            }
        },
        getData: function(b) {
            var n = this, q = b.params, r = (q.filter || "") + (q.group || "") + "-" + (q.sort || "") + "-" + (q.dir || ""), a = n.tree, t, p, o, m;
            if (a) {
                n.fixTree(b, a);
            }
            p = n.data;
            if (typeof p === "function") {
                t = true;
                p = p.call(this, b);
            }
            if (!r || !p) {
                return p || [];
            }
            if (!t && r == n.currentOrder) {
                return n.sortedData;
            }
            b.filterSpec = q.filter && Ext.decode(q.filter);
            b.groupSpec = q.group && Ext.decode(q.group);
            o = q.sort;
            if (q.dir) {
                o = [ {
                    direction: q.dir,
                    property: o
                } ];
            } else {
                o = Ext.decode(q.sort);
            }
            if (b.filterSpec) {
                var s = new Ext.util.FilterCollection();
                s.add(this.processFilters(b.filterSpec));
                p = Ext.Array.filter(p, s.getFilterFn());
            }
            m = d(b.sortSpec = o);
            if (b.groupSpec) {
                m = d([ b.groupSpec ], m);
            }
            p = Ext.isArray(p) ? p.slice(0) : p;
            if (m) {
                Ext.Array.sort(p, m);
            }
            n.sortedData = p;
            n.currentOrder = r;
            return p;
        },
        processFilters: Ext.identityFn,
        getPage: function(k, b) {
            var j = b, i = b.length, a = k.params.start || 0, l = k.params.limit ? Math.min(i, a + k.params.limit) : i;
            if (a || l < i) {
                j = j.slice(a, l);
            }
            return j;
        },
        getGroupSummary: function(b, a, f) {
            return a[0];
        },
        getSummary: function(a, r, q) {
            var o = this, v = a.groupSpec.property, n, s = {}, p = [], u, t;
            Ext.each(q, function(e) {
                u = e[v];
                s[u] = true;
            });
            function b() {
                if (n) {
                    p.push(o.getGroupSummary(v, n, a));
                    n = null;
                }
            }
            Ext.each(r, function(e) {
                u = e[v];
                if (t !== u) {
                    b();
                    t = u;
                }
                if (!s[u]) {
                    return !p.length;
                }
                if (n) {
                    n.push(e);
                } else {
                    n = [ e ];
                }
                return true;
            });
            b();
            return p;
        }
    };
}());

Ext.define("Ext.ux.ajax.JsonSimlet", {
    extend: "Ext.ux.ajax.DataSimlet",
    alias: "simlet.json",
    doGet: function(p) {
        var m = this, k = m.getData(p), l = m.getPage(p, k), j = p.xhr.options.proxy && p.xhr.options.proxy.getReader(), i = j && j.getRootProperty(), n = m.callParent(arguments), o = {};
        if (i && Ext.isArray(l)) {
            o[i] = l;
            o[j.getTotalProperty()] = k.length;
        } else {
            o = l;
        }
        if (p.groupSpec) {
            o.summaryData = m.getSummary(p, k, l);
        }
        n.responseText = Ext.encode(o);
        return n;
    }
});

Ext.define("Ext.ux.ajax.SimXhr", {
    readyState: 0,
    mgr: null,
    simlet: null,
    constructor: function(d) {
        var c = this;
        Ext.apply(c, d);
        c.requestHeaders = {};
    },
    abort: function() {
        var b = this;
        if (b.timer) {
            clearTimeout(b.timer);
            b.timer = null;
        }
        b.aborted = true;
    },
    getAllResponseHeaders: function() {
        var b = [];
        Ext.Object.each(this.responseHeaders, function(a, d) {
            b.push(a + ": " + d);
        });
        return b.join("\r\n");
    },
    getResponseHeader: function(c) {
        var d = this.responseHeaders;
        return d && d[c] || null;
    },
    open: function(i, l, k, h, g) {
        var j = this;
        j.method = i;
        j.url = l;
        j.async = k !== false;
        j.user = h;
        j.password = g;
        j.setReadyState(1);
    },
    overrideMimeType: function(b) {
        this.mimeType = b;
    },
    schedule: function() {
        var c = this, d = c.mgr.delay;
        if (d) {
            c.timer = setTimeout(function() {
                c.onTick();
            }, d);
        } else {
            c.onTick();
        }
    },
    send: function(d) {
        var c = this;
        c.body = d;
        if (c.async) {
            c.schedule();
        } else {
            c.onComplete();
        }
    },
    setReadyState: function(c) {
        var d = this;
        if (d.readyState != c) {
            d.readyState = c;
            d.onreadystatechange();
        }
    },
    setRequestHeader: function(c, d) {
        this.requestHeaders[c] = d;
    },
    onreadystatechange: Ext.emptyFn,
    onComplete: function() {
        var me = this, callback;
        me.readyState = 4;
        Ext.apply(me, me.simlet.exec(me));
        callback = me.jsonpCallback;
        if (callback) {
            var text = callback + "(" + me.responseText + ")";
            eval(text);
        }
    },
    onTick: function() {
        var b = this;
        b.timer = null;
        b.onComplete();
        b.onreadystatechange && b.onreadystatechange();
    }
});

Ext.define("Ext.ux.ajax.SimManager", {
    singleton: true,
    defaultType: "basic",
    delay: 150,
    ready: false,
    constructor: function() {
        this.simlets = [];
    },
    getSimlet: function(r) {
        var l = this, n = r.indexOf("?"), q = l.simlets, m = q.length, p, i, k, o;
        if (n < 0) {
            n = r.indexOf("#");
        }
        if (n > 0) {
            r = r.substring(0, n);
        }
        for (p = 0; p < m; ++p) {
            i = q[p];
            k = i.url;
            if (k instanceof RegExp) {
                o = k.test(r);
            } else {
                o = k === r;
            }
            if (o) {
                return i;
            }
        }
        return l.defaultSimlet;
    },
    getXhr: function(h, f, g, j) {
        var i = this.getSimlet(f);
        if (i) {
            return i.openRequest(h, f, g, j);
        }
        return null;
    },
    init: function(d) {
        var c = this;
        Ext.apply(c, d);
        if (!c.ready) {
            c.ready = true;
            if (!("defaultSimlet" in c)) {
                c.defaultSimlet = new Ext.ux.ajax.Simlet({
                    status: 404,
                    statusText: "Not Found"
                });
            }
            c._openRequest = Ext.data.Connection.prototype.openRequest;
            Ext.data.Connection.override({
                openRequest: function(g, h, b) {
                    var a = !g.nosim && c.getXhr(h.method, h.url, g, b);
                    if (!a) {
                        a = this.callParent(arguments);
                    }
                    return a;
                }
            });
            if (Ext.data.JsonP) {
                Ext.data.JsonP.self.override({
                    createScript: function(b, a, h) {
                        var j = Ext.urlAppend(b, Ext.Object.toQueryString(a)), i = !h.nosim && c.getXhr("GET", j, h, true);
                        if (!i) {
                            i = this.callParent(arguments);
                        }
                        return i;
                    },
                    loadScript: function(a) {
                        var b = a.script;
                        if (b.simlet) {
                            b.jsonpCallback = a.params[a.callbackKey];
                            b.send(null);
                            a.script = document.createElement("script");
                        } else {
                            this.callParent(arguments);
                        }
                    }
                });
            }
        }
        return c;
    },
    openRequest: function(g, f, h) {
        var e = {
            method: g,
            url: f
        };
        return this._openRequest.call(Ext.data.Connection.prototype, {}, e, h);
    },
    register: function(f) {
        var d = this;
        d.init();
        function e(b) {
            var a = b;
            if (!a.isSimlet) {
                a = Ext.create("simlet." + (a.type || a.stype || d.defaultType), b);
            }
            d.simlets.push(a);
            a.manager = d;
        }
        if (Ext.isArray(f)) {
            Ext.each(f, e);
        } else {
            if (f.isSimlet || f.url) {
                e(f);
            } else {
                Ext.Object.each(f, function(b, a) {
                    a.url = b;
                    e(a);
                });
            }
        }
        return d;
    }
});

Ext.define("Ext.ux.ajax.XmlSimlet", {
    extend: "Ext.ux.ajax.DataSimlet",
    alias: "simlet.xml",
    xmlTpl: [ "<{root}>\n", '<tpl for="data">', "    <{parent.record}>\n", '<tpl for="parent.fields">', "        <{name}>{[parent[values.name]]}</{name}>\n", "</tpl>", "    </{parent.record}>\n", "</tpl>", "</{root}>" ],
    doGet: function(m) {
        var o = this, w = o.getData(m), q = o.getPage(m, w), p = m.xhr.options.operation.getProxy(), t = p && p.getReader(), u = t && t.getModel(), r = o.callParent(arguments), x = {
            data: q,
            reader: t,
            fields: u && u.fields,
            root: t && t.getRootProperty(),
            record: t && t.record
        }, s, v, n;
        if (m.groupSpec) {
            x.summaryData = o.getSummary(m, w, q);
        }
        if (o.xmlTpl) {
            s = Ext.XTemplate.getTpl(o, "xmlTpl");
            v = s.apply(x);
        } else {
            v = w;
        }
        if (typeof DOMParser != "undefined") {
            n = new DOMParser().parseFromString(v, "text/xml");
        } else {
            n = new ActiveXObject("Microsoft.XMLDOM");
            n.async = false;
            n.loadXML(v);
        }
        r.responseText = v;
        r.responseXML = n;
        return r;
    }
});

Ext.define("Ticket.EntitySimlet", {
    extend: "Ext.ux.ajax.JsonSimlet",
    alias: "simlet.entity",
    doPost: function(f) {
        var g = this.callParent(arguments), h = this.processData(Ext.decode(f.xhr.body)), i = this.getById(this.data, h.id, true), j;
        for (j in h) {
            i[j] = h[j];
        }
        g.responseText = Ext.encode(i);
        return g;
    },
    processData: Ext.identityFn,
    getData: function(d) {
        var c = d.params;
        if ("id" in c) {
            return this.getById(this.data, c.id);
        }
        delete this.currentOrder;
        return this.callParent(arguments);
    },
    getById: function(i, h) {
        var g = i.length, f, j;
        for (f = 0; f < g; ++f) {
            j = i[f];
            if (j.id === h) {
                return j;
            }
        }
        return null;
    }
});

Ext.define("Ticket.SimData", {
    singleton: true,
    dateFormat: "Y-m-d\\TH:i:s\\Z",
    words: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.".replace(/[,\.]/g, "").split(" "),
    random: function() {
        var h = 2147483648, g = 1664525, f = 1013904223, e = 1103515245;
        return function(a, b) {
            e = (g * e + f) % h;
            var c = e / (h - 1);
            return Math.floor(c * (b - a + 1) + a);
        };
    }(),
    sentence: function(f, g) {
        var i = this.random(Ext.isDefined(f) ? f : 10, g || 30), h = this.words, j = Ext.String.capitalize(h[this.random(0, h.length - 1)]);
        while (i--) {
            j += " ";
            j += h[this.random(0, h.length - 1)];
        }
        j += ".";
        return j;
    },
    paragraph: function(f) {
        var d = f || this.random(2, 5), e = "";
        while (d--) {
            if (e) {
                e += " ";
            }
            e += this.sentence();
        }
        return e;
    },
    essay: function(f) {
        var d = f || this.random(1, 4), e = "";
        while (d--) {
            if (e) {
                e += "\n\n";
            }
            e += this.paragraph();
        }
        return e;
    },
    minDate: +Ext.Date.subtract(new Date(), Ext.Date.MONTH, 6),
    maxDate: +new Date(),
    MILLIDAY: 60 * 60 * 24 * 1e3,
    randomDate: function(d) {
        d = d || 180;
        var c = 1e3 * this.random(1, d * this.MILLIDAY / 1e3);
        return new Date(this.minDate + c);
    },
    nextDate: function(f, g) {
        g = g || 2 / 3;
        var h = f.getTime(), e = this.maxDate - h;
        return new Date(h + 1e3 * this.random(1, e * g / 1e3));
    },
    init: function() {
        var r = this, C = r.dateFormat, t = [], z = [], w = [], x = [], A = [], y = [], p = [ "Admins", "Development", "QA", "Support", "Sales" ], s = {}, q = {}, u = {}, v = {
            Sencha: {
                SDK: "Don,Alex,Ben,Evan,Kevin,Nige,Phil,Pierre,Ross,Tommy",
                IT: "Len,Ian,Mike,Ryan"
            }
        };
        Ext.Object.each(v, function(a, b) {
            var c = z.length + 1;
            z.push({
                id: c,
                name: a
            });
            Ext.each(p, function(d) {
                y.push({
                    id: y.length + 1,
                    name: d,
                    organizationId: c
                });
            });
            Ext.Object.each(b, function(o, d) {
                var i = w.length + 1, h = A.length + 1, f = {
                    id: i,
                    name: o,
                    organizationId: 1,
                    leadId: h
                }, H = r.randomDate(20);
                w.push(f);
                Ext.Array.forEach(d.split(","), function(F) {
                    var E = A.length + 1, J = {
                        id: E,
                        name: F,
                        projectId: i,
                        organizationId: c
                    };
                    A.push(J);
                    u[E] = J;
                });
                for (var j = r.random(100, 200); j-- > 0; ) {
                    H = r.nextDate(H, .03);
                    var m = x.length + 1, l = H, e = Ext.Date.add(l, Ext.Date.MINUTE, r.random(30, 7200)), G = r.random(h, A.length), g = r.random(h, A.length);
                    x.push({
                        id: m,
                        title: r.sentence(5, 15),
                        description: r.essay(),
                        projectId: f.id,
                        creatorId: G,
                        creator: Ext.apply({}, u[G]),
                        assigneeId: g,
                        assignee: Ext.apply({}, u[g]),
                        created: Ext.Date.format(l, C),
                        modified: Ext.Date.format(e, C),
                        status: r.random(1, 3)
                    });
                    for (var n = r.random(0, 3); n-- > 0; ) {
                        l = r.nextDate(l);
                        var k = r.random(h, A.length);
                        t.push({
                            id: t.length + 1,
                            text: r.paragraph(),
                            ticketId: m,
                            userId: k,
                            user: Ext.apply({}, u[k]),
                            created: Ext.Date.format(l, C)
                        });
                    }
                }
            });
            Ext.Array.forEach(A, function(g) {
                var e = s[g.id] = [], f = y.length, h = r.random(1, 3), d;
                while (e.length < h) {
                    d = y[r.random(0, f - 1)];
                    if (Ext.Array.indexOf(e, d) === -1) {
                        e.push(d);
                        (q[d.id] || (q[d.id] = [])).push(g);
                    }
                }
            });
        });
        function D(a) {
            return {
                type: "entity",
                data: a
            };
        }
        function B(b) {
            var a = Ext.Array.toMap(b, "id");
            return function(c) {
                return c.id in a;
            };
        }
        Ext.ux.ajax.SimManager.init().register({
            "/organization": D(z),
            "/group": Ext.apply({
                processFilters: function(a) {
                    Ext.each(a, function(b, c) {
                        if (b.property === "userId") {
                            a[c] = B(s[b.value]);
                        }
                    });
                    return this.self.prototype.processFilters.call(this, a);
                }
            }, D(y)),
            "/project": D(w),
            "/comment": D(t),
            "/ticket": Ext.apply({
                processData: function(a) {
                    a.modified = Ext.Date.format(new Date(), C);
                    return a;
                },
                processFilters: function(a) {
                    var c = Ext.Array.findBy(a, function(d) {
                        return d.property === "status";
                    });
                    var b = Ext.Array.findBy(a, function(d) {
                        return d.property === "assigneeId";
                    });
                    if (c && c.value === -1) {
                        Ext.Array.remove(a, c);
                    }
                    if (b) {
                        b.exactMatch = true;
                    }
                    return a;
                }
            }, D(x)),
            "/ticketStatusSummary": {
                type: "json",
                data: function(d) {
                    var a = Ext.decode(d.params.filter)[0].value, b = [], c = {};
                    Ext.Array.forEach(x, function(e) {
                        var f;
                        if (e.projectId === a) {
                            f = e.status;
                            if (!c.hasOwnProperty(f)) {
                                c[f] = 0;
                            }
                            c[f] += 1;
                        }
                    });
                    Ext.Object.each(c, function(f, e) {
                        b.push({
                            status: f,
                            total: e
                        });
                    });
                    return b;
                }
            },
            "/ticketOpenSummary": {
                type: "json",
                data: function(f) {
                    var a = Ext.decode(f.params.filter)[0].value, g = Ext.Date, e = g.clearTime(new Date(), true), c = g.subtract(e, g.MONTH, 1), b = [], d = {};
                    Ext.Array.forEach(x, function(h) {
                        var j, i;
                        if (h.projectId === a) {
                            j = Ext.Date.parse(h.created, "c");
                            if (j >= c) {
                                i = Ext.Date.format(j, "Y-m-d");
                                if (!d.hasOwnProperty(i)) {
                                    d[i] = 0;
                                }
                                d[i] += 1;
                            }
                        }
                    });
                    Ext.Object.each(d, function(i, h) {
                        b.push({
                            id: a + i,
                            date: i,
                            total: h
                        });
                    });
                    return b;
                }
            },
            "/user": Ext.apply({
                processFilters: function(a) {
                    Ext.each(a, function(b, c) {
                        if (b.property === "groupId") {
                            a[c] = B(q[b.value]);
                        }
                    });
                    return this.self.prototype.processFilters.call(this, a);
                }
            }, D(A)),
            "/authenticate": {
                type: "json",
                data: function(c) {
                    var a = c.params.username, b = Ext.Array.findBy(A, function(d) {
                        return d.name === a;
                    }) || A[0];
                    return Ext.apply({}, b);
                }
            }
        });
    }
});

Ext.define("Ticket.view.user.GroupModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.user-group"
});

Ext.define("Ticket.view.user.GroupController", {
    extend: "Ext.app.ViewController",
    alias: "controller.user-group",
    onAddGroup: function() {
        var b = this;
        Ext.Msg.prompt("Add Group", "Group name", function(j, k) {
            if (j === "ok") {
                var h = b.getSession(), l = b.getViewModel(), a;
                var i = h.createRecord("Group", {
                    name: k
                });
                a = l.getData().currentOrg.groups();
                a.add(i);
            }
        });
    }
});

Ext.define("Ticket.view.user.Group", {
    extend: "Ext.window.Window",
    controller: "user-group",
    viewModel: {
        type: "user-group"
    },
    width: 450,
    minHeight: 250,
    height: 350,
    bodyPadding: 10,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    title: "Edit Groups",
    modal: true,
    items: [ {
        xtype: "grid",
        bind: "{currentOrg.groups}",
        reference: "groupGrid",
        title: "Groups",
        margin: "0 5 0 0",
        flex: 1,
        hideHeaders: true,
        columns: [ {
            dataIndex: "name",
            flex: 1
        } ]
    }, {
        xtype: "multiselector",
        bind: {
            store: "{groupGrid.selection.users}",
            title: "Users - {groupGrid.selection.name}"
        },
        title: "Users",
        margin: "0 0 0 5",
        flex: 1,
        search: {
            store: {
                model: "User"
            }
        }
    } ],
    buttons: [ {
        text: "New Group",
        listeners: {
            click: "onAddGroup"
        }
    }, "->", {
        text: "Close",
        listeners: {
            click: "closeView"
        }
    } ]
});

Ext.define("Ticket.view.user.UserController", {
    extend: "Ext.app.ViewController",
    alias: "controller.user",
    onGroupsClick: function() {
        var b = new Ticket.view.user.Group();
        b.show();
    }
});

Ext.define("Ticket.view.user.User", {
    extend: "Ext.window.Window",
    controller: "user",
    width: 300,
    minHeight: 250,
    height: 450,
    bodyPadding: 10,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    bind: "Edit User: {theUser.name}",
    modal: true,
    tools: [ {
        type: "gear",
        tooltip: "Edit Groups",
        callback: "onGroupsClick"
    } ],
    items: [ {
        xtype: "textfield",
        fieldLabel: "Name",
        labelWidth: 70,
        bind: "{theUser.name}"
    }, {
        xtype: "multiselector",
        bind: "{theUser.groups}",
        title: "Groups",
        flex: 1,
        margin: "10 0",
        search: {
            store: {
                model: "Group"
            }
        }
    } ],
    buttons: [ {
        text: "Groups",
        listeners: {
            click: "onGroupsClick"
        }
    }, "->", {
        text: "Close",
        listeners: {
            click: "closeView"
        }
    } ]
});


Ext.define("Ticket.Application", {
    extend: "Ext.app.Application",
    controllers: [ "Root@Ticket.controller" ],
    onBeforeLaunch: function() {
        Ticket.SimData.init();
        this.callParent();
    }
});

Ext.application({
    name: "Ticket",
    extend: "Ticket.Application"
});