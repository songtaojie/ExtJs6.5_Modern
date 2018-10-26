Ext.define('SSJT.view.grid.cell.RowNumberer', {
    extend:'Ext.grid.cell.RowNumberer',
    xtype:'ssjt_rownumberercell',
    align:'center',
    resizingCls: Ext.baseCSSPrefix + 'rowresizing',
    rowSelector: '.' + Ext.baseCSSPrefix + 'gridrow',
    resizerSelector: '.' + Ext.baseCSSPrefix + 'gridrow .' + Ext.baseCSSPrefix + 'horizontal-resizer-el',

    getTemplate: function() {
        var template = this.callParent();

        template.push({
            reference: 'hResizerElement',
                cls: Ext.baseCSSPrefix + 'horizontal-resizer-el ' +
                     Ext.baseCSSPrefix + 'item-no-tap'
        });

        return template;
    },
    initialize(){
        this.callParent(arguments);
        debugger
    },
    afterRender(){
        const me = this;
        me.callParent(arguments);  
        const grid = me.getCurrentGrid();
        me._hResizeMarker = grid.hResizeMarkerElement;
        me._hResizeMarkerParent = grid.hResizeMarkerElement.parent();
        me.renderElement.on({
            touchstart: 'onContainerTouchStart',
            scope: me,
            priority: 100
        }); 
    },
    getCurrentGrid(){
        const me = this,
            column = me.getColumn();
        return column.getGrid();
    },
    // initialize() {
    //     const me = this;
    //     me.callParent(arguments);
    //     debugger
       
    // },
    onContainerTouchStart(e) {
        var me = this,
            target = e.getTarget(me.rowSelector),
            resizer = e.getTarget(me.resizerSelector),
            row;

        if (resizer && !e.multitouch && target && !me._resizeRow) {
            row = Ext.Component.from(target);

            if (row && row.isGridRow) {
                me._startRowHeight = row.getHeight() || row.el.getHeight() || 33;
                me._minRowHeight = row.getMinHeight() || 33;
                me._maxRowHeight = row.getMaxHeight();
                me._resizeRow = row;
                me._startY = e.getY();
                row.addCls(me.resizingCls);
                // Prevent drag and longpress gestures being triggered by this mousedown
                e.claimGesture();
                me._hResizeMarker.show();
                me._hResizeMarker.setTop(row.el.getOffsetsTo(me._hResizeMarkerParent)[1] + me._startRowHeight);
                
                me.touchListeners = Ext.getBody().on({
                    touchEnd: 'onTouchEnd',
                    touchMove: 'onTouchMove',
                    scope: me,
                    destroyable: true
                });
            }
        } else if (e.multitouch && me._resizeRow) {
            me.endResize();
        }
    },
    onTouchMove(e) {
        const me = this;
        if (e.isMultitouch) {
            me.endResize();
            return;
        }

        if (me._resizeRow) {
            var row = me._resizeRow,
                resizeAmount = e.getY() - me._startY;

            if (row && row.isGridRow) {
                me.currentRowHeight = Math.max(Math.ceil(me._startRowHeight + resizeAmount), me._minRowHeight);
                if (me._maxRowHeight) {
                    me.currentRowHeight = Math.min(me.currentRowHeight, me._maxRowHeight);
                }
                me._hResizeMarker.setTop(row.el.getOffsetsTo(me._hResizeMarkerParent)[1] + me.currentRowHeight);

                e.claimGesture();
            }
        }
    },
    onTouchEnd(e) {
        var me = this,
            row = me._resizeRow,
            hasResized = e.getY() !== me._startY;
        me.$resizeAmount = e.getY() - me._startY;
        Ext.destroy(me.touchListeners);
        if (row) {
            me.endResize();

            // Mouse/touch down then up means a tap on the resizer
            if (!hasResized) {
                // row.onResizerTap(e);
            }
        }
    },
    endResize: function () {
        var me = this,
            row = me._resizeRow;
        if (row && row.isGridRow) {
            me._hResizeMarker.hide();
            me.adjustRowHeight();
            me.adjustSelect();
            row.removeCls(me.resizingCls);
            delete me._resizeRow;
            delete me._startY;
            delete me._minRowHeight;
            delete me._maxRowHeight;
        }
    },
    /**
     * 调整行的高度和位置
     */
    adjustRowHeight() {
        const me = this,
            row = me._resizeRow;
        if (row && row.isGridRow && me.currentRowHeight) {
            // console.log(me.currentRowHeight);
            var resizeAmount = me.currentRowHeight - me._startRowHeight,
                grid = me.getCurrentGrid();
            if(resizeAmount !== 0) {
                var cells = row.getCells(),
                    cell = cells.length >1?cells[1] : me,
                    cellBodyHeight = cell.bodyElement.getHeight(),
                    padLR,
                    topAmount;
                if(cell.bodyElement.getPadding) {
                    var padTB = cell.bodyElement.getPadding('tb');
                    padLR = cell.bodyElement.getPadding('l');
                    topAmount = cellBodyHeight - padTB;
                }
                var padTop =Math.floor((me.currentRowHeight -topAmount || 17 - 2)/2);
                cells.forEach(c => {
                    c.bodyElement.setPadding(`${padTop} ${padLR || 10} ${padTop - 1}`);
                });
                grid.onDataItemResize(row, null,me.currentRowHeight);
            }
        }
    },
    adjustSelect() {
        const me = this,
            grid = me.getCurrentGrid(),
            selectable = grid.getSelectable();
        if(selectable) {
            var selectCount = selectable.getSelectionCount();
            if(selectCount > 0) {
                var selection = selectable.getSelection();
                if(selection.isCells) {
                    var rangeStart = [
                        selection.getFirstRowIndex(),
                        selection.getFirstColumnIndex()
                    ],
                    rangeEnd =  [
                        selection.getLastRowIndex(),
                        selection.getLastColumnIndex()
                    ];
                    selectable.selectCells(rangeStart,rangeEnd);
                }else if(selection.isRows) {
                    selectable.selectRows(selection.getRecords());
                }else if(selection.isColumns) {
                    var selColumns = selection.getColumns();
                    selectable.deselectAll();
                    selColumns.forEach(c => {
                        selectable.selectColumn(c);
                    });
                }
            }
        }
    }
});