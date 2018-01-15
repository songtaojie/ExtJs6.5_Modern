Ext.define('Common.util.User', {
    alternateClassName: 'User',
    requires: [
        'MX.util.Utils'
    ],
    singleton: true,

    config: {
        user: null // 用户信息
    },

    /**
     * @property {Object} digit
     * 通用设置 里面的 小数位数
     * Money, Price, Percent, Rate, Quantity
     */
    digit: null,

    /**
     * { UserID: 1, UserName: '', AvatarHash: '' }
     *
     * @param {Object} user
     */
    updateUser: function (user, oldUser) {
        var me = this;

        if (!user || !oldUser || user.UserID != oldUser.UserID) {
            Utils.getApp().fireEvent('userchanged');
        }

        const extra = user ? user.Extra : null;
        me.digit = extra ? extra.digit : null;

        Ext.Viewport.getViewModel().set('user', user);
    },


    /**
     * userId 是不是 当前登录的用户
     *
     * @param {String} userId
     * @return {Boolean}
     */
    isMe(userId) {
        if (Ext.isEmpty(userId)) return false;

        return this.getUserID() == userId;
    },

    /**
     * 获取当前登录用户的UserID
     *
     * @return {String}
     */
    getUserID() {
        var user = this.getUser();
        if (!user) return null;

        return user.UserID;
    },

    /**
     * 获取 数值类型 需要格式化的 小数位数
     * @param {String} type 数值类型，Money/Price/Percent/Rate/Quantity
     * @return {Number} 小数位数
     */
    getDigit(type) {
        const me = this;
        if(me.digit && me.digit.hasOwnProperty(type)) {
            return me.digit[type];
        }

        return 2; // 默认 2
    }
});