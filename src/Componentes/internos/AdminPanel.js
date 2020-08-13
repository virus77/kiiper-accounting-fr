/**
 * Filename: AdminPanel.js
 * Author: jafb717@gmail.com
 * Description: Admin panel components
 */

/** Imports ---------------------------------------------------------------- */

/** React imports */
import React, { useState } from "react";
import { MiToggleSwitch } from "mi-toggle-switch";

// This is required for mi-toogle-switch. DON'T DELETE IT!
import StyledComponent from "styled-components";
import InputFile from "./accordion/InputFile";

/** Style sheets imports */
// Admin panel CSS file
import "./Css/adminpanel.css";

/** Icons */
import leftArrowIcon from "../../Imagenes/leftArrow.svg";
import organizationDetailsIcon from "../../Imagenes/adminODTopic.png";

/** Components ----------------------------------------------------------- */

/// Admin panel component
function AdminPanel(props) {
	// ----------------------------------------------------
	/** Component states */

	// Manages settingsPanel render
	const [settingsPanel, showSettingsPanel] = useState(false);

	// Manages topicsPanel render
	const [topicsPanel, showTopicsPanel] = useState(true);

	// Manages breadcrumb render
	const [breadcrumb, showBreadcrumb] = useState(false);

	// Manages breadcrumb topic
	const [breadcrumbTopic, setBreadcrumbTopic] = useState("");

	// Manages topic settings panel render
	const [topicSettingsPanel, showTopicSettingsPanel] = useState("");

	// Manages toogle button taxes module enable
	const [enableTaxesToggle, handleTaxesToggle] = useState(false);

	// Manages taxes module render
	const [taxesModuleSubgroup, showTaxesModuleSubgroup] = useState(false);

	// ----------------------------------------------------
	/** Component events */

	/// Shows topic settgins panel
	/// @param {object} event - DOM event
	const onTopicItemClick = (event) => {
		// Getting topic title
		const topicItem = event.currentTarget;
		let topicTitle = [...topicItem.querySelectorAll(".topicItemTitle")];
		topicTitle = topicTitle[0].innerText;

		// Setting and showing breadcrumb
		setBreadcrumbTopic(topicTitle);
		showBreadcrumb(true);

		// Showing settings panel
		const topicSettings = event.currentTarget.getAttribute("data-settings");
		showTopicSettingsPanel(topicSettings);
	};

	/// Shows topics panel and reset breadcrumb
	/// @param {object} event - DOM event
	const onBreadcrumbRootClick = (event) => {
		// Reseting and hiding breadcrumb
		setBreadcrumbTopic("");
		showBreadcrumb(false);

		// Showing topics panel and hiding settings panel
		showTopicsPanel(true);
		showSettingsPanel(false);
		showTopicSettingsPanel("");
	};

	/// Handles toggle switch taxes module showing
	/// @param {object} event - DOM event
	const onToggleSwitchTaxesModuleClick = (switchEvent) => {
		// SWITCH_STATE is a property from mi-toggle-switch component
		const isEnabled = switchEvent.SWITCH_STATE.enabled;

		// Showing taxes module subgroup
		showTaxesModuleSubgroup(isEnabled);
		handleTaxesToggle(isEnabled);
	};

	// ----------------------------------------------------

	// Component render
	return (
		// Main admin workspace
		<div id="adminPanel" className="group">
			{/** Workspace header */}
			<div id="adminPanelHeader">
				{/** Workspace title */}
				<div id="adminPanelTitle" className="centeredContainer">
					<span
						id="adminBreadcrumbRoot"
						onClick={(event) => onBreadcrumbRootClick(event)}
					>
						Configuración de Organizaciones
					</span>
					{breadcrumb ? (
						<span id="adminBreadcrumb">
							<img alt="leftArrow" src={leftArrowIcon} />
							<span>{breadcrumbTopic}</span>
						</span>
					) : null}
				</div>
			</div>

			{/** Workspace body */}
			<div id="adminPanelBody" className="centeredContainer">
				{/** Panel where settings topics are displayed */}
				{topicsPanel ? (
					<section id="topicsSection">
						{/** General settings panel */}
						<div className="topicsPanel">
							<span className="topicsPanelTitle">General</span>
							<div className="topicsPanelList">
								<div
									className="topicItem"
									data-settings="organizationDetails"
									onClick={(event) => {
										// Showing settings panel, hiding topics panel
										showTopicsPanel(false);
										showSettingsPanel(true);

										// Showing topic settings panel
										onTopicItemClick(event);
									}}
								>
									<img
										alt="organizationDetails"
										src={organizationDetailsIcon}
									/>
									<span className="topicItemTitle">
										Detalles de organización
									</span>
									<span className="topicItemResume">
										Grupo, Supervisor, sello, correlativos...
									</span>
								</div>
							</div>
						</div>
					</section>
				) : null}

				{/** Panel where settings forms are displayed  according to topic choice */}
				{settingsPanel ? (
					<section id="settingsSection">
						{/** Organization details settings */}
						{topicSettingsPanel === "organizationDetails" ? (
							<div id="organizationDetails" className="settingsPanel">
								{/** Topic settings form */}
								<div className="settingsPanelForm">
									{/** Topic settings form group */}
									<div className="formGroup">
										<div className="formGroupTitle">Información básica</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Grupo</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<select>
													<option value="GrupoA">Grupo A</option>
													<option value="GrupoB">Grupo B</option>
													<option value="GrupoC">Grupo c</option>
												</select>
												<input type="text" placeholder="Grupo nuevo..." />
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Nombre de supervisor</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<input type="text" placeholder="Juan Pérez" />
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Correo del supervisor</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<input
													type="email"
													placeholder="juan.perez@gmail.com"
												/>
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label for="taxesModuleEnable">
													Habilitar módulo de impuestos
												</label>
											</div>
											<div className="formFieldInput formFieldItem">
												{/** mi-toggle-switch component */}
												<MiToggleSwitch
													deactiveColor="#E6DEFD"
													activeColor="#7158E2"
													isEnable={enableTaxesToggle}
													onClick={(event) =>
														onToggleSwitchTaxesModuleClick(event)
													}
												/>
											</div>
										</div>

										{/** Topic settings form subgroup */}
										{/** When user enables Taxes module to organization */}
										{taxesModuleSubgroup ? (
											<div className="formFieldContainer">
												<div className="formFieldLabel formFieldItem"></div>
												<div className="formFieldItem">
													<div
														className="formSubGroup"
														data-subpanel="taxesModuleEnable"
													>
														<div className="formFieldContainer">
															<div className="formFieldLabel formFieldItem">
																<label>RIF</label>
															</div>
															<div className="formFieldInput formFieldItem">
																<input type="text" placeholder="123456789" />
															</div>
														</div>
														<div className="formFieldContainer">
															<div className="formFieldLabel formFieldItem">
																<label>Usuario de SENIAT</label>
															</div>
															<div className="formFieldInput formFieldItem">
																<input type="text" placeholder="JuanPerez" />
															</div>
														</div>
														<div className="formFieldContainer">
															<div className="formFieldLabel formFieldItem">
																<label>Contraseña de SENIAT</label>
															</div>
															<div className="formFieldInput formFieldItem">
																<input type="text" type="password" />
															</div>
														</div>
													</div>
												</div>
											</div>
										) : null}
									</div>

									{/** Topic settings form group */}
									<div className="formGroup">
										<div className="formGroupTitle">
											Correlativos para comprobantes de retenciones
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Comprobante de retención de IVA</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<input type="text" placeholder="123456789" />
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Comprobante de retención de ISLR</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<input type="text" placeholder="123456789" />
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Notas de crédito de IVA</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<input type="text" placeholder="123456789" />
											</div>
										</div>
									</div>

									{/** Topic settings form group */}
									<div className="formGroup">
										<div className="formGroupTitle">Otros</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Sello</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<InputFile id="fileSell" />
											</div>
										</div>
										<div className="formFieldContainer">
											<div className="formFieldLabel formFieldItem">
												<label>Firma digital de representante legal</label>
											</div>
											<div className="formFieldInput formFieldItem">
												<InputFile id="fileSignature" />
											</div>
										</div>
									</div>

									{/** Topic settings form actions */}
									<div className="formActions">
										<button className="formConfirmButton">Guardar</button>
										<button className="formCancelButton">Cancelar</button>
									</div>
								</div>
							</div>
						) : null}
					</section>
				) : null}
			</div>
		</div>
	);
}

export default AdminPanel;
