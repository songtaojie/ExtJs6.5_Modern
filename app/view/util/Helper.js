Ext.define('SSJT.view.util.Helper', {
    alternateClassName:'SSJTHelper',
    singleton:true,
    
    strToDate(value) {
        if(!Ext.isEmpty(value) && /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/.test(value)) {
            return new Date(Date.parse(value.replace(/-/g, '/')));
        }

        return null;
    },
    /**
     * 加载拼音文件资源
     * @param {*} success
     * @param {*} fail
     */
    ensurePinYinJsLibs(success, fail) {
        const me = this,
            bundleId = 'pinyinjslibsloaded',
            path = Ext.getResourcePath('libs/pinyin/', 'shared'),
            ver = Ext.manifest.version;
        if (!RM.isDefined(bundleId)) {
            RM.load(`${path}pinyin.js?v=${ver}`, bundleId);
        }
        RM.ready(bundleId, {
            success() {
                if (Ext.isFunction(success)) success();
            },
            error() {
                if (Ext.isFunction(fail)) fail();
            }
        });
    },
    confirm(msg, handle) {
        Ext.Msg.confirm('系统提示', msg, function (btn) {
            if (btn == 'yes' && handle != null) {
                handle();
            }
        }).focus();
    },
    /**
     * 对字符串添加分隔符
     * @param {*} s
     * @param {*} split
     */
    formatStr(s, split) {
        if(Ext.isEmpty(s))return '';
        if(split === false)return s;
        if(Ext.isString(split))return s + split;

        return `${s}; `;
    },
});