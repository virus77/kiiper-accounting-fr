import React, { Component } from 'react';
//import { $ } from 'jquery/dist/jquery';
import { Menu } from 'semantic-ui-react'

//Componentes
import util from '../Js/util'
import calls from '../Js/calls'
import AlertDismissible from '../internos/Alert'
import { NavDropdown } from 'react-bootstrap';

//Css
import 'semantic-ui-css/semantic.min.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import '../internos/Css/Grid.scss'
import '../internos/Css/alert.css'

class Compras extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: "true",
            columnDefs: [],
            rowData: [],
            columnDefs2: [],
            rowData2: [],
            headerCheckboxSelection: true,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: { checkbox: true },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            defaultColDef: {
                editable: true,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
            },
            show: false,
            setShow: true,
            texto: "",
            Tipo: "IVA",
            event: 4.2,
            eventKey: 0,
            arrayWithholdings: []
        }
    };

    //#region Métodos de ciclo de vida
    componentWillMount() {

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(null, "Aprobados", "Proveedor", this.props.orgIdSelected).then(result => {

            // Setting component state
            this.setState({
                rowData: result.structure.gridItems,
                columnDefs: result.structure.headersTemplate,
                activeItem: result.statusInfo.name,
                Tipo: result.taxInfo.name,
                event: result.taxInfo.event,
            })
        });
    }

    //Función utilizada para cambiar el estado y llenado del grid dependiendo la selección de IVA/ISLR
    handleListItemClick = (e, index) => {

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(index, this.state.activeItem, "Proveedor", this.props.orgIdSelected).then(result => {

            // Setting component state
            this.setState({
                rowData: result.structure.gridItems,
                columnDefs: result.structure.headersTemplate,
                activeItem: result.statusInfo.name,
                eventKey: result.taxInfo.event,
                Tipo: result.taxInfo.name,
                event: result.taxInfo.event,
            })
        });
    }

    //Función utilizada para cambiar el estado y llenado del frid delendiendo del clic en el menu superior del mismo
    handleItemClick = (e, name) => {

        // Cleaning rows selected on grid
        this.refs.agGrid.api.deselectAll();

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(this.state.event, name.name, "Proveedor", this.props.orgIdSelected).then(result => {

            // Setting component state
            this.setState({
                rowData: result.structure.gridItems,
                columnDefs: result.structure.headersTemplate,
                activeItem: result.statusInfo.name,
                Tipo: result.taxInfo.name,
                event: result.taxInfo.event,
            })
        });
    };

    //Función utilizada para mover los datos de un estatus a otro
    onMoveData = async (name, val) => {

        let arrayToSend = "";

        switch (name) {
            case "Archivados":
            case "Aprobados":

                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let Result = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (Result === true) {
                        this.setState({ show: val, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                    }
                }
                break;
            default:
                this.setState({ show: false, texto: "" })
                break;
        }
    }

    //Función on row selected del grid
    onRowSelected = event => {

        const { activeItem } = this.state

        // Getting grid selected rows
        const gridSelectedRows = event.api.getSelectedRows();
        if (gridSelectedRows.length > 0) {
            switch (activeItem) {

                case "Archivados":
                case "Aprobados":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                    break;
                default:
                    break;
            }
        }
        else
            this.setState({ activeItem: activeItem.toString().substring(0, activeItem.length - 3), show: false })
    };

    /// Clear selected elements in the grid
    onRemoveSelected = () => {
        var selectedData = this.refs.agGrid.api.getSelectedRows();
        var res = this.refs.agGrid.api.applyTransaction({ remove: selectedData });
        util.printResult(res);
    };

    /// Llena el estado dependiendo delestatus seleccionado
    /// @param {object} gridSelectedRows - Object of selected items in grid
    /// @param {string} statusName - name of status
    onFillstate = (gridSelectedRows, statusName) => {

        let arrayToSend = [];

        // Start proccess to gather all information from grid items selected /
        // Gathering items selected information
        gridSelectedRows.forEach(selectedRow => {

            // Voucher data to be send or used in validation
            const withHoldingId = selectedRow.withHoldingId;

            // Defining JSON oject to add to list of voucher to send
            // in voucher view action button 
            switch (statusName) {

                case "Recibidos":      // Received voucher
                case "Archivados":     // Stored voucher
                case "Aprobados":     // Stored voucher

                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        _id: withHoldingId
                    });
                    break;

                default:
                    break;
            }
        });

        return arrayToSend;
    };

    //Función onchange del grid
    onSelectionChanged = event => {
        /* var rowCount = event.api.getSelectedNodes().length;
        window.alert('selection changed, ' + rowCount + ' rows selected');*/
    };

    render() {
        const { activeItem } = this.state
        return (
            <div>
                {/*Pintado del dropdownlist de iva/isrl*/}
                <div style={{ paddingBottom: "10px" }}>
                    <NavDropdown id="ddlVentas" title={this.state.event === 4.2 ? '≡  Comprobante de retención de IVA  ' : this.state.event === 4.1 ? '≡  Comprobante de retención de ISLR  ' : '≡  Comprobante de retención de IVA  '} >
                        <NavDropdown.Item eventKey={4.1} onClick={(event) => this.handleListItemClick(event, 4.1)} href="#Reportes/ISLR"><span className="ddlComVenLabel"> Comprobante de retención de ISLR </span></NavDropdown.Item>
                        <NavDropdown.Item eventKey={4.2} onClick={(event) => this.handleListItemClick(event, 4.2)} href="#Reportes/IVA"><span className="ddlComVenLabel"> Comprobante de retención de IVA </span></NavDropdown.Item>
                    </NavDropdown>
                </div>
                {/*Pintado de grid dependiendo del menu superior del grid*/}
                <Menu style={{ display: "flex" }}>
                    <Menu.Item
                        name='Aprobados'
                        active={activeItem === 'Aprobados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Aprobados' ? <span style={{ color: "#7158e2" }} >Aprobados</span> :
                            activeItem === 'AprobadosSel' ? <span style={{ color: "#7158e2" }} >Aprobados</span> :
                                <span >Aprobados</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Anulados'
                        active={activeItem === 'Anulados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Anulados' ? <span style={{ color: "#7158e2" }} >Anulados</span> :
                            <span >Anulados</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Archivados'
                        active={activeItem === 'Archivados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Archivados' ? <span style={{ color: "#7158e2" }} >Archivados</span> :
                            activeItem === 'ArchivadosSel' ? <span style={{ color: "#7158e2" }} >Archivados</span> :
                                <span >Archivados</span>}
                    </Menu.Item>
                    <div style={{ paddingTop: "5px", paddingRight: "5px", borderStyle: "none", flex: "1", display: "flex", justifyContent: "flex-end" }}>
                        {activeItem === 'Aprobados' || activeItem === 'Archivados' ?
                            <div className="idDibvDisabled">
                                <span>Mover a anulados 㐅</span>
                            </div>
                            : activeItem === 'AprobadosSel' ?
                                <div className="idDibvEnabled" onClick={() => this.onMoveData("Aprobados", true)} >
                                    <span>Mover a anulados 㐅</span>
                                </div>
                                : activeItem === 'ArchivadosSel' ?
                                    <div className="idDibvEnabled" onClick={() => this.onMoveData("Archivados", true)} >
                                        <span>Mover a anulados 㐅</span>
                                    </div> : null
                        }
                    </div>
                </Menu>
                {/*Pintado de grid dependiendo del flujo de los botones*/}
                <div style={{ width: '100%', height: '100%' }}>
                    <div id="salesGrid" style={{ height: '400px', width: '100%' }}
                        className="ag-theme-alpine">
                        {activeItem === "Aprobados" ?
                            util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                            activeItem === "Anulados" ?
                                util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                    this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                activeItem === "Archivados" ?
                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                        this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                        this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this))
                        }
                        <div id="idDivAlert">
                            {this.state.show === true ?
                                <div id="idButtonDiv">
                                    <button style={{ zIndex: "-1" }} type="button" className="close" onClick={(event) => this.onMoveData(event, false)}><span aria-hidden="true">OK</span></button>
                                </div> : null}
                            <AlertDismissible valor={this.state.show} texto={this.state.texto} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Compras;