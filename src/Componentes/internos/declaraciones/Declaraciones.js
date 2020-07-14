import React, { Component } from 'react';
//import { $ } from 'jquery/dist/jquery';
import { Menu } from 'semantic-ui-react'

//Componentes
import util from '../../Js/util'
import calls from '../../Js/calls'
import AlertDismissible from '../Alert'
import { NavDropdown, Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";

//Css
import 'semantic-ui-css/semantic.min.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import '../../internos/Css/Grid.scss';
import '../../internos/Css/alert.css';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Css/styles.scss';
import Autorenew from '@material-ui/icons/Autorenew';
import DropdownList from 'react-widgets/lib/DropdownList';

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
            event: 2,
            eventKey: 0,
            arrayWithholdings: [],
            showModal: false,
            selectedOption: '1',
            accounts: [],
            showModalAccounts: false,
            bankAccountCode: null,
            bankReference: null
        }
    };

    //#region Métodos de ciclo de vida
    componentWillMount() {

        calls.getBankAccounts(this.props.orgIdSelected).then(result => {
            if(result.data !== undefined ) this.setState({ accounts: result.data });
            //console.log("data", result.data);
        });

        // Getting data from Xero and building data grid
        util.getAndBuildGridDataDeclaration(null, "Por generar", this.props.orgIdSelected).then(result => {
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
        util.getAndBuildGridDataDeclaration(index, this.state.activeItem, this.props.orgIdSelected).then(result => {

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

    //Función utilizada para cambiar el estado y llenado del grid delendiendo del clic en el menu superior del mismo
    handleItemClick = (e, name) => {

        // Cleaning rows selected on grid
        this.refs.agGrid.api.deselectAll();

        // Getting data from Xero and building data grid
        util.getAndBuildGridDataDeclaration(this.state.event, name.name, this.props.orgIdSelected).then(result => {

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
                    const retencionType = (this.state.event) === 1? 'ISLR': 'IVA';

                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: `La declaracion de retención de ${retencionType} ha sido enviada a aprobación.` })
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
                this.handleShowModal();
                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1? 'ISLR': 'IVA';
                    if (val) {
                        let result1 = await calls.registerStatement(arrayToSend);
                        if (result1 === true || result1 === false) {
                            this.setState({ show: true, texto: `La declaracion de retención de ${retencionType} ha sido aprobada.` });
                            this.onRemoveSelected();
                            this.setState({ activeItem: name })
                        }
                    } else {
                        let result1 = await calls.denyStatement(arrayToSend);
                        if (result1 === true || result1 === false) {
                            this.setState({ show: true, texto: `La declaracion de retención de ${retencionType} ha sido rechaza.` })
                            this.onRemoveSelected();
                            this.setState({ activeItem: name })
                        }
                    }
                    
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Aprobados":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1? 'ISLR': 'IVA';
                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "la declaracion de retencion de IVA/SLR ha sido enviar a aprobacion y enviamos notifcacion al cliente." })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "Por declarar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.registerStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido declarado en Xero y cambió su estatus a ‘anulado’." })
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
                this.handleShowModalAccounts();
                if (arrayToSend.length > 0) {

                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.payStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: "El comprobante de retención ha sido pagado en Xero y cambió su estatus a ‘pagados’." })
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

            const statementId = selectedRow.statementId;

            // Defining JSON oject to add to list of voucher to send
            // in voucher view action button 
            switch (statusName) {

                case "Por generar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                       _id: statementId
                   });
                   break;
                case "Por aprobar":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: statementId
                    });
                    break;
                case "Aprobados":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: statementId
                    });
                    break;
                case "Por declarar":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: statementId,
                        commitmentFile: selectedRow.compromiso,
                        warrantFile: selectedRow.Certificado
                    });
                    break;
                case "Por pagar":
                     // Storing data from items selected in Sales grid
                     arrayToSend.push({
                        _id: statementId,
                        paymentFile: selectedRow.pago
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
                case "Por declarar":
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

    onReloadStatement = async (statementId) => {
        let result = await calls.updateStatement(statementId);
    }

    /// Clear selected elements in the grid
    onRemoveSelected = () => {
        var selectedData = this.refs.agGrid.api.getSelectedRows();
        var res = this.refs.agGrid.api.applyTransaction({ remove: selectedData });
        util.printResult(res);
    };

    onDownloadAuxiliarTaxReport = async(statementId) => {
        let result = await calls.getDownloadAuxiliarTaxReport(statementId);
    }
 
    //Función onchange del grid
    onSelectionChanged = event => {
        /* var rowCount = event.api.getSelectedNodes().length;
        window.alert('selection changed, ' + rowCount + ' rows selected');*/
    };

    handleCloseModal = () => this.setState({ showModal: false });
    handleShowModal = () => this.setState({ showModal: true });

    handleCloseModalAccounts = () => this.setState({ showModalAccounts: false });
    handleShowModalAccounts = () => this.setState({ showModalAccounts: true });

    handleOptionChange = event => {
        this.setState({
          selectedOption: event.target.value
        });
    }

    handleDropdownAccounts = event => {
        this.setState({
          bankAccountCode: event.code
        });
    }

    handleInputAccounts = event => {
        this.setState({
            bankReference: event.target.value
        });
    }

    render() {
        const { activeItem } = this.state
 
        return (
            <div style={{ height: "100%" }}>
                {/* [Por aprobar] Modal de enviar notificacion al cliente */}
                <Modal show={this.state.showModal} onHide={this.handleCloseModal}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Aprobar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <form>
                                    <div className="radio">
                                        <label>
                                            <input type="radio" value="1" checked={this.state.selectedOption === '1'} 
                                             onChange={this.handleOptionChange}/>
                                             &nbsp;&nbsp;Aprobar y enviar notificación al cliente
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input type="radio" value="2" checked={this.state.selectedOption === '2'}  onChange={this.handleOptionChange}/>
                                            &nbsp;&nbsp;Aprobar y solicitar Visto Bueno al cliente
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="xeroGenerate" onClick={this.handleCloseModal}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* [Por pagar] Modal eleccion cuenta bancaria y numero de referencia*/}

                <Modal show={this.state.showModalAccounts} onHide={this.handleCloseModalAccounts}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Pago</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <form>
                                    <div className="dropdown-container">
                                        <label>
                                            Banco: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </label>
                                        <DropdownList
                                            style={{ width: "240px" }}
                                            filter
                                            onChange={this.handleDropdownAccounts}
                                            data={this.state.accounts}
                                            allowCreate="onFilter"
                                            valueField="code"
                                            textField="name"/>
                                    </div>
                                    <div className="dropdown-container">
                                        <label>
                                            Referencia: &nbsp;&nbsp;
                                        </label>
                                        <input onChange={this.handleInputAccounts}/>
                                    </div>
                                    <div className="accounts-button">
                                        <Button className="xeroGenerate" onClick={this.handleCloseModalAccounts}>
                                            Contabilizar
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    </Modal.Body>
                </Modal>
                {/*Pintado del dropdownlist de iva/isrl*/}
                <div>
                    <NavDropdown id="ddlVentas" title={this.state.event === 1 ? '≡  Comprobante de retención de IVA  ' : this.state.event === 2 ? '≡  Comprobante de retención de ISLR  ' : '≡  Comprobante de retención de IVA  '} >
                        <NavDropdown.Item eventKey={2} onClick={(event) => this.handleListItemClick(event, 2)} href="#Reportes/ISLR"><span className="ddlComVenLabel"> Comprobante de retención de ISLR </span></NavDropdown.Item>
                        <NavDropdown.Item eventKey={1} onClick={(event) => this.handleListItemClick(event, 1)} href="#Reportes/IVA"><span className="ddlComVenLabel"> Comprobante de retención de IVA </span></NavDropdown.Item>
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
                        name='Por declarar'
                        active={activeItem === 'Por declarar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Anulados' ? <span style={{ color: "#7158e2" }} >Por declarar</span> :
                            <span >Por declarar</span>}
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
                                <div className="two-buttons-container">
                                    <div className="idDibvDisabledsmall">
                                     <span> <Autorenew /> Actualizar</span>
                                    </div>
                                    <div className="idDibvDisabledsmall">
                                        <span>Enviar</span>
                                    </div>
                                </div>
                                :activeItem === 'Por aprobar'?
                                <div className="two-buttons-container">
                                    <div className="idDibvDisabledsmall">
                                        <span>Rechazar</span>
                                    </div>
                                    <div className="idDibvDisabledsmall">
                                        <span>Aprobar</span>
                                    </div>
                                </div>
                                // <div className="two-buttons-container">
                                //     <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por aprobar", true)} >
                                //         <span>Rechazar</span>
                                //     </div>
                                //     <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por aprobar", true)} >
                                //         <span>Aprobar</span>
                                //     </div>
                                // </div>
                                :activeItem === 'Por aprobar'?
                                    <div className="idDibvDisabledsmall">
                                        <span>Aprobar</span>
                                    </div>
                                    : activeItem === 'Aprobados' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Declarar</span>
                                        </div>
                                        :activeItem === 'Por declarar' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Declarar</span>
                                        </div>
                                        :activeItem === 'Por pagar' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Pagar</span>
                                        </div>
                                        // <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por pagar", true)} >
                                        // <span>Pagar</span>
                                        // </div> 
                                        :activeItem === 'PorGenerarSel' ?
                                            <div className="two-buttons-container">
                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por generar", true)} >
                                                    <span> <Autorenew /> Recargar</span>
                                                </div>
                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por generar", true)} >
                                                    <span>Enviar</span>
                                                </div>
                                            </div>
                                            :activeItem === 'PorAprobarSel' ?
                                                <div className="two-buttons-container">
                                                    <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por aprobar", false)} >
                                                        <span>Rechazar</span>
                                                    </div>
                                                    <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por aprobar", true)} >
                                                        <span>Aprobar</span>
                                                    </div>
                                                </div>
                                                :activeItem === 'AprobadosSel' ?
                                                    <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Aprobados", true)} >
                                                        <span>Declarar</span>
                                                    </div>
                                                    : activeItem === 'PordeclararSel' ?
                                                        <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Por declarar", true)} >
                                                            <span>Declarar</span>
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
                                        activeItem === "Por declarar" ?
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