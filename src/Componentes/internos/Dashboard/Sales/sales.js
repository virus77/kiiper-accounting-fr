import React, { Component } from "react";
import styles from "./sales.module.css";
import { Doughnut } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import salesDataD from "../dataDumy/sales.json";

class Sales extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			overdueInvoice: {
				columnDefs: [
					{
						headerName: "Facturas atrasadas",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Atraso",
								field: "behind",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Cantidad",
								field: "amount",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
						],
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
			mainClients: {
				columnDefs: [
					{
						headerName: "Principales clientes",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Cliente",
								field: "contact",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Cantidad",
								field: "amount",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
						],
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
							data: [0.2, 0.3, 0.2, 0.3],
							backgroundColor: ["#44CDDB", "#9680ED", "#232C51", "#86FFF5"],
						},
					],
					labels: ["1 months", "2 months", "3 months", "+3 months"],
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						datalabels: {
							color: "#fff",
							font: {
								family: "'Goldplay',sans-serif",
								weight: "700",
							},
							formatter: function(value) {
								return Math.round(value*100) + '%';
							 },
						},
					},
					legend: {
						display: true,
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
		const overdueInvoiceData = salesDataD.listSalesbyGroup.map((item) => {
			return {
				behind: item.behind,
				amount: `${item.currencyCode} ${item.amountDue}`,
			};
		});

		this.setState((prevState) => ({
			overdueInvoice: {
				...prevState.overdueInvoice,
				rowData: overdueInvoiceData,
			},
		}));

		// ----------------------------------------------------

		// Setting main clients data
		const mainClientsData = salesDataD.listSalesParClient.map((item) => {
			return {
				amount: `${item.currencyCode} ${item.amountDue}`,
				contact: item.contactName,
			};
		});

		this.setState((prevState) => ({
			mainClients: {
				...prevState.mainClients,
				rowData: mainClientsData,
			},
		}));
	}

	// ----------------------------------------------------

	// Component rendering
	render() {
		return (
			<div className={styles.Sales}>
				<div className={styles.Invoices}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.overdueInvoice.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.overdueInvoice.rowData}
								defaultColDef={this.state.overdueInvoice.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>Facturas atrasadas</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
							/>
						</div>
					</div>
				</div>
				<div className={styles.Customers}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.mainClients.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.mainClients.rowData}
								defaultColDef={this.state.mainClients.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>
							Principales clientes a pagar
						</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
								width={200}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Sales;
