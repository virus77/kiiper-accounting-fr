import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Menu } from 'semantic-ui-react'
import { $ } from 'jquery';

//Css
import 'semantic-ui-css/semantic.min.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class Compras extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: "true",
            columnDefs: [
                {
                    headerName: 'No. Factura',
                    field: 'NoFactura',
                    width: 120,
                    checkboxSelection: function (params) {
                        return params.columnApi.getRowGroupColumns().length === 0;
                    },
                    headerCheckboxSelection: function (params) {
                        return params.columnApi.getRowGroupColumns().length === 0;
                    },
                },
                { headerName: 'Contacto', field: 'Contacto', filter: 'agTextColumnFilter', width: 250, resizable: true, sortable: true, editable: true },
                { headerName: 'Fecha Factura', field: 'FechaFactura', filter: 'agTextColumnFilter', width: 140, sortable: true, editable: true, cellEditor: 'datePicker' },
                { headerName: 'Fecha Aprobación', field: 'FechaAplicacion', filter: 'agTextColumnFilter', width: 170, sortable: true, editable: true, cellEditor: 'datePicker' },
                { headerName: 'Base Imponible', field: 'CaseImponible', width: 160, sortable: true },
                { headerName: 'IVA', field: 'IVA', width: 80, sortable: true },
                { headerName: 'IVA Retenido', field: 'IVARetenido', width: 120, sortable: true },
                { headerName: 'SubTotal Factura', field: 'SubTotalFactura', width: 140, sortable: true },
                { headerName: 'Total Factura', field: 'TotalFactura', width: 140, sortable: true },
                { headerName: '%', field: 'Averige', width: 80, sortable: true },
                { headerName: 'Doc', field: 'Link', width: 120, resizable: true }
            ],
            rowData: [
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
            ],
            components: { datePicker: this.getDatePicker() },
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: { checkbox: true },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
        }
    }

    getDatePicker() {
        function Datepicker() { }
        Datepicker.prototype.init = function (params) {
            this.eInput = document.createElement('input');
            this.eInput.value = params.value;
            this.eInput.classList.add('ag-input');
            this.eInput.style.height = '100%';
            $(this.eInput).datepicker({ dateFormat: 'dd/mm/yy' });
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
        return Datepicker;
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return (
            <div>
                <Menu>
                    <Menu.Item
                        name='Aprobados'
                        active={activeItem === 'Aprobados'}
                        onClick={this.handleItemClick}>
                        Aprobados
                    </Menu.Item>
                    <Menu.Item
                        name='Anulados'
                        active={activeItem === 'Anulados'}
                        onClick={this.handleItemClick}>
                        Anulados
                    </Menu.Item>
                    <Menu.Item
                        name='Archivados'
                        active={activeItem === 'Archivados'}
                        onClick={this.handleItemClick}>
                        Archivados
                    </Menu.Item>
                </Menu>
                <br />
                <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                    <AgGridReact
                        pagination={true}
                        enableRangeSelection={true}
                        paginationAutoPageSize={true}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        animateRows={true}
                        sortingOrder={['desc', 'asc', null]}
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}>
                    </AgGridReact>
                </div >
            </div>
        );
    }
}

export default Compras;