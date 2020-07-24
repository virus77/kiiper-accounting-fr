import React, { Component } from "react";

/// controles
import { Button, Card, Form, Modal } from "react-bootstrap";
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

registerLocale("es", es);
var moment = require("moment"); /// require

class Reports extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reports: [
				{ id: "fiscalBook", book: "Libros fiscales" },
				{ id: "legalBook", book: "Libros legales" },
				{ id: "declarationBook", book: "Declaraciones" },
			],
		};
	}

	render() {
		const {
			state: { reports },
		} = this;

		return (
			<div>
				<div className="report-container">
					{reports.map((report, index) => (
						<ReportBook
							key={`report${index}`}
							reportId={report.id}
							bookName={report.book}
							orgIdSelected={this.props.orgIdSelected}
						/>
					))}
				</div>
			</div>
		);
	}
}

class ReportBook extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showDate: false,
			open: false,
			setOpen: false,
			arrowUpClass: "",
		};
	}


	// Ayuda a mostrar el contenido del nodo del acordeón elegido
	showAccordionContent = async (event) => {
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

	render() {
		const {
			state: { arrowUpClass },
			props: { reportId, bookName },
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
					{bookName}
				</h3>
				<div className="flex-container accordionContent">
					<Card className="card-container">
						<Card.Body>
							<BookTable
								orgIdSelected={this.props.orgIdSelected}
								bookType={"Compras"}
							/>
						</Card.Body>
					</Card>
					<Card className="card-container">
						<Card.Body>
							<BookTable
								orgIdSelected={this.props.orgIdSelected}
								bookType={"Ventas"}
							/>
						</Card.Body>
					</Card>
				</div>
			</div>
		);
	}
}

class BookTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rowData: [],
			columnDefs: [],
			modalShow: false,
			errorMsg: false,
			bookType: "",
			taxbookId: "",
			startDate: new Date(),
			finishDate: new Date(),
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	//#region Métodos de ciclo de vida
	componentDidMount() {
		// Getting data from Xero and building data grid
		this.onFillGrid("", "", "");
	}

	//#region Métodos de ciclo de vida
	onFillGrid(Valor, x, y) {
		// Getting data from Xero and building data grid
		util.getAndBuildGridDataReports(this.props.orgIdSelected, Valor, x, y).then(result => {
			// Setting component state
			this.setState({
				rowData: result.structure.gridItems,
				columnDefs: result.structure.headersTemplate
			})
		});
	}

	/// Funcion utilizada para obtener el periodo y enviar los parámetros
	/// solicitados por medio de post para generar el guardado en Xero
	onGetPeriodo = () => {

		let x = moment(document.getElementById("dtpkDesde" + this.state.bookType).value);
		let y = moment(document.getElementById("dtpkHasta" + this.state.bookType).value);

		if (x.isBefore(y)) {
			this.setState({ errorMsg: "" });

			let taxbookId = calls.getBook(
				this.props.orgIdSelected,
				1,
				x.format("DD/MM/YYYY"),
				y.format("DD/MM/YYYY"),
				this.state.bookType === "Ventas" ? "/salesBook" : "/purchasesBook"
			);

			if (taxbookId.data === false)
				console.log("Ocurrió un problema al momento de generar el periodo");
			else {
				this.setState({ taxbookId: taxbookId.data });
				this.onDownloadFile();
				this.onFillGrid("Grid", x, y);
				console.log("El periodo se generó correctamente");
			}
		} else {
			this.setState({
				errorMsg: "Las fechas son inválidas",
			});
		}
	};

	/// Muestra u oculta el modal the bootstrap
	/// @param {string} show - mostrar el modal o no
	manageModalShow = (show, bookType) => {
		this.setState({ modalShow: show, bookType: bookType });
	};

	/* Funciones Libro */
	handleChangeStartDate = date => {
		let startDate = moment(date).format("DD/MM/YYYY");
		let endDate = moment(
			document.getElementById("dtpkHasta" + this.state.bookType).value
		).format("DD/MM/YYYY");

		if (util.compareDates(startDate, endDate) === 1) {
			this.setState({
				errorMsg: "Fecha desde, no puede ser mayor a fecha hasta",
			});
		} else {
			this.setState({ startDate: date, errorMsg: "" });
		}
	};

	handleChangeFinishDate = date => {
		let endDate = moment(date).format("DD/MM/YYYY");
		let StartDate = moment(
			document.getElementById("dtpkDesde" + this.state.bookType).value

		).format("DD/MM/YYYY");
		if (util.compareDates(endDate, StartDate) === -1) {
			this.setState({
				errorMsg: "Fecha hasta, no puede ser menor a fecha desde",
			});
		} else {
			this.setState({ finishDate: date, errorMsg: "" });
		}
	};

	handleClick = (e) => {
		console.log("handleClick", e);
		if (e.target.value === "3") {
			this.setState({
				showDate: true,
				optionSelected: e.id,
			});
		} else {
			this.setState({
				showDate: false,
				optionSelected: e.id,
			});
		}
	};

	handleClose = () => {
		this.setState({ modalShow: false });
	}

	/// Funcion utilizada para generar el archivo obteniendo desde 
	/// un get en base64 el archivo generado
	/// @param {text} origen - Texto para identificar de donde proviene el llamado
	onDownloadFile = () => {
		let resp = "";
		switch (this.state.bookType) {
			case "Ventas":
				calls.getDocumentByTaxbookId(this.state.taxbookId, "/generateSalesBook");
				break;

			case "Compras":
				calls.getDocumentByTaxbookId(this.state.taxbookId, "/generatePurchasesBook");
				break;

			default:
				break;
		}

		if (resp === false)
			console.log("No se logro descargar el archivo");
	}

	render() {
		const {
			state: { columnDefs, rowData, modalShow },
			props: { bookType },
		} = this;

		const closeBtn = <button className="close" onClick={(event) => this.manageModalShow(false, bookType)}>X</button>

		return (
			<div className="bookTableWrapper">
				{/** Botón para generar un periodo específico de libro */}
				<span
					className="periodSelectionGenerator"
					onClick={(event) => this.manageModalShow(true, bookType)}
				>
					<img border="0" src={periodSelection} />
				</span>

				{/** Título del libro*/}
				<Card.Title>{`Libros de ${bookType}`}</Card.Title>
				<hr className="separator" />

				{/** Tabla de datos de libros generados por periodo */}
				<div id={`myGrid${bookType}`} className="aggridReport ag-theme-alpine">
					<AgGridReact columnDefs={columnDefs} rowData={rowData}></AgGridReact>
				</div>

				{/** Cuadro de diálogo para mostrar la opción de generar un libro por un periodo específico */}
				<Modal
					show={modalShow}
					onHide={this.handleClose}
					size="md"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Seleccionar periodo
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Card.Text>
							<div className="date-container">
								<div className="inline-date" style={{ marginLeft: 0 }}>
									<div className="time-interval fieldLabel">Desde:</div>
									<DatePicker
										id={`dtpkDesde${bookType}`}
										className={"calendar"}
										selected={this.state.startDate}
										onChange={this.handleChangeStartDate}
										locale="es"
										showMonthDropdown
										showYearDropdown
									/>
								</div>
								<div className="inline-date">
									<div className="time-interval fieldLabel">Hasta:</div>
									<DatePicker
										id={`dtpkHasta${bookType}`}
										className={"calendar"}
										selected={this.state.finishDate}
										onChange={this.handleChangeFinishDate}
										locale="es"
										showMonthDropdown
										showYearDropdown
									/>
								</div>
							</div>
						</Card.Text>
						<div style={{ textAlign: "center", color: "red" }}>
							<span>{this.state.errorMsg}</span>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<div className="inline-date">
							<Button
								className="xeroGenerate"
								onClick={() => {
									this.onGetPeriodo(); this.manageModalShow(false, bookType);
								}}
							>
								Generar
								</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export { Reports };
