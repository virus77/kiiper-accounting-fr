import React, { Component } from "react";
//import { $ } from 'jquery/dist/jquery';
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

class Compras extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: "Aprobados",
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
			arrayWithholdings: [],
		};
	}

	//#region Métodos de ciclo de vida
	componentWillMount() {
		// Getting data from Xero and building data grid
		util
			.getAndBuildGridData(
				null,
				this.state.activeItem,
				"Proveedor",
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
	}

	//Función utilizada para cambiar el estado y llenado del grid dependiendo la selección de IVA/ISLR
	handleListItemClick = (e, index) => {
		// Getting data from Xero and building data grid
		util
			.getAndBuildGridData(
				index,
				this.state.activeItem,
				"Proveedor",
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
				"Proveedor",
				this.props.orgIdSelected
			)
			.then((result) => {
				// Setting component state
				this.setState({
					rowData: result.structure.gridItems,
					columnDefs: result.structure.headersTemplate,
					activeItem: name.name,
					Tipo: result.taxInfo.name,
					event: result.taxInfo.event,
				});
			});
	};

	//Función utilizada para mover los datos de un estatus a otro
	onMoveData = async (name, val) => {
		this.onFillstate(
			this.refs.agGrid.api.getSelectedRows(),
			name, val
		);
	};

	/// Llena el estado dependiendo delestatus seleccionado
	/// @param {object} gridSelectedRows - Object of selected items in grid
	/// @param {string} statusName - name of status
	onFillstate = async (gridSelectedRows, statusName, val) => {
		let arrayToSend = [];

		// Start proccess to gather all information from grid items selected /
		// Gathering items selected information
		gridSelectedRows.forEach(async (selectedRow) => {
			
			// Voucher data to be send or used in validation
			const withHoldingId = selectedRow.withHoldingId;

			// Defining JSON oject to add to list of voucher to send
			// in voucher view action button
			switch (statusName) {
				case "Recibidos": // Received voucher
				case "Archivados": // Stored voucher
				case "Aprobados":
					// Storing data from items selected in Sales grid
					arrayToSend.push({
						_id: withHoldingId,
					});

					if (arrayToSend.length > 0) {
						// Moving received or stored vouchers to cancelled
						let result1 = await calls.setDataVoidWidthHoldings(arrayToSend);
						if (result1 === true || result1 === false) {
							this.setState({
								show: val,
								texto:
									"El comprobante de retención ha sido anulado en Xero y cambió su estatus a ‘anulado’.",
							});
							this.onRemoveSelected();
							this.setState({ activeItem: statusName });
						}
					} else this.setState({ activeItem: statusName, show: false });

					break;

				case "Anulados": // Stored voucher
					// Moving received or stored vouchers to cancelled
					let result2 = await calls.setDataReissueWidthHoldings(withHoldingId);
					if (result2 === true || result2 === false || result2 === undefined) {
						this.setState({
							show: val,
							texto:
								"El comprobante de retención ha sido anulado en Xero y cambió su estatus.",
						});
						this.onRemoveSelected();
						this.setState({ activeItem: statusName });
					}
					break;

				default:
					this.setState({ show: false });
					break;
			}
		});
	};

	//Función on row selected del grid
	onRowSelected = (event) => {
		const { activeItem } = this.state;

		// Getting grid selected rows
		const gridSelectedRows = event.api.getSelectedRows();
		if (gridSelectedRows.length > 0) {
			switch (activeItem) {
				case "Recibidos":
				case "Archivados":
				case "Aprobados":
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

	/// Clear selected elements in the grid
	onRemoveSelected = () => {
		var selectedData = this.refs.agGrid.api.getSelectedRows();
		var res = this.refs.agGrid.api.applyTransaction({ remove: selectedData });
		util.printResult(res);
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
				{/*Pintado del dropdownlist de iva/isrl*/}
				<div>
					{/*Si es contribuyente especial pinta IVA e ISLR y si no solo pinta ISLR*/}
					{this.props.specialContrib === true ? (
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
					) : (
							<NavDropdown
								id="ddlVentas"
								title={"≡  Comprobante de retención de ISLR  "}
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
							</NavDropdown>
						)}
				</div>
				{/*Pintado de grid dependiendo del menu superior del grid*/}
				<Menu style={{ display: "flex" }}>
					<Menu.Item
						name="Aprobados"
						active={activeItem === "Aprobados" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "Aprobados" ? (
							<span style={{ color: "#7158e2" }}>Aprobados</span>
						) : activeItem === "AprobadosSel" ? (
							<span style={{ color: "#7158e2" }}>Aprobados</span>
						) : (
									<span>Aprobados</span>
								)}
					</Menu.Item>
					<Menu.Item
						name="Anulados"
						active={activeItem === "Anulados" ? true : false}
						onClick={this.handleItemClick}
					>
						{activeItem === "AnuladosSel" ? (
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
						style={{
							borderStyle: "none",
							flex: "1",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						{activeItem === "Aprobados" || activeItem === "Archivados" ? (
							<div className="idDibvDisabledsmall">
								<span>Anular 㐅</span>
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
						) : activeItem === "AprobadosSel" ? (
							<div
								className="idDivEnabledSmall"
								onClick={() => this.onMoveData("Aprobados", true)}
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
						{activeItem === "Aprobados"
							? util.createDataDrid(
								this.state.columnDefs,
								this.state.rowData,
								this.state.rowSelection,
								this.state.defaultColDef,
								this.state.components,
								this.onRowSelected.bind(this),
								this.onSelectionChanged.bind(this)
							)
							: activeItem === "Anulados"
								? util.createDataDrid(
									this.state.columnDefs,
									this.state.rowData,
									this.state.rowSelection,
									this.state.defaultColDef,
									this.state.components,
									this.onRowSelected.bind(this),
									this.onSelectionChanged.bind(this)
								)
								: activeItem === "Archivados"
									? util.createDataDrid(
										this.state.columnDefs,
										this.state.rowData,
										this.state.rowSelection,
										this.state.defaultColDef,
										this.state.components,
										this.onRowSelected.bind(this),
										this.onSelectionChanged.bind(this)
									)
									: util.createDataDrid(
										this.state.columnDefs,
										this.state.rowData,
										this.state.rowSelection,
										this.state.defaultColDef,
										this.state.components,
										this.onRowSelected.bind(this),
										this.onSelectionChanged.bind(this)
									)}
					</div>
					<div id="idDivAlert">
						{this.state.show === true ? (
							<div id="idButtonDiv">
								<button
									style={{ zIndex: "-1" }}
									type="button"
									className="close"
									onClick={(event) =>
										this.onMoveData(this.state.activeItem, false)
									}
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
		);
	}
}

export default Compras;
