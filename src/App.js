import React, { Component } from "react";
import Cookies from "js-cookie";
import $ from "jquery";
import calls from "./Componentes/Js/calls";

//Css
import "./App.css";
import kiiperLogoSm from "./Imagenes/Kiiper_logoSm.png";
import Principal from "./Componentes/Principal";

//Controles
import { Form } from "react-bootstrap";
import Spinner from "@bit/joshk.react-spinners-css.spinner";

class App extends Component {
	// Constructor of App component
	constructor(props) {
		super();
		this.state = {
			accessToken: Cookies.get("accessToken"),
			groups: [],
			organizations: [],
			isActive: false,
			isInActive: true,
			show: true,
		};
	}

	/// Main App component function
	componentDidMount = async () => {
		// Storing access token requested to Xero in a cookie
		document.getElementById("Spinner").style.display = "none";
		if (Cookies.get("accessToken")) {
			// Defining state of App component in order to show
			// the content because of [isInActive = false]
			let grupo = await calls.getGroupsList();
			this.setState({
				groups: grupo,
				isInActive: false,
				isActive: true,
				show: false,
			});
		}
	};

	//Acceso de kiiper a xero y de xero a kiiper para el acceso a
	//las organizaciones
	accesToXero = async () => {
		// Fetch URL with parameters
		document.getElementById("Spinner").style.display = "block";
		let email = document.getElementById("ctrlEmail").value;
		let password = document.getElementById("ctrlPassword").value;
		//let _urlFisico = "https://login.xero.com/identity/user/login?ReturnUrl=%2Fidentity%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DD6BBEFA31BAF4160BCC8F8BF8434D5FC%26scope%3Dopenid%2520profile%2520email%2520accounting.transactions%2520accounting.settings%2520accounting.contacts%2520accounting.attachments%2520accounting.reports.read%2520offline_access%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fkiiper-accounting.herokuapp.com%252Fcallback";
		let _urlFisico = "https://login.xero.com/identity/user/login?ReturnUrl=%2Fidentity%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DCCBAC45C2B804DE58FA0E6354DACFA5A%26scope%3Dopenid%2520profile%2520email%2520accounting.transactions%2520accounting.settings%2520accounting.contacts%2520accounting.attachments%2520accounting.reports.read%2520offline_access%26response_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A5000%252Fcallback";
		var param = { Email: email, Password: password, xeroRootWeb: _urlFisico };
		var accestoken = "";
		var paso = "";

		$.ajax({
			url: "http://ai.quierocasa.com.mx:50236/WsCaptcha.asmx/callAccessToXero",
			data: JSON.stringify(param),
			dataType: "json",
			type: "POST",
			async: false,
			crossDomain: true,
			contentType: "application/json; charset=utf-8",
			success: function (data) {
				if (data !== null) {
					accestoken = data.d;
					if (accestoken.includes("j:")) {
						paso = "true";
						accestoken = accestoken.replace("j:", "");
					} else alert(accestoken);
				}
			},
			error: function (a, b, error) {
				alert(error);
			},
		});

		if (paso === "true") {
			let consentUrl = await calls.getFinalCallback(accestoken);
			window.open(consentUrl, "_self");
		}
		document.getElementById("Spinner").style.display = "none";
	};

	// Starts process to login into Xero
	onIniciarProceso = () => {
		// Delete cookie to garant the login in Xero
		Cookies.remove("accessToken");
		this.setState({ accessToken: "" });
	};

	render() {
		const { accessToken } = this.state;
		this.state.isInActive
			? this.state.show
				? (document.body.className = "bodycolor")
				: (document.body.className = "bodycolorForm")
			: (document.body.style.background = "#f3f3f3");

		return (
			<div>
				{/* Acción utilizada ocultar el formulario de inicio de sesión y darle paso al contenido */}
				{this.state.isInActive ? (
					/* Acción utilizada ocultar el logo de kiiper para darle paso al formulario de inicio de sesion */
					<div className="AppLogin">
						<div className="appLoginHeader">
							<img src={kiiperLogoSm} alt="img-logokiiper" />
						</div>
						<div className="formulario">
							<div className="col-12 formContainer">
								<div className="formLoginTitle">Bienvenidos a kiiper</div>
								<div className="formLoginInstructions">
									Para continuar debes ingresar tus datos e iniciar sesión
								</div>
								<div
									id="Spinner"
									style={{
										paddingLeft: "35%",
										position: "absolute",
										zIndex: "1",
									}}
								>
									<Spinner color="#be97e8" />
								</div>
								<Form>
									<Form.Group>
										<Form.Label>Correo electrónico: </Form.Label>
										<Form.Control
											id="ctrlEmail"
											type="email"
											placeholder="ej. nombre@corrreo.com"
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Contraseña: </Form.Label>
										<Form.Control
											id="ctrlPassword"
											type="password"
											placeholder="Password"
										/>
									</Form.Group>
									<div className="formActions">
										<span id="spnAccessToken" style={{ display: "none" }}>
											{this.state.accessToken}
										</span>
										<span
											id="xeroSyncAnchor"
											onClick={() => this.accesToXero()}
										>
											Iniciar sesión
										</span>
									</div>
								</Form>
							</div>
						</div>
					</div>
				) : (
						<div className="App">
							<span id="spnAccessToken" style={{ display: "none" }}>
								{this.state.accessToken}
							</span>
							<Principal token={accessToken} grp={this.state.groups} />
						</div>
					)}
			</div>
		);
	}
}

export default App;
