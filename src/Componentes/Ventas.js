import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'

//Componentes
import util from './Js/util'

//Css
import 'semantic-ui-css/semantic.min.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class Ventas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: "true",
            columnDefs: [],
            rowData: [],
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
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    //#region Métodos de ciclo de vida
    async componentWillMount() {
        let columnDefs = util.returnHeaderSales();
        let rowData = util.returnSales();
        this.setState({ rowData: rowData, columnDefs: columnDefs })
    }

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
                <div style={{ width: '100%', height: '100%' }}>
                    <div id="salesGrid" style={{ height: '530px', width: '100%', }}
                        className="ag-theme-alpine">
                        {activeItem === "Aprobados" ?
                            util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef, this.onGridReady) :
                            activeItem === "Anulados" ?
                                util.createDataDrid(this.state.columnDefs, null, this.state.rowSelection, this.state.defaultColDef, this.onGridReady) :
                                activeItem === "Archivados" ?
                                    util.createDataDrid(this.state.columnDefs, null, this.state.rowSelection, this.state.defaultColDef, this.onGridReady) :
                                    util.createDataDrid(this.state.columnDefs, this.state.rowData, this.state.rowSelection, this.state.defaultColDef, this.onGridReady)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Ventas;