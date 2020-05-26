import React, { Component } from 'react';
//import { $ } from 'jquery/dist/jquery';
import { Menu } from 'semantic-ui-react'

//Componentes
import util from '../Js/util'
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
                minWidth: 100

            },
            show: false,
            setShow: true,
            texto: "",
            Tipo: "IVA",
            event: 4.2,
            eventKey: 0
        }
    };

    //#region Métodos de ciclo de vida
    componentWillMount() {

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(null, "Recibidos", "Cliente").then( result => {
            
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

    //Función utilizada para cambiar el estado y llenado del grid dependiendo la selección de IVA/ISRL
    handleListItemClick = (e, index) => {

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(null, "Recibidos", "Cliente").then( result => {
            
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

        // Getting data from Xero and building data grid
        util.getAndBuildGridData(this.state.event, name.name, "Cliente").then( result => {
            
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
    onMoveData = (name, val) => {
        switch (name) {
            case "Archivados":
            case "Recibidos":
                this.setState({ show: val, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                break;
            default:
                this.setState({ show: false, texto: "" })
                break;
        }
    }

    //Función on row selected del grid
    onRowSelected = event => {
        const { activeItem } = this.state
        if (event.api.getSelectedNodes().length > 0) {
            switch (activeItem) {
                case "Archivados":
                case "Recibidos":
                    this.setState({ activeItem: activeItem + "Sel", show: false, texto: "El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’." })
                    break;
                default:
                    this.setState({ show: false, texto: "" })
                    break;
            }
        }
        else
            this.setState({ activeItem: activeItem.toString().substring(0, activeItem.length - 3), show: false })

        //'row ' + event.node.data.athlete + ' selected = ' + event.node.selected
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
                <div style={{ paddingBottom: "20px" }}>
                    <NavDropdown id="ddlVentas" title={this.state.event === 4.2 ? '≡  Comprobante de retención de IVA  ' : this.state.event === 4.1 ? '≡  Comprobante de retención de I.S.R.L  ' : '≡  Comprobante de retención de IVA  '} >
                        <NavDropdown.Item eventKey={4.1} onClick={(event) => this.handleListItemClick(event, 4.1)} href="#Reportes/I.S.R.L"><span className="ddlComVenLabel"> Comprobante de retención de I.S.R.L </span></NavDropdown.Item>
                        <NavDropdown.Item eventKey={4.2} onClick={(event) => this.handleListItemClick(event, 4.2)} href="#Reportes/IVA"><span className="ddlComVenLabel"> Comprobante de retención de IVA </span></NavDropdown.Item>
                    </NavDropdown>
                </div>
                {/*Pintado de grid dependiendo del menu superior del grid*/}
                <Menu>
                    <Menu.Item
                        name='Recibidos'
                        active={activeItem === 'Recibidos' ? true : false}
                        onClick={this.handleItemClick}>
                        {activeItem === 'Recibidos' ? <span style={{ color: "#7158e2" }} >Recibidos</span> :
                            activeItem === 'RecibidosSel' ? <span style={{ color: "#7158e2" }} >Recibidos</span> :
                                <span >Recibidos</span>}
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
                    <Menu.Item
                        id="idItemRight">
                    </Menu.Item>
                    <div style={{ paddingTop: "5px", paddingRight: "5px", borderStyle: "none" }}>
                        {activeItem === 'Recibidos' || activeItem === 'Archivados' ?
                            <div className="idDibvDisabled">
                                <span>Mover a anulados 㐅</span>
                            </div>
                            : activeItem === 'RecibidosSel' ?
                                <div className="idDibvEnabled" onClick={() => this.onMoveData("Recibidos", true)} >
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
                    <div id="salesGrid" style={{ height: '446px', width: '100%' }}
                        className="ag-theme-alpine">
                        {activeItem === "Recibidos" ?
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
                    </div>
                    <div id="idDivAlert">
                        {this.state.show === true ?
                            <div id="idButtonDiv">
                                <button style={{ zIndex: "-1" }} type="button" className="close" onClick={(event) => this.onMoveData(event, false)}><span aria-hidden="true">OK</span></button>
                            </div> : null}
                        <AlertDismissible valor={this.state.show} texto={this.state.texto} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Compras;