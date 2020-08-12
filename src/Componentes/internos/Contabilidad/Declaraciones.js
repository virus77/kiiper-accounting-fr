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

        //calls.getBankAccounts(this.props.orgIdSelected).then(result => {
        //    if (result.data !== undefined) this.setState({ accounts: result.data });
        //console.log("data", result.data);
        //});

        // Getting data from Xero and building data grid
        util.getAndBuildGridDataDeclaration(null, "PorGenerar", this.props.orgIdSelected).then(result => {
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
            case "PorGenerar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1 ? 'ISLR' : 'IVA';

                    let result1 = await calls.generateStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: `La declaracion de retención de ${retencionType} ha sido enviada a aprobación.` })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "PorAprobar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);
                this.handleShowModal();
                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1 ? 'ISLR' : 'IVA';
                    if (val) {
                        let result1 = await calls.approveStatement(arrayToSend);
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
                    const retencionType = (this.state.event) === 1 ? 'ISLR' : 'IVA';
                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.declareStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: `La declaración de retención de ${retencionType} ha sido enviada a aprobación y envíamos notifcación al cliente.` })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "PorDeclarar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);

                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1 ? 'ISLR' : 'IVA';
                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.registerStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: `La declaración de retención de ${retencionType} ha sido declarado en Xero y ha sido enviada a Pagados.` })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ activeItem: name, show: false })
                break;
            case "PorPagar":
                // Getting ros selected and building a JSON to send
                arrayToSend = this.onFillstate(this.refs.agGrid.api.getSelectedRows(), name);
                this.handleShowModalAccounts();
                if (arrayToSend.length > 0) {
                    const retencionType = (this.state.event) === 1 ? 'ISLR' : 'IVA';
                    // Moving received or stored vouchers to cancelled
                    let result1 = await calls.payStatement(arrayToSend);
                    if (result1 === true || result1 === false) {
                        this.setState({ show: true, texto: `La declaración de retención de ${retencionType} ha sido pagado en Xero y ha sido enviada a Pagados.` })
                        this.onRemoveSelected();
                        this.setState({ activeItem: name })
                    }
                }
                else
                    this.setState({ show: false });
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

            const _id = selectedRow._id;

            // Defining JSON oject to add to list of voucher to send
            // in voucher view action button 
            switch (statusName) {

                case "PorGenerar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        id_statement: _id
                    });
                    break;
                case "PorAprobar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        id_statement: _id
                    });
                    break;
                case "Aprobados":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        id_statement: _id
                    });
                    break;
                case "PorDeclarar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        id_statement: _id,
                        commitmentFile: selectedRow.compromiso,
                        warrantFile: selectedRow.Certificado
                    });
                    break;
                case "PorPagar":
                    // Storing data from items selected in Sales grid
                    arrayToSend.push({
                        id_statement: _id,
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
                case "PorGenerar":
                case "PorAprobar":
                case "Aprobados":
                case "PorDeclarar":
                case "PorPagar":
                    this.setState({
                        activeItem: activeItem + "Sel",
                        show: false,
                        texto:
                            "El comprobante de retención ha sido anulado en Xero y cambió su estatus a: " + activeItem,
                    });
                    break;
                default:
                    break;
            }
        } else {
            if (activeItem.includes("Sel") === true) {
                this.setState({
                    activeItem: activeItem.substring(0, activeItem.length - 3),
                    show: false,
                    texto: "",
                });
            }
            else this.setState({ activeItem: activeItem, show: false, texto: "" });
        }
    };

    onReloadStatement = async (statementId) => {
        await calls.updateStatement(statementId);
    }

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
                                                    onChange={this.handleOptionChange} />
                                             &nbsp;&nbsp;Aprobar y enviar notificación al cliente
                                        </label>
                                        </div>
                                        <div className="radio">
                                            <label>
                                                <input type="radio" value="2" checked={this.state.selectedOption === '2'} onChange={this.handleOptionChange} />
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
                                                textField="name" />
                                        </div>
                                        <div className="dropdown-container">
                                            <label>
                                                Referencia: &nbsp;&nbsp;
                                        </label>
                                            <input onChange={this.handleInputAccounts} />
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
                    <NavDropdown id="ddlVentas" title={this.state.event === 1 ? '≡  Retenciones de IVA  ' : this.state.event === 2 ? '≡  Retenciones de ISLR  ' : '≡  Retenciones de IVA  '} >
                        <NavDropdown.Item eventKey={2} onClick={(event) => this.handleListItemClick(event, 2)} href="#Reportes/ISLR"><span className="ddlComVenLabel"> Retenciones de ISLR </span></NavDropdown.Item>
                        <NavDropdown.Item eventKey={1} onClick={(event) => this.handleListItemClick(event, 1)} href="#Reportes/IVA"><span className="ddlComVenLabel"> Retenciones de IVA </span></NavDropdown.Item>
                    </NavDropdown>
                </div>
                {/*Pintado de grid dependiendo del menu superior del grid*/}
                <Menu style={{ display: "flex" }}>
                    <Menu.Item
                        name='PorGenerar'
                        active={activeItem === 'PorGenerar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'PorGenerar' ? <span style={{ color: "#7158e2" }} >Por generar</span> :
                            activeItem === 'PorGenerarSel' ? <span style={{ color: "#7158e2" }} >Por generar</span> :
                                <span >Por generar</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='PorAprobar'
                        active={activeItem === 'PorAprobar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'PorAprobar' ? <span style={{ color: "#7158e2" }} >Por aprobar</span> :
                            activeItem === 'PorAprobarSel' ? <span style={{ color: "#7158e2" }} >Por aprobar</span> :
                                <span >Por aprobar</span>}
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
                        name='PorDeclarar'
                        active={activeItem === 'PorDeclarar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Anulados' ? <span style={{ color: "#7158e2" }} >Por declarar</span> :
                            <span >Por declarar</span>}
                    </Menu.Item>
                    <Menu.Item
                        name='PorPagar'
                        active={activeItem === 'PorPagar' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'PorPagar' ? <span style={{ color: "#7158e2" }} >Por pagar</span> : null}
                    </Menu.Item>
                    <Menu.Item
                        name='Pagados'
                        active={activeItem === 'Pagados' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Pagados' ? <span style={{ color: "#7158e2" }} >Pagados</span> : null}
                    </Menu.Item>
                    <div style={{ borderStyle: "none", flex: "1", display: "flex", justifyContent: "flex-end" }}>
                        {
                            activeItem === 'PorGenerar' ?
                                <div className="two-buttons-container">
                                    <div className="idDibvDisabledsmall">
                                        <span> <Autorenew /> Actualizar</span>
                                    </div>
                                    <div className="idDibvDisabledsmall">
                                        <span>Enviar</span>
                                    </div>
                                </div>
                                : activeItem === 'PorAprobar' ?
                                    <div className="two-buttons-container">
                                        <div className="idDibvDisabledsmall">
                                            <span>Rechazar</span>
                                        </div>
                                        <div className="idDibvDisabledsmall">
                                            <span>Aprobar</span>
                                        </div>
                                    </div>
                                    : activeItem === 'PorAprobar' ?
                                        <div className="idDibvDisabledsmall">
                                            <span>Aprobar</span>
                                        </div>
                                        : activeItem === 'Aprobados' ?
                                            <div className="idDibvDisabledsmall">
                                                <span>Declarar</span>
                                            </div>
                                            : activeItem === 'PorDeclarar' ?
                                                <div className="idDibvDisabledsmall">
                                                    <span>Declarar</span>
                                                </div>
                                                : activeItem === 'PorPagar' ?
                                                    <div className="idDibvDisabledsmall">
                                                        <span>Pagar</span>
                                                    </div>
                                                    : activeItem === 'PorGenerarSel' ?
                                                        <div className="two-buttons-container">
                                                            <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorGenerar", true)} >
                                                                <span> <Autorenew /> Actualizar</span>
                                                            </div>
                                                            <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorGenerar", true)} >
                                                                <span>Enviar</span>
                                                            </div>
                                                        </div>
                                                        : activeItem === 'PorAprobarSel' ?
                                                            <div className="two-buttons-container">
                                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorAprobar", false)} >
                                                                    <span>Rechazar</span>
                                                                </div>
                                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorAprobar", true)} >
                                                                    <span>Aprobar</span>
                                                                </div>
                                                            </div>
                                                            : activeItem === 'AprobadosSel' ?
                                                                <div className="idDivEnabledSmall" onClick={() => this.onMoveData("Aprobados", true)} >
                                                                    <span>Declarar</span>
                                                                </div>
                                                                : activeItem === 'PordeclararSel' ?
                                                                    <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorDeclarar", true)} >
                                                                        <span>Declarar</span>
                                                                    </div>
                                                                    : activeItem === 'PorPagarSel' ?
                                                                        <div className="idDivEnabledSmall" onClick={() => this.onMoveData("PorPagar", true)} >
                                                                            <span>Pagar</span>
                                                                        </div>
                                                                        : null
                        }
                    </div>
                </Menu>
                {/*Pintado de grid dependiendo del flujo de los botones*/}
                <div>
                    <div id="salesGrid" className="ag-theme-alpine">
                        {activeItem === "PorGenerar" ?
                            util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                            activeItem === "PorAprobar" ?
                                util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                    this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                activeItem === "Aprobados" ?
                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                        this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                    activeItem === "PorDeclarar" ?
                                        util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef,
                                            this.state.components, this.onRowSelected.bind(this), this.onSelectionChanged.bind(this)) :
                                        activeItem === "PorPagar" ?
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