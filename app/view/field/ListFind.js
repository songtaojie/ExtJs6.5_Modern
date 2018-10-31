/**
 * 添加拼音过滤
 */
Ext.define('SSJT.view.field.ListFind', {
    extend: 'Ext.field.ComboBox',
    xtype:[
        'ssjt_listfind',
        'ssjt_listfindfield'
    ],
    config:{
        pinYinFilter:true
    },
    isVoucherListFind:true,
    containValueFilter:true, // false代表是使用以什么开头的过滤值方式，true代表使用全like的过滤方式
    containTextFilter:true, // false代表是使用以什么开头的过滤显示文本方式，true代表使用全like的过滤方式
    displayField:'value',
    options:[
        'GetYearBalance',
        'GetBeginBalance',
        'GetCurrBalance',
        'GetAmount',
        'GetYearAmount',
        'GetNetAmount',
        'GetYearNetAmount',
        'GetYearBalanceF',
        'GetBeginBalanceF',
        'GetCurrBalanceF',
        'GetAmountF',
        'GetYearAmountF',
        'GetNetAmountF',
        'GetYearNetAmountF'
    ],
    picker:'floated',
    triggerAction:'query',
    itemTpl: '<span class="listfind-picker-value">{value:htmlEncode}</span>',
    /**
     * 如果该属性被设置为true，则设置查询模式为本地查询，并设置PrimaryFilter
     * @param {*} filter
     */
    applyPinYinFilter(filter) {
        const me = this;
        if(filter) {
            me.setQueryMode('local');
        }
        
        return filter;
    },
    /**
     * 更新store的属性
     * @param {*} store
     * @param {*} oldStore
     */
    updateStore(store, oldStore) {
        const me = this;
        me.callParent([store, oldStore]);
        if(store && me.getPinYinFilter()) {
            store.setAutoLoad(true);
            store.setRemoteFilter(false);
            store.setRemoteSort(false);
        }
    },
    /**
     * 初始化时，如果pinYinFilter属性设置为了true则加载拼音过滤的文件，
     * 并设置store为自动加载，并把远程过滤设置为false，
     * 因为在使用拼音过滤时，是加载的全部数据,在前台使用拼音进行过滤
     */
    initialize() {
        const me = this,
            picker = me.getPicker();
        me.callParent(arguments);
        if(me.getPinYinFilter()) {
            SSJTHelper.ensurePinYinJsLibs();
            me.resetPrimaryFilter();
        }
        picker.on({
            show:{
                fn:function(p) {
                    var items = p.getInnerItems();
                    items.forEach(item => {
                        item.setTools(null);
                    });
                },
                single:true
            }
        });
    },
    /**
     * 重新设置PrimaryFilter
     */
    resetPrimaryFilter() {
        const me = this,
            valueField = me.getValueField(),
            labelField = me.getDisplayField(),
            containValue = me.containValueFilter === true,
            containText = me.containTextFilter === true;
        me.setPrimaryFilter({
            filterFn:function(record) {
                const query = this.getValue();
                if(query) {
                    const v = record.get(valueField),
                        l = record.get(labelField);
                    let valueFilter = false,
                        textFilter = false;
                    if(containValue) {
                        valueFilter = me.indexOfFilter(v, query);
                    }else {
                        valueFilter = me.startWith(v, query);
                    }
                    if(containText) {
                        textFilter = me.indexOfFilter(l, query);
                    }else {
                        textFilter = me.startWith(l, query);
                    }
                    if(valueFilter || textFilter || !/[^a-z]/i.test(query) && (me.testPinyin(query.toUpperCase(), l, containText) || me.testPinyin(query, v, containValue))) {
                        return true;
                    }

                    return false;
                }

                return true;
            }
        });
    },
    /**
     * 重写加载前的事件，如果是使用拼音过滤，则此时的PrimaryFilter被修改成了使用拼音进行过滤，
     * 所以手动添加一个query属性的过滤
     * @param {*} store
     * @param {*} op
     */
    onBeforeLoadAutoComplete(store, op) {
        const me = this;
        let filters = op.getFilters();
        if(!filters) {
            filters = [new Ext.util.Filter({
                id: 'primary-filter',
                property: 'query',
                value: '',
                disabled: true
            })];
            if(me.getPinYinFilter()) {
                filters.push(new Ext.util.Filter({
                    property: '_IsAll',
                    value: 'Y',
                }));
            }
            op.setFilters(filters);
        }
        me.callParent(arguments);
    },
    // 检查拼音是否匹配
    testPinyin(matchText, text, contains) {
        const me = this;
        if(window.makePy) {
            var pinyins = window.makePy(text);
            for (var i = 0; i < pinyins.length; i++) {
                if (!contains) {
                    if(me.startWith(pinyins[i], matchText))return true;
                }
                else {
                    if(pinyins[i].indexOf(matchText) !== -1)return true;
                }
            }
        }

        return false;
    },
    /**
     * 以什么开头的过滤
     * @param {*} text
     * @param {*} s
     */
    startWith(text, s) {
        if(s === null || s === '' || text.length === 0 || s.length > text.length)return false;
        if (text.substr(0, s.length) == s)return true;

        return false;
    },
    /**
     * 全like过滤
     * @param {*} text
     * @param {*} s
     */
    indexOfFilter(text, s) {
        if(s === null || s === '' || text.length === 0 || s.length > text.length)return false;
        if (text.indexOf(s) >= 0)return true;

        return false;
    }
});