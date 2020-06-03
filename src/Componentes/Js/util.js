import React from "react";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AgGridReact } from 'ag-grid-react';
import calls from './calls'
import $ from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/datepicker.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/datepicker';

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
        const taxInfo = util.getTaxInfoConcept(dropDownListEvent, kindOfPeople);
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

                        // In case the data needs a specific value based in a formula
                        case (header.hasOwnProperty("calculated")) :

                            switch (header.formulaName) {

                                // Base taxable calculation
                                case "base_taxable":

                                    // Invoice subtotal
                                    let invoiceSubTotal = item["invoice_subtotal"]["$numberDecimal"];
                                    invoiceSubTotal = invoiceSubTotal ? invoiceSubTotal : 0;

                                    // Invoice exempt amount
                                    let exemptAmount = item["invoice_exempt_amount"];
                                    exemptAmount = exemptAmount ? exemptAmount["$numberDecimal"] : 75;
                                   
                                    itemValue = parseFloat(invoiceSubTotal) - parseFloat(exemptAmount);
                                    itemValue = util.formatMoney(itemValue.toFixed(2));
                                    break;

                                case "retention_percentage":
                                    // Invoice total tax
                                    /*let invoiceTotalTax = item["invoice_total_tax"]["$numberDecimal"];
                                    invoiceTotalTax = invoiceTotalTax ? invoiceTotalTax : 0;

                                    // Retention percentage
                                    let retentionPer = item["retention_percentage"];
                                    retentionPer = retentionPer ? retentionPer["$numberDecimal"] : 0.75;

                                    itemValue = (parseFloat(invoiceTotalTax) * parseFloat(retentionPer)) / 100;
                                    itemValue = util.formatMoney(itemValue.toFixed(2));
                                    */
                                    itemValue = 75;
                                    break;

                                case "retention_amount":

                                    // If retention amount came from request to Xero
                                    let retentionAmount = item["retention_amount"];
                                    retentionAmount = retentionAmount ? retentionAmount["$numberDecimal"] : "";
                                    
                                    if (retentionAmount) {
                                        itemValue = retentionAmount;
                                    }
                                    else {

                                        // If retention amount did not come from Xero
                                        // Invoice total tax
                                        let invoiceTotalTax = item["invoice_total_tax"]["$numberDecimal"];
                                        invoiceTotalTax = invoiceTotalTax ? invoiceTotalTax : 0;

                                        itemValue = parseFloat(invoiceTotalTax) * 0.75;
                                        itemValue = util.formatMoney(itemValue.toFixed(2));
                                    }
                                    break;

                                default :
                                    break;
                            }
                            break;

                        // In case itemValue is empty just break
                        case itemValue === "" :
                        default :
                            break;

                        // In case itemValue is a float. 
                        // This value comes different from Xero. It is an 
                        // object with a $numberDecimal property inside
                        case (itemValue.hasOwnProperty("$numberDecimal")) :
                            itemValue = util.formatMoney(parseFloat(itemValue["$numberDecimal"]))
                            break;

                        // In case itemValue is a integer
                        case (typeof itemValue === 'number') :

                            switch (itemProp) {

                                case "id_status" :
                                    itemValue = util.getStatusInfoConcept(itemValue);
                                    break;

                                case "id_tax_type" :
                                    itemValue = util.getTaxInfoConcept(itemValue);
                                    break;

                                default :
                                    break;
                            }
                            break;

                        case (typeof itemValue === "string") :

                            // In case itemValue is a date
                            if(moment(itemValue).isValid() && itemValue.indexOf("-") >= 4) {
                                itemValue = moment(itemValue).format("DD/MM/YYYY");
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

            // No cambiar por 2 chinga
            case "Aprobados":
                statusInfo.id = 1;
                statusInfo.name = "Aprobados";
                break;

            default:
                break;
        }

        return statusInfo;
    },
    /// Helps to get the kind of tax of a voucher
    /// @param {float} taxIndex - The index configured by tax in DropDownList events property
    getTaxInfoConcept: (taxIndex, kindOfPeople) => {

        // Defining tax info depending on index configured in the DropDownList
        // taxinfo.id - its the internal id Xero gives the tax, in order to request
        // taxinfo.name - its used to rendering porpuses in Ventas component
        let taxInfo = {};

        switch (taxIndex) {
            case 4.1:
            case "ISLR":
                kindOfPeople === "Cliente" ? taxInfo.id = 5 : taxInfo.id = 2;
                taxInfo.name = "ISLR";
                taxInfo.event = 4.1;
                break;

            case 4.2:
            case "IVA":
            default:
                kindOfPeople === "Cliente" ? taxInfo.id = 4 : taxInfo.id = 1;
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
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', headerClass: "centerHeader", filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'invoice_subtotal', type: 'rightAligned', xeroField: true, calculated: true, formulaName: 'base_taxable', width: 123, sortable: true },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', type: 'rightAligned', width: 120, sortable: true },
            Tipo === "IVA" ? {
                headerName: '% retenido', field: 'Retencion', valueGetter: function () {
                    return 75;
                }, calculated: true, formulaName: 'retention_percentage', width: 100, sortable: true,
            } : { headerName: '', field: '', hide: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', xeroField: true, calculated: true, formulaName: 'retention_amount', type: 'rightAligned', width: 129, sortable: true },
            { headerName: 'Fecha de comprobante', field: 'approval_date', width: 149, sortable: true, editable: true, cellEditor: Datepicker },
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
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', headerClass: "centerHeader", filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'invoice_subtotal', xeroField: 'invoice_subtotal', width: 123, sortable: true, type: 'rightAligned' },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', width: 120, sortable: true, type: 'rightAligned' },
            Tipo === "IVA" ? {
                headerName: '% retenido', field: 'Retencion', type: 'centerAligned', valueGetter: function () {
                    return 75;
                }, calculated: true, formulaName: 'retention_percentage', width: 104, sortable: true,
            } : { headerName: '', field: '', width: 0, hide: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', type: 'rightAligned', xeroField: true, calculated: true, formulaName: 'retention_amount', width: 129, sortable: true },
            { headerName: 'Fecha de comprobante', field: 'date', xeroField: 'approval_date', width: 149, sortable: true },
            { headerName: 'No. Comprobante', field: 'Comprobante', xeroField: 'invoice_number', width: 160, sortable: true },
            { headerName: '', field: 'file', width: 100, cellRenderer: this.CellRendererP }
        ]
        return (columnDefs)
    },
    //Coloca icono de carga en el grid
    CellRendererUp: function (params) {
        var eDiv = document.createElement('div');
        eDiv.className = "file-container";
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
        var eDiv = document.createElement('div');
        eDiv.className = "file-container";
        eDiv.innerHTML = '<a href="' + params.data.withHoldingId + '"><span style="cursor: pointer; " >' + flag + '</span></a>';
        return eDiv;
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
    bankType: function (_bank) {
        console.log("Entreeee bank", _bank)
        var bankName = _bank.toLowerCase();

        const banks = [
            { id: 1, name: 'mercantil natural' },
            { id: 2, name: 'mercantil juridica' },
            { id: 3, name: 'bod' },
            { id: 4, name: 'banesco' },
            { id: 5, name: 'commerce bank' },
            { id: 6, name: 'bicentenario' },
            { id: 7, name: 'mibanco' },
            { id: 8, name: 'bvc' },
            { id: 9, name: 'bancaribe' },
            { id: 10, name: 'safra' },
            { id: 11, name: 'plaza' },
            { id: 12, name: 'caroni' },
            { id: 13, name: 'venezuela' },
            { id: 14, name: 'santader' },
            { id: 15, name: 'exterior' },
            { id: 16, name: 'bnc' },
            { id: 17, name: 'provincial' },
            { id: 18, name: 'banplus' },
            { id: 19, name: 'mercadopago' },
            { id: 20, name: 'deutsche' },
            { id: 21, name: 'multibank' },
            { id: 22, name: 'banesco panama' },
            { id: 23, name: 'chase' },
            { id: 24, name: 'wellfargo' },
            { id: 25, name: 'rigdewood' },
            { id: 26, name: 'kearny' },
            { id: 27, name: 'tdbank' }
        ];

        var bankSelected = banks.filter(function (bank) {
            return bankName.indexOf(bank.name) > -1
        });

        console.log("bank selected", bankSelected);
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
    let voucherDate = moment(params.data.approval_date);
    voucherDate = voucherDate.format("YYYYMM");
    let inputField = document.createElement("input");
    inputField.style = "border-style: none; width: 100%; height: 100%;";
    inputField.value = voucherDate !== "Invalid date" ? voucherDate : "";
    inputField.maxLength = 14;
    inputField.addEventListener('input', this.inputChanged.bind(this, params));
    container.appendChild(inputField);

    this.eGui = container;
    this.eInput = this.eGui.querySelector('input');
}

NumberValidation.prototype.inputChanged = function (params, event) {

    // Finding date added to voucher
    const val = event.target.value;
    if (!this.isValid(val) || !params.data.approval_date) {
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

function Datepicker() { }
Datepicker.prototype.init = function (params) {
    this.eInput = document.createElement('input');
    this.eInput.Id = "date_" + params.data.withHoldingId;
    this.eInput.value = params.value;
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';
    $(this.eInput).datepicker({ 
        dateFormat: 'dd/mm/yy',
        dayNames: [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ],
        dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ],
        dayNamesShort: [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ],
        monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
        monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec" ]
    });
};
Datepicker.prototype.getGui = function () {
    return this.eInput;
};
Datepicker.prototype.afterGuiAttached = function () {
    this.eInput.focus();
    this.eInput.select();
};
Datepicker.prototype.getValue = function () {
    return this.eInput.value;
};
Datepicker.prototype.destroy = function () { };

Datepicker.prototype.isPopup = function () {
    return false;
};

export default util;