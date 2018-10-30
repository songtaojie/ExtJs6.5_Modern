Ext.define('SSJT.view.report.ReportGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.flexible-selection',

    getSelectable: function () {
        return this.lookup('selectionGrid').getSelectable();
    },

    onSelectionChange: function (grid, records, selecting, selection) {
        var status = this.lookup('status'),
            message = '??',
            startDataIndex,
            endDataIndex,
            startRange,
            endRange,
            firstRowIndex,
            firstColumnIndex,
            lastRowIndex,
            lastColumnIndex,
            value = '';

        if (!selection) {
            message = 'No selection';
        }
        else if (selection.isCells) {
            if(selection.startCell) {
                var cell = selection.startCell.cell;
                value = cell.getValue() || '';
                value = '<span style="font-weight:bold;">'+value+'</span>';
                startDataIndex = cell.dataIndex;
            }
            if(selection.endCell) {
                endDataIndex = selection.endCell.cell.dataIndex;
            }
            firstRowIndex = Ext.Number.parseInt(selection.getFirstRowIndex());
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = Ext.Number.parseInt(selection.getLastRowIndex());
            lastColumnIndex = selection.getLastColumnIndex();

            startDataIndex = startDataIndex || firstColumnIndex;
            endDataIndex = endDataIndex || lastColumnIndex;
            startRange = lastColumnIndex - firstColumnIndex + 1;
            endRange = lastRowIndex - firstRowIndex + 1;
            message = `区域：${startRange}x${endRange} at( [${startDataIndex}, ${firstRowIndex + 1 }] - [${endDataIndex}, ${lastRowIndex + 1}]) 值：${value}`;
            // message = '区域: ' + startRange + 'x' + endRange +
            //     ' at ([' + (startDataIndex || firstColumnIndex) + ', ' + (Ext.Number.parseInt(firstRowIndex) + 1) + ')'+' 值: '+value;
        }
        else if (selection.isRows) {
            message = '行数: ' + selection.getCount();
        }
        else if (selection.isColumns) {
            message = '列数: ' + selection.getCount();
        }

        status.setHtml(message);
    },
    onTextChange(sender, value, oldValue, e) {
        var status = this.lookup('status'),
            html = status.getHtml() || '',
            newHtml;
        newHtml = html.substring(0,html.indexOf('>') + 1) + value + html.substring(html.lastIndexOf('</'));
        status.setHtml(newHtml);
    },
    onSelectableChange: function (menuitem, checked) {
        debugger
        var sel = this.getSelectable(),
            fn = menuitem.fn;

        if (fn === 'setChecked') {
            checked = checked ? 'only' : true;
        }

        sel[fn](checked);
    },

    onExtensibleChange: function (menuitem, checked) {
        if (checked) {
            var sel = this.getSelectable();

            sel.setExtensible(menuitem.getValue());
        }
    },
    /**
     * 合并单元格
     */
    mergeGridCells() {
        const me = this,
            sel = me.getSelectable(),
            selection = sel.getSelection();
        if(selection && selection.isCells) {
            const range = selection.getRowRange(),
                count = sel.getSelectionCount();
            if(range[0] === range[1] && count > 1) {
                var notMerge = false;

                selection.eachCell(function(location){
                    if(location.cell.isOrignMergeCell) {
                        notMerge = true;
                        return false;
                    }
                });
                if(!notMerge) {
                    var startLocation = selection.startCell,
                        startcell = startLocation.cell,
                        startcolumn = startLocation.column,
                        width = startcolumn.getWidth() || startcolumn.getComputedWidth(),
                        nextcell;
                    if(Ext.isEmpty(startcell.mergeGridCells)) {
                        startcell.mergeGridCells = [];
                    }
                    selection.eachCell(function(location) {
                        nextcell = location.cell;
                        nextcell.on('widthchange','onCellWidthChange',me);
                        if(nextcell !== startcell) {
                            var nextWidth = nextcell.getWidth() || nextcell.getComputedWidth();
                            nextcell.mergeGridCell = startcell;
                            startcell.mergeGridCells.push(nextcell);
                            nextcell.blur();
                            nextcell.hide();
                            width += nextWidth;
                        }else {
                            nextcell.isOrignMergeCell = true;
                            nextcell.mergeWidthChage = true;
                        }
                    });
                    startcell.setAlign('center');
                    startcell.mergeWidthChage = true;
                    startcell.setWidth(width);
                    sel.selectCells(startLocation,startLocation)
                }
            }
        }

    },
    onCellWidthChange(cell, value, oldValue) {
        if(cell.mergeGridCell && !cell.isVisible()) {
            var mergeCell = cell.mergeGridCell,
                orignWidth = mergeCell.getWidth() || mergeCell.getComputedWidth();
            mergeCell.mergeWidthChage = true;
            mergeCell.setWidth(orignWidth - oldValue + value);
        }else if(cell.isOrignMergeCell) {
            if(cell.mergeWidthChage) {
                delete cell.mergeWidthChage;
            }else {
                var mergeCells = cell.mergeGridCells,
                    mergeWidth = value,
                    cellWidth;
                if(!Ext.Object.isEmpty(mergeCells)) {
                    mergeCells.forEach(c => {
                        cellWidth = c.getWidth() || c.getComputedWidth() || c.el.getWidth();
                        mergeWidth += cellWidth;
                    });
                }
                cell.mergeWidthChage = true;
                cell.setWidth(mergeWidth);
            }
        }
    },
    
    cancelMergeGridCell() {
        const me = this,
            sel = me.getSelectable(),
            selection = sel.getSelection();
        var mergeCells = [];
        selection.eachCell(function(location) {
            var cell = location.cell;
            if(cell.isOrignMergeCell && cell.isVisible()) {
                if(mergeCells.indexOf(cell) < 0){
                    mergeCells.push(cell);
                }
            }else if(cell.mergeGridCell && !cell.isVisible()){
                if(mergeCells.indexOf(cell.mergeGridCell) < 0){
                    mergeCells.push(cell.mergeGridCell);
                }
            }
        });
        if(!Ext.Object.isEmpty(mergeCells)) {
            mergeCells.forEach(mergeCell => {
                var cells = mergeCell.mergeGridCells;
                if(cells) {
                    var mergeColumn = mergeCell.getColumn();
                    cells.forEach(c => {
                        var column = c.getColumn();
                        c.un('widthchange','onCellWidthChange',me);
                        c.setWidth(column.getWidth() || column.getComputedWidth());
                        delete c.mergeGridCell;
                        c.show();
                    });
                    delete mergeCell.isOrignMergeCell;
                    delete mergeCell.mergeGridCells;
                    mergeCell.setAlign('left')
                    mergeCell.un('widthchange','onCellWidthChange',me);
                    mergeCell.setWidth(mergeColumn.getWidth() || mergeColumn.getComputedWidth())
                }
            });
        }
    },
    /**
     * 插入行
     */
    insertRow() {
        const grid = this.lookup('selectionGrid'),
            store = grid.getStore();
        store.add(store.createModel({}));
    },
    insertColumn() {
        const me = this,
            grid = me.lookup('selectionGrid'),
            model = grid.store.getModel(),
            columns = grid.getColumns('gridcolumn:not(rownumberer)'),
            maxColumn = columns[columns.length - 1],
            dataIndex = maxColumn.getDataIndex(),
            nextFieldName = me.getNextColumnName(dataIndex);
            nextField = model.getField(nextFieldName),
            scrollable = grid.getScrollable();
        if(nextField == null) {
            model.addFields([{
                name:nextFieldName,
                allowNull:true
            }]);
        }
        grid.addColumn({
            text:nextFieldName,
            editable:true,
            dataIndex:nextFieldName, 
            width: 75,
            align:'center'          
        });
        if(scrollable) {
            scrollable.scrollTo(Infinity,null);
        }
    },
    getNextColumnName(name) {
        if(Ext.isEmpty(name))return String.fromCharCode(65);
        var me = this,
            length = name.length,
            newName;
        var lastCode = name.charCodeAt(length-1) - 64,
            name = name.substring(0,length - 1);
        if(lastCode<= 25) {
            newName = name + String.fromCharCode(lastCode + 1 + 64);
        }else {
            newName = me.getNextColumnName(name) + String.fromCharCode(65);
        }
        return newName;
    },
    getDataIndexForCode(colIndex){
        var charCode ,
            newName;
        if(colIndex >= 1 && colIndex <= 26) {
            charCode = colIndex + 64
            newName =  String.fromCharCode(charCode);
        }else if(colIndex > 26) {
            colIndex = colIndex - 26;
            newName = String.fromCharCode(65) + me.getDataIndexForCode(colIndex);
        }
        return newName
    },
    getExcelCol(value){
        var result = 0;
        for (var index = 0; index < value.length; index++)
        {
            result = result *26;
            var temp = value[index];
            result += (temp.charCodeAt() - 'A'.charCodeAt() + 1);
        }
        return result;
    },
    fillValue(data) {
        var me = this,
            grid = me.lookup('selectionGrid'),
            store = grid.getStore();
        if(Ext.isArray(data)) {
            var itemCount = grid.getItemCount(),
                maxRowIndex = itemCount;
            data.forEach(d =>{
                if(maxRowIndex < d.RowIndex) {
                    maxRowIndex = d.RowIndex;
                }
                // if(maxColumnCount < d.ColIndex) {
                //     maxColumnCount = d.ColIndex;
                // }
            });
            if(itemCount < maxRowIndex) {
                var items = [];
                for(var i = itemCount;i<maxRowIndex;i++){
                    items.push(store.createModel({}));
                }
                store.add(items);
            }
            var dataCount = data.length,
                columns = grid.getColumns('gridcolumn:not(rownumberer)'),
                maxRowIndex = store.getCount() - 1,
                maxColumnIndex = columns.length - 1,
                rowIndex,
                colIndex,
                record,
                columnName,
                d;
            if(maxRowIndex <=0 || maxColumnIndex <= 0)return;
            for(var sourceRowIdx = 0;sourceRowIdx<dataCount;sourceRowIdx++) {
                d = data[sourceRowIdx];
                rowIndex = d.RowIndex - 1;
                colIndex = d.ColIndex;
                if(rowIndex < 0 || rowIndex > maxRowIndex)continue;
                record = store.getAt(rowIndex);
                columnName = me.getDataIndexForCode(colIndex);
                record && record.set(columnName,'#='+d.Formula);
            }
        }
    },
    onReadData() {
        var me = this,
            fields = ['Formula','RowIndex','ColIndex'];
        Utils.ajax('ajax/Financial.VoucherView/GetInfo', {
            data:{
                P1:'6100',
                P2:fields
            },
            success(r){
                if(r){
                    me.fillValue(r.data);
                }
            }
        });

    },
    onSave() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            store = grid.getStore(),
            rowIndex,
            colIndex,
            idFieldName,
            result = [];
        var dialog = Ext.create({
            xtype:'result_dialog'
        }),
            diaGrid = dialog.down('grid'),
            diaStore = diaGrid.getStore(),
            diaModel;
        diaStore.removeAll();
        store.each(r => {
            if(r.isDirty()) {
                idFieldName = r.idField.getName();
                rowIndex = grid.mapToRecordIndex(r) + 1;
                Ext.Object.each(r.getData(), function(key, value) {
                    if(key !== idFieldName) {
                        colIndex = me.getExcelCol(key);
                        diaModel = diaStore.createModel({
                            RowIndex:rowIndex,
                            ColIndex:colIndex,
                            NeedReplace:'Y',
                            SheetName:'Sheet1',
                            Formula:value,
                            Value:(value || '').substring(2)
                        })
                        result.push(diaModel);
                    }
                });
            }
        });
        diaStore.add(result);
        dialog.show();
    },
    onContextMenu(e, el) {
        const me = this,
            com = Ext.Component.from(el),
            grid = me.lookup('selectionGrid');
        if(com && com.isGridColumn || com.isGridCell) {
            const selectable = grid.getSelectable(),
                status = {
                    insertRow:false,
                    insertColumn:false
                };
            grid.deselectAll();
            if(com.isGridColumn) {
                selectable.selectColumn(com);
                status.insertColumn = true;
            }else if(com.isGridCell) {
                const cell = com,
                    idx = grid.getItemIndex(el),
                    record = grid.getStore().getAt(idx);
                if(cell.hasCls('x-rownumberercell')) {
                    grid.select(record, false);
                    status.insertRow = true;
                }else {
                    status.insertRow = true;
                    status.insertColumn = true;
                    const location = me.getGridLocation(cell);
                    selectable.selectCells(location, location);
                }
            }
            me._showCtxMenu(e.pageX, e.pageY, status);
            e.preventDefault();
        }
           
            
    },
    _showCtxMenu(x, y, status) {
        status = status || {};
        var me = this,
            menu = Ext.create('Ext.menu.Menu', {
            indented:false,
            items:[{
                text:'插入行',
                handler:'onInsertRow',
                hidden:status.insertRow !== true,
                scope:me
            }, {
                text:'插入列',
                hidden:status.insertColumn !== true,
                handler:'onInsertColumn',
                scope:me
            },{
                text:'复制',
                handler:'onCopyData',
                scope:me
            },{
                text:'剪切',
                handler:'onCutData',
                scope:me
            }]
        });
        const region = new Ext.util.Region(y, x + 1, y + 1, x);
        menu.showBy(region, 'tl-bl?');
    },
    onCopyData() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            clipboard = grid.getPlugin('clipboard');
        if(clipboard) {
            clipboard.doCutCopy(null,false);
        }
    },
    onCutData() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            clipboard = grid.getPlugin('clipboard');
        if(clipboard) {
            clipboard.doCutCopy(null,true);
        }
    },
    onInsertRow() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            selection = selectable.getSelection();
        if(selection.isRows || selection.isCells) {
            const store = grid.getStore(),
                index = selection.getFirstRowIndex();
            store.insert(index + 1, store.createModel({}));
        }
    },
    onInsertColumn() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            selection = selectable.getSelection();
        if(selection.isColumns){
            const column = selection.getColumns()[0];
            if(column) {
                var allColumn = grid.getColumns(),
                    store = grid.getStore(),
                    model = store.getModel(),
                    columnName = column.getDataIndex(),
                    columnIndex = allColumn.indexOf(column),
                    allCount = allColumn.length,
                    tempColumn,
                    tempNextField,
                    tempColumnName,
                    tempColumnNames = [],
                    tempNextColumnName,
                    tempCells;
                for(let i = allCount - 1; i > columnIndex; i--) {
                    tempColumn = allColumn[i];
                    if(tempColumn) {
                        tempColumnName = tempColumn.getDataIndex();
                        tempNextColumnName = me.getNextColumnName(tempColumnName);
                        tempNextField =  model.getField(tempNextColumnName);
                        if(tempNextField == null) {
                            model.addFields([{
                                name:tempNextColumnName,
                                allowNull:true
                            }]);
                        }
                        tempColumn.setText(tempNextColumnName);
                        tempColumn.setDataIndex(tempNextColumnName);
                        tempCells = tempColumn.getCells();
                        tempCells.forEach(c => {
                            c.dataIndex = tempNextColumnName;
                        });
                    }
                }
                
                const nextColumnName = me.getNextColumnName(columnName),
                    nextField = model.getField(nextColumnName);
                if(nextField == null) {
                    model.addFields([{
                        name:nextColumnName,
                        allowNull:true
                    }]);
                }
                grid.insertColumn(columnIndex + 1, {
                    text:nextColumnName,
                    editable:true,
                    dataIndex:nextColumnName, 
                    width: 75,
                    align:'center'          
                });
                grid.refresh();
            }
        }
    },
    /**
     * 根据正在编辑的文本框获取当前的坐标位置处的相关信息
     * @param{Ext.grid.plugin.CellEditing|Ext.grid.cell.Base|Ext.form.Field} editor
     */
    getGridLocation(editor) {
        let location = null;
        if(editor && editor.isField) {
            editor = editor.getParent();
        }
        if(editor && editor.isCellEditor) {
            location = editor.getLocation();
            if(Ext.Object.isEmpty(location)) {
                editor = editor.getRefOwner();
            }
        }
        if(Ext.Object.isEmpty(location) && editor && editor.isGridCell) {
            const record = editor.getRecord(),
                column = editor.getColumn(),
                grid = column.getGrid();
            location = new Ext.grid.Location(grid, {
                record: record,
                column: column
            });
        }

        return location;
    },
});