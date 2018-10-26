Ext.define('SSJT.view.pages.Error404', {
    extend: 'SSJT.view.pages.ErrorBase',
    xtype: 'page404',

    items: [{
        cls: 'error-page-top-text',
        html: '404'
    }, {
        cls: 'error-page-desc',
        html: [
            '<div>啊呀, 你好像迷路了!</div>',
            '<div>不要慌! ',
            '<a href="javascript:history.back();">&nbsp;点此返回&nbsp;</a>',
            '</div>'
        ].join('')
    }]
});