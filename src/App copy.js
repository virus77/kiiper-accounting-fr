import React, { Component } from 'react';
import Cookies from 'js-cookie';
import calls from './Componentes/Js/calls'
import $ from 'jquery';

//Css
import './App.css';
import kiiperLogoSm from './Imagenes/Kiiper_logoSm.png';
import Principal from './Componentes/Principal';

//Controles
import { Form } from 'react-bootstrap';

class App extends Component {
  // Constructor of App component
  constructor(props) {
    super();
    this.state = {
      accessToken: "",
      organizations: [],
      isActive: false,
      isInActive: true,
      show: true
    }

    // Logout function
    this.logoutFunction = this.logoutFunction.bind(this)
  }

  /// Main App component function
  componentDidMount() {

    // Storing access token requested to Xero in a cookie
    this.setState({ accessToken: Cookies.get('accessToken') });
    
    if (Cookies.get('accessToken')) {
      // Get organizations from logged user
      fetch('/getGrantedOrganisations')
        .then(res => res.json())
        .then(data => {
          // Defining state of App component in order to show
          // the content because of [isInActive = false]
          this.setState({
            organizations: data,
            isInActive: false,
            isActive: true,
            show: false,
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  //Acceso de kiiper a xero y de xero a kiiper para el acceso a 
  //las organizaciones
  accesToXero = async () => {
    // Fetch URL with parameters
    let email = document.getElementById("ctrlEmail").value;
    let password = document.getElementById("ctrlPassword").value;
    var param = { Email: email, Password: password };
    var access_token = "";
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
          access_token = data.d;
        }
      },
      error: function (a, b, error) {
        alert(error);
      }
    });

    let consentUrl = await calls.getFinalCallback(access_token);
    window.open(consentUrl, "_self");
  }

  logoutFunction = () => {
    fetch('/logout')
      .then(res => window.location.reload(false));
  };

  // Starts process to login into Xero
  onIniciarProceso = () => {

    // Delete cookie to garant the login in Xero
    Cookies.remove('accessToken');
    this.setState({ accessToken: "" });
  }

  render() {
    const { accessToken } = this.state;
    this.state.isInActive ?
      this.state.show ?
        document.body.className = "bodycolor" :
        document.body.className = "bodycolorForm" :
      document.body.style.background = "#f3f3f3";

    return (
      <div>
        {/* Acción utilizada ocultar el formulario de inicio de sesión y darle paso al contenido */}
        {this.state.isInActive ?
          /* Acción utilizada ocultar el logo de kiiper para darle paso al formulario de inicio de sesion */
          <div className="App">
            <div style={{ padding: "35px" }}>
              <img src={kiiperLogoSm} alt="img-logokiiper" />
            </div>
            <div className="formulario">
              <div className="col-12">
                <br />
                <div style={{ padding: "40px 0px 0px 35px", fontSize: "30pt", color: "#232C51", fontWeight: "bold" }}>
                  Bienvenidos a kiiper
                  </div>
                <div style={{ padding: "25px 0px 0px 35px", fontSize: "18pt", color: "#232C51" }}>
                  Accounting routines done!
                  </div>
                <div style={{ padding: "45px 35px 0px 35px", fontSize: "12pt", color: "#232C51" }}>
                  Para continuar debes ingresar tus datos e iniciar sesión
                  </div>
                <Form style={{ padding: "20px 35px 0px 35px", fontSize: "11pt", color: "#232C51" }}>
                  <Form.Group>
                    <Form.Label >Correo electrónico: </Form.Label>
                    <Form.Control id="ctrlEmail" type="email" placeholder="ej. nombre@corrreo.com" />
                  </Form.Group>
                  <div style={{ padding: "10px 0px 0px 0px" }}>
                    <Form.Group>
                      <Form.Label>Contraseña: </Form.Label>
                      <Form.Control id="ctrlPassword" type="password" placeholder="Password" />
                    </Form.Group>
                  </div>
                  <div style={{ padding: "40px 0px 0px 0px", color: "white", textAlign: "right" }}>
                    <span id="xeroSyncAnchor" onClick={() => this.accesToXero()}>Iniciar sesión</span>
                    <span id="spnAccessToken" style={{ display: "none" }}>{this.state.accessToken}</span>
                  </div>
                </Form>

              </div>
            </div>
          </div> :
          <div className="App">
            <Principal token={accessToken} org={this.state.organizations} />
          </div>
        }
      </div>
    );
  }
}

export default App;