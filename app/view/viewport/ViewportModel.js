Ext.define('SSJT.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.viewport',

    data: {
        user: null
    },

    formulas: {
        userAvatar: {
            bind: {
                u: '{user}'
            },
            get (data) {
                if(!data.u) return '';

                return `${AvatarMgr.getAvatarUrl(data.u.UserID)}&_dc=${data.u.AvatarHash}`;
            }
        }
    }
});