import React, { Component } from "react";
import "../Css/BanksConvert/inputfile.css";

///  Componente InputFile para cambiar el estilo del botón
/// default del input de tipo file que da el explorador web
class InputFile extends Component {
	constructor(props) {
		super(props);
	}

	setFileInfo = (event) => {
		var fileName = "";
		var label = event.target.nextElementSibling,
			labelVal = label.innerHTML;

		if (event.target.files && event.target.files.length > 1)
			fileName = (
				event.target.getAttribute("data-multiple-caption") || ""
			).replace("{count}", event.target.files.length);
		else fileName = event.target.value.split("\\").pop();

		if (fileName) label.innerHTML = fileName;
		else label.innerHTML = labelVal;

		if (this.props.onChange) {
			this.props.onChange(event);
		}
	};

	render() {
		return (
			<div className="inputFileContainer">
				<input
					type="file"
					name="file"
					id={this.props.id}
					className="inputFile margin-left-button"
					onChange={(event) => this.setFileInfo(event)}
					data-multiple-caption="{count} files selected"
					multiple
				/>
				<label className="inputFileLabel" htmlFor={this.props.id}>
					Selecciona un archivo...
				</label>
			</div>
		);
	}
}

export default InputFile;
