Ext.define('SSJT.view.book.balances.BalancesTable',{
    extend:'Ext.grid.Grid',
    xtype:'balances_table',
    columnLines: true,
    infinite: false,
    columns: [{
        text: '基本信息',
        // width: '30%',
        // minWidth: 100,
        //rowspan: 3,
        flex:2,
        columns:[{
            text:'科目编号',
            dataIndex:'ID',
            align:'center',
            flex:1

        },{
            text:'科目名称',
            dataIndex:'Name',
            align:'center',
            flex:2
        },{
            text:'币种',
            dataIndex:'Currency',
            align:'center',
            hidden:true,
            flex:1
        }]
    }, {
        text: '期初余额',
        // width: '30%',
        // minWidth: 100,
        flex:1,
        columns:[{
            text:'借方本币',
            dataIndex:'Currency1',
            flex:1,
            align:'center'
        },{
            text:'贷方本币',
            dataIndex:'Currency2',
            flex:1,
            align:'center'
        }]
    }, {
        text: '本期发生',
        // width: '30%',
        // minWidth: 100,
        flex:1,
        columns:[{
            text:'借方',
            dataIndex:'Happen1',
            flex:1,
            align:'center'
        },{
            text:'贷方',
            dataIndex:'Happen2',
            flex:1,
            align:'center'
        }]
    }, {
        text: '期末余额',
        // width: '30%',
        // minWidth: 100,
        flex:1,
        columns:[{
            text:'借方',
            dataIndex:'Happen1',
            align:'center',
            flex:1,
        },{
            text:'贷方',
            dataIndex:'Happen2',
            flex:1,
            align:'center'
        }]
    }],
// plugins: {
//     gridpagingtoolbar: true
// },
// listeners: {
//     childtap: 'onChildTap'
// },
})