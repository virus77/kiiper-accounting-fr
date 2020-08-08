/* Imports ----------------------------------------------------------------- */

/* React imports */
import React, { Component } from "react";

/* Components import */
import Accordion from "../accordion/Accordion";
import FileTransformationInformation from "../accordion/FileTransformationInformation";
import calls from "../../Js/calls";

// Main app CSS file
import "../Css/styles.scss";

/* Components import */
import util from "../../Js/util";

/* Main component ------------------------------------------------------ */

/// App component
class BanksConvert extends Component {
	// Constructor declaration
	constructor(props) {
		super(props);
		var openConvert = false;
		var showConversionView = false;
		var bankSelected = null;
		var bankInfo = null;
		const hideAccordionPanelClass = "";

		this.state = {
			openConvert,
			showConversionView,
			accounts: [],
			bankSelected,
			bankInfo,
			hideAccordionPanelClass,
		};
	}

	// ----------------------------------------------------
	/* Component events */

	// Component Did Mount event
	componentDidMount() {
		//Getting data from Xero and building data grid
		calls.getBankAccounts(this.props.orgIdSelected).then((result) => {
			this.setState({ accounts: result.data });
		});

		// Reseting breadcrumb path every time component is rendered
		this.props.setBreadcrumbPath("");
	}

	// Event to set the render of FileTransformation
	setOpenConvert = (showConversionView) => {
		this.state.openConvert = true;

		// Defines which HTML to show in File Transformation component
		// true: shows conversion panel
		// false: shows conversion history panel
		this.setState({ showConversionView: showConversionView });

		// Hides Accordion panel when showing bank conversion history
		if (!showConversionView) {
			this.setState({ hideAccordionPanelClass: "hideAccordionPanelClass" });
		} else {
			this.setState({ hideAccordionPanelClass: "" });
		}
	};

	// Event to set the bank selected to show File transformation
	setBankSelected = (_bankSelected) => {
		this.state.bankSelected = _bankSelected;
	};

	// Event to set the banki info to show File transformation
	setBankInfo = (_bankInfo) => {
		this.state.bankInfo = _bankInfo;
	};

	// Event to show bank records panel when user click
	// the search button inside any bank conversion subpanel
	showConversionViewPanel = (bank) => {
		// Getting bank info and data
		var _bankInfo = util.bankType(bank);
		var _bankData = this.state.accounts.filter(function (_bank) {
			return bank.indexOf(_bank.name) > -1;
		});

		// Setting bank info of the bank selected to render File transformation component
		this.setBankSelected(_bankData);
		this.setBankInfo(_bankInfo);

		// Showing File Transformation component
		this.setOpenConvert(false);
	};

	// ----------------------------------------------------

	// Rendering component
	render() {
		const {
			state: { openConvert, showConversionView, hideAccordionPanelClass },
		} = this;

		return (
			<div className="padding-accordion-bank">
				<Accordion
					key="accordionPanel"
					accounts={this.state.accounts}
					setOpenConvert={this.setOpenConvert}
					setBreadcrumbPath={this.props.setBreadcrumbPath}
					setShowModuleAgain={this.props.setShowModuleAgain}
					setBankSelected={this.setBankSelected}
					setBankInfo={this.setBankInfo}
					className={hideAccordionPanelClass}
				></Accordion>
				<div key="conversionPanel" id="conversionPanel">
					{openConvert && !this.props.showModuleAgain ? (
						// Declaring component to convert bank statement and transactions
						<FileTransformationInformation
							bankData={this.state.bankSelected}
							bankInfo={this.state.bankInfo}
							orgIdSelected={this.props.orgIdSelected}
							showConversionView={showConversionView}
							showConversionViewPanel={this.showConversionViewPanel}
						/>
					) : null}
				</div>
			</div>
		);
	}
}

export default BanksConvert;
