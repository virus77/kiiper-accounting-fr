import React, { Component } from "react";


//Utilerias
import calls from "../../Js/calls";
import util from "../../Js/util";

//Componentes
import { AgGridReact } from "ag-grid-react";
import { CSVLink } from "react-csv";
import InputFile from "./InputFile";

//CSS
import "../Css/styles.scss";

//Imágenes
import Busqueda from "../../../Imagenes/searchBankRecords.svg";

class FileTransformationInformation extends Component {
	constructor(props) {
		super(props);
		this.csvLink = React.createRef();

		this.state = {
			selectedFile: null,
			columnDefs: [],
			rowData: [],
			defaultColDef: { width: 250 },
			existFileTransformation: false,
			transformedFile: [],
			formatPartial: "",
			formatMonth: "",
		};
	}

	onDownloadFile(id_conversion) {
		calls.getBankStatements(id_conversion).then((result) => {
			console.log("onDownloadFile data", result.data);

			let _newRowData = result.data.map(function (e) {
				let d = new Date(e.date);
				let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
				let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
				let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

				e["*Date"] = `${da}-${mo}-${ye}`;
				delete e.date;

				e["*Amount"] = e.amount;
				delete e.amount;

				e["Description"] = e.description;
				delete e.description;

				e["Reference"] = e.reference;
				delete e.reference;

				e["Payee"] = "";
				e["Check Number"] = "";

				return e;
			});

			this.setState({ transformedFile: result.data }, () => {
				// click the CSVLink component to trigger the CSV download

				setTimeout(
					function () {
						this.csvLink.current.link.click();
					}.bind(this),
					0
				);
			});
		});
	}

	onRowSelected(rowIndex, _rowData) {
		if (rowIndex !== null) {
			if (_rowData["lastTransactionDate"] !== "Sin transacciones")
				this.onDownloadFile(_rowData["id_conversion"]);
		}
	}

	componentDidMount() {
		//Getting data from Xero and building data grid
		var _columnDefs = [
			{
				headerName: "Fecha",
				field: "date",
				cellStyle: { textAlign: "center" },
				width: 200,
				comparator: util.dateComparator,
			},
			{
				headerName: "Última transacción",
				field: "lastTransactionDate",
				cellStyle: { textAlign: "center" },
				width: 200,
				comparator: util.dateComparator,
			},
			{
				headerName: "Descargar",
				field: "download",
				cellStyle: { textAlign: "center" },
				width: 200,
				cellRenderer: util.CellRendererBanks
			},
		];
		var _rowData;
		this.setState({
			formatPartial: util.bankType(this.props.bankData[0].name)[0]
				.formatPartial,
			formatMonth: util.bankType(this.props.bankData[0].name)[0].formatMonth,
		});
		calls
			.getConversions(
				this.props.orgIdSelected,
				this.props.bankData[0].id_bank_xero
			)
			.then((result) => {
				_rowData = result.data;
				let _newRowData = _rowData.map(function (e) {
					if (e.lastTransactionDate === "Sin transacciones") {
						e["download"] = false;
					} else {
						e["download"] = true;
					}
					return e;
				});

				console.log("getConversions List", result.data);

				this.setState({
					rowData: _newRowData,
					columnDefs: _columnDefs,
				});
			});
	}

	onChangeHandler = (event) => {
		this.setState({
			selectedFile: event.target.files[0],
		});
	};

	onClickHandler = () => {
		var data = new FormData();
		data.append("file", this.state.selectedFile);
		data.append("id_bank_xero", this.props.bankData[0].id_bank_xero);
		data.append("organisationId", this.props.orgIdSelected);

		let _bank = util.bankType(this.props.bankData[0].name);

		calls.convertBankStatement(_bank[0]["url"], data).then((result) => {
			console.log("onClickHandler data", result);

			this.setState({
				existFileTransformation: true,
			});
		});
	};

	render() {
		return (
			<div id="conversionSubPanel">
				{this.props.showConversionView ? (
					[
						/** Conversion panel for transactions */
						<div className="container-transformation">
							<img
								className="searchBankRecords"
								alt="search"
								src={Busqueda}
								onClick={() =>
									this.props.showConversionViewPanel(
										this.props.bankData[0].name
									)
								}
							/>
							<div className="transformationInstructions">
								<h3>Convertir movimientos bancarios (parcial)</h3>
								<div>Siga estas instrucciones para transformar el archivo:</div>

								<ul className="descriptionUnorderedList">
									<li>
										Diríjase a la<strong>&nbsp;página web del banco</strong>
									</li>
									<li>
										Descargue los movimientos bancarios desde el primer día del
										mes que desee convertir en
										<strong>&nbsp;formato {this.state.formatPartial}</strong>
									</li>
									<li>
										Adjunte el formato de movimientos bancarios en
										<strong>
											&nbsp;Examinar / Seleccionar Archivo / Browse / Choose
											File
										</strong>
									</li>
									<li>
										Presione el botón<strong>&nbsp;Convertir</strong>
									</li>
								</ul>
							</div>
							<div className="container-button-load">
								{/* Component InpuFile para cambiar el estilo default del control input de tipo file */}
								<InputFile
									id="fileStatement"
									onClick={(event) => this.onChangeHandler(event)}
								/>
								<button
									type="button"
									className="button-pill-blue"
									onClick={this.onClickHandler}
								>
									<div className="text"> Convertir </div>
								</button>
							</div>
							{this.state.existFileTransformation ? (
								<div className="file-path">
									{" "}
									El archivo ha sido transformado exitosamente
								</div>
							) : null}
							<CSVLink
								data={this.state.transformedFile}
								filename={`${this.props.bankData[0].name}-transformado.csv`}
								ref={this.csvLink}
								className="hidden"
							></CSVLink>
						</div>,

						/** Conversion panel for bank statements */
						<div className="container-transformation">
							<img
								className="searchBankRecords"
								alt="search"
								src={Busqueda}
								onClick={() =>
									this.props.showConversionViewPanel(
										this.props.bankData[0].name
									)
								}
							/>
							<div className="transformationInstructions">
								<h3>Convertir estados de cuenta (mensual)</h3>
								<div>Siga estas instrucciones para transformar el archivo:</div>

								<ul className="descriptionUnorderedList">
									<li>
										Diríjase a la<strong>&nbsp;página web del banco</strong>
									</li>
									<li>
										Descargue el estado de cuenta del mes que desee convertir en
										<strong>&nbsp;formato {this.state.formatMonth}</strong>
									</li>
									<li>
										Adjunte el estado de cuenta en
										<strong>
											&nbsp;Examinar / Seleccionar Archivo / Browse / Choose
											File
										</strong>
									</li>
									<li>
										Presione el botón<strong>&nbsp;Convertir</strong>
									</li>
								</ul>
							</div>
							<div className="container-button-load">
								{/* Component InpuFile para cambiar el estilo default del control input de tipo file */}
								<InputFile id="fileBank" onChange={this.onChangeHandler} />
								<button
									type="button"
									className="button-pill-blue"
									onClick={this.onClickHandler}
								>
									<div className="text"> Convertir </div>
								</button>
							</div>
							{this.state.existFileTransformation ? (
								<div className="file-path">
									{" "}
									El archivo ha sido transformado exitosamente
								</div>
							) : null}
							<CSVLink
								data={this.state.transformedFile}
								filename={`${this.props.bankData[0].name}-transformado.csv`}
								ref={this.csvLink}
								className="hidden"
							></CSVLink>
						</div>,
					]
				) : (
						<div
							id="banksTransacctionsGrid"
							className="container-transformation ag-theme-alpine"
							style={{
								minHeight: "calc(100vh - 217px)",
								padding: 0,
								borderStyle: "none",
								width: "100%",
							}}
						>
							<AgGridReact
								columnDefs={this.state.columnDefs}
								rowData={this.state.rowData}
								onCellFocused={(e) => {
									this.onRowSelected(e.rowIndex, this.state.rowData[e.rowIndex]);
								}}
								defaultColDef={{
									flex: 1,
								}}
							></AgGridReact>
							<CSVLink
								data={this.state.transformedFile}
								filename={`${this.props.bankData[0].name}-transformado.csv`}
								ref={this.csvLink}
								className="hidden"
							></CSVLink>
						</div>
					)}
			</div>
		);
	}
}

export default FileTransformationInformation;
