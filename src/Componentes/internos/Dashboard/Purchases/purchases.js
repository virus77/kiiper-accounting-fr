import React, { Component } from "react";
import styles from "./purchases.module.css";
import { Doughnut } from "react-chartjs-2";
import { AgGridReact } from "ag-grid-react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import util from "../../../Js/util.js";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import PurchasesDataD from "../dataDumy/purchases.json";

// Total amount of providers table
let totalAmountProviders = 0;

class Purchases extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			overdueBill: {
				columnDefs: [
					{
						headerName: "Cuentas por pagar",
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
								comparator: util.currencyComparator 
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
								headerName: "Monto",
								field: "amount",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
								comparator: util.currencyComparator 
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
									(value * 100) / totalAmountProviders
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
		fetch(`/getSuppliersYouOwe?id_organisation=${this.props.orgIdSelected}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// Getting total amount from all providers
				totalAmountProviders = data.reduce((total, provider) => {
					return total + provider.AmountDue;
				}, 0);

				// Setting values for providers chart
				const providersChartData = data.map((provider) => {
					return provider.AmountDue;
				});

				// Setting labels for providers chart
				const providersChartLabels = data.map((provider) => {
					return provider.ContactName.substring(0,10) + "..";
				});

				// Setting values for providers table
				const mainProvidersData = data.map((provider) => {
					return {
						amount: util.formatMoney(provider.AmountDue),
						contact: provider.ContactName,
					};
				});

				this.setState((prevState) => ({
					mainProviders: {
						...prevState.mainProviders,
						rowData: mainProvidersData,
					},
					charts: {
						...prevState.charts,
						data: {
							datasets: [
								{
									data: providersChartData,
									backgroundColor: [
										"#44CDDB",
										"#9680ED",
										"#232C51",
										"#86FFF5",
										"#8596CA",
									],
								},
							],
							labels: providersChartLabels,
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
				<div className={styles.Bills}>
					<div className={styles.SalesTable}>
						<div
							className="ag-theme-alpine dashboardBusiness"
							style={{ height: this.props.dashboardtableHeight }}
						>
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
					<div className={styles.Providers}>
						<div className={styles.SalesTable}>
							<div
								className="ag-theme-alpine dashboardBusiness"
								style={{ height: this.props.dashboardtableHeight }}
							>
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
				) : null}
			</div>
		);
	}
}

export default Purchases;
