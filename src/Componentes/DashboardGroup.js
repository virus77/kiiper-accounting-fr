import React, { Component } from "react";

/// controles
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";

/// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/DashboardGroup.css";
import "../Componentes/internos/Dashboard/dashboard.css";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import Purchases from "../Componentes/internos/Dashboard/Purchases/purchases.js";
import Sales from "../Componentes/internos/Dashboard/Sales/sales.js";
import banksDataD from "../Componentes/internos/Dashboard/dataDumy/accounts.json";

class DashboardGroup extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			banks: {
				columnDefs: [
					{
						headerName: "Cuenta bancaria",
						field: "account",
						headerClass: "dashboardGridColumn",
						cellClass: "dashboardGroupGridCellBank",
					},
					{
						headerName: "Registros",
						field: "pendingItems",
						headerClass: "dashboardGridColumn",
						cellClass: "dashboardGroupGridCellBank",
					},
					{
						headerName: "Monto",
						field: "amount",
						headerClass: "dashboardGridColumn",
						cellClass: "dashboardGroupGridCellBank",
					},
					{
						headerName: "Antigüedad",
						field: "behind",
						headerClass: "dashboardGridColumn",
						cellClass: "dashboardGroupGridCellBank",
					},
				],
				rowData: [],
				defaultColDef: {
					flex: 1,
					resizable: false,
					filterable: false,
					sortable: true,
				},
			},
			charts: {
				plugins: [ChartDataLabels],
				data: {
					datasets: [
						{
							data: [65, 59, 80, 81, 56],
							backgroundColor: [
								"#44CDDB",
								"#9680ED",
								"#232C51",
								"#86FFF5",
								"#864aF5",
							],
						},
					],
					labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
				},
				options: {
					maintainAspectRatio: true,
					plugins: {
						datalabels: {
							color: "#fff",
							font: {
								family: "'Goldplay',sans-serif",
								weight: "700",
							},
							/*formatter: function (value) {
								return Math.round(value * 100) + "%";
							},*/
						},
					},
					legend: {
						display: false,
						labels: {
							fontColor: "#232C51",
							fontFamily: "'Muli',sans-serif",
							boxWidth: 10,
							fontSize: 10,
						},
						position: "bottom",
						align: "start",
					},
				},
			},
		};
	}

	// ----------------------------------------------------
	/* Component events */

	// Component Did Mount event
	componentDidMount() {
		// Setting overdue invoice data
		const banksData = banksDataD.accounts.map((item) => {
			return {
				account: item.account_name,
				pendingItems: "3",
				amount: `${item.currency_code} ${item.total_pending_amount}`,
				behind: "+3 items",
			};
		});

		this.setState((prevState) => ({
			banks: {
				...prevState.banks,
				rowData: banksData,
			},
		}));
	}

	render() {
		return (
			<div className="report-container" style={{ display: "flex", padding:0 }}>
				<div style={{ width: "50%" }}>
					<div style={{ height: "100%" }}>
						<Card style={{borderStyle:"none", height: "100%"}}>
							<Card.Body>
								<Card.Title>Conciliación bancaria</Card.Title>
								<div
									className="ag-theme-alpine"
									style={{ height: "280px" }}
								>
									<AgGridReact
										columnDefs={this.state.banks.columnDefs}
										groupHeaderHeight={50}
										headerHeight={50}
										rowData={this.state.banks.rowData}
										defaultColDef={this.state.banks.defaultColDef}
									></AgGridReact>
								</div>
							</Card.Body>
							<Card.Body style={{ paddingBottom: 0 }}>
								<Bar
									data={this.state.charts.data}
									options={this.state.charts.options}
								/>
							</Card.Body>
						</Card>
					</div>
				</div>
				<div style={{ width: "50%" }}>
					<div>
						<Card style={{borderStyle:"none"}}>
							<Card.Body>
								<Card.Title>Ventas</Card.Title>
								<Sales dashboardType="group" dashboardtableHeight="280px" />
							</Card.Body>
						</Card>
					</div>
					<div>
						<Card style={{borderStyle:"none"}}>
							<Card.Body>
								<Card.Title>Compras</Card.Title>
								<Purchases dashboardType="group" dashboardtableHeight="280px" />
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		);
	}
}
export { DashboardGroup };
