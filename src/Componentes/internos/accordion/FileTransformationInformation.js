import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';

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
            fileUploadState:"",
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

    fileUploadAction = () => this.inputReference.current.click();

    fileUploadInputChange = (e) =>this.setState({fileUploadState:e.target.value});

    render() {
        const {
        onClick,
        props: { children },
        state: { openSections },
        } = this;

        return (
            <div className="container-transformation">
                <h3>Chase Bank</h3>
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
                                <input type="file" hidden ref={this.inputReference} 
                                    onChange={this.fileUploadInputChange} />
                                <button className="margin-left-button button-pill-blue" onClick={this.fileUploadAction}>
                                    <div className="text"> Cargar imagen</div>
                                </button>

                                <button className="button-pill-blue">
                                    <div className="text"> Transformar Archivo </div>
                                </button>
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