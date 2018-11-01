
Ext.define('SSJT.view.report.Grid', {
    extend: 'Ext.Container',
    xtype: 'flexible-selection-grid',
    controller: 'flexible-selection',

    requires: [
        'SSJT.store.Report',
        'SSJT.view.grid.plugin.Clipboard',
        'Ext.grid.plugin.CellEditing',
        'Ext.util.TSV',
        'Ext.grid.plugin.ColumnResizing'
    ],

    layout: 'fit',
    // maxWidth: 1125,

    items: [{
        xtype: 'ssjt_grid',
        reference: 'selectionGrid',
        userCls:'report-grid',
        shadow: 'true',
        title: '财务报表',
        columnLines: true,
        itemRipple: false,
        store: {
            type: 'report'
        },
        keyMap:{
            F4:'onGridF4KeyTap'
        },
        selectable: {
            // Disables sorting by header click, though it will be still available via menu
            columns: true,
            cells: true,
            checkbox: false,
            drag: true,
            extensible: 'both'
        },
        // Propagates numeric values when the selection is extended in the Y axis
        plugins: {
            clipboard:{
                type:'ssjt_clipboard'
            },
            selectionreplicator: true,
            gridcellediting:true,
        },
        listeners: {
            selectionchange: 'onSelectionChange'
        },
        sortable:false,
        grouped:false,
        columns: [{
            text: 'A',
            dataIndex: 'A',
            editable:true,
            groupable: false,
            // flex: 1, 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false,
                renderer:'onRenderer',
                // tools: {
                //     // Tools can also be configured using an object.
                //     insert: {
                //         handler: 'onInsertFun',
                //         //tooltip: 'Change settings...',
                //         iconCls:'x-fa fa-facebook-official',
                //         // Cells offer a start or end "zone" for tools:
                //         zone: 'end',
                //         tooltip: '插入函数'
                //         // Use record binding for dynamic configuration:
                //     }
                // }
            },
            width: 75,
            minWidth:1,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'B', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'B', 
            align:'center',
            renderer:'onRenderer',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'C', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'C',
            align:'center', 
            renderer:'onRenderer',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'D', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'D',
            align:'center', 
            renderer:'onRenderer',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'E', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'E',
            align:'center',
            renderer:'onRenderer',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'F', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'F',
            align:'center', 
            renderer:'onRenderer',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'G',
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'G', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
             width: 75,
             editor:{
                 field:{
                    xtype:'ssjt_listfind',
                     listeners:{
                         change:'onTextChange'
                     }
                 }
             }
        },{
            text: 'H', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'H',
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            }, 
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'I',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'I',
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'J', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'J',
            align:'center', 
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'K',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'K', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'L', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'L', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'M', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'M', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'N',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'N', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'O',
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'O', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'P', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'P', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'Q', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'Q', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'R',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'R', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'S',
            minWidth:1, 
            editable:true,
            groupable: false,
            dataIndex: 'S',
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            }, 
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'T', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'T', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'U',
            minWidth:1,
            editable:true,
            groupable: false, 
            dataIndex: 'U', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'V',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'V', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'W',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'W', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'X', 
            minWidth:1,
            editable:true,
            groupable: false,
            dataIndex: 'X', 
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'Y',
            minWidth:1,
            editable:true, 
            groupable: false,
            dataIndex: 'Y',
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            },
             width: 75,
             editor:{
                 field:{
                    xtype:'ssjt_listfind',
                     listeners:{
                         change:'onTextChange'
                     }
                 }
             }
        },{
            text: 'Z',
            minWidth:1, 
            editable:true,
            groupable: false,
            dataIndex: 'Z',
            align:'center',
            cell:{
                align:'left',
                encodeHtml:false
            }, 
            width: 75,
            editor:{
                field:{
                    xtype:'ssjt_listfind',
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        }],
        
        items: [{
            xtype: 'component',
            reference: 'status',
            docked: 'bottom',
            cls: 'demo-solid-background',
            padding: '5 10',
            html: 'No selection'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '5 8',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            // shadow: 'true',
            ui: 'action'
        },
        items: [{
        //     text: 'Selectable',
        //     menu: {
        //         defaults: {
        //             xtype: 'menucheckitem',
        //             checkHandler: 'onSelectableChange'
        //         },
        //         items: [{
        //             text: 'rows',
        //             fn: 'setRows',
        //             checked: true,
        //             bind: {
        //                 checked: '{isRows}'
        //             }
        //         }, {
        //             text: 'cells',
        //             fn: 'setCells',
        //             checked: true
        //         }, {
        //             text: 'columns',
        //             fn: 'setColumns',
        //             checked: true
        //         }, {
        //             text: 'drag',
        //             fn: 'setDrag',
        //             checked: true
        //         }, {
        //             text: 'checkbox',
        //             fn: 'setCheckbox',
        //             checked: true,
        //             bind: {
        //                 checked: {
        //                     bindTo: '{isRows}',
        //                     twoWay: false
        //                 }
        //             }
        //         }]
        //     }
        // }, {
        //     text: 'Extensible',
        //     menu: {
        //         defaults: {
        //             xtype: 'menuradioitem',
        //             checkHandler: 'onExtensibleChange',
        //             group: 'extensible'
        //         },
        //         items: [{
        //             text: 'x',
        //             value: 'x'
        //         }, {
        //             text: 'y',
        //             value: 'y',
        //             checked: true
        //         }, {
        //             text: 'both',
        //             value: true
        //         }]
        //     }
        // },{
            text:'文本左对齐',
            handler:'onAlignLeft'
        },{
            text:'文本居中',
            handler:'onAlignCenter'
        },{
            text:'文本右对齐',
            handler:'onAlignRight'
        }, {
            text:'字体加粗',
            handler:'onFontBlod'
        },{
            text:'取消加粗',
            handler:'onRemoveFondBlod'
        },{
            text:'插入函数',
            handler:'onInsertFunc'
        },{
            xtype:'component',
            flex:1
        },{
            xtype:'numberfield',
            label:'模板编号',
            labelWidth:65,
            width:180,
            shadow: false,
            itemId:'tempNumber',
            value:6100
        },{
            text:'读取模板数据',
            handler:'onReadData'
        }, {
            text:'保存',
            handler:'onSave'
        }]
    }],
    initialize() {
        const me = this,
            grid = me.lookup('selectionGrid'),
            header = grid.getHeaderContainer();
        me.callParent(arguments);
        grid.bodyElement.on({
            contextmenu: 'onContextMenu',
        });
        header.bodyElement.on({
            contextmenu: 'onContextMenu',
        });
    }
});
