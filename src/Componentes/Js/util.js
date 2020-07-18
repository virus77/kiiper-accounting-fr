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

import Download from '../../Imagenes/downloadDocument.svg';
import Upload from '../../Imagenes/uploadDocument.svg';


// Declaring momenty object
var moment = require('moment'); // require

var withHoldingId = "";
var fileName = "";

const util = {
    /// Start a process to request information from Xero to build
    /// the structure data to render in the grid of the component Ventas and Compras
    /// @param {float} dropDownListEvent - event id of the ddl
    /// @param {string} statusName - status name
    /// @param {string} kindOfPeople - if Client column or provider applies
    /// @param {string} orgIdSelected - organization id from Xero
    getAndBuildGridData: (dropDownListEvent, statusName, kindOfPeople, orgIdSelected, section = null) => {

        // Retrieving and setting data to perform a request to Xero
        const statusInfo = util.getStatusInfoConcept(statusName);
        const taxInfo = util.getTaxInfoConcept(dropDownListEvent, kindOfPeople);
        const isEditableGrid = util.knowIfGridHeadersEditable(statusInfo);

        return (

            // Getting specific organization data
            calls.getOrgConceptsInfo(taxInfo, statusInfo, orgIdSelected).then(result => {

                // Build grid data structured with editable columns
                const structure = util.fillWorkspaceGrid(
                    result.data, taxInfo, isEditableGrid, kindOfPeople, statusName, section
                );

                return {
                    structure: structure,
                    taxInfo: result.taxInfo,
                    statusInfo: result.statusInfo
                }
            })
        );
    },
    getAndBuildGridDataDeclaration: (dropDownListEvent, statusName, orgIdSelected, kindOfPeople = "") => {

        // Retrieving and setting data to perform a request to Xero
        const statusInfo = util.getStatusInfoConceptDeclaration(statusName);
        const taxInfo = util.getTaxInfoConceptDeclaration(dropDownListEvent);
        const isEditableGrid = util.knowIfGridHeadersEditable(statusInfo);

        return (

            // Getting specific organization data
            calls.getStatements(orgIdSelected, taxInfo.id, statusInfo.id).then(result => {

                // Build grid data structured with editable columns
                const structure = util.fillWorkspaceGrid(
                    result.data, taxInfo, isEditableGrid, kindOfPeople, statusName, "declaracion"
                );

                return {
                    structure: structure,
                    taxInfo: taxInfo,
                    statusInfo: statusInfo
                }
            })
        );
    },
    /// After getting the data from the organization in the function
    /// getOrgConceptsInfo the data is porcessed to give the right format
    /// @param {array} items - data requested from server
    /// @param {string} taxInfo - tax info with id and name
    /// @param {boolean} isAnEditableGrid - If the grid will have editable columns
    fillWorkspaceGrid: (items, taxInfo, isAnEditableGrid, kindOfPeople, statusName, section = null) => {

        let gridItems = [];
        let headersTemplate = [];

        switch (section) {

            case "declaracion":
                headersTemplate = util.returnHeaderDeclaration(taxInfo.name, kindOfPeople, statusName)
                break;

            default:
                // Deciding which kind of headers use depending on parameters
                headersTemplate =
                    isAnEditableGrid ?
                        util.returnHeader(taxInfo.name, kindOfPeople) :
                        util.returnHeaderFlow(taxInfo.name, kindOfPeople, statusName);
                break;
        }

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
                        case (header.hasOwnProperty("calculated")):

                            switch (header.formulaName) {

                                // Base taxable calculation
                                case "base_taxable":

                                    // Invoice subtotal
                                    let invoiceSubTotal = item.invoice_subtotal;
                                    invoiceSubTotal = invoiceSubTotal ? invoiceSubTotal : 0;

                                    // Invoice exempt amount
                                    let exemptAmount = item.invoice_exempt_amount;
                                    exemptAmount = exemptAmount ? exemptAmount : 75;

                                    itemValue = parseFloat(invoiceSubTotal) - parseFloat(exemptAmount);
                                    itemValue = util.formatMoney(itemValue.toFixed(2));
                                    break;

                                case "retention_amount":

                                    // If retention amount came from request to Xero
                                    let retentionAmount = item.retention_amount;
                                    retentionAmount = retentionAmount ? retentionAmount : "";

                                    if (retentionAmount) {
                                        itemValue = util.formatMoney(retentionAmount);
                                    }
                                    else {

                                        // If retention amount did not come from Xero
                                        // Invoice total tax
                                        let invoiceTotalTax = item.invoice_total_tax;
                                        invoiceTotalTax = invoiceTotalTax ? invoiceTotalTax : 0;

                                        itemValue = parseFloat(invoiceTotalTax) * 0.75;
                                        itemValue = util.formatMoney(itemValue.toFixed(2));
                                    }
                                    break;

                                default:
                                    break;
                            }
                            break;

                        // In case itemValue is empty just break
                        case itemValue === "":
                        default:
                            break;

                        // In case itemValue is a float. 
                        // This value comes different from Xero. It is an 
                        // object with a $numberDecimal property inside
                        case (typeof itemValue === 'decimal'):
                            itemValue = util.formatMoney(parseFloat(itemValue))
                            break;

                        // In case itemValue is a integer
                        case (typeof itemValue === 'number'):

                            switch (itemProp) {

                                case "id_status":
                                    itemValue = util.getStatusInfoConcept(itemValue);
                                    break;

                                case "id_tax_type":
                                    itemValue = util.getTaxInfoConcept(itemValue);
                                    break;

                                default:
                                    itemValue = util.formatMoney(itemValue.toFixed(2));
                                    break;
                            }
                            break;

                        case (typeof itemValue === "string"):

                            // In case itemValue is a date
                            if (moment(itemValue).isValid() && itemValue.indexOf("-") >= 4) {
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

            // No cambiar
            case "Aprobados":
                statusInfo.id = 2;
                statusInfo.name = "Aprobados";
                break;

            case "Por aprobar":
                statusInfo.id = 5;
                statusInfo.name = "Por aprobar";
                break;

            case "Declarados":
                statusInfo.id = 6;
                statusInfo.name = "Declarados";
                break;

            case "Por pagar":
                statusInfo.id = 7;
                statusInfo.name = "Por pagar";
                break;

            case "Pagados":
                statusInfo.id = 8;
                statusInfo.name = "Pagados";
                break;

            case "Por generar":
                statusInfo.id = 9;
                statusInfo.name = "Por generar";
                break;

            default:
                break;
        }

        return statusInfo;
    },
    getStatusInfoConceptDeclaration: (statusName) => {
        let statusInfo = {
            id: 1,
            name: "Por generar"
        };

        switch (statusName) {

            case "Por generar":
                statusInfo.id = 1;
                statusInfo.name = "Por generar";
                break;

            case "Por aprobar":
                statusInfo.id = 2;
                statusInfo.name = "Por aprobar";
                break;

            case "Aprobados":
                statusInfo.id = 3;
                statusInfo.name = "Aprobados";
                break;

            case "Por declarar":
                statusInfo.id = 4;
                statusInfo.name = "Por declarar";
                break;

            case "Por pagar":
                statusInfo.id = 5;
                statusInfo.name = "Por pagar";
                break;

            case "Pagados":
                statusInfo.id = 6;
                statusInfo.name = "Pagados";
                break;

            default:
                break;
        }

        return statusInfo;
    },
    /// Helps to get the kind of tax of a voucher
    /// @param {float} taxIndex - The index configured by tax in DropDownList events property
    getTaxInfoConceptDeclaration: (taxIndex) => {

        // Defining tax info depending on index configured in the DropDownList
        // taxinfo.id - its the internal id Xero gives the tax, in order to request
        // taxinfo.name - its used to rendering porpuses in Ventas component
        let taxInfo = {};

        switch (taxIndex) {
            case 2:
            case "ISLR":
                taxInfo.name = "ISLR";
                taxInfo.event = 2;
                taxInfo.id = 2;
                break;

            case 1:
            case "IVA":
            default:
                taxInfo.name = "IVA";
                taxInfo.event = 1;
                taxInfo.id = 1;
                break;
        }

        return taxInfo;
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
            { headerName: 'reissued', field: 'reissued', xeroField: 'reissued', hide: true },
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
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 110, sortable: true},
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', headerClass: "centerHeader", filter: 'agTextColumnFilter', width: 248, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', cellClass: "grid-cell-centered", xeroField: 'invoice_date', filter: 'agTextColumnFilter', filter: 'agTextColumnFilter', width: 130, sortable: true, cellClass: "grid-cell-centered" },
            { headerName: 'Base imponible', field: 'invoice_subtotal', xeroField: true, calculated: true, formulaName: 'base_taxable', width: 135, sortable: true, type: 'rightAligned' },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', type: 'rightAligned', width: 110, sortable: true },
            {
                headerName: '% retenido', field: 'Retencion', xeroField: 'retention_percentage', type: 'rightAligned', hide: Tipo === "IVA" ? false : true, calculated: true, width: 104, sortable: true, cellClass: "grid-cell-centered",
                valueGetter: function (params) {
                    return 75;
                },
            },
            { headerName: 'Monto retenido', field: 'MontoRetenido', xeroField: true, calculated: true, formulaName: 'retention_amount', type: 'rightAligned', width: 129, sortable: true },
            { headerName: 'Fecha de comprobante', field: 'approval_date', width: 170, sortable: true, editable: true, cellEditor: Datepicker },
            { headerName: 'No. Comprobante', field: 'Comprobante', width: 150, sortable: true, editable: true, cellEditor: NumberValidation },
            { headerName: '', field: '_id', width: 60, cellRenderer: this.CellRendererUp }
        ]

        return (columnDefs)
    },
    //Crea el header del componente de ventas
    /// @param {object} Tipo - Maneja variable si es IVA o ISLR)
    /// @param {object} kindOfPeople - Indica si es cliente o proveedor 
    returnHeaderFlow: function (Tipo, kindOfPeople, statusName) {
        var columnDefs = [
            //#region hidden rows
            { headerName: 'withHoldingId', field: 'withHoldingId', xeroField: '_id', hide: true },
            //iid_tax_type: El tipo de impuesto; donde 1 es retenciones de IVA, 2 es retenciones de ISLR, 3 es retenciones 
            //de IVA a notas de crédito, 4 es retenciones de IVA a facturas de venta, y 5 es retenciones de ISLR a facturas de venta
            { headerName: 'ISLR / IVA', field: 'id_tax_type', xeroField: 'id_tax_type', hide: true },
            //id_status: El estatus del comprobante; donde 1 es borrador, 2 es aprobado, 3 es anulado, y 4 es archivado
            { headerName: 'B_A_A_A', field: 'id_status', xeroField: 'id_status', hide: true },
            { headerName: 'reissued', field: 'reissued', xeroField: 'reissued', hide: true },
            //#endregion hidden rows
            {
                headerName: 'No. Factura', field: 'NoFactura', xeroField: 'invoice_number', width: 125,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    switch (true) {
                        //Validar siempre trae aprobados
                        case statusName !== "Anulados":
                            return params.columnApi.getRowGroupColumns().length === 0;

                        case params.data.reissued === true:
                            break;

                        default:
                            return params.columnApi.getRowGroupColumns().length === 0;
                    }
                },
            },
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 110, sortable: true},
            { headerName: kindOfPeople, field: 'Contacto', xeroField: 'contact_name', headerClass: "centerHeader", filter: 'agTextColumnFilter', width: 248, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 130, sortable: true, cellClass: "grid-cell-centered" },
            { headerName: 'Base imponible', field: 'invoice_subtotal', xeroField: 'invoice_subtotal', width: 135, sortable: true, type: 'rightAligned' },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'retained_amount', width: 110, sortable: true, type: 'rightAligned' },
            {
                headerName: '% retenido', field: 'Retencion', xeroField: 'retention_percentage', hide: Tipo === "IVA" ? false : true, calculated: true, width: 104, sortable: true, cellClass: "grid-cell-centered", type: 'rightAligned',
                valueGetter: function () {
                    return 75;
                },
            },
            { headerName: 'Monto retenido', field: 'MontoRetenido', xeroField: true, calculated: true, formulaName: 'retention_amount', width: 129, sortable: true, headerClass: "grid-cell-centered", type: 'rightAligned' },
            { headerName: 'Fecha de comprobante', field: 'date', xeroField: 'approval_date', filter: 'agTextColumnFilter', width: 170, sortable: true, cellClass: "grid-cell-centered" },
            { headerName: 'No. Comprobante', field: 'Comprobante', xeroField: 'correlative', width: 200, sortable: true , cellClass: "grid-cell-centered", type: 'rightAligned'},
            { headerName: '', field: 'file', width: 60, cellRenderer: this.CellRendererP }
        ]
        return (columnDefs)
    },
    /// Crea el header del componente de declaracion
    /// @param {object} Tipo - Maneja variable si es IVA o ISLR)
    /// @param {object} kindOfPeople - Indica si es cliente o proveedor 
    returnHeaderDeclaration: function (Tipo, kindOfPeople, statusName) {

        var seeCommitmentColumn = ['Por declarar', 'Por pagar', 'Pagados'];
        var seePaymentColumn = ['Por pagar', 'Pagados'];
        var seeCertificateColumn = ['Por declarar', 'Pagados'];

        var columnDefs = [
            //#region hidden rows
            { headerName: 'statementId', field: 'statementId', xeroField: '_id', hide: true },
            //#endregion hidden rows
            {
                headerName: 'Nombre', field: 'Nombre', xeroField: 'invoice_number', width: 164,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    switch (true) {
                        //Validar siempre trae aprobados
                        case statusName !== "Anulados":
                            return params.columnApi.getRowGroupColumns().length === 0;

                        case params.data.reissued === "":
                        case params.data.reissued === true:
                        case params.data.reissued === undefined:
                            break;

                        default:
                            return params.columnApi.getRowGroupColumns().length === 0;
                    }
                },
            },
            { headerName: 'Fecha Límite', field: 'FechaLimite', xeroField: 'due_date', filter: 'agTextColumnFilter', filter: 'agTextColumnFilter', width: 150, sortable: true },
            { headerName: 'Base sujeta a retención', field: 'invoice_subtotal', xeroField: 'statement_total_amount', width: 164, sortable: true, type: 'rightAligned' },
            { headerName: 'Total retenido', field: 'Retencion', xeroField: 'statement_total_tax', type: 'rightAligned', calculated: true, width: 120, sortable: true, cellClass: "grid-cell-centered" },
            {
                headerName: 'Aprobado por', field: 'AprobadoPor', xeroField: 'aprobado_por', type: 'rightAligned', hide: statusName === "Aprobados" ? false : true, calculated: true, width: 120, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Status', field: 'status', xeroField: 'status', type: 'rightAligned', hide: statusName === "Aprobados" ? false : true, calculated: true, width: 140, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Cuenta Xero', field: 'cuentaXero', xeroField: 'cuentaXero', type: 'rightAligned', hide: statusName != "Por Generar" ? false : true, calculated: true, width: 120, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Auxiliar', field: 'Auxiliar', xeroField: 'auxiliar', type: 'rightAligned', calculated: true, width: 110, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Compromiso', field: 'compromiso', xeroField: 'compromiso', type: 'rightAligned', hide: !seeCommitmentColumn.includes(statusName), calculated: true, width: 110, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Pago', field: 'Pago', xeroField: 'pago', type: 'rightAligned', hide: !seePaymentColumn.includes(statusName), calculated: true, width: 110, sortable: true, cellClass: "grid-cell-centered",
            },
            {
                headerName: 'Certificado', field: 'Certificado', xeroField: 'certificado', type: 'rightAligned', hide: !seeCertificateColumn.includes(statusName), calculated: true, width: 110, sortable: true, cellClass: "grid-cell-centered",
            },
        ]
        return (columnDefs)
    },
    //Coloca icono de carga en el grid
    CellRendererUp: function (params) {
        var eDiv = document.createElement('div');
        eDiv.className = "file-container";

        var eDivIn = document.createElement('div');
        eDivIn.className = "custom-file-upload";

        var img = document.createElement('img');
        img.setAttribute("border", "0");
        img.setAttribute("width", "18");
        img.setAttribute("height", "21");
        img.setAttribute("src", Upload);
        img.setAttribute("style", "cursor: pointer");
        eDivIn.appendChild(img);

        var inputF = document.createElement('input');
        inputF.setAttribute("type", "file");
        inputF.setAttribute("name", "theName");
        inputF.className = "file-upload";
        inputF.setAttribute("id", 'file_' + params.data.withHoldingId);
        inputF.onchange = async function () {
            var file = inputF.files[0];
            var reader = new FileReader();
            // Read file content on file loaded event
            reader.onload = function () {
                var label = document.createElement('label');
                label.setAttribute("style", "display: none");
                label.style.display = 'none';
                label.setAttribute("id", "lbl_" + params.data.withHoldingId);
                label.innerText = reader.result;
                document.body.appendChild(label);
            };
            // Convert data to base64 
            reader.readAsDataURL(file);
        };
        eDivIn.appendChild(inputF);

        eDiv.appendChild(eDivIn);
        return eDiv;
    },
    //Coloca icono de descarga en el grid
    // y se ejecuta laa acción para descargar documento
    /// @param {object} params - parámetro 
    CellRendererP: function (params) {
        withHoldingId = params.data.withHoldingId;
        fileName = "Retención de IVA - " + params.data.invoice_number;
        var flag = '<img border="0" width="18" height="21" src="' + { Download } + '"></img>';
        var eDiv = document.createElement('div');
        eDiv.className = "file-container";
        eDiv.setAttribute("id", "down_" + withHoldingId);

        //Función utilooizada ára llamar el archivo en base64
        //Convertirlo a pdf y descargarlo
        eDiv.onclick = async function () {
            let resp = await calls.getDocumentById(withHoldingId);
            var element = document.createElement('a');
            element.setAttribute('href', 'data:application/octet-stream;base64,' + encodeURIComponent(resp.data));
            element.setAttribute('download', fileName + ".pdf");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        eDiv.innerHTML = '<span style="cursor: pointer; " >' + flag + '</span>';
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
    /// Regresa rango de fechas del mes actual
    getmonthRange() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        return (
            { firstDay: moment(firstDay).format("DD/MM/YYYY"), lastDay: moment(lastDay).format("DD/MM/YYYY") }
        )
    },
    /// Regresa rango de fechas del mes previo al actual
    getPreviousRange() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth() - 1;
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

        return (
            { firstDay: moment(firstDay).format("DD/MM/YYYY"), lastDay: moment(lastDay).format("DD/MM/YYYY") }
        )
    },
    bankType: function (_bank) {
        var bankName = _bank.toLowerCase();

        const banks = [
            { id: 1, name: 'mercantil natural', url: '/convertBankStatement/MercantilNatural' },
            { id: 2, name: 'mercantil juridica', url: '/convertBankStatement/MercantilJuridica' },
            { id: 3, name: 'bod', fileType: 'pdf', url: '/convertBankStatement/BOD' },
            { id: 4, name: 'banesco', url: '/convertBankStatement/Banesco' },
            { id: 5, name: 'commerce bank', url: '/convertBankStatement/CommerceBank' },
            { id: 6, name: 'bicentenario', url: '/convertBankStatement/Bicentenario' },
            { id: 7, name: 'mibanco', url: '/convertBankStatement/MiBanco' },
            { id: 8, name: 'bvc', url: '/convertBankStatement/BVC' },
            { id: 9, name: 'bancaribe', url: '/convertBankStatement/Bancaribe' },
            { id: 10, name: 'safra', url: '/convertBankStatement/Safra' },
            { id: 11, name: 'plaza', url: '/convertBankStatement/Plaza' },
            { id: 12, name: 'caroni', url: '/convertBankStatement/Caroni' },
            { id: 13, name: 'venezuela', url: '/convertBankStatement/Vzla' },
            { id: 14, name: 'santader', url: '/convertBankStatement/Santander' },
            { id: 15, name: 'exterior', url: '/convertBankStatement/Exterior' },
            { id: 16, name: 'bnc', url: '/convertBankStatement/BNC' },
            { id: 17, name: 'provincial', url: '/convertBankStatement/Provincial' },
            { id: 18, name: 'banplus', url: '/convertBankStatement/Banplus' },
            { id: 19, name: 'mercadopago', url: '/convertBankStatement/Mercadopago' },
            { id: 20, name: 'deutsche', url: '/convertBankStatement/Deutsche' },
            { id: 21, name: 'multibank', url: '/convertBankStatement/Multibank' },
            { id: 22, name: 'banesco panama', url: '/convertBankStatement/BanescoPanama' },
            { id: 23, name: 'chase', url: '/convertBankStatement/Chase' },
            { id: 24, name: 'wellfargo', url: '/convertBankStatement/WellsFargo' },
            { id: 25, name: 'rigdewood', url: '/convertBankStatement/Ridgewood' },
            { id: 26, name: 'kearny', url: '/convertBankStatement/Kearny' },
            { id: 27, name: 'tdbank', url: '/convertBankStatement/TDBank' }
        ];

        var bankSelected = banks.filter(function (bank) {
            return bankName.indexOf(bank.name) > -1
        });
        return bankSelected;
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
    //Coloca icono de descarga en el grid
    // y se ejecuta laa acción para descargar documento
    /// @param {object} dateTimeA - Fecha inicial
    /// @param {object} dateTimeB - Fecha fin
    compareDates: function (dateTimeA, dateTimeB) {
        var momentA = moment(dateTimeA, "DD/MM/YYYY");
        var momentB = moment(dateTimeB, "DD/MM/YYYY");

        if (momentA > momentB) return 1;
        else if (momentA < momentB) return -1;
        else return 0;
    },
};

function NumberValidation() { }
NumberValidation.prototype.init = function (params) {
    let container = document.createElement('div');
    container.style = "display: flex; align-items: center; justify-content: center; height: 100%;";

    // Finding date added to voucher
    let voucherDate = moment(params.data.approval_date, "DD/MM/YYYY").format("YYYYMM");

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
        changeYear: true,
        changeMonth: true,
        dateFormat: 'dd/mm/yy',
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
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

Datepicker.prototype.destroy = function () {
};

Datepicker.prototype.isPopup = function () {
    return false;
};

export default util;