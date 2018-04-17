Ext.define('SSJT.store.Balances', {
    extend: 'Ext.data.Store',
    alias: 'store.balances',
    requires:[
        'SSJT.model.Balances'
    ],
    model:'SSJT.model.Balances',
    remoteFilter:true,
    remoteSort:true,
    proxy: {
        type: 'ajax',
        api : 'store/Financial.AccBooks/QueryBalancesData',
    },
});
