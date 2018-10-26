
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
        title: '资产负债表',
        columnLines: true,
        itemRipple: false,
        store: {
            type: 'report'
        },
        selectable: {
            // Disables sorting by header click, though it will be still available via menu
            columns: true,
            cells: true,
            checkbox: false,
            drag: true,
            extensible: 'y'
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
                align:'left'
            },
            width: 75,
            editor:{
                field:{
                    listeners:{
                        change:'onTextChange'
                    }
                }
            }
        },{
            text: 'B', 
            editable:true,
            groupable: false,
            dataIndex: 'B', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'C', 
            editable:true,
            groupable: false,
            dataIndex: 'C',
            align:'center', 
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'D', 
            editable:true,
            groupable: false,
            dataIndex: 'D',
            align:'center', 
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'E', 
            editable:true,
            groupable: false,
            dataIndex: 'E',
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'F', 
            editable:true,
            groupable: false,
            dataIndex: 'F',
            align:'center', 
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'G',
            editable:true,
            groupable: false,
            dataIndex: 'G', 
            align:'center',
            cell:{
                align:'left'
            },
             width: 75
        },{
            text: 'H', 
            editable:true,
            groupable: false,
            dataIndex: 'H',
            align:'center',
            cell:{
                align:'left'
            }, 
            width: 75
        },{
            text: 'I',
            editable:true, 
            groupable: false,
            dataIndex: 'I',
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'J', 
            editable:true,
            groupable: false,
            dataIndex: 'J',
            align:'center', 
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'K',
            editable:true, 
            groupable: false,
            dataIndex: 'K', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'L', 
            editable:true,
            groupable: false,
            dataIndex: 'L', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'M', 
            editable:true,
            groupable: false,
            dataIndex: 'M', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'N',
            editable:true, 
            groupable: false,
            dataIndex: 'N', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'O',
            editable:true,
            groupable: false,
            dataIndex: 'O', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'P', 
            editable:true,
            groupable: false,
            dataIndex: 'P', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'Q', 
            editable:true,
            groupable: false,
            dataIndex: 'Q', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'R',
            editable:true, 
            groupable: false,
            dataIndex: 'R', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'S', 
            editable:true,
            groupable: false,
            dataIndex: 'S',
            align:'center',
            cell:{
                align:'left'
            }, 
            width: 75
        },{
            text: 'T', 
            editable:true,
            groupable: false,
            dataIndex: 'T', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'U',
            editable:true,
            groupable: false, 
            dataIndex: 'U', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'V',
            editable:true, 
            groupable: false,
            dataIndex: 'V', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'W',
            editable:true, 
            groupable: false,
            dataIndex: 'W', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'X', 
            editable:true,
            groupable: false,
            dataIndex: 'X', 
            align:'center',
            cell:{
                align:'left'
            },
            width: 75
        },{
            text: 'Y',
            editable:true, 
            groupable: false,
            dataIndex: 'Y',
            align:'center',
            cell:{
                align:'left'
            },
             width: 75
        },{
            text: 'Z', 
            editable:true,
            groupable: false,
            dataIndex: 'Z',
            align:'center',
            cell:{
                align:'left'
            }, 
            width: 75
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
            shadow: 'true',
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
            text:'插入行',
            handler:'insertRow'
        },{
            text:'插入列',
            handler:'insertColumn'
        }, {
            text:'合并单元格',
            handler:'mergeGridCells'
        }, {
            text:'取消合并单元格',
            handler:'cancelMergeGridCell'
        }, {
            text:'读取数据',
            handler:'onReadData'
        }]
    }]
});
