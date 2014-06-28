Ext.define("App.view.main.NavigationTree", {
    extend: "Ext.tree.Panel",
    xtype: "navigation-tree",
    title: "Navigation",
    rootVisible: false,
    lines: false,
    useArrows: true,
    hideHeaders: true,
    collapseFirst: false,
    width: 250,
    minWidth: 100,
    height: 200,
    split: true,
    stateful: true,
    stateId: "mainnav.west",
    collapsible: true,
    tools: [ {
        type: "up",
        tooltip: "Switch to Breadcrumb View",
        listeners: {
            click: "showBreadcrumbNav"
        }
    } ],
    initComponent: function() {
        var b = this;
        b.columns = [ {
            xtype: "treecolumn",
            flex: 1,
            dataIndex: "text",
            scope: b,
            renderer: function(d) {
                var a = this.searchField.getValue();
                if (a.length > 0) {
                    return this.strMarkRedPlus(a, d);
                }
                return d;
            }
        } ];
        Ext.apply(b, {
            store: Ext.StoreMgr.get("navigation"),
            dockedItems: [ {
                xtype: "textfield",
                dock: "top",
                emptyText: "Search",
                enableKeyEvents: true,
                triggers: {
                    clear: {
                        cls: "x-form-clear-trigger",
                        handler: "onClearTriggerClick",
                        hidden: true,
                        scope: "this"
                    },
                    search: {
                        cls: "x-form-search-trigger",
                        weight: 1,
                        handler: "onSearchTriggerClick",
                        scope: "this"
                    }
                },
                onClearTriggerClick: function() {
                    this.setValue();
                    b.store.clearFilter();
                    this.getTrigger("clear").hide();
                },
                onSearchTriggerClick: function() {
                    b.filterStore(this.getValue());
                },
                listeners: {
                    keyup: {
                        fn: function(g, j, a) {
                            var h = g.getValue();
                            g.getTrigger("clear")[h.length > 0 ? "show" : "hide"]();
                            this.filterStore(h);
                        },
                        buffer: 300
                    },
                    render: function(a) {
                        this.searchField = a;
                    },
                    scope: b
                }
            } ]
        });
        b.callParent(arguments);
    },
    filterStore: function(l) {
        var m = this, h = m.store, n = l.toLowerCase(), k = function(b) {
            var c = b.childNodes, e = c && c.length, a = j.test(b.get("text")), d;
            if (!a) {
                for (d = 0; d < e; d++) {
                    if (c[d].isLeaf()) {
                        a = c[d].get("visible");
                    } else {
                        a = k(c[d]);
                    }
                    if (a) {
                        break;
                    }
                }
            } else {
                for (d = 0; d < e; d++) {
                    c[d].set("visible", true);
                }
            }
            return a;
        }, j;
        if (n.length < 1) {
            h.clearFilter();
        } else {
            j = new RegExp(n, "i");
            h.getFilters().replaceAll({
                filterFn: k
            });
        }
    },
    strMarkRedPlus: function(c, d) {
        return d.replace(new RegExp("(" + c + ")", "gi"), "<span style='color: red;'><b>$1</b></span>");
    }
});