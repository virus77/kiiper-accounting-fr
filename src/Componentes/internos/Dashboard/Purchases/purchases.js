import React, { Component } from "react";
import styles from "./purchases.module.css";
import { Doughnut } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import PurchasesDataD from "../dataDumy/purchases.json";

class Purchases extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			overdueBill: {
				columnDefs: [
					{
						headerName: "Cuentas atrasadas",
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
			mainProviders: {
				columnDefs: [
					{
						headerName: "Principales proveedores",
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
							data: [1440000, 2000000, 3000000],
							backgroundColor: ["#5EFEFF", "#9680ED", "#232C51"],
						},
					],
					labels: ["Dayne Guarimara", "Eduardo Alvarez", "Alcaldia Municipio"],
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						datalabels: {
							color: "#8596CA",
							font: {
								family: "'Goldplay',sans-serif",
								weight: "700",
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
		// Setting overdue bill data
		const overdueBillData = PurchasesDataD.listPurchases.map((item) => {
			return {
				behind: item.behind,
				amount: `${item.currencyCode} ${item.amountDue}`,
			};
		});

		this.setState((prevState) => ({
			overdueBill: {
				...prevState.overdueBill,
				rowData: overdueBillData,
			},
		}));

		// ----------------------------------------------------

		// Setting main providers data
		const mainProvidersData = PurchasesDataD.listPurchasesParClient.map((item) => {
			return {
				amount: `${item.currencyCode} ${item.amountDue}`,
				contact: item.contactName,
			};
		});

		this.setState((prevState) => ({
			mainProviders: {
				...prevState.mainProviders,
				rowData: mainProvidersData,
			},
		}));
	}

	// ----------------------------------------------------

	// Component rendering
	render() {
		return (
			<div className={styles.Sales}>
				<div className={styles.Bills}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.overdueBill.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.overdueBill.rowData}
								defaultColDef={this.state.overdueBill.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>Cuentas atrasadas</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
							/>
						</div>
					</div>
				</div>
				<div className={styles.Providers}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.mainProviders.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.mainProviders.rowData}
								defaultColDef={this.state.mainProviders.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>
							Principales proveedores a pagar
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

export default Purchases;
