Ext.define('SSJT.view.module.Module', {
    extend: 'Ext.Container',
    requires: [
        'SSJT.view.module.ModuleController'
    ],
    xtype: 'module',
    controller: 'module',

    cls: 'module-view colorful-bg1',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    scrollable: 'y',

    items: [{
        xtype: 'dataview',
        userCls: 'module-dv',
        width: '100%',
        maxWidth: 1225,
        inline: true,
        loadingText: null,

        itemTpl: [
            '<div class="icon-wrapper">',
            '<div class="square-icon round-corner {iconCls}" style="background-color:{bgColor}">',
            '</div>',
            '</div>',
            '<div class="text-wrapper">',
            '<div class="short-text ellipsis">{text}</div>',
            '</div>'
        ].join(''),
        itemCls: 'small-100 medium-50 large-25',

        store: {
            data: [{
                id: 'tasks',
                iconCls: 'x-fa fa-tasks',
                bgColor: '#5AC8FA',
                text: '任务'
            }, {
                id: 'crm',
                iconCls: 'i-aio-crm',
                bgColor: '#5AC8FA',
                text: 'CRM'
            }, {
                id:'train',
                iconCls: 'x-fa fa-chrome',
                bgColor: '#5AC8FA',
                text: 'train'
            }, {
                iconCls: 'x-fa fa-firefox',
                bgColor: '#5AC8FA',
                text: 'Coming soon'
            }, {
                iconCls: 'x-fa fa-opera',
                bgColor: '#5AC8FA',
                text: 'Coming soon'
            }, {
                iconCls: 'x-fa fa-internet-explorer',
                bgColor: '#5AC8FA',
                text: 'Coming soon'
            }]
        },

        listeners: {
            childtap: 'onTapItem'
        }
    }]
});