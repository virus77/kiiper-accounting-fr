import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import logo from './logo.svg';
import Principal from './Componentes/Principal';

class App extends Component {
  constructor(props) {
    super();
    this.state = { accessToken: "", isActive: false, isInActive: true, inicio: true }
    this.logoutFunction = this.logoutFunction.bind(this)
  }

  componentDidMount() {
    this.setState({ accessToken: Cookies.get('accessToken') })
    this.getConsentUrl();
  }

  getConsentUrl = () => {
    fetch('/getConsentUrl')
      .then(res => res.json())
      .then(consentUrl => document.getElementById("xeroSyncAnchor").href = consentUrl);
  }

  logoutFunction = () => {
    fetch('/logout')
      .then(res => window.location.reload(false));
  };

  onIniciarProceso = () => {
    fetch('/logout')
      .then(res => window.location.reload(false));
  };

  onIniciarProceso = () => {

    if (window.confirm('¿Esta seguro que quiere accesar?')) {
      this.getConsentUrl();

      this.setState({ isInActive: false, isActive: true });
    }
  };

  render() {
    const { accessToken } = this.state;
    return (
      <div>
        {this.state.isInActive ?
          <div className="App" style={{ backgroundColor: "#312b7e" }}>
            <div className="h-100 row align-items-center">
              <div className="col-12 text-center"> <img src="logo.png" className="img-fluid" alt="" />
                <br />
                <img src={logo} className="App-logo" alt="logo" width="50" />
                <div className="text-center">
                  <p className="accessToken"><b style={{  color: "#ffffff"}} >Access Token: </b>{accessToken}</p>
                  {/* <button type="button" className="btn btn-light btn-sm" onClick={ this.logoutFunction }>Logout</button> */}
                </div>
                <br ></br>
                <input id="xeroSyncAnchor" onClick={() => { this.onIniciarProceso() }} type="button" />
              </div>
            </div>
          </div> :
          <Principal />}
      </div>
    );
  }
}

export default App;