import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import calls from '../../Js/calls';

class FileTransformationInformation extends Component {
    static propTypes = {
    //children: PropTypes.instanceOf(Object).isRequired,
    };

    constructor(props) {
        super(props);

        const openSections = {};
        this.inputReference = React.createRef();
        this.state = { 
            openSections,
            selectedFile: null
        };
    }

    onClick = label => {
        const {
            state: { openSections },
        } = this;

        const isOpen = !!openSections[label];

        this.setState({
            openSections: {
            [label]: !isOpen
            }
        });
    };

    onChangeHandler = event =>{
        // this.setState({
        //   selectedFile: event.target.files[0],
        // });
    }

    uploadAction = e => {
        const data = new FormData();
        const file = e.target.files[0];
        console.log("file", file)
        data.append('file', file);
        data.append('id_bank_xero', this.props.bankData[0].id_bank_xero);
        data.append('organisationId', this.props.orgIdSelected);

            
        fetch('/convertBankStatement/BOD', {
            method: 'POST',
            body: data
        }).then(res => res.json()).then(result => console.log(result));
    }

    onClickHandler = () => {

        // var data = new FormData()
        // data.append('file',  this.state.selectedFile);
        // data.append('id_bank_xero', this.props.bankData[0].id_bank_xero);
        // data.append('organisationId', this.props.orgIdSelected);

        // var _bankInfo = this.props.bankInfo;
        // console.log(data.get('file'))

        var data = new FormData();
        data.append('file', this.state.selectedFile);
        data.append('id_bank_xero', this.props.bankData[0].id_bank_xero);
        data.append('organisationId', this.props.orgIdSelected);
    
        fetch('/convertBankStatement/BOD', {
          method: 'POST',
          body: data
        }).then(res => res.json()).then(result => console.log(result));


        // fetch('/convertBankStatement/BOD', {
        //     method: 'POST',
        //     body: JSON.stringify({'id_bank_xero': this.props.bankData[0].id_bank_xero, 'organisationId':  this.props.orgIdSelected})
        // }).then(res => res.json()).then(result => console.log(result));

        // calls.convertBankStatement(_bankInfo[0]['url'], data).then(result => {
        //     console.log("data", result.data);
        // });
    }

    render() {
        const {
        onClick,
        props: { children },
        state: { openSections },
        } = this;

        return (
            <div className="container-transformation">
                <h3>{this.props.bankData[0].name}</h3>
                <div>Siga estas instrucciones para transformar el archivo:</div>
                <br/>
                <div>
                    <ol>
                        <li>En una nueva ventana, diríjase a la página web de su banco</li>
                        <hr className="separator"/>
                        <li>Descargue el estado de cuenta.
                            <ul>
                                <li>El formato del archivo debe ser pdf.</li>
                                <li>Se debe emitir el estado de cuenta desde el primer día del mes que desee cargar.</li>
                            </ul>
                        </li>
                        <hr className="separator"/>
                        <li>Transformar estado de cuenta.
                            <ul>
                                <li>Adjunte el estado de cuenta en Examinar / Seleccionar Archivo / Browse / Choose File</li>
                                <li>Presione el botón Transformar archivo.</li>
                                <li>Descargue el estado de cuenta transformado en el botón Descargar</li>
                            </ul>
                            <br/>
                            <div className="container-button-load">
                                <input className="margin-left-button" type="file" name="file" onChange={this.uploadAction}/>
                                {/* <button type="button" className="button-pill-blue" onClick={this.onClickHandler}>
                                    <div className="text"> Transformar Archivo </div>
                                </button> */}
                            </div>
                            <br/>
                            <div className="margin-left-button file-path">
                                {this.state.fileUploadState}
                            </div>
                        </li>
                        <hr className="separator"/>
                        <li>Importe en Xero el estado de cuenta transformado.
                            <ul>
                                <li>Diríjase a la página web de Xero</li>
                                <li>Inicie sesión.</li>
                                <li>En el menú principal diríjase a Accounts > Bank Accounts.</li>
                                <li>En el banco donde importará el estado de cuenta diríjase a Manage Account 
                                    > (Reconcile) Import a Statement.</li>
                                <li>En caso de ser necesario Xero mostrará la pantalla Statement Import Options 
                                    para configurar los campos del archivo que acaba de importar.
                                </li>
                                <li>Recuerde verificar que el saldo final del banco actualizado en Xero, 
                                    luego de importar el archivo, coincida con el saldo final en el estado de cuenta bancario.
                                </li>
                            </ul>
                        </li>
                        <hr className="separator"/>
                    </ol>
                    <button className="button-pill-blue">
                        <div className="text"> Volver </div>
                    </button>
                </div>
            </div>
        );
    }
}

export default FileTransformationInformation;