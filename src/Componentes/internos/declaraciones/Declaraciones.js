import React, { Component } from 'react';
//import { $ } from 'jquery/dist/jquery';
import { Menu } from 'semantic-ui-react'

//Componentes
import util from '../../Js/util'
import calls from '../../Js/calls'
import AlertDismissible from '../Alert'
import { NavDropdown } from 'react-bootstrap';

//Css
import 'semantic-ui-css/semantic.min.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import '../../internos/Css/Grid.scss'
import '../../internos/Css/alert.css'

class Declaraciones extends Component {
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
                minWidth: 100

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
        util.getAndBuildGridData(null, "Por generar", "Proveedor", this.props.orgIdSelected, 'declaracion').then(result => {

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
        util.getAndBuildGridData(index, this.state.activeItem, "Proveedor", this.props.orgIdSelected, 'declaracion').then(result => {

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
        util.getAndBuildGridData(this.state.event, name.name, "Proveedor", this.props.orgIdSelected, 'declaracion').then(result => {

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
            case "Por generar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Por aprobar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Aprobados":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Declarados":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Por pagar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            default:
                break;
        }
    }

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

                case "Por generar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                       _id: withHoldingId
                   });
                   break;
                case "Por aprobar":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: withHoldingId
                    });
                    break;
                case "Aprobados":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: withHoldingId
                    });
                    break;
                case "Declarados":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: withHoldingId
                    });
                    break;
                case "Por pagar":
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

    //Función on row selected del grid
    onRowSelected = event => {

        const { activeItem } = this.state

        // Getting grid selected rows
        const gridSelectedRows = event.api.getSelectedRows();
        if (gridSelectedRows.length > 0) {
            switch (activeItem) {

                case "Por generar":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido aprobado en Xero y cambió su estatus a ‘aprobado’." })
                    break;
                case "Por aprobar":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido aprobado en Xero y cambió su estatus a ‘aprobado’." })
                    break;
                case "Aprobados":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido declarado en Xero y cambió su estatus a ‘declarado’." })
                    break;
                case "Declarados":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha pasado a por pagar en Xero y cambió su estatus a ‘Por Pagar’." })
                    break;
                case "Por pagar":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido pagado en Xero y cambió su estatus a ‘pagados’." })
                    break;
                default:
                    break;
            }
        }
    };

    /// Clear selected elements in the grid
    onRemoveSelected = () => {
        var selectedData = this.refs.agGrid.api.getSelectedRows();
        var res = this.refs.agGrid.api.applyTransaction({ remove: selectedData });
        util.printResult(res);
    };


    //Función onchange del grid
    onSelectionChanged = event => {
        /* var rowCount = event.api.getSelectedNodes().length;
        window.alert('selection changed, ' + rowCount + ' rows selected');*/
    };

    render() {
        const { activeItem } = this.state
        return (
            <div style={{ height: "100%" }}>
                {/*Pintado del dropdownlist de iva/isrl*/}
                <div>
                    <NavDropdown id="ddlVentas" title={this.state.event === 4.2 ? '≡  Comprobante de retención de IVA  ' : this.state.event === 4.1 ? '≡  Comprobante de retención de ISLR  ' : '≡  Comprobante de retención de IVA  '} >
                        <NavDropdown.Item eventKey={4.1} onClick={(event) => this.handleListItemClick(event, 4.1)} href="#Reportes/ISLR"><span className="ddlComVenLabel"> Comprobante de retención de ISLR </span></NavDropdown.Item>
                        <NavDropdown.Item eventKey={4.2} onClick={(event) => this.handleListItemClick(event, 4.2)} href="#Reportes/IVA"><span className="ddlComVenLabel"> Comprobante de retención de IVA </span></NavDropdown.Item>
                    </NavDropdown>
                </div>
                {/*Pintado de grid dependiendo del menu superior del grid*/}
                <Menu style={{ display: "flex" }}>
                    <Menu.Item
                        name='Por generar'
                        active={activeItem === 'Por generar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Por generar' ? <span style={{ color: "#7158e2" }} >Por generar</span> :
                            activeItem === 'PorGenerarSel' ? <span style={{ color: "#7158e2" }} >Por generar</span> :
                                <span >Por generar</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Por aprobar'
                        active={activeItem === 'Por aprobar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Por aprobar' ? <span style={{ color: "#7158e2" }} >Por Aprobar</span> :
                            activeItem === 'PorAprobarSel' ? <span style={{ color: "#7158e2" }} >Por Aprobar</span> :
                                <span >Por Aprobar</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Aprobados'
                        active={activeItem === 'Aprobados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Aprobados' ? <span style={{ color: "#7158e2" }} >Aprobados</span> :
                            activeItem === 'AprobadosSel' ? <span style={{ color: "#7158e2" }} >Aprobados</span> :
                                <span >Aprobados</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Declarados'
                        active={activeItem === 'Declarados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Anulados' ? <span style={{ color: "#7158e2" }} >Declarados</span> :
                            <span >Declarados</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='Por pagar'
                        active={activeItem === 'Por pagar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Por pagar' ? <span style={{ color: "#7158e2" }} >Por pagar</span> : null}
                    </Menu.Item>
                    <Menu.Item
                        name='Pagados'
                        active={activeItem === 'Pagados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Pagados' ? <span style={{ color: "#7158e2" }} >Pagados</span> : null}
                    </Menu.Item>
                    <div style={{ borderStyle: "none", flex: "1", display: "flex", justifyContent: "flex-end" }}>
                        {
                            activeItem === 'Por generar'?
                                <div className="idDibvDisabledsmall">
                                    <span>Aprobación</span>
                                </div>:
                                activeItem === 'Por aprobar'?
                                    <div className="idDibvDisabledsmall">
                                        <span>Aprobar</span>
                                    </div>
                                    : activeItem === 'Aprobados' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Declarar</span>
                                        </div>
                                        :activeItem === 'Declarados' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Por Pagar</span>
                                        </div>
                                        :activeItem === 'Por pagar' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Pagar</span>
                                        </div>
                                        : activeItem === 'PorGenerarSel' ?
                                            <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por generar", true)} >
                                                <span>Aprobación</span>
                                            </div>
                                            : activeItem === 'PorAprobarSel' ?
                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por aprobar", true)} >
                                                    <span>Aprobar</span>
                                                </div>
                                                : activeItem === 'AprobadosSel' ?
                                                    <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Aprobados", true)} >
                                                        <span>Declarar</span>
                                                    </div>
                                                    : activeItem === 'DeclaradosSel' ?
                                                        <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Declarados", true)} >
                                                            <span>Por pagar</span>
                                                        </div> 
                                                    : activeItem === 'PorPagarSel' ?
                                                        <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por pagar", true)} >
                                                            <span>Pagar</span>
                                                        </div> 
                                                    : null
                        }
                    </div>
                </Menu>
                {/*Pintado de grid dependiendo del flujo de los botones*/}
                <div style={{ width: '100%', height: '100%' }}>
                    <div id="salesGrid" style={{ height: '446px', width: '100%' }}
                        className="ag-theme-alpine">
                        {activeItem === "Por generar" ?
                                util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                    this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)):
                                activeItem === "Por aprobar" ?
                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                        this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                    activeItem === "Aprobados" ?
                                        util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                            this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                        activeItem === "Declarados" ?
                                            util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                                this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                            activeItem === "Por pagar" ?
                                                util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                                    this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                                        this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this))
                        }
                    </div>
                    <div id="idDivAlert">
                        {this.state.show === true ?
                            <div id="idButtonDiv">
                                <button style={{ zIndex: "-1" }} type="button" className="close" onClick={(event) => this.onMoveData(this.state.activeItem, false)}><span aria-hidden="true">OK</span></button>
                            </div> : null}
                        <AlertDismissible valor={this.state.show} texto={this.state.texto} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Declaraciones;