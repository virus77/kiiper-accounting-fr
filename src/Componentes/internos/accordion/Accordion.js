/* Imports ----------------------------------------------------------------- */

/* React imports */
import React, { Component } from "react";
import PropTypes from "prop-types";

/* Components import */
import util from "../../Js/util";

/* Main component ------------------------------------------------------ */

/// App component
class Accordion extends Component {
	// ----------------------------------------------------
	/* Component events */

	//  When clicking on bank 
	onClickConvert = (event, bank, showConversionView) => {
		// Getting bank info and data
		var _bankInfo = util.bankType(bank);
		var _bankData = this.props.accounts.filter(function (_bank) {
			return bank.indexOf(_bank.name) > -1;
		});

		// Setting bank breadcrumb and
		this.props.setBreadcrumbPath(` > ${_bankData[0].name}`);
		this.props.setShowModuleAgain(false);

		// Setting bank info of the bank selected to render File transformation component
		this.props.setBankSelected(_bankData);
		this.props.setBankInfo(_bankInfo);

		// Showing File Transformation component
		this.props.setOpenConvert(showConversionView);

		// Giving the bank an impression of selection
		const banks = [...document.querySelectorAll(".bankSelectionClass")];
		banks.forEach(item => item.classList.remove("bankSelectionClass"));
		event.target.classList.add("bankSelectionClass");
	};

	// ----------------------------------------------------

	// Rendering component
	render() {
		return (
			<div id="accordionPanel" className={this.props.className}>
				{this.props.accounts.map((mapping, index) => (
					<div
						key={`bank${index}`}
						className="accordionBankItem"
						onClick={(event) => {this.onClickConvert(event, mapping.name, true)}}
					>
						<span>{mapping.name}</span>
					</div>
				))}
			</div>
		);
	}
}

export default Accordion;
