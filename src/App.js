import React, { Component } from 'react';
import Cookies from 'js-cookie';

//Css
import './App.css';
import kiiperLogoSm from './Imagenes/Kiiper_logoSm.png';
import Principal from './Componentes/Principal';

//Controles
import { Button, Form, Row, Col } from 'react-bootstrap';

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

    // If access token to Xero does not exist in the App state
    if (!Cookies.get('accessToken')) {

      // Go and open the login page to Xero
      fetch('/getConsentUrl')
        .then(res => res.json())
        .then(consentUrl => window.open(consentUrl, "_self"))
        .catch((error) => {
          console.log(error);
        });
    }
    // If access token does exist
    else {

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
          /*  Acción utilizada ocultar el logo de kiiper para darle paso al formulario de inicio de sesion */
          <div className="App">
            <div style={{ padding: "30px" }}>
              <img src={kiiperLogoSm} alt="img-logokiiper" />
            </div>
            <div className="formulario">
              <div className="col-12" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <br />
                <div style={{ padding: "30px 0px 0px 0px", fontSize: "30pt", color: "#232C51", fontWeight: "bold" }}>
                  Bienvenidos a kiiper
                    </div>
                <div style={{ padding: "25px 0px 0px 0px", fontSize: "18pt", color: "#232C51" }}>
                  Accounting routines done!
                    </div>
                {/* <div style={{ padding: "45px 35px 0px 35px", fontSize: "12pt", color: "#232C51" }}>
                  Para continuar debes ingresar tus datos e iniciar sesión
                    </div>*/}
                <Form style={{ padding: "50px 0px 0px 0px", fontSize: "11pt", color: "#232C51" }}>
                  {/* <Form.Group controlId="formBasicEmail">
                      <Form.Label >Correo electrónico: </Form.Label>
                      <Form.Control type="email" placeholder="ej. nombre@corrreo.com" />
                      <Form.Text className="text-muted">
                      </Form.Text>
                    </Form.Group>
                    <div style={{ padding: "10px 0px 0px 0px" }}>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Contraseña: </Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                      </Form.Group>
                    </div>
                    <div style={{ padding: "10px 0px 0px 0px" }}>
                      <Row>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="No cerrar sesión" />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Label className="label">Olvidé mi contraseña</Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>*/}
                  <div style={{ padding: "0px 0px 0px 0px" }}>
                    <Button type="submit" id="xeroSyncAnchor" onClick={() => { this.onIniciarProceso() }}>
                      Iniciar sesión
                      </Button>
                  </div>
                  {/*<Row style={{ padding: "10px 0px 0px 0px" }}>
                      <Col>
                        <Form.Group controlId="formBasicCheckbox">
                          <Form.Label className="label">¿No tienes cuenta con kiiper?</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>*/}
                  {/* <p className="accessToken text-center"><b style={{ fontSize: "11pt", color: "gray" }} >Access Token: </b>{accessToken}</p>
                      <a id="xeroSyncAnchor2" href="/getConsentUrl"><img src="connect_xero_button_blue.png" className="img-fluid" alt="" /></a>*/}
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