/**
 * 头像管理帮助类
 * @author jiangwei
 */
Ext.define('Common.util.AvatarMgr', {
    singleton: true,
    requires: [
        'MX.util.Utils'
    ],
    alternateClassName: 'AvatarMgr',

    /**
     * 加载头像
     * @param {HTMLElement} node <img>节点
     */
    load: function (node) {
        if (!node || !node.parentNode || !node.parentNode.parentNode) return;

        var user = node.getAttribute('data-user'),
            isName = node.hasAttribute('data-isname');
        if (Ext.isEmpty(user)) return;

        var userId = this._getIdBy(user, isName);
        if (Ext.isEmpty(userId)) return;
        if (userId == 'System') {
            node.parentNode.className += ' system';
        }

        node.removeAttribute('onload');

        if (Ext.browser.is.Cordova) {
            // var nodeId = Ext.id(node);
            // this.doTsk(nodeId, userId);
        } else {
            var url = this.getAvatarUrl(userId),
                imgLoaded,
                imgError;

            imgLoaded = function (e) {
                e.target.parentNode.className += ' loaded';
                e.target.style.removeProperty('display');
                e.target.removeEventListener('load', imgLoaded, false);
                e.target.removeEventListener('error', imgError, false);
            };
            imgError = function (e) {
                e.target.parentNode.removeChild(e.target);
                e.target.removeEventListener('load', imgLoaded, false);
                e.target.removeEventListener('error', imgError, false);
            };

            node.addEventListener('load', imgLoaded, false);
            node.addEventListener('error', imgError, false);
            node.src = url;
        }
    },
    _getIdBy: function (user, isName) {
        if (Ext.isEmpty(user)) return '';
        if (isName) {
            if (user == '系统') {
                return 'System';
            }

            return '';
        }

        return user;
    },

    /**
     * 组装头像 html
     * @param {Object} option 可选项: idField用户编号字段(默认UserSign), nameField用户名称字段(默认UserName), title鼠标悬停提示, cls其他class样式类
     * @return {String}
     */
    getAvatarHtml(option) {
        option = option || {};

        const idField = option.idField || 'UserSign',
            nameField = option.nameField || 'UserName',
            cls = option.cls || '',
            title = option.title || '',
            titleAttr = Ext.isEmpty(title) ? '' : ` title="${title}"`;

        return [
            `<a class="avatar link-avatar firstletter ${cls}" letter="{[AvatarMgr.getFirstLetter(values.${nameField})]}" style="{[AvatarMgr.getColorStyle(values.${nameField})]}" ${titleAttr}>`,
                `<img src="{[ImgUtil.onePxImg]}" onload="AvatarMgr.load(this)" style="display:none" data-user="{${idField}}" />`,
            '</a>'
        ].join('');
    },

    /**
     * 组装 头像 url
     * @param {String} userId
     */
    getAvatarUrl(userId) {
        if (Ext.isEmpty(userId)) {
            userId = User.getUserID();
        }

        if (!Ext.isEmpty(userId)) {
            return Utils.joinPath(Config.httpUrl, `Doc/Avatar.ashx?UserID=${userId}`);
        }

        return '';
    },

    /**
     * 获取名字的第一个字，如果是英文，取2个字母
     * @param {String} name 名字
     * @return {String}
     */
    getFirstLetter(name) {
        if (Ext.isEmpty(name)) return '';
        if (name.length == 1) return name;
        var first = name.substr(0, 1).toUpperCase(),
            second = name.substr(1, 1);
        if (!/[\u4E00-\u9FFF]/.test(first) && !/[\u4E00-\u9FFF]/.test(second)) {
            return first + second.toLowerCase();
        }

        return first;
    },

    /**
     * 计算名字唯一色
     * @param {String} name 名字
     * @return {String} 颜色
     */
    getUniqueColor(name) {
        if (Ext.isEmpty(name)) return 'transparent';

        var hex = (Math.abs(Utils.hashCode(name)) % 0xcccccc).toString(16),
            color = `#${Ext.String.leftPad(hex, 6, '0')}`;

        return color;
    },

    /**
     * 计算名字唯一颜色样式
     * @param {String} name 名字
     * @return {String} 颜色样式
     */
    getColorStyle(name) {
        const color = this.getUniqueColor(name);

        return `background-color:${color};`;
    }
});