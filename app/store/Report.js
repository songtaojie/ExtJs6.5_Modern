Ext.define('SSJT.store.Report', {
    extend: 'Ext.data.ArrayStore',
    model: 'SSJT.model.Report',
    alias: 'store.report',
    data: (function () {
        var data = [],
            mod = 0x7fffFFFF,
            // return integer [min,max)
            rand = function (min, max) {
                var r = (seed = ((seed * 214013) + 2531011) % mod) / mod; // [0, 1)
                return Math.floor(r * (max - min)) + min;
            },
            seed = 13;
        var height = window.screen.height,
            count = Math.ceil(height/32);
        for (var year = 0; year <= count; ++year) {
            data.push(new SSJT.model.Report());
        }

        return data;
    }())
});