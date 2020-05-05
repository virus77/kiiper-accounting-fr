import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AgGridReact } from 'ag-grid-react';
import { $ } from 'jquery';

const util = {
    //Crea el Copyright
    Copyright: function () {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="/">Kipper</Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    },
    //Crea el componente generidco del grid
    createDataDrid: function (columnDefs, rowData, defaultColDef, onGridReady) {
        return (
            <AgGridReact
                pagination={true}
                enableRangeSelection={true}
                paginationAutoPageSize={true}
                suppressRowClickSelection={true}
                groupSelectsChildren={true}
                animateRows={true}
                sortingOrder={['desc', 'asc', null]}
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                debug={true}
                rowSelection={'multiple'}
                rowGroupPanelShow={'always'}
                pivotPanelShow={'always'}
                onGridReady={onGridReady}>
            </AgGridReact>
        )
    },
    //Crea el header del componente de ventas
    returnHeaderSales: function () {
        var columnDefs = [
            {
                headerName: 'No. Factura', field: 'NoFactura', width: 120,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'No. Control', field: 'Control', filter: 'agTextColumnFilter', width: 140, resizable: true, sortable: true },
            { headerName: 'Contacto', field: 'Contacto', filter: 'agTextColumnFilter', width: 250, resizable: true, sortable: true, editable: true },
            { headerName: 'Fecha Factura', field: 'FechaFactura', filter: 'agTextColumnFilter', width: 170, sortable: true, editable: true },
            { headerName: 'SubTotal Factura', field: 'SubTotalFactura', width: 140, sortable: true },
            { headerName: 'Total Factura', field: 'TotalFactura', width: 120, sortable: true },
            { headerName: 'Total IVA', field: 'TotalIVA', width: 120, sortable: true },
            { headerName: '% Retenido', field: 'Retencion', width: 120, sortable: true, editable: true },
            { headerName: 'Monto Retenido', field: 'MontoRetenido', width: 140, sortable: true },
            { headerName: 'Fecha Comprobante', field: 'FechaComprobante', width: 180, sortable: true, editable: true },
            { headerName: 'No. Comprobante', field: 'Comprobante', width: 160, sortable: true, editable: true },
            { headerName: 'Doc', field: 'Link', width: 120, resizable: true }
        ]
        return (columnDefs)
    },
    returnSales: function () {
        var rowData = [
            {
                NoFactura: '1', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '2', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '3', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '4', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '5', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '6', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '7', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '8', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '9', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            },
            {
                NoFactura: '10', Control: 'TEST', Contacto: 'Gustavo', FechaFactura: '01/01/2020',
                SubTotalFactura: '123', TotalFactura: '12345', TotalIVA: '50%', Retencion: '75%',
                MontoRetenido: '00.91', FechaComprobante: "", Comprobante: "", Link: 'Link'
            }
        ]
        return (rowData)
    },

    //Crea el header del componente de compras
    returnHeaderPurchase: function () {
        let columnDefs = [
            {
                headerName: 'No. Factura', field: 'NoFactura', width: 120,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'Contacto', field: 'Contacto', filter: 'agTextColumnFilter', width: 250, resizable: true, sortable: true, editable: true },
            { headerName: 'Fecha Factura', field: 'FechaFactura', filter: 'agTextColumnFilter', width: 140, sortable: true, editable: true },
            { headerName: 'Fecha Aprobación', field: 'FechaAplicacion', filter: 'agTextColumnFilter', width: 170, sortable: true, editable: true },
            { headerName: 'Base Imponible', field: 'CaseImponible', width: 160, sortable: true },
            { headerName: 'IVA', field: 'IVA', width: 80, sortable: true },
            { headerName: 'IVA Retenido', field: 'IVARetenido', width: 120, sortable: true },
            { headerName: 'SubTotal Factura', field: 'SubTotalFactura', width: 140, sortable: true },
            { headerName: 'Total Factura', field: 'TotalFactura', width: 140, sortable: true },
            { headerName: '%', field: 'Averige', width: 80, sortable: true },
            { headerName: 'Doc', field: 'Link', width: 120, resizable: true }
        ]
        return (columnDefs)
    },
    returnPurchase: function () {
        var rowData = [
            {
                NoFactura: '1', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '2', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '3', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '4', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '5', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '6', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '7', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '8', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '9', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            },
            {
                NoFactura: '10', Contacto: 'Gustavo', FechaFactura: '01/01/2020', FechaAplicacion: '01/01/2020',
                CaseImponible: '123', IVA: '16%', IVARetenido: '50%', SubTotalFactura: '$55,000.00',
                TotalFactura: '$63,300.00', Averige: 10, Link: 'Link'
            }
        ]
        return (rowData)
    }
}

export default util;