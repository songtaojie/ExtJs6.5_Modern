Ext.define('SSJT.view.report.FunDialog', {
    extend:'Ext.Dialog',
    xtype:'funcdialog',
    referenceHolder: true,

    closable: true,
    closeAction: 'hide',
    
    hidden: true,
    defaultListenerScope:true,
    maxWidth: '100vw',
    maxHeight: '100vh',
    width:500,
    height:600,
    // platformConfig: {
    //     phone: {
    //         width: '100vw',
    //         height: '100vh'
    //     },
    //     '!phone': {
    //         width: 900,
    //         height: '90vh'
    //     }
    // },
    viewModel:{
        data:{
            descript:'',
            textValue:''
        }
    },
    buttons:[{
        xtype:'component',
        flex:1
    }, {
        text:'确定',
        itemId:'define',
        ui:'action',
        handler:'onTapOk'
    }, {
        text:'取消',
        handler:'onCancle',
        ui: 'flat'
    }],
    defaultFocus:'#define',
    title:'插入函数',
    layout:'vbox',
    padding:15,
    listeners:{
        hide:'onDialogHide'
    },
    keyMap:{
        enter:'onTapOk'
    },
    items:[{
        xtype:'fieldcontainer',
        items:[{
            xtype:'label',
            html:'选择函数:',
            style:{
                margin:'auto 0'
            }
        }, {
            xtype:'fieldcontainer',
            docked:'right',
            items:[{
                xtype: 'radiofield',
                name : 'selectType',
                padding:'0 10 0',
                labelWidth:40,
                value: 'S',
                label: '覆盖',
                checked: true
            }, {
                xtype: 'radiofield',
                name : 'selectType',
                value: 'A',
                labelWidth:40,
                label: '追加'
            }]
        }]
    }, {
        xtype:'list',
        border:true,
        flex:1,
        style:'border:1px solid #CCC;',
        // fullscreen: true,
        itemTpl: '<div class="contact"><b>{funName}</b>({shortName})</div>',
        grouped: true,
        groupHeader: {
            tpl: '{name}({count})'
        },
        listeners:{
            select:'onSelect'
        },
        store: {
            grouper: {
                property: 'groudName',
                groupFn: function(record) {
                    return `<b style='font-size: 15px;color: black;'>${record.get('groudName')}</b>`;
                }
            },
            data: [{
                    groudName:'常用函数', funName: 'GetYearBalance',shortName:'NCYE',
                    description:'获取科目方向年初余额(本币)：GetYearBalance(Period, "Params[]")或NCYE(Period, "Params[]")，'+
                    '如：要获取1001科目的科目方向年初余额:<br>'+
                       '应写为：GetYearBalance([P:期间]，"[Acc:1001]")'
                },{ groudName:'常用函数', funName: 'GetBeginBalance',shortName:'QCYE',
                    description:'获取科目方向期初余额(本币)：GetBeginBalance(Period, "Params[]")或QCYE(Period, "Params[]")，'+
                    '如：要获取1001和1002科目的科目方向期初余额:<br>'+
                    '应写为：GetBeginBalance([P:期间]，"[Acc:1001，1002]")'
                },{ 
                    groudName:'常用函数', funName: 'GetCurrBalance',shortName:'BQYE',
                    description:'获取科目方向本期余额(本币)：GetCurrBalance(Period, "Params[]")或BQYE(Period, "Params[]")，'+
                    '如：要获取现金流量项目为100的期末余额:<br>'+
                       '应写为：GetCurrBalance([P:期间]，"[Cash:100] ")'
                },{
                    groudName:'常用函数',  funName: 'GetAmount',shortName:'BQFS',
                    description:'获取科目方向发生额(本币)：GetAmount(Period, "Params[]")或BQFS(Period, "Params[]")，'+
                    '如：要要获取1001科目，币种为EUR的科目方向发生额:<br>'+
                       '应写为：GetAmount([P:期间]，"[Acc:1001];[Curr:EUR]")'
                },{ 
                    groudName:'常用函数', funName: 'GetYearAmount',shortName:'LJFS',
                    description:'获取科目方向累计发生额(本币)：GetYearAmount(Period, "Params[]")或LJFS(Period, "Params[]")，'+
                    '如：要获取1122科目，往来编号100 的科目方向累计发生额:<br>'+
                       '应写为：GetYearAmount([P:期间]，"[Acc:1122];[Crd:100]")'
                },{
                    groudName:'常用函数',  funName: 'GetNetAmount',shortName:'BQJF',
                    description:'获取科目方向净发生额(本币)：GetNetAmount(Period, "Params[]")或BQJF(Period, "Params[]")，'+
                    '如：要获取1001科目 的科目方向净发生额:<br>'+
                       '应写为：GetNetAmount([P:期间]，"[Acc:1001]")'
                },{
                    groudName:'常用函数',  funName: 'GetYearNetAmount',shortName:'LJJF',
                    description:'获取科目方向累计净发生额(本币)：GetYearNetAmount(Period, "Params[]")或LJJF(Period, "Params[]")，'+
                 '如：要获取1001科目 的科目方向累计净发生额:<br>应写为：GetYearNetAmount([P:期间]，"[Acc:1001]")'
                },{
                    groudName:'常用函数',  funName: 'GetYearBalanceFC',shortName:'NCYEF',
                    description:'获取年初科目方向余额(原币):GetYearBalanceFC(Period, "Params[]")或NCYEF(Period, "Params[]")，'+
                    '获取1001科目，200901期间的科目方向年初余额，<br>应写为：GetYearBalanceFC("200901"，" [Acc:1001]")'
                },{
                    groudName:'常用函数',  funName: 'GetBeginBalanceFC',shortName:'QCYEF',
                    description:'期初科目方向余额(原币):GetBeginBalanceFC(Period, "Params[]")或QCYEF(Period, "Params[]")，'+
                    '如获取1001和1002科目，200901期间的科目方向期初余额，<br>应写为：GetBeginBalanceFC("200901"，" [Acc:1001，1002]")'
                },{
                    groudName:'常用函数',  funName: 'GetCurrBalanceFC',shortName:'BQYEF',
                    description:'本期科目方向余额(原币):GetCurrBalanceFC(Period, "Params[]")或BQYEF(Period, "Params[]")，'+
                    '如获取现金流量项目为100，200901期间的期末余额，<br>应写为：GetCurrBalanceFC("200901"，"[Cash:100]")'
                },{
                    groudName:'常用函数',  funName: 'GetAmountFC',shortName:'BQFSF',
                    description:'获取本期科目方向发生(原币):GetAmountFC(Period, "Params[]")或BQFSF(Period, "Params[]")，'+
                    '如获取1001科目，币种为人民币，200901期间的科目方向发生额，<br>应写为：GetAmountFC("200901"，" [Acc:1001];[Curr:RMB]")'
                },{
                    groudName:'常用函数',  funName: 'GetYearAmountFC',shortName:'LJFSF',
                    description:'获取累计科目方向发生(原币):GetYearAmount(Period, "Params[]")或LJFSF(Period, "Params[]")，'+
                    '获取1001科目，往来编号100，200901期间的科目方向累计发生额，<br>应写为：GetYearAmountFC("200901"，" [Acc:1001];[Crd:100]")'
                },{
                    groudName:'常用函数',  funName: 'GetNetAmountFC',shortName:'BQJFF',
                    description:'获取本期科目方向净发生(原币):GetNetAmountFC(Period, "Params[]")或BQJFF(Period, "Params[]")，'+
                    '获取1001科目，200901期间的科目方向净发生额，<br>应写为：GetNetAmountFC("200901"，" [Acc:1001]")'
                },{
                    groudName:'常用函数',  funName: 'GetYearNetAmountFC',shortName:'LJJFF',
                    description:'获取累计科目方向净发生(原币):GetYearNetAmountFC(Period, "Params[]")或LJJF(Period, "Params[]")，'+
                    '获取1001科目，200901期间的科目方向累计净发生额，<br>应写为：GetYearAmountFC("200901"，" [Acc:1001]")'
                },{
                    groudName:'通用函数',  funName: 'GetValue',shortName:'GetValue',
                    description:'财务报表支持的通用函数:GetValue(Period,"Time; Kind; Params[]")，'+
                    '如：借方年初本币余额：#=GetValue([P:期间],"[T:M5];[K:B11];[Acc:1122]")'
                }]
        }
    }, {
        xtype:'label',
        userSelectable:'text',
        bind:{
            html:'<b>函数描述：</b><br>{descript}'
        }
    }, {
        xtype:'textareafield',
        label:'公式值:',
        labelAlign:'top',
        bind:{
            value:'{textValue}'
        }
    }],
    onSelect(list,selected) {
        var me = this,
            textarea = me.down('textareafield'),
            selectType = me.down('field[name=selectType]{isChecked()}'),
            vm = me.getViewModel();
        if(selected) {
            var value = '';
            vm.set('descript',selected.get('description'));
            if(selectType.getValue() === 'A') {
                var value = textarea.getValue() || '';
            }
            value = value + selected.get('funName');
            textarea.setValue(value);
        }
    },
    onCancle() {
        this.hide();
    },
    onDialogHide() {
        var me = this,
            vm = me.getViewModel(),
            textarea = me.down('textareafield');
        textarea.reset();
        vm.set('descript','');
        vm.set('textValue','');
    },
    onTapOk() {
        var me = this,
            textarea = me.down('textareafield'),
            value = textarea.getValue();
        me.fireEvent('finishediting',me,value);
    }
});