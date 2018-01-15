/**
 * 带有 value 和 text 的 Model
 * @author jiangwei
 */
Ext.define('MX.model.ValueText', {
    extend: 'Ext.data.Model',
    idProperty: 'value',
    fields: ['value', 'text']
});