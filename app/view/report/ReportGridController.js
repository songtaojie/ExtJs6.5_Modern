Ext.define('SSJT.view.report.ReportGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.flexible-selection',

    getSelectable: function () {
        return this.lookup('selectionGrid').getSelectable();
    },
    /**
     * 文本渲染时
     */
    onRenderer(value) {
        if(Ext.isEmpty(value))return value;
        return value.replace(new RegExp(' ','g'), '&nbsp;');
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
                value = value.replace(new RegExp(' ','g'), '&nbsp;');
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
        if(!Ext.isEmpty(value)) {
            value = value.replace(new RegExp(' ','g'), '&nbsp;');
        }
        newHtml = html.substring(0,html.indexOf('>') + 1) + value + html.substring(html.lastIndexOf('</'));
        status.setHtml(newHtml);
    },
    onSelectableChange: function (menuitem, checked) {
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
                column,
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
                column = grid.getColumns(`gridcolumn[text=${columnName}]`)[0];
                record && record.set(column?column.getDataIndex() : columnName,d.Formula);
            }
        }
    },
    onReadData() {
        var me = this,
            view = me.getView(),
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
            },
            maskTarget:view
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
            diaModel,
            colName,
            column,
            keyColumnNameMap = {};
        diaStore.removeAll();
        store.each(r => {
            if(r.isDirty()) {
                idFieldName = r.idField.getName();
                rowIndex = grid.mapToRecordIndex(r) + 1;
                Ext.Object.each(r.getData(), function(key, value) {
                    if(key !== idFieldName) {
                        if(!keyColumnNameMap.hasOwnProperty(key)) {
                            column = grid.getColumnForField(key);
                            keyColumnNameMap[key] = key;
                            if(column.getText() !== key) {
                                keyColumnNameMap[key] = column.getText();
                            }
                        }
                        colName = keyColumnNameMap[key];
                        colIndex = me.getExcelCol(colName);
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
    /**
     * 右键菜单事件
     * @param {*} e 
     * @param {*} el 
     */
    onContextMenu(e, el) {
        const me = this,
            com = Ext.Component.from(el),
            grid = me.lookup('selectionGrid');
        if(com && com.isGridColumn || com.isGridCell) {
            const sel = grid.getSelectable(),
                selCount = sel.getSelectionCount(),
                selection = sel.getSelection(),
                status = {
                    insertRow:false,
                    insertColumn:false,
                    mergeCell : false
                };
            if(com.isGridColumn) {
                var reSelectCol = true;
                if(selection.isColumns && selCount >=1) {
                    const selColumns = selection.getColumns();
                    reSelectCol = selColumns.indexOf(com) < 0;
                }
                if(reSelectCol) {
                    grid.deselectAll();
                    sel.selectColumn(com);
                }
                status.insertColumn = true;
            }else if(com.isGridCell) {
                const cell = com,
                    idx = grid.getItemIndex(el),
                    record = grid.getStore().getAt(idx);
                if(cell.hasCls('x-rownumberercell')) {
                    var reSelectRow = true;
                    if(selection.isRows && selCount >= 1) {
                        const records = selection.getRecords();
                        reSelectRow = records.indexOf(record) < 0;
                    }
                    if(reSelectRow) {
                        grid.deselectAll();
                        grid.select(record, false);
                    }
                    status.insertRow = true;
                }else {
                    var seSelectCell = true,
                        range = selection.getRowRange();;
                    if(selection.isCells && selCount >= 1) {
                        selection.eachCell(l => {
                            if(l.cell === cell) {
                                seSelectCell = false;
                                return false;
                            }
                        });
                    }
                    if(seSelectCell) {
                        const location = me.getGridLocation(cell);
                        grid.deselectAll();
                        sel.selectCells(location, location);
                    }
                    status.insertRow = true;
                    status.insertColumn = true;
                    if(selCount > 1 && range[0] === range[1]){
                        status.mergeCell = true;
                    }
                }
            }
            me._showCtxMenu(e.pageX, e.pageY, status);
            e.preventDefault();
        }
    },
    /**
     * 显示右键菜单，以及上面的一些功能
     * @param {*} x 
     * @param {*} y 
     * @param {*} status 
     */
    _showCtxMenu(x, y, status) {
        status = status || {};
        var me = this,
            menu = Ext.create('Ext.menu.Menu', {
            indented:false,
            defaults:{
                scope:me,
            },
            items:[{
                text:'插入行',
                handler:'onInsertRow',
                hidden:status.insertRow !== true,
            }, {
                text:'插入列',
                hidden:status.insertColumn !== true,
                handler:'onInsertColumn',
            },{
                text:'复制',
                handler:'onCopyData',
                hidden:true
            },{
                text:'剪切',
                handler:'onCutData',
                scope:me,
                hidden:true
            }, {
                text:'合并单元格',
                handler:'mergeGridCells',
                hidden:status.mergeCell !== true
            }, {
                text:'取消合并单元格',
                handler:'cancelMergeGridCell',
            }]
        });
        const region = new Ext.util.Region(y, x + 1, y + 1, x);
        menu.showBy(region, 'tl-bl?');
    },
    /**
     * 复制数据
     */
    onCopyData() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            clipboard = grid.getPlugin('clipboard');
        if(clipboard) {
            clipboard.doCutCopy(null,false);
        }
    },
    /**
     * 剪切数据
     */
    onCutData() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            clipboard = grid.getPlugin('clipboard');
        if(clipboard) {
            clipboard.doCutCopy(null,true);
        }
    },
    /**
     * 插入一行数据
     */
    onInsertRow() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            selection = selectable.getSelection();
        if(selection.isRows || selection.isCells) {
            const store = grid.getStore(),
                index = selection.getLastRowIndex();
            store.insert(index + 1, store.createModel({}));
        }
    },
    /**
     * 是用这种方式进行插入，再插入列后，只修改text即表头的显示字母，不修改dataIndex，这样
     * 就不用管从插入列到最后的那些列在移动时数据的移动了
     * 这样在数据解析的时候，列索引我们就根据text来进行设置
     */
    onInsertColumn(){
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            selection = selectable.getSelection(),
            allColumn = grid.getColumns(),
            column;
        if(selection.isColumns){
            column = selection.getColumns()[selection.getCount() - 1];
        }else if(selection.isCells) {
            const firstColumnIndex = selection.getLastColumnIndex();
            column = allColumn[firstColumnIndex];
        }
        if(column) {
            var store = grid.getStore(),
                model = store.getModel(),
                columnName = column.getText(),
                columnIndex = allColumn.indexOf(column),
                allCount = allColumn.length,
                lastColumnName = allColumn[allCount - 1].getText(),
                tempColumn,
                tempColumnName;
            for(let i = allCount - 1; i > columnIndex; i--) {
                tempColumn = allColumn[i];
                if(tempColumn) {
                    tempColumnName = tempColumn.getText();
                    tempNextColumnName = me.getNextColumnName(tempColumnName);
                    tempColumn.setText(tempNextColumnName);
                }
            }
            const nextColumnName = me.getNextColumnName(columnName),
                nextDataIndex = me.getNextColumnName(lastColumnName),
                nextField = model.getField(nextDataIndex);
            if(nextField == null) {
                model.addFields([{
                    name:nextDataIndex,
                    allowNull:true
                }]);
            }
            grid.insertColumn(columnIndex + 1, {
                text:nextColumnName,
                editable:true,
                dataIndex:nextDataIndex, 
                width: 75,
                align:'center',
                cell:{
                    align:'left'
                }          
            });
        }
    },
    /**
     * 文本居左显示
     */
    onAlignLeft() {
        const me = this;
        me.doSetAlign('left');
    },
    /**
     * 文本居zhong显示
     */
    onAlignCenter() {
        const me = this;
        me.doSetAlign('center');
    },
    /**
     * 文本局右显示
     */
    onAlignRight() {
        const me = this;
        me.doSetAlign('right');
    },
    
    doSetAlign(align) {
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            selection = selectable.getSelection(),
            cell,
            record;
        selection.eachCell(l=>{
            record = l.record;
            cell = l.cell;
            if(Ext.isEmpty(cell) && !grid.isRecordRendered(record)) {
                grid.scrollToRecord(record, true);
                cell = grid.mapToCell(record,l.column);
            }
            if(cell) {
                cell.setAlign(align);
            }
        });
    },
    /**
     * 字体加粗
     */
    onFontBlod() {
        var me = this,
            sel = me.getSelectable(),
            selection = sel.getSelection(),
            cell,
            record,
            grid;
        selection.eachCell(l=>{
            record = l.record;
            cell = l.cell;
            grid = l.view;
            if(Ext.isEmpty(cell) && !grid.isRecordRendered(record)) {
                grid.scrollToRecord(record, true);
                cell = grid.mapToCell(record,l.column);
            }
            if(cell && !cell.isNumberCell) {
                cell.addCls('gridcell-font-blod');
            }
        });
    },
    onRemoveFondBlod() {
        var me = this,
            sel = me.getSelectable(),
            selection = sel.getSelection(),
            cell,
            record,
            grid;
        selection.eachCell(l=>{
            record = l.record;
            cell = l.cell;
            grid = l.view;
            if(Ext.isEmpty(cell) && !grid.isRecordRendered(record)) {
                grid.scrollToRecord(record, true);
                cell = grid.mapToCell(record,l.column);
            }
            cell && cell.removeCls('gridcell-font-blod');
        });
    },
    /**
     * 插入列时是根据修改每一列的dataIndex来进行插入的（主要是为了对应dataIndex和text，使他们保持一样，
     * 在数据解析式比较好处理），但是这样在列数据的往后面移动时，不是很好处理，所以换一种方式
     *
     * 
     */
    onInsertColumn2() {
        var me = this,
            grid = me.lookup('selectionGrid'),
            selectable = grid.getSelectable(),
            clip = grid.getPlugin("clipboard"),
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
                    tempCells,
                    cutData;
                for(let i = allCount - 1; i > columnIndex; i--) {
                    tempColumn = allColumn[i];
                    if(tempColumn) {
                        selectable.selectColumn(tempColumn);
                        tempColumnName = tempColumn.getDataIndex();
                        tempNextColumnName = me.getNextColumnName(tempColumnName);
                        tempNextField =  model.getField(tempNextColumnName);
                        if(tempNextField == null) {
                            model.addFields([{
                                name:tempNextColumnName,
                                allowNull:true
                            }]);
                        }
                        cutData = clip.getCellData(clip.getSystem(), true);
                        tempColumn.setText(tempNextColumnName);
                        tempColumn.setDataIndex(tempNextColumnName);
                        tempCells = tempColumn.getCells();
                        tempCells.forEach(c => {
                            c.dataIndex = tempNextColumnName;
                        });
                        clip.putCellData(cutData, clip.getSystem(),i + 1, 0);
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