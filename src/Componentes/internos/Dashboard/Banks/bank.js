import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";

import $ from "jquery";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/themes/base/datepicker.css";
import "jquery-ui/ui/core";
import "jquery-ui/ui/widgets/datepicker";

import Cookies from "js-cookie";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import styles from "./banks.module.css";
import ParamsRenderer from "./cellRenderer";
import calls from "../../../Js/calls";
import util from "../../../Js/util";
//import apiSummer from "../api/Account";

// Declaring momenty object
const moment = require("moment"); // require

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
							editable: true,
							cellEditor: Datepicker
						},
						{
							headerName: "Saldo",
							field: "amount",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
							editable: true,
							cellEditor: AmountBalanceReview,
							valueFormatter: currencyFormatter,
						},
						{
							headerName: "",
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
							headerName: "Monto",
							field: "totalAmount",
							headerClass: `dashboardGridColumn ${styles.HeaderStyle}`,
							cellClass: "dashboardGridCell",
							comparator: util.currencyComparator 
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
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12.301,56",
					behindB: "+3 meses",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12.301,56",
					behindB: "+3 meses",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12.301,56",
					behindB: "+3 meses",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "¡Grandioso! Tu banco está está conciliado",
					totalAmount: "12.301,56",
					behindB: "+3 meses",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12.301,56",
					behindB: "+3 meses",
				},
				{
					bank: "Banco Mercantil",
					action: "Review importing",
					behind: "+3 meses",
					emptyColumn: "",
					date: "",
					amount: "",
					verified: "Verificar",
					emptyColumn: "",
					pendingItems: "2",
					totalAmount: "12.301,09",
					behindB: "+3 meses",
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
	componentDidMount  = async () => {
		//Getting data from Xero and building data grid
		calls.getBankAccounts(this.props.orgIdSelected).then((result) => {
			if (result) {
				this.setState({ accounts: result.data });
			}
		});

		//const result = await apiSummer.getAccounts("", Cookies.get("accessToken"),);
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

// ----------------------------------------------------

function currencyFormatter(params) {
	if (params.value) return formatNumber(params.value);
	else return "0";
}

function formatNumber(amount) {
	const numberParts = amount.split(".");
	const formatInteger = parseFloat(numberParts[0]).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "1.") ;
	const displayedNumber = formatInteger.substring(0, formatInteger.length - 3) + "," + numberParts[1]
	return displayedNumber;
}

// ----------------------------------------------------

function AmountBalanceReview() {}
AmountBalanceReview.prototype.init = function (params) {
	let container = document.createElement("div");
	container.className = "inputContainer";
	let inputField = document.createElement("input");
	inputField.type = "number";
	container.appendChild(inputField);

	this.eGui = container;
	this.eInput = this.eGui.querySelector("input");
};

AmountBalanceReview.prototype.getGui = function () {
	return this.eGui;
};

AmountBalanceReview.prototype.destroy = function () {};

AmountBalanceReview.prototype.getValue = function () {
	return this.eInput.value;
};

AmountBalanceReview.prototype.afterGuiAttached = function () {
	this.eInput.focus();
	this.eInput.select();
};

// ----------------------------------------------------

function Datepicker() {}
Datepicker.prototype.init = function (params) {
	this.eInput = document.createElement("input");
	this.eInput.Id = "date_" + params.data.withHoldingId;
	this.eInput.value = params.value;
	this.eInput.classList.add("ag-input");
	this.eInput.style.height = "100%";
	$(this.eInput).datepicker({
		changeYear: true,
		changeMonth: true,
		dateFormat: "dd/mm/yy",
		dayNames: [
			"Domingo",
			"Lunes",
			"Martes",
			"Miércoles",
			"Jueves",
			"Viernes",
			"Sábado",
		],
		dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
		dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
		monthNames: [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		],
		monthNamesShort: [
			"Ene",
			"Feb",
			"Mar",
			"Abr",
			"May",
			"Jun",
			"Jul",
			"Ago",
			"Sep",
			"Oct",
			"Nov",
			"Dic",
		],
	});
};

Datepicker.prototype.getGui = function () {
	return this.eInput;
};

Datepicker.prototype.afterGuiAttached = function () {
	this.eInput.focus();
	this.eInput.select();
};

Datepicker.prototype.getValue = function () {
	return this.eInput.value;
};

Datepicker.prototype.destroy = function () {};

Datepicker.prototype.isPopup = function () {
	return false;
};
