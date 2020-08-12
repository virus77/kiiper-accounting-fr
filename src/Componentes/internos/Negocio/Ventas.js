import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

//Componentes
import util from "../../Js/util";
import calls from "../../Js/calls";
import AlertDismissible from "../../internos/Alert";
import { NavDropdown } from "react-bootstrap";

//Css
import "semantic-ui-css/semantic.min.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "../../internos/Css/Grid.scss";
import "../../internos/Css/alert.css";

// Declaring momenty object
var moment = require("moment"); // require

class Ventas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: "true",
			columnDefs: [],
			rowData: [],
			columnDefs2: [],
			rowData2: [],
			headerCheckboxSelection: true,
			cellRenderer: "agGroupCellRenderer",
			cellRendererParams: { checkbox: true },
			rowSelection: "multiple",
			rowGroupPanelShow: "always",
			pivotPanelShow: "always",
			components: {},
			defaultColDef: {
				editable: true,
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				sortable: true,
				resizable: true,
				filter: true,
				flex: 1,
				minWidth: 100,
			},
			show: false,
			setShow: true,
			texto: "",
			Tipo: "IVA",
			event: 4.2,
			eventKey: 0,
			gridRowsSelectedToRegister: [],
			arrayWithholdings: [],
		};
	}

	//#region Métodos de ciclo de vida
	componentWillMount() {
		// Getting data from Xero and building data grid
		util
			.getAndBuildGridData("", "", "Cliente", this.props.orgIdSelected)
			.then((result) => {
				// Setting component state
				this.setState({
					rowData: result.structure.gridItems,
					columnDefs: result.structure.headersTemplate,
					activeItem: result.statusInfo.name,
				});
			});
	}

	//Función utilizada para cambiar el estado y llenado del grid dependiendo la selección de IVA/ISLR
	handleListItemClick = (e, index) => {
		// Getting data from Xero and building data grid
		util
			.getAndBuildGridData(
				index,
				this.state.activeItem,
				"Cliente",
				this.props.orgIdSelected
			)
			.then((result) => {
				// Setting component state
				this.setState({
					rowData: result.structure.gridItems,
					columnDefs: result.structure.headersTemplate,
					activeItem: result.statusInfo.name,
					eventKey: result.taxInfo.event,
					Tipo: result.taxInfo.name,
					event: result.taxInfo.event,
				});
			});
	};

	//Función utilizada para cambiar el estado y llenado del frid delendiendo del clic en el menu superior del mismo
	handleItemClick = (e, name) => {
		// Cleaning rows selected on grid
		this.refs.agGrid.api.deselectAll();

		// Getting data from Xero and building data grid
		util
			.getAndBuildGridData(
				this.state.event,
				name.name,
				"Cliente",
				this.props.orgIdSelected
			)
			.then((result) => {
				// Setting component state
				this.setState({
					rowData: result.structure.gridItems,
					columnDefs: result.structure.headersTemplate,
					activeItem: result.statusInfo.name,
					Tipo: result.taxInfo.name,
					event: result.taxInfo.event,
				});
			});
	};

	//Función utilizada para mover los datos de un estatus a otro
	onMoveData = async (name, val) => {
		let arrayToSend = "";

		switch (name) {
			case "Pendientes":
				// Getting ros selected and building a JSON to send
				arrayToSend = this.onFillstate(
					this.refs.agGrid.api.getSelectedRows(),
					name
				);

				if (arrayToSend.length > 0) {
					// Moving pending vouchers to received
					let result = await calls.setDataWidthHoldings(
						this.state.Tipo,
						arrayToSend
					);
					if (result === true) {
						this.setState({
							show: val,
							texto:
								"El comprobante de retención ha sido registrado en Xero y cambió su estatus a 'recibido'.",
						});
						this.onRemoveSelected();
						this.setState({ activeItem: name });
					}
				}
				break;

			case "Archivados":
			case "Recibidos":
				// Getting ros selected and building a JSON to send
				arrayToSend = this.onFillstate(
					this.refs.agGrid.api.getSelectedRows(),
					name
				);

				if (arrayToSend.length > 0) {
					// Moving received or stored vouchers to cancelled
					let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
					if (result1 === true) {
						this.setState({
							show: val,
							texto:
								"El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’.",
						});
						this.onRemoveSelected();
						this.setState({ activeItem: name });
					}
				} else this.setState({ activeItem: name, show: false });
				break;
			case "Anulados":
				// Getting ros selected and building a JSON to send
				arrayToSend = this.onFillstate(
					this.refs.agGrid.api.getSelectedRows(),
					name
				);

				if (arrayToSend.length > 0) {
					// Moving received or stored vouchers to cancelled
					let result2 = await calls.setDataReissueWidthHoldings(arrayToSend);

					if (result2 === true) {
						this.setState({
							show: val,
							texto:
								"El comprobante de retención ha sido anulado en Xero y cambió su estatus.",
						});
						this.onRemoveSelected();
						this.setState({ activeItem: name });
					}
				} else this.setState({ activeItem: name, show: false });
				break;
			default:
				this.setState({ show: false });
				break;
		}
	};

	/// Llena el estado dependiendo delestatus seleccionado
	/// @param {object} gridSelectedRows - Object of selected items in grid
	/// @param {string} statusName - name of status
	onFillstate = (gridSelectedRows, statusName) => {
		let arrayToSend = [];

		// Start proccess to gather all information from grid items selected /
		// Gathering items selected information
		gridSelectedRows.forEach((selectedRow, rowIndex) => {
			// Voucher data to be send or used in validation
			const clientName = selectedRow.Contacto;
			const retentionPercentage = selectedRow.Retencion;
			const withHoldingId = selectedRow.withHoldingId;

			// Finding date added to voucher
			let voucherDate =
				selectedRow.approval_date != "" ? selectedRow.approval_date : "";

			// Finding file uploaded to voucher
			let voucherFile = document.querySelector(`[id=lbl_${withHoldingId}]`);
			voucherFile = voucherFile ? voucherFile.innerHTML : "";

			// Formatting voucher number
			let voucherNumber = selectedRow.Comprobante
				? selectedRow.Comprobante
				: "";

			// --------------------------------------

			// Defining JSON oject to add to list of voucher to send
			// in voucher view action button
			switch (statusName) {
				// Pending voucher
				case "Pendientes":
					switch (true) {
						// When voucher date was not captured in column field
						case !voucherDate:
							this.setState({
								show: true,
								texto: `La fecha de comprobante está vacía en ${clientName}.`,
							});
							return false;

						// When voucher date was not captured in column field
						case !voucherNumber:
							this.setState({
								show: true,
								texto: `El número de comprobante está vacío en ${clientName}.`,
							});
							return false;

						case !voucherFile:
							this.setState({
								show: true,
								texto: `El documento está vacío en ${clientName}.`,
							});
							return false;

						default:
							// Storing data from items selected in Ventas grid
							arrayToSend.push({
								withholdingId: withHoldingId,
								retentionPercentage: retentionPercentage,
								withholdingNumber: voucherNumber,
								withholdingDate: voucherDate,
								withholdingFile: voucherFile,
							});
							break;
					}
					break;

				case "Recibidos": // Received voucher
				case "Archivados": // Stored voucher
					// Storing data from items selected in Sales grid
					arrayToSend.push({
						_id: withHoldingId,
					});
					break;

				case "Anulados": // Stored voucher
					// Storing data from items selected in Sales grid
					arrayToSend.push({
						withholdingId: withHoldingId,
					});
				default:
					break;
			}
		});

		return arrayToSend;
	};

	/// Clear selected elements in the grid
	onRemoveSelected = () => {
		var selectedData = this.refs.agGrid.api.getSelectedRows();
		var res = this.refs.agGrid.api.applyTransaction({ remove: selectedData });
		util.printResult(res);
	};

	//Función onRowSelected del grid
	onRowSelected = (event) => {
		const { activeItem } = this.state;

		// Getting grid selected rows
		const gridSelectedRows = event.api.getSelectedRows();

		if (gridSelectedRows.length > 0) {
			switch (activeItem) {
				case "Pendientes":
				case "Archivados":
				case "Recibidos":
				case "Anulados":
					this.setState({
						activeItem: activeItem + "Sel",
						show: false,
						texto:
							"El comprobante de retención ha sido anulado en Xero y cambió su estatus a: " + activeItem,
					});
					break;

				default:
					break;
			}
		} else {
			if (activeItem.includes("Sel") === true) {
				this.setState({
					activeItem: activeItem.substring(0, activeItem.length - 3),
					show: false,
					texto: "",
				});
			}
			else this.setState({ activeItem: activeItem, show: false, texto: "" });
		}
	};

	//Función onchange del grid
	onSelectionChanged = (event) => {
		/* var rowCount = event.api.getSelectedNodes().length;
        window.alert('selection changed, ' + rowCount + ' rows selected');*/
	};

	render() {
		const { activeItem } = this.state;
		return (
			<div style={{ height: "100%" }}>
				{/*Pintado del dropdownlist de iva/islr*/}
				<div>
					<NavDropdown
						id="ddlVentas"
						title={
							this.state.event === 4.2
								? "≡  Comprobante de retención de IVA  "
								: this.state.event === 4.1
									? "≡  Comprobante de retención de ISLR  "
									: "≡  Comprobante de retención de IVA  "
						}
					>
						<NavDropdown.Item
							eventKey={4.1}
							onClick={(event) => this.handleListItemClick(event, 4.1)}
							href="#Reportes/ISLR"
						>
							<span className="ddlComVenLabel">
								{" "}
								Comprobante de retención de ISLR{" "}
							</span>
						</NavDropdown.Item>
						<NavDropdown.Item
							eventKey={4.2}
							onClick={(event) => this.handleListItemClick(event, 4.2)}
							href="#Reportes/IVA"
						>
							<span className="ddlComVenLabel">
								{" "}
								Comprobante de retención de IVA{" "}
							</span>
						</NavDropdown.Item>
					</NavDropdown>
				</div>
				{/*Pintado de grid dependiendo del menu superior del grid*/}
				<Menu style={{ display: "flex" }}>
					<Menu.Item
						name="Pendientes"
						active={activeItem === "Pendientes" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "Pendientes" ? (
							<span style={{ color: "#7158e2" }}>Pendientes</span>
						) : activeItem === "PendientesSel" ? (
							<span style={{ color: "#7158e2" }}>Pendientes</span>
						) : (
									<span>Pendientes</span>
								)}
					</Menu.Item>
					<Menu.Item
						name="Recibidos"
						active={activeItem === "Recibidos" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "Recibidos" ? (
							<span style={{ color: "#7158e2" }}>Recibidos</span>
						) : activeItem === "RecibidosSel" ? (
							<span style={{ color: "#7158e2" }}>Recibidos</span>
						) : (
									<span>Recibidos</span>
								)}
					</Menu.Item>
					<Menu.Item
						name="Anulados"
						active={activeItem === "Anulados" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "Anulados" ? (
							<span style={{ color: "#7158e2" }}>Anulados</span>
						) : activeItem === "AnuladosSel" ? (
							<span style={{ color: "#7158e2" }}>Anulados</span>
						) : (
									<span>Anulados</span>
								)}
					</Menu.Item>
					<Menu.Item
						name="Archivados"
						active={activeItem === "Archivados" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "Archivados" ? (
							<span style={{ color: "#7158e2" }}>Archivados</span>
						) : activeItem === "ArchivadosSel" ? (
							<span style={{ color: "#7158e2" }}>Archivados</span>
						) : (
									<span>Archivados</span>
								)}
					</Menu.Item>
					<div
						style={{ flex: "1", display: "flex", justifyContent: "flex-end" }}
					>
						{activeItem === "Pendientes" ? (
							<div className="idDibvDisabledsmall">
								<span>Registrar</span>
							</div>
						) : activeItem === "PendientesSel" ? (
							<div
								className="idDivEnabledSmall"
								onClick={() => this.onMoveData("Pendientes", true)}
							>
								<span>Registrar</span>
							</div>
						) : activeItem === "Anulados" ? (
							<div className="idDibvDisabledsmall">
								<span>Remitir</span>
							</div>
						) : activeItem === "AnuladosSel" ? (
							<div
								className="idDivEnabledSmall"
								onClick={() => this.onMoveData("Anulados", true)}
							>
								<span>Remitir</span>
							</div>
						) : activeItem === "Recibidos" || activeItem === "Archivados" ? (
							<div className="idDibvDisabledsmall">
								<span>Anular 㐅</span>
							</div>
						) : activeItem === "RecibidosSel" ? (
							<div
								className="idDivEnabledSmall"
								onClick={() => this.onMoveData("Recibidos", true)}
							>
								<span>Anular 㐅</span>
							</div>
						) : activeItem === "ArchivadosSel" ? (
							<div
								className="idDivEnabledSmall"
								onClick={() => this.onMoveData("Archivados", true)}
							>
								<span>Anular 㐅</span>
							</div>
						) : null}
					</div>
				</Menu>
				{/*Pintado de grid dependiendo del flujo de los botones*/}
				<div>
					<div id="salesGrid" className="ag-theme-alpine">
						{activeItem === "Pendientes"
							? util.createDataDrid(
								this.state.columnDefs,
								this.state.rowData,
								{},
								this.state.components,
								this.onRowSelected.bind(this),
								this.onSelectionChanged.bind(this)
							)
							: activeItem === "Recibidos"
								? util.createDataDrid(
									this.state.columnDefs,
									this.state.rowData,
									{},
									this.state.components,
									this.onRowSelected.bind(this),
									this.onSelectionChanged.bind(this)
								)
								: activeItem === "Anulados"
									? util.createDataDrid(
										this.state.columnDefs,
										this.state.rowData,
										{},
										this.state.components,
										this.onRowSelected.bind(this),
										this.onSelectionChanged.bind(this)
									)
									: activeItem === "Archivados"
										? util.createDataDrid(
											this.state.columnDefs,
											this.state.rowData,
											{},
											this.state.components,
											this.onRowSelected.bind(this),
											this.onSelectionChanged.bind(this)
										)
										: util.createDataDrid(
											this.state.columnDefs,
											this.state.rowData,
											{},
											this.state.components,
											this.onRowSelected.bind(this),
											this.onSelectionChanged.bind(this)
										)}
						<div id="idDivAlert">
							{this.state.show === true ? (
								<div id="idButtonDiv">
									<button
										style={{ zIndex: "-1" }}
										type="button"
										className="close"
										onClick={(event) => this.onMoveData(event, false)}
									>
										<span aria-hidden="true">OK</span>
									</button>
								</div>
							) : null}
							<AlertDismissible
								valor={this.state.show}
								texto={this.state.texto}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Ventas;
