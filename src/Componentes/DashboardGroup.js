import React, { Component } from "react";

/// controles
import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { AgGridReact, SortableHeaderComponent } from 'ag-grid-react';

/// Variation
import es from "date-fns/locale/es";

/// Componentes
import calls from "../Componentes/Js/calls";
import util from "../Componentes/Js/util";

/// CSS
import "../Componentes/internos/Css/styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/DashboardGroup.css";
import styles from '../Componentes/internos/Dashboard/Purchases/purchases.module.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import PurchasesDataD from '../Componentes/internos/Dashboard/dataDumy/purchases.json'
import bankDataD from '../Componentes/internos/Dashboard/dataDumy/accounts.json';
/// Imágenes

const data = {
    datasets: [{
        data: [1440000, 2000000, 3000000],
        backgroundColor: [
            '#5EFEFF',
            '#9680ED',
            '#232C51',
        ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Dayne Guarimara',
        'Eduardo Alvarez',
        'Alcaldia Municipio Girardot'
    ],

    options: {

    }
};

const arrayData = []

const getData = PurchasesDataD.listPurchases.map((item) => {
    arrayData.push({
        behind: item.behind,
        amount: `${item.currencyCode} ${item.amountDue}`,
    })
})

const dataJson = {
    rowData: arrayData
}

const arrayData2 = [];

const getData2 = PurchasesDataD.listPurchasesParClient.map((item) => {
    arrayData2.push({
        amount: `${item.currencyCode} ${item.amountDue}`,
        contact: item.contactName,
    })
})

const dataJson2 = {
    rowData: arrayData2
}


const columnDefs = {
    columnDefs: [
        {
            headerName: 'Overdue bills', headerClass: styles.Title,
            children: [
                { headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.SubTitle },
                { headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle },
            ]
        },
    ]
}

const columnDefs2 = {
    columnDefs: [
        {
            headerName: 'Main Suppliers', headerClass: styles.Title,
            children: [
                { headerName: "Contact", field: "contact", sortable: true, filter: false, headerClass: styles.SubTitle },
                { headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle },
            ]
        },
    ]
}

class DashboardGroup extends Component {
    columnDefs = {
        columnDefs: [
            {
                headerName: '', headerClass: styles.HeaderGroupStyle,
                children: [
                    { headerName: "Bank Accounts", field: "bank", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                ]
            },
            {
                headerName: 'Bank statements importing', headerClass: styles.HeaderGroupStyle,
                children: [
                    { headerName: "Action", field: "action", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                    { headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                ]
            },
            {
                headerName: 'Bank balance review', headerClass: styles.HeaderGroupStyle,
                children: [
                    { headerName: "Date", field: "date", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                    { headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                    { headerName: "Verified", field: "verified", cellRenderer: 'paramsRenderer', sortable: true, filter: false, headerClass: styles.HeaderStyle },
                ]
            },
            {
                headerName: 'Bank reconciliation', headerClass: styles.HeaderGroupStyle,
                children: [
                    { headerName: "Items", field: "pendingItems", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                    { headerName: "Total Amount", field: "totalAmount", sortable: true, filter: false, headerClass: styles.HeaderStyle },
                    { headerName: "Behind", field: "behindB", sortable: true, filter: false, headerClass: styles.HeaderStyle }
                ]
            },
        ]
    }

    rowData = {
        rowData: [
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' },
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' },
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' },
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' },
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' },
            { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified: 'verified', items: '10', totalAmount: '12301', behindB: '1123' }
        ]
    }

    arrayData2 = [];

    getData2 = bankDataD.accounts.map((item) => {
        this.arrayData2.push({
            bank: item.account_name,
            action: 'Review Importing',
            behind: '+3 months',
            date: 'input date',
            amount: 'amount',
            verified: 'verified',
            pendingItems: item.pending_items,
            totalAmount: item.total_pending_amount,
            behindB: ''
        })
    })

    dataJson2 = {
        rowData: this.arrayData2
    }

    constructor(props) {
        super(props);

        this.state = {
            data: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [
                    {
                        label: 'Rainfall',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: [65, 59, 80, 81, 56]
                    }
                ]
            }
        }
    }

    render() {
        return (
            <div>
                <div className="report-container" >
                    <div class="row">
                        <div class="col-sm-6">
                            <Card ClassName="card-style50">
                                <Card.Body>
                                    <Card.Title>Reconciliación de bancos</Card.Title>
                                    <div className="ag-theme-alpine" style={{ height: '340px', width: '100%', border: 'none' }}>
                                        <AgGridReact
                                            columnDefs={this.columnDefs.columnDefs}
                                            groupHeaderHeight={50}
                                            headerHeight={50}
                                            rowData={this.dataJson2.rowData}
                                            allowDragFromColumnsToolPanel={false}
                                            enableMultiRowDragging={false}
                                            colWidth={135}
                                            frameworkComponents={
                                                this.frameworkComponents
                                            }
                                            defaultColDef={{
                                                sortable: true,
                                                filter: false,
                                                editable: false,
                                                enablePivot: true,
                                                // headerComponentFramework: SortableHeaderComponent,
                                            }}>
                                        </AgGridReact>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col-sm-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Compras</Card.Title>
                                    <div className="ag-theme-alpine" style={{ height: '340px', width: '100%', border: 'none' }}>
                                        <AgGridReact
                                            columnDefs={columnDefs.columnDefs}
                                            groupHeaderHeight={50}
                                            headerHeight={50}
                                            rowData={dataJson.rowData}
                                            allowDragFromColumnsToolPanel={false}
                                            enableMultiRowDragging={false}
                                            colWidth={160}
                                            defaultColDef={{
                                                sortable: true,
                                                filter: false,
                                                headerComponentFramework: SortableHeaderComponent,
                                            }}>
                                        </AgGridReact>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col-sm-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Compras</Card.Title>
                                    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                                        <Doughnut data={data} legend={false} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <Card ClassName="card-style50">
                                <Card.Body>
                                    <Card.Title>Reconciliación de bancos</Card.Title>
                                    <Bar
                                        data={this.state.data}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Average Rainfall per month',
                                                fontSize: 20
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right'
                                            }
                                        }}
                                    />
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col-sm-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Ventas</Card.Title>
                                    <div className="ag-theme-alpine" style={{ height: '340px', width: '100%', border: 'none' }}>
                                        <AgGridReact
                                            columnDefs={columnDefs2.columnDefs}
                                            groupHeaderHeight={50}
                                            headerHeight={50}
                                            rowData={dataJson2.rowData}
                                            allowDragFromColumnsToolPanel={false}
                                            enableMultiRowDragging={false}
                                            colWidth={160}
                                            defaultColDef={{
                                                sortable: true,
                                                filter: false,
                                                headerComponentFramework: SortableHeaderComponent,
                                            }}>
                                        </AgGridReact>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col-sm-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Ventas</Card.Title>
                                    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                                        <Doughnut data={data} legend={false} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
export { DashboardGroup };
