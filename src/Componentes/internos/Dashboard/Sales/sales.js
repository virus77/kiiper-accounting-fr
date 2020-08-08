import React, { Component } from "react";
import styles from "./sales.module.css";
import { Doughnut } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import salesDataD from "../dataDumy/sales.json";

// Total amount of clients table
let totalAmountClients = 0;

class Sales extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			overdueInvoice: {
				columnDefs: [
					{
						headerName: "Cuentas por cobrar",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Antigüedad",
								field: "behind",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Monto",
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
						headerName: "Clientes principales",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Cliente",
								field: "contact",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Monto",
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
				data: {},
				options: {
					maintainAspectRatio: false,
					plugins: {
						datalabels: {
							color: "#fff",
							font: {
								family: "'Goldplay',sans-serif",
								weight: "700",
							},
							formatter: function (value) {
								const partPercentage = parseFloat(
									(value * 100) / totalAmountClients
								).toFixed(2);
								return `${partPercentage}%`;
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
		fetch(`/getClientsOwingYou?id_organisation=${this.props.orgIdSelected}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// Getting total amount from all clients
				totalAmountClients = data.reduce((total, client) => {
					return total + client.AmountDue;
				}, 0);

				// Setting values for clients chart
				const clientsChartData = data.map((client) => {
					return client.AmountDue;
				});

				// Setting labels for clients chart
				const clientsChartLabels = data.map((client) => {
					return client.ContactName.substring(0, 10) + "..";
				});

				const mainClientsData = data.map((item) => {
					return {
						amount: item.AmountDue,
						contact: item.ContactName,
					};
				});

				this.setState((prevState) => ({
					mainClients: {
						...prevState.mainClients,
						rowData: mainClientsData,
					},
					charts: {
						...prevState.charts,
						data: {
							datasets: [
								{
									data: clientsChartData,
									backgroundColor: [
										"#44CDDB",
										"#9680ED",
										"#232C51",
										"#86FFF5",
										"#8596CA",
									],
								},
							],
							labels: clientsChartLabels,
						},
					},
				}));
			});
	}

	// ----------------------------------------------------

	// Component rendering
	render() {
		return (
			<div className={styles.Sales}>
				<div className={styles.Invoices}>
					<div className={styles.SalesTable}>
						<div
							className="ag-theme-alpine dashboardBusiness"
							style={{ height: this.props.dashboardtableHeight }}
						>
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
						<div className={styles.ChartTitle}>Antigüedad</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
							/>
						</div>
					</div>
				</div>
				{this.props.dashboardType !== "group" ? (
					<div className={styles.Customers}>
						<div className={styles.SalesTable}>
							<div
								className="ag-theme-alpine dashboardBusiness"
								style={{ height: this.props.dashboardtableHeight }}
							>
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
								Clientes principales (por definir)
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
				) : null}
			</div>
		);
	}
}

export default Sales;
