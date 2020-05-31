import React from "react";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AgGridReact } from 'ag-grid-react';
import calls from './calls'

// Declaring momenty object
var moment = require('moment'); // require

const util = {
    /// Start a process to request information from Xero to build
    /// the structure data to render in the grid of the component Ventas and Compras
    /// @param {float} dropDownListEvent - event id of the ddl
    /// @param {string} statusName - status name
    /// @param {string} kindOfPeople - if Client column or provider applies
    /// @param {string} orgIdSelected - organization id from Xero
    getAndBuildGridData: (dropDownListEvent, statusName, kindOfPeople, orgIdSelected) => {

        // Retrieving and setting data to perform a request to Xero
        const statusInfo = util.getStatusInfoConcept(statusName);
        const taxInfo = util.getTaxInfoConcept(dropDownListEvent);
        const isEditableGrid = util.knowIfGridHeadersEditable(statusInfo);

        return (

            // Getting specific organization data
            calls.getOrgConceptsInfo(taxInfo, statusInfo, orgIdSelected).then(result => {

                // Build grid data structured with editable columns
                const structure = util.fillWorkspaceGrid(
                    result.data, taxInfo, isEditableGrid, kindOfPeople
                );

                return {
                    structure: structure,
                    taxInfo: result.taxInfo,
                    statusInfo: result.statusInfo
                }
            })
        );
    },
    /// After getting the data from the organization in the function
    /// getOrgConceptsInfo the data is porcessed to give the right format
    /// @param {array} items - data requested from server
    /// @param {string} taxInfo - tax info with id and name
    /// @param {boolean} isAnEditableGrid - If the grid will have editable columns
    fillWorkspaceGrid: (items, taxInfo, isAnEditableGrid, kindOfPeople) => {

        let gridItems = [];

        // Deciding which kind of headers use depending on parameters
        let headersTemplate =
            isAnEditableGrid ?
                util.returnHeader(taxInfo.name, kindOfPeople) :
                util.returnHeaderFlow(taxInfo.name, kindOfPeople);

        // ---------------------------------------

        if (headersTemplate.length > 0) {

            // Iterating requested chunk of data from server to
            // give it the correct format to be render in the grid
            items.forEach(item => {

                // Item to fill with data
                let itemNode = {};

                headersTemplate.forEach(header => {

                    // Each item property is filled with his correlated field en Xero
                    // in case there is not any correlation the default value is ""
                    let itemProp = header.field;
                    let itemValue = header.xeroField ? item[header.xeroField] : "";
                    itemValue = itemValue ? itemValue : "";

                    // Value formatting
                    switch (true) {

                        // In case itemValue is empty just break
                        case itemValue === "":
                        default:
                            break;

                        // In case itemValue is a float. 
                        // This value comes different from Xero. It is an 
                        // object with a $numberDecimal property inside
                        case (itemValue.hasOwnProperty("$numberDecimal")):
                            itemValue = util.formatMoney(parseFloat(itemValue["$numberDecimal"]))
                            break;

                        // In case itemValue is a int
                        case (typeof itemValue === 'number'):

                            switch (itemProp) {

                                case "id_status":
                                    itemValue = util.getStatusInfoConcept(itemValue);
                                    break;

                                case "id_tax_type":
                                    itemValue = util.getTaxInfoConcept(itemValue);
                                    break;

                                default:
                                    break;
                            }
                            break;

                        // In case itemValue is a date
                        case (moment(itemValue).isValid()):
                            itemValue = moment(itemValue).format("DD/MM/YYYY");
                            break;

                        // In case the data needs a specific value based in a formula
                        case (header.hasOwnProperty("calculated")):

                            switch (header.formulaName) {

                                // Base taxable calculation
                                case "base_taxable":

                                    // Invoice subtotal
                                    let subtotal = item["invoice_subtotal"]["$numberDecimal"];
                                    subtotal = subtotal ? subtotal : 75;

                                    // Invoice exempt amount
                                    let exempt = item["invoice_exempt_amount"]["$numberDecimal"];
                                    exempt = exempt ? exempt : 75;
                                    itemValue = util.formatMoney(Number.parseFloat(subtotal) - Number.parseFloat(exempt));
                                    break;

                                case "retention_percentage":
                                    // Invoice total tax
                                    let totalTax = item["invoice_total_tax"]["$numberDecimal"];
                                    totalTax = totalTax ? totalTax : 75;

                                    // Retention percentage
                                    let retention = 0; //item["retention_percentage"]["$numberDecimal"];
                                    retention = retention ? retention : 75;

                                    itemValue = (Number.parseFloat(totalTax) * Number.parseFloat(retention)) / 100;
                                    break;

                                default:
                                    break;
                            }
                            break;
                    }

                    // Creating property in JSON object
                    itemNode[itemProp] = itemValue;
                });

                // Adding item node to the array of proccessed data
                gridItems.push(itemNode);
            });
        }

        // ---------------------------------------

        // Headers return and data mapped for each item
        return {
            headersTemplate: headersTemplate,
            gridItems: gridItems
        };
    },
    /// Helps to determine the status of a voucher
    /// @param {string} statusName - the name of the status
    getStatusInfoConcept: (statusName) => {

        // Deciding voucher type. Pending by default
        // Pending [Borrador o Aprobado en Compras] = 1
        // Approved [Aprobado o Recibido] = 2
        // Nulified [Anulado] = 3
        // Stored [Archivado] = 4
        let statusInfo = {
            id: 1,
            name: "Pendientes"
        };

        switch (statusName) {

            case "Recibidos":
                statusInfo.id = 2;
                statusInfo.name = "Recibidos";
                break;

            case "Anulados":
                statusInfo.id = 3;
                statusInfo.name = "Anulados";
                break;

            case "Archivados":
                statusInfo.id = 4;
                statusInfo.name = "Archivados";
                break;

            case "Aprobados":
                statusInfo.id = 2;
                statusInfo.name = "Aprobados";
                break;

            default:
                break;
        }

        return statusInfo;
    },
    /// Helps to get the kind of tax of a voucher
    /// @param {float} taxIndex - The index configured by tax in DropDownList events property
    getTaxInfoConcept: (taxIndex) => {

        // Defining tax info depending on index configured in the DropDownList
        // taxinfo.id - its the internal id Xero gives the tax, in order to request
        // taxinfo.name - its used to rendering porpuses in Ventas component
        let taxInfo = {};

        switch (taxIndex) {
            case 4.1:
            case "ISLR":
                taxInfo.id = 2;
                taxInfo.name = "ISLR";
                taxInfo.event = 4.1;
                break;

            case 4.2:
            case "IVA":
            default:
                taxInfo.id = 1;
                taxInfo.name = "IVA";
                taxInfo.event = 4.2;
                break;
        }

        return taxInfo;
    },
    /// Helps to know when a grid data needs to have editable columns
    /// @param {object} voucherStatus - status info of the voucher (sales, purchases)
    knowIfGridHeadersEditable: (voucherStatus) => {

        let isEditableGrid = false;

        // Validating voucher status equal to Pending [Borrador]
        if (voucherStatus.id === 1 && voucherStatus.name !== "Aprobados") {
            isEditableGrid = true;
        }

        return isEditableGrid;
    },
    //Crea el componente generidco del grid
    createDataDrid: function (columnDefs, rowData, defaultColDef, components, onRowSelected, onSelectionChanged) {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div
                    id="myGrid"
                    style={{ height: '100%', width: '100%' }}
                    className="ag-theme-alpine">
                    <AgGridReact
                        ref="agGrid"
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
                        components={components}
                        singleClickEdit={true}
                        onRowSelected={onRowSelected}
                        onSelectionChanged={onSelectionChanged}
                        rowHeight={35}
                        headerHeight={38}>
                    </AgGridReact>
                </div>
            </div>
        )
    },
    /// rea el header del componente de ventas
    /// @param {object} Tipo - Maneja variable si es IVA o ISLR)
    /// @param {object} kindOfPeople - Indica si es cliente o proveedor 
    returnHeader: function (Tipo, kindOfPeople) {
        var columnDefs = [
            //#region hidden rows
            { headerName: 'withHoldingId', field: 'withHoldingId', xeroField: '_id', hide: true },
            //id_tax_type: El tipo de impuesto; donde 1 es retenciones de IVA, 2 es retenciones de ISLR, 3 es retenciones 
            //de IVA a notas de crédito, 4 es retenciones de IVA a facturas de venta, y 5 es retenciones de ISLR a facturas de venta
            { headerName: 'ISLR / IVA', field: 'id_tax_type', xeroField: 'id_tax_type', hide: true },
            //id_status: El estatus del comprobante; donde 1 es borrador, 2 es aprobado, 3 es anulado, y 4 es archivado
            { headerName: 'B_A_A_A', field: 'id_status', xeroField: 'id_status', hide: true },
            //#endregion hidden rows
            {
                headerName: 'No. Factura', field: 'NoFactura', xeroField: 'invoice_number', width: 125,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 120, resizable: true, sortable: true },
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'invoice_subtotal', xeroField: 'invoice_subtotal', calculated: true, formulaName: 'base_taxable', width: 123, sortable: true },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', width: 120, sortable: true },
            Tipo === "IVA" ? { headerName: '% retenido', field: 'Retencion', calculated: true, formulaName: 'retention_percentage', width: 100, sortable: true, } : { headerName: '', field: '', hide: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', width: 129, sortable: true },
            { headerName: 'Fecha comprobante', field: '_id', width: 149, sortable: true, cellRenderer: this.CellRendererCalendar },
            { headerName: 'No. Comprobante', field: 'Comprobante', width: 160, sortable: true, editable: true, cellEditor: NumberValidation },
            { headerName: '', field: '_id', width: 100, cellRenderer: this.CellRendererUp }
        ]

        return (columnDefs)
    },
    //Crea el header del componente de ventas
    /// @param {object} Tipo - Maneja variable si es IVA o ISLR)
    /// @param {object} kindOfPeople - Indica si es cliente o proveedor 
    returnHeaderFlow: function (Tipo, kindOfPeople) {
        var columnDefs = [
            //#region hidden rows
            { headerName: 'withHoldingId', field: 'withHoldingId', xeroField: '_id', hide: true },
            //iid_tax_type: El tipo de impuesto; donde 1 es retenciones de IVA, 2 es retenciones de ISLR, 3 es retenciones 
            //de IVA a notas de crédito, 4 es retenciones de IVA a facturas de venta, y 5 es retenciones de ISLR a facturas de venta
            { headerName: 'ISLR / IVA', field: 'id_tax_type', xeroField: 'id_tax_type', hide: true },
            //id_status: El estatus del comprobante; donde 1 es borrador, 2 es aprobado, 3 es anulado, y 4 es archivado
            { headerName: 'B_A_A_A', field: 'id_status', xeroField: 'id_status', hide: true },
            //#endregion hidden rows
            {
                headerName: 'No. Factura', field: 'NoFactura', xeroField: 'invoice_number', width: 125,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 120, resizable: true, sortable: true },
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'invoice_subtotal', xeroField: 'invoice_subtotal', width: 123, sortable: true },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', width: 120, sortable: true },
            Tipo === "IVA" ? { headerName: '% retenido', field: 'Retencion', xeroField: 'retention_percentage', width: 104, sortable: true, } : { headerName: '', field: '', width: 0, hide: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', xeroField: 'retention_amount', width: 129, sortable: true },
            { headerName: 'Fecha comprobante', field: 'date', xeroField: 'approval_date', width: 149, sortable: true },
            { headerName: 'No. Comprobante', field: 'Comprobante', xeroField: 'invoice_number', width: 160, sortable: true },
            { headerName: '', field: 'file', width: 100, cellRenderer: this.CellRendererP }
        ]
        return (columnDefs)
    },
    // Renderiza columna fecha para elegir una fecha de calendario
    CellRendererCalendar: function (params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<input id="date_' + params.data.withHoldingId + '"  type="date" name="trip-start" value="" min="2000-01-01" max="2050-12-31">'

        return eDiv;
    },
    //Coloca icono de carga en el grid
    CellRendererUp: function (params) {
        var eDiv = document.createElement('div');
        eDiv.class = "file-container";
        eDiv.innerHTML = '<div class="custom-file-upload">' +
            '<img border="0" width="18" height="21" src="http://desacrm.quierocasa.com.mx:7002/Images/kiiper_Upload.png"></img>' +
            '<input id="file_' + params.data.withHoldingId + '" type="file" class="file-upload" id="file-upload" />' +
            '   </div>' +
            '</div>';
        return eDiv;
    },
    //Coloca icono de descarga en el grid
    CellRendererP: function (params) {
        var flag = '<img border="0" width="18" height="21" src="http://desacrm.quierocasa.com.mx:7002/Images/kiiper_Download.png"></img>';
        return (
            '<a href="' + params.data.withHoldingId + '"><span style="cursor: pointer; " >' + flag + '</span></a>'
        );
    },
    //Action log in ag-grid
    printResult: function (res) {
        console.log('---------------------------------------');
        if (res.add) {
            res.add.forEach(function (rowNode) {
                console.log('Added Row Node', rowNode);
            });
        }
        if (res.remove) {
            res.remove.forEach(function (rowNode) {
                console.log('Removed Row Node', rowNode);
            });
        }
        if (res.update) {
            res.update.forEach(function (rowNode) {
                console.log('Updated Row Node', rowNode);
            });
        }
    },
    //Set format money
    formatMoney: function (amount, decimalCount = 2, decimal = ",", thousands = ".") {
        try {
            try {
                decimalCount = Math.abs(decimalCount);
                decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

                const negativeSign = amount < 0 ? "-" : "";

                let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
                let j = (i.length > 3) ? i.length % 3 : 0;

                return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
            } catch (e) {
                console.log(e)
            }
        } catch (e) {
            console.log(e)
        }
    },
    //Valida si una cadena contiene algun dato de otra cadena
    contains: function (value, searchFor) {
        if (Object.prototype.toString.call(value) === '[object Array]') {

        }
        else {
            var v = (value || '').toLowerCase();
            var v2 = searchFor;
            if (v2) {
                v2 = v2.toLowerCase();
            }
            return v.indexOf(v2) > -1;
        }
    },
    //Crea el Copyright
    Copyright: function () {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="/">kiiper</Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    },
}

function NumberValidation() { }
NumberValidation.prototype.init = function (params) {
    let container = document.createElement('div');
    container.style = "display: flex; align-items: center; justify-content: center; height: 100%;";

    // Finding date added to voucher
    let voucherDate = document.querySelector(`[id=date_${params.data.withHoldingId}]`);
    voucherDate = voucherDate.value ? moment(voucherDate.value) : "";
    voucherDate = voucherDate ? voucherDate.format("YYYYMM") : "";
    voucherDate = voucherDate && params.value.indexOf(voucherDate) < 0 ? `${voucherDate}${params.value}` : params.value;

    let inputField = document.createElement("input");
    inputField.style = "border-style: none; width: 100%; height: 100%;";
    inputField.value = voucherDate;
    inputField.maxLength = 14;
    inputField.addEventListener('input', this.inputChanged.bind(this, params));
    container.appendChild(inputField);

    this.eGui = container;
    this.eInput = this.eGui.querySelector('input');
}

NumberValidation.prototype.inputChanged = function (params, event) {

    // Finding date added to voucher
    const val = event.target.value;
    let voucherDate = document.querySelector(`[id=date_${params.data.withHoldingId}]`);

    if (!this.isValid(val) || !voucherDate.value) {
        this.eInput.value = val.substr(0, val.length - 1);
    }
}

NumberValidation.prototype.isValid = function (value) {
    return value.length <= this.eInput.maxLength;
}

NumberValidation.prototype.getValue = function () {
    return this.eInput.value;
}

NumberValidation.prototype.isCancelAfterEnd = function () {
    return !this.isValid(this.eInput.value);
}

NumberValidation.prototype.getGui = function () {
    return this.eGui;
}

NumberValidation.prototype.destroy = function () {
    this.eInput.removeEventListener('input', this.inputChanged);
}

export default util;