import React, { Component } from "react";

/// controles
import { Button, Card, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { AgGridReact } from "ag-grid-react";

// Variation
import es from "date-fns/locale/es";

/// Componentes
import calls from "../../Js/calls";
import util from "../../Js/util";

/// CSS
import "../Css/styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/books.css";

/// Imágenes
import periodSelection from "../Css/periodSelection.svg";
import downArrow from "../../../Imagenes/downArrow.png";
import downloadFile from '../../../Imagenes/downloadDocument.svg';

registerLocale("es", es);
var moment = require("moment"); /// require

class ReportNode extends Component {
	constructor(props) {
		super(props);

		var optionList = [
			{ id: 0, text: "Seleccionar..." },
			{ id: 1, text: "Mes Actual" },
			{ id: 2, text: "Mes Anterior" },
			{ id: 3, text: "Personalizado" },
		];

		this.state = {
			optionList,
			startDateLibroCompras: new Date(),
			finishDateLibroCompras: new Date(),
			showDateLibroCompras: false,
			optionSelectedLibroCompras: 0,
			msgLibroCompras: "",
			startDateLibroVentas: new Date(),
			finishDateLibroVentas: new Date(),
			showDateLibroVentas: false,
			optionSelectedLibroVentas: 0,
			msgLibroVentas: "",
			startDateRetencionesIVA: new Date(),
			finishDateRetencionesIVA: new Date(),
			showDateRetencionesIVA: false,
			optionSelectedRetencionesIVA: 0,
			msgRetencionesIVA: "",
			startDateRetencionesISLR: new Date(),
			finishDateRetencionesISLR: new Date(),
			showDateRetencionesISLR: false,
			optionSelectedRetencionesISLR: 0,
			msgRetencionesISLR: "",
			taxbookIdVentas: "",
			taxbookIdCompras: "",
			IdStatementIVA: "",
			IdStatementISLR: "",
			open: false,
			setOpen: false,
			tipo: "",
			dueDate: new Date(),
			errorMsg: "",
			arrowUpClass: "",
			rowData: [
				{ period: "Semana1", topDate: "10/10/2020", file: 35000 },
				{ period: "Semana2", topDate: "10/10/2020", file: 32000 },
				{ period: "Semana3", topDate: "10/10/2020", file: 72000 },
			],
			columnDefs: [
				{
					headerName: "Período",
					field: "period",
					flex: 1,
					cellClass: "grid-cell-centered"
				},
				{
					headerName: "Fecha límite",
					field: "topDate",
					flex: 1,
					cellClass: "grid-cell-centered"
				},
				{
					headerName: "Archivo",
					field: "file",
					flex: 1,
					cellClass: "grid-cell-centered",
					cellRenderer: this.fileColumnRenderer
				},
			],
		};

		this.handleClickLibroCompras = this.handleClickLibroCompras.bind(this);
		this.handleClickLibroVentas = this.handleClickLibroVentas.bind(this);
	}

	componentDidMount() {}

	/* Funciones Comunes */

	/* Funciones Libro de Compras */

	handleChangeStartDateLibroCompras = (date) => {
		let startDate = moment(date).format("DD/MM/YYYY");
		let endDate = moment(
			document.getElementById("dtpkHastaCompras").value
		).format("DD/MM/YYYY");
		if (util.compareDates(startDate, endDate) === 1) {
			this.setState({
				msgLibroCompras: "Fecha desde, no puede ser mayor a fecha hasta",
				errorMsg: "error-msg",
			});
		} else {
			this.setState({
				startDateLibroCompras: date,
				msgLibroCompras: "",
				errorMsg: "",
			});
		}
	};

	handleChangeFinishDateLibroCompras = (date) => {
		let endDate = moment(date).format("DD/MM/YYYY");
		let StartDate = moment(
			document.getElementById("dtpkDesdeCompras").value
		).format("DD/MM/YYYY");
		if (util.compareDates(endDate, StartDate) === -1) {
			this.setState({
				msgLibroCompras: "Fecha hasta, no puede ser menor a fecha desde",
				errorMsg: "error-msg",
			});
		} else {
			this.setState({
				finishDateLibroCompras: date,
				msgLibroCompras: "",
				errorMsg: "",
			});
		}
	};

	handleClickLibroCompras = (e) => {
		console.log("handleClick LibroCompra", e.target.value);
		if (e.target.value === "3") {
			this.setState({
				showDateLibroCompras: true,
				optionSelectedLibroCompras: e.id,
			});
		} else {
			this.setState({
				showDateLibroCompras: false,
				optionSelectedLibroCompras: e.id,
			});
		}
	};

	/// Funcion utilizada para obtener el periodo y enviar los parámetros
	/// solicitados por medio de post para generar el guardado en Xero
	onGetPeriodLibroCompras = async () => {
		let x = moment(this.state.startDateLibroCompras);
		let y = moment(this.state.finishDateLibroCompras);

		if (x.isBefore(y)) {
			this.setState({
				msgLibroCompras: "",
				errorMsg: "",
			});

			let taxbookId = await calls.getBook(
				this.props.orgIdSelected,
				this.state.optionSelectedLibroCompras,
				y.format("DD/MM/YYYY"),
				x.format("DD/MM/YYYY"),
				"/purchasesBook"
			);

			if (taxbookId.data === false)
				console.log("Ocurrió un problema al momento de guardar en Xero");
			else {
				this.setState({ taxbookIdCompras: taxbookId.data });
				alert("El preriodo se guardo correctamente en Xero");
			}
		} else {
			this.setState({
				msgLibroCompras: "Las fechas son inválidas",
				errorMsg: "error-msg",
			});
		}
	};

	/* Funciones Libro de Ventas */

	handleChangeStartDateLibroVentas = (date) => {
		let startDate = moment(date).format("DD/MM/YYYY");
		let endDate = moment(
			document.getElementById("dtpkHastaVentas").value
		).format("DD/MM/YYYY");
		if (util.compareDates(startDate, endDate) === 1) {
			this.setState({
				msgLibroVentas: "Fecha desde, no puede ser mayor a fecha hasta",
			});
		} else {
			this.setState({ startDateLibroVentas: date, msgLibroVentas: "" });
		}
	};

	handleChangeFinishDateLibroVentas = (date) => {
		let endDate = moment(date).format("DD/MM/YYYY");
		let StartDate = moment(
			document.getElementById("dtpkDesdeVentas").value
		).format("DD/MM/YYYY");
		if (util.compareDates(endDate, StartDate) === -1) {
			this.setState({
				msgLibroVentas: "Fecha hasta, no puede ser menor a fecha desde",
			});
		} else {
			this.setState({ finishDateLibroVentas: date, msgLibroVentas: "" });
		}
	};

	handleClickLibroVentas = (e) => {
		console.log("handleClick LibroVentas", e);
		if (e.target.value === "3") {
			this.setState({
				showDateLibroVentas: true,
				optionSelectedLibroVentas: e.id,
			});
		} else {
			this.setState({
				showDateLibroVentas: false,
				optionSelectedLibroVentas: e.id,
			});
		}
	};

	/// Funcion utilizada para obtener el periodo y enviar los parámetros
	/// solicitados por medio de post para generar el guardado en Xero
	onGetPeriodLibroVentas = async () => {
		let x = moment(this.state.startDateLibroVentas);
		let y = moment(this.state.finishDateLibroVentas);

		if (x.isBefore(y)) {
			this.setState({
				msgLibroVentas: "",
			});

			let taxbookId = await calls.getBook(
				this.props.orgIdSelected,
				this.state.optionSelectedLibroVentas,
				y.format("DD/MM/YYYY"),
				x.format("DD/MM/YYYY"),
				"/purchasesBook"
			);

			if (taxbookId.data === false)
				console.log("Ocurrió un problema al momento de guardar en Xero");
			else {
				this.setState({ taxbookIdVenntas: taxbookId.data });
				alert("El preriodo se guardo correctamente en Xero");
			}
		} else {
			this.setState({
				msgLibroVentas: "Las fechas son inválidas",
			});
		}
	};

	/// Funcion utilizada para generar el excel obteniendo desde
	/// un get en base64 el archivo generado
	/// @param {text} origen - Texto para identificar de donde proviene el llamado
	onDownloadExcel = async (origen) => {
		let resp = "";
		switch (origen) {
			case "Ventas":
				//await calls.getDocumentByTaxbookId(this.state.taxbookIdVentas, "/generateSalesBook");
				resp = await calls.getDocumentByTaxbookId(
					"5ee552b80446db0b64bf49f9",
					"/generateSalesBook"
				);
				break;

			case "Compras":
				//await calls.getDocumentByTaxbookId(this.state.taxbookIdCompras, "/generatePurchasesBook");
				resp = await calls.getDocumentByTaxbookId(
					"5ee552b80446db0b64bf49f9",
					"/generatePurchasesBook"
				);
				break;

			case "IVA":
				//await calls.getDocumentByIdStatement(this.state.IdStatementIVA, "/downloadAuxiliarTaxReport");
				resp = await calls.getDocumentByIdStatement(
					"5ee552b80446db0b64bf49f9",
					"/downloadAuxiliarTaxReport"
				);
				break;

			case "ISLR":
				//await calls.getDocumentByIdStatement(this.state.IdStatementISLR, "/downloadAuxiliarTaxReport");
				resp = await calls.getDocumentByIdStatement(
					"5ee552b80446db0b64bf49f9",
					"/downloadAuxiliarTaxReport"
				);
				break;

			default:
				break;
		}

		if (resp === false) console.log("No se logro descargar el excel");
	};

	// función asignada para cerrar el modal
	handleClose = () => {
		this.setState({ setOpen: false });
	};

	// función asignada para obtener el duedate
	handleChangeDueDate = (date) => {
		this.setState({ dueDate: date });
	};

	// Ayuda a mostrar el contenido del nodo del acordeón elegido
	showAccordionContent = (event) => {
		const accordionContent = event.currentTarget.nextElementSibling;
		const accordionContentStyle = window.getComputedStyle(accordionContent);

		if (accordionContentStyle.display === "none") {
			accordionContent.style.display = "flex";
			this.setState({ arrowUpClass: "arrowUp" });
		} else {
			accordionContent.style.display = "none";
			this.setState({ arrowUpClass: "" });
		}
	};

	// Ayuda a determinar la manera default en que se presenta la columna Archivo
	fileColumnRenderer = () => {
		let fileIcon = document.createElement("img");
		fileIcon.src = downloadFile;
		fileIcon.className = "fileColumnIcon";
		fileIcon.title = "Descargar reporte";
		fileIcon.addEventListener("click", ()=>{
			// Accion al dar click
		});

		return fileIcon;
	};

	render() {
		const {
			state: { arrowUpClass, columnDefs, rowData, defaultColDef },
			props: { reportId },
		} = this;

		return (
			<div id={reportId} className="accordionNode">
				<span className={`acoordionOptionArrow ${arrowUpClass}`}>
					<img alt="abajo" src={downArrow} />
				</span>
				<h3
					onClick={(event) => this.showAccordionContent(event)}
					className="report-title"
				>
					Libros Fiscales
				</h3>
				<div className="flex-container accordionContent">
					<Card className="card-container">
						<Card.Body>
							<span
								className="periodSelectionGenerator"
								onClick={(event) => this.onDownloadExcel("Compras")}
							>
								<img border="0" src={periodSelection} />
							</span>
							<Card.Title>Libro de Compras</Card.Title>
							<hr className="separator" />
							<div id="myGridCompras" className="aggridReport ag-theme-alpine">
								<AgGridReact
									columnDefs={columnDefs}
									rowData={rowData}
								></AgGridReact>
							</div>
						</Card.Body>
					</Card>
					<Card className="card-container">
						<Card.Body>
							<span
								className="periodSelectionGenerator"
								onClick={(event) => this.onDownloadExcel("Ventas")}
							>
								<img border="0" src={periodSelection} />
							</span>
							<Card.Title>Libros de Ventas</Card.Title>
							<hr className="separator" />
							<div id="myGridVentas" className="aggridReport ag-theme-alpine">
								<AgGridReact
									columnDefs={columnDefs}
									rowData={rowData}
								></AgGridReact>
							</div>
							{/*<Card.Text>
								<div className="date-container" style={{ marginRight: 30 }}>
									<div className="fieldLabel">Período:</div>
									<Form>
										<Form.Group>
											<Form.Control
												as="select"
												className="ddlPeriodo"
												value={this.state.optionSelectedLibroVentas}
												onChange={this.handleClickLibroVentas}
											>
												<option value="0">Seleccionar...</option>
												<option value="1">Mes actual</option>
												<option value="2">Mes anterior</option>
												<option value="3">Personalizado</option>
											</Form.Control>
										</Form.Group>
									</Form>
								</div>
								{this.state.showDateLibroVentas ? (
									<div className="date-container">
										<div className="inline-date" style={{ marginLeft: 0 }}>
											<div className="time-interval fieldLabel">Desde:</div>
											<DatePicker
												id="dtpkDesdeVentas"
												className={"calendar"}
												selected={this.state.startDateLibroVentas}
												onChange={this.handleChangeStartDateLibroVentas}
												locale="es"
												showMonthDropdown
												showYearDropdown
											/>
										</div>
										<div className="inline-date">
											<div className="time-interval fieldLabel">Hasta:</div>
											<DatePicker
												id="dtpkHastaVentas"
												className={"calendar"}
												selected={this.state.finishDateLibroVentas}
												onChange={this.handleChangeFinishDateLibroVentas}
												locale="es"
												showMonthDropdown
												showYearDropdown
											/>
										</div>
									</div>
								) : null}
							</Card.Text>

							<div className="action-container">
								<div className="inline-date">
									<Button
										className="xeroGenerate"
										onClick={() => {
											this.onGetPeriodLibroVentas();
										}}
									>
										Generar
									</Button>
								</div>
							</div>*/}
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class Reports extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reports: ["fiscalBook", "legalBook", "declarationBook"],
		};
	}

	render() {
		const {
			state: { reports },
		} = this;

		return (
			<div>
				<div className="report-container">
					{reports.map((reportId, index) => (
						<ReportNode key={`report${index}`} reportId={reportId} />
					))}
				</div>
			</div>
		);
	}
}

export { Reports, ReportNode };
