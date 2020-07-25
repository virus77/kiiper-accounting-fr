import React, {Component} from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import styles from "./banks.module.css";
import ParamsRenderer from "./cellRenderer";
import calls from "../../../Js/calls";

class Bank extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);

		// Component state
		this.state = {
			accounts: [],
			columnDefs: [
				{
					headerName: "",
					headerClass: `dashboardGridColumnGroup dashboardGridFirstColum ${styles.HeaderGroupStyle}`,
					children: [
						{
							headerName: "Cuentas bancarias",
							field: "bank",
							headerClass: `dashboardGridColumn dashboardGridFirstColum ${styles.HeaderStyle}`,
							minWidth: 220,
							cellClass: "dashboardGridCell",
						},
					],
				},
				{
					headerName: "Importaciones Edo. cuenta",
					headerClass: `dashboardGridColumnGroup ${styles.HeaderGroupStyle}`,
					children: [
						{
							headerName: "Acción",
							field: "action",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
						{
							headerName: "Antigüedad",
							field: "behind",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
					],
				},
				{
					headerName: "N/A",
					headerClass: `dashboardGridEmptyColumnGroup`,
					children: [
						{
							headerName: "",
							field: "emptyColumn",
							headerClass: "dashboardGridEmptyColumn",
							cellClass: "dashboardGridEmptyCell",
							minWidth: 10,
							width: 10,
						},
					],
				},
				{
					headerName: "Revisión de balance",
					headerClass: `dashboardGridColumnGroup ${styles.HeaderGroupStyle}`,
					children: [
						{
							headerName: "Fecha",
							field: "date",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
						{
							headerName: "Cantidad",
							field: "amount",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
						{
							headerName: "Verificar",
							field: "verify",
							cellRenderer: "paramsRenderer",
							sortable: false,
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
					],
				},
				{
					headerName: "N/A",
					headerClass: `dashboardGridEmptyColumnGroup`,
					children: [
						{
							headerName: "",
							field: "emptyColumn",
							headerClass: "dashboardGridEmptyColumn",
							cellClass: "dashboardGridEmptyCell",
							minWidth: 10,
							width: 10,
						},
					],
				},
				{
					headerName: "Conciliación bancaria",
					headerClass: `dashboardGridColumnGroup ${styles.HeaderGroupStyle}`,
					children: [
						{
							headerName: "Registros",
							field: "pendingItems",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
							colSpan: function (params) {
								return params.data.pendingItems.indexOf("Grandioso") >= 0
									? 3
									: 1;
							},
						},
						{
							headerName: "Cantidad total",
							field: "totalAmount",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
						{
							headerName: "Antigüedad",
							field: "behindB",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
						},
					],
				},
			],
			rowData: [
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12301",
					behindB: "+3 months",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12301",
					behindB: "+3 months",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12301",
					behindB: "+3 months",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "¡Grandioso! Tu banco está está conciliado",
					totalAmount: "12301",
					behindB: "+3 months",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12301",
					behindB: "+3 months",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 months",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12301",
					behindB: "+3 months",
				},
			],
			defaultColDef: {
				width: 120,
				resizable: false,
				filterable: false,
				sortable: true,
			},
		};
	}

	// ----------------------------------------------------
	/* Component events */

	// Component Did Mount event
	componentDidMount() {
		//Getting data from Xero and building data grid
		calls.getBankAccounts(this.props.orgIdSelected).then((result) => {
			if (result) {
				this.setState({ accounts: result.data });
			}
		});
	}

	// To cutom render Veirify column
	frameworkComponents = {
		paramsRenderer: ParamsRenderer,
	};

	// ----------------------------------------------------

	// Component rendering
	render() {
		return (
			<div className="ag-theme-alpine dashboardModule">
				<AgGridReact
					rowClass="dashboardGridRow"
					columnDefs={this.state.columnDefs}
					groupHeaderHeight={50}
					frameworkComponents={this.frameworkComponents}
					headerHeight={50}
					rowData={this.state.rowData}
					defaultColDef={this.state.defaultColDef}
				></AgGridReact>
			</div>
		);
	}
}

export default Bank;
