Ext.define('SSJT.view.grid.plugin.Clipboard', {
    extend:'Ext.grid.plugin.Clipboard',
    alias: 'plugin.ssjt_clipboard',
    putCellData: function (data, format) {
        if(Ext.isString(data)) {
            data = data.replace(new RegExp('"','g'),"'");
        }
        var cmp = this.getCmp(),
            values = Ext.util.TSV.decode(data),
            recCount = values.length,
            colCount = recCount ? values[0].length : 0,
            columns = cmp.getHeaderContainer().getVisibleColumns(),
            store = cmp.getStore(),
            maxRowIdx = store ? store.getCount() - 1 : 0,
            maxColIdx = columns.length - 1,
            selectable = cmp.getSelectable(),
            selection = selectable && selectable.getSelection(),
            row, sourceRowIdx, sourceColIdx, column, record, columnIndex, recordIndex,
            dataObject, destination, dataIndex, startColumnIndex, startRecordIndex;

        if (maxRowIdx <= 0 || maxColIdx <= 0) {
            return;
        }

        if (selection) {
            selection.eachCell(function (c) {
                destination = c;
                return false;
            });
        }

        startColumnIndex = destination ? destination.columnIndex : 0;
        startRecordIndex = destination ? destination.recordIndex : 0;

        for (sourceRowIdx = 0; sourceRowIdx < recCount; sourceRowIdx++) {
            row = values[sourceRowIdx];
            recordIndex = startRecordIndex + sourceRowIdx;
            // If we are at the end of the destination store, break the row loop.
            if (recordIndex > maxRowIdx) {
                break;
            }
            record = store.getAt(recordIndex);

            dataObject = {};
            columnIndex = startColumnIndex;
            sourceColIdx = 0;

            // Collect new values in dataObject
            while (sourceColIdx < colCount && columnIndex <= maxColIdx) {
                column = columns[columnIndex];
                dataIndex = column.getDataIndex();

                // we skip ignored columns
                if (!column.getIgnoreExport()) {
                    // paste the content if the column allows us to do that, otherwise we ignore it
                    if (dataIndex && (format === 'raw' || format === 'text')) {
                        var tempData = row[sourceColIdx];
                        if(Ext.isString(tempData)) {
                            tempData = tempData.replace(new RegExp("'",'g'),'"');
                        }
                        dataObject[dataIndex] = tempData;
                    }
                    sourceColIdx++;
                }
                columnIndex++;
            }

            // Update the record in one go.
            record.set(dataObject);
        }
    },
})