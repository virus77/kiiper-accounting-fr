import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AgGridReact } from 'ag-grid-react';
import { $ } from 'jquery/dist/jquery';

// Moment.js library initialization
var moment = require('moment'); // require

const util = {
    /// Start a process to request information from Xero to build
    /// the structure data to render in the grid of the component Ventas and Compras
    getAndBuildGridData : (dropDownListEvent, status) => {

        // Retrieving and setting data to perform a request to Xero
        const statusInfo = util.getStatusInfoConcept(status);
        const taxInfo = util.getTaxInfoConcept(dropDownListEvent);
        const editableGrid = util.knowIfGridHeadersEditable(statusInfo, taxInfo);

        return (

            // Getting specific organization data
            util.getOrgConceptsInfo("sales", taxInfo, statusInfo).then(result => {

                // Build grid data structured with editable columns
                const structure = util.fillWorkspaceGrid(
                    result.data, taxInfo, editableGrid
                );

                return {
                    structure : structure,
                    taxInfo : taxInfo,
                    statusInfo : statusInfo
                }
            })
        );
    },
    /// Helps to request and build the data structure to render it
    /// inside the workspace grid. The information represented 
    /// corresponds to the different concepts from the organization
    /// selected like: sales, purchases, banks, etc.
    /// @param {string} conceptType - concept type: sales, purchases...
    /// @param {integer} taxInfo - tax info with id and name
    /// @param {integer} statusInfo - status info with id and name
    getOrgConceptsInfo : (conceptType, taxInfo, statusInfo) => {

        // Organization selected by user previously
        let orgIdDefault = "5ea086c97cc16250b45f82e1"; //this.props.orgIdSelected

        // Fetch URL with parameters
        const fetchURL =
            "/getWithholdings" +
            `?id_organisation=${orgIdDefault}` +
            `&id_tax_type=${taxInfo.id}` +
            `&id_status=${statusInfo.id}`;

        return (

            // Fetching data from the endpoint
            fetch(fetchURL)
                .then(res => res.json())
                .then(data => {
                    return {
                        data : data,
                        conceptType : conceptType,
                        taxInfo : taxInfo
                    }
                })
        );
    },
    /// After getting the data from the organization in the function
    /// getOrgConceptsInfo the data is porcessed to give the right format
    /// @param {array} items - data requested from server
    /// @param {string} taxInfo - tax info with id and name
    /// @param {boolean} isAnEditableGrid - If the grid will have editable columns
    fillWorkspaceGrid : (items, taxInfo, isAnEditableGrid) => {

        let gridItems = [];

        // Deciding which kind of headers use depending on parameters
        let headersTemplate = 
            isAnEditableGrid ? 
            util.returnHeader(taxInfo.name) : 
            util.returnHeaderFlow(taxInfo.name);

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

                    // Value formatting
                    switch (true) {

                        // In case itemValue is a float. 
                        // This value comes different from Xero. It is an 
                        // object with a $numberDecimal property inside
                        case (itemValue.hasOwnProperty("$numberDecimal")) :
                            itemValue = itemValue["$numberDecimal"];
                            break;

                        // In case itemValue is a date
                        case (moment(itemValue).isValid()) :
                            itemValue = moment(itemValue).format("DD/MM/YYYY");
                            break;

                        // In case the data needs a specific value based in a formula
                        case (header.hasOwnProperty("calculated")) :

                            switch(header.formulaName){

                                // Base taxable calculation
                                case "base_taxable" :

                                    // Invoice subtotal
                                    let subtotal = item["invoice_subtotal"]["$numberDecimal"];
                                    subtotal = subtotal ? subtotal : 0;

                                    // Invoice exempt amount
                                    let exempt = item["invoice_exempt_amount"]["$numberDecimal"];
                                    exempt = exempt ? exempt : 0;
                                    
                                    itemValue = Number.parseFloat(subtotal) - Number.parseFloat(exempt);
                                    break;

                                case "retention_percentage" :
                                    // Invoice total tax
                                    let totalTax = item["invoice_total_tax"]["$numberDecimal"];
                                    totalTax = totalTax ? totalTax : 0;

                                    // Retention percentage
                                    let retention = 0; //item["retention_percentage"]["$numberDecimal"];
                                    retention = retention ? retention : 0;

                                    itemValue = (Number.parseFloat(totalTax) * Number.parseFloat(retention)) / 100;
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
    /// Helps to determine the status of a concept
    /// @param {string} statusName - the name of the status
    getStatusInfoConcept : (statusName) => {

        // Deciding concept type. Pending by default
        // Pending [Borrador] = 1
        // Approved [Aprobado o Recibido] = 2
        // Nulified [Anulado] = 3
        // Stored [Archivado] = 4
        let statusInfo = {
            id : 1,
            name : "Pendientes"
        };

        switch(statusName){

            case "Recibidos" :
                statusInfo.id = 2;
                statusInfo.name = "Recibidos";
                break;
            
            case "Anulados" :
                statusInfo.id = 3;
                statusInfo.name = "Anulados";
                break;
            
            case "Archivados" :
                statusInfo.id = 4;
                statusInfo.name = "Archivados";
                break;
        }

        return statusInfo;
    },
    /// Helps to get the kind of tax of a concept
    /// @param {float} taxIndex - The index configured by tax in DropDownList events property
    getTaxInfoConcept : (taxIndex) => {

        // Defining tax info depending on index configured in the DropDownList
        // taxinfo.id - its the internal id Xero gives the tax, in order to request
        // taxinfo.name - its used to rendering porpuses in Ventas component
        let taxInfo = {};

        switch(taxIndex){
            case 4.1 : 
                taxInfo.id = 2;
                taxInfo.name = "ISRL";
                taxInfo.event = 4.1;
                break;
            
            case 4.2 :
            default :
                taxInfo.id = 1;
                taxInfo.name = "IVA";
                taxInfo.event = 4.2;
                break;
        }

        return taxInfo;
    },
    /// Helps to know when a grid data needs to have editable columns
    /// @param {object} conceptsStatus - status info of the concept (sales, purchases)
    /// @param {object} conceptsTax - tax info of the concept (sales, purchases)
    knowIfGridHeadersEditable : (conceptsStatus, conceptsTax) => {
        
        let editableGrid = false;

        // Validating concept status equal to Pending [Borrador]
        if(conceptsStatus.id === 1){
            editableGrid = true;
        }

        return editableGrid;
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
    //Crea el componente generidco del grid
    createDataDrid: function (columnDefs, rowData, defaultColDef, components, onRowSelected, onSelectionChanged) {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div
                    id="myGrid"
                    style={{ height: '100%', width: '100%' }}
                    className="ag-theme-alpine">
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
                        components={components}
                        singleClickEdit={true}
                        onRowSelected={onRowSelected}
                        onSelectionChanged={onSelectionChanged}
                        rowHeight={35}>
                    </AgGridReact>
                </div>
            </div>
        )
    },
    //Crea el header del componente de ventas
    returnHeader: function (Tipo) {
        var columnDefs = [
            {
                headerName: 'No. Factura', field: 'NoFactura', xeroField: 'id_invoice_xero', width: 118,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 120, resizable: true, sortable: true },
            { headerName: 'Cliente', field: 'Contacto', xeroField: 'contact_name', filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'SubTotalFactura', calculated: true, formulaName: 'base_taxable',  width: 123, sortable: true },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', width: 120, sortable: true },
            { headerName: '% retenido', field: 'Retencion', calculated: true, formulaName: 'retention_percentage', width: 104, sortable: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', width: 129, sortable: true },
            { headerName: 'Fecha comprobante', field: 'FechaComprobante', width: 149, sortable: true, cellRenderer: this.CellRendererCalendar },
            { headerName: 'No. Comprobante', field: 'Comprobante', width: 140, sortable: true, editable: true },
            { headerName: 'Doc', field: 'Link', width: 80, cellRenderer: this.CellRendererUp }
        ]

        return (columnDefs)
    },
    //Crea el header del componente de ventas
    returnHeaderFlow: function (Tipo) {
        var columnDefs = [
            {
                headerName: 'No. Factura', field: 'NoFactura', xeroField: 'id_invoice_xero', width: 118,
                headerCheckboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            },
            { headerName: 'No. Control', field: 'Control', xeroField: 'invoice_control', filter: 'agTextColumnFilter', width: 120, resizable: true, sortable: true },
            { headerName: 'Cliente', field: 'Contacto', xeroField: 'contact_name', filter: 'agTextColumnFilter', width: 240, resizable: true, sortable: true },
            { headerName: 'Fecha factura', field: 'FechaFactura', xeroField: 'invoice_date', filter: 'agTextColumnFilter', width: 128, sortable: true },
            { headerName: 'Base imponible', field: 'SubTotalFactura', xeroField: 'invoice_subtotal', width: 123, sortable: true },
            { headerName: 'Total ' + Tipo, field: 'TotalIVA', xeroField: 'invoice_total_tax', width: 120, sortable: true },
            { headerName: '% retenido', field: 'Retencion', width: 104, sortable: true },
            { headerName: 'Monto retenido', field: 'MontoRetenido', width: 129, sortable: true },
            { headerName: 'Fecha comprobante', field: 'FechaComprobante', width: 149, sortable: true },
            { headerName: 'No. Comprobante', field: 'Comprobante', width: 140, sortable: true },
            { headerName: 'Doc', field: 'Link', width: 80, cellRenderer: this.CellRendererP }
        ]
        return (columnDefs)
    },
    // Renderiza columna fecha para elegir una fecha de calendario
    CellRendererCalendar: function (params) {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = '<input type="date" id="start" name="trip-start" value=' + params.value + ' min="2000-01-01" max="2050-12-31">'
        
        return eDiv;
    },
    //Coloca icono de carga en el grid
    CellRendererUp: function (params) {
        var eDiv = document.createElement('div');
        eDiv.class = "file-container";
        eDiv.innerHTML = '<div class="custom-file-upload">' +
            '<img border="0" width="18" height="21" src="http://desacrm.quierocasa.com.mx:7002/Images/kiiper_Upload.png"></img>' +
            '<input id="' + params.value + '" type="file" class="file-upload" id="file-upload" />' +
            '   </div>' +
            '</div>';
        return eDiv;
    },
    //Coloca icono de descarga en el grid
    CellRendererP: function (params) {
        var flag = '<img border="0" width="18" height="21" src="http://desacrm.quierocasa.com.mx:7002/Images/kiiper_Download.png"></img>';
        return (
            '<a href="' + params.value + '"><span style="cursor: pointer; " >' + flag + '</span></a>'
        );
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
    }
}

export default util;