Ext.define('SSJT.view.report.Result', {
    extend:'Ext.Dialog',
    xtype:'result_dialog',
    requires:[
        'SSJT.store.Result'
    ],
    height:'80vh',
    closable:true,
    resizable:true,
    title:'数据',
    width:900,
    layout: 'fit',
    items:[{
        xtype:'grid',
        columnLines: true,
        store: {
            type: 'result'
        },
        columns:[{
            text:'Formula',
            dataIndex:'Formula',
            width:450
        },{
            text:'RowIndex',
            dataIndex:'RowIndex'
        },{
            text:'ColIndex',
            dataIndex:'ColIndex'
        },{
            text:'SheetName',
            dataIndex:'SheetName'
        }]
    }]
})