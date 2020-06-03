import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import calls from '../../Js/calls';
import util from '../../Js/util';

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

    componentDidMount() {
        //Getting data from Xero and building data grid
        calls.getConversions(this.props.orgIdSelected, this.props.bankData[0].id_bank_xero).then(result => {
            console.log("data 2", result);
        });
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
        this.setState({
          selectedFile: event.target.files[0],
        });
    }

    // uploadAction = e => {
    //     let h = new Headers();
    //     h.append('Accept','application/json');

    //     const data = new FormData();
    //     let file = e.target.files[0];
    //     console.log("file 2", file)
    //     data.append('file', file);
    //     data.append('id_bank_xero', this.props.bankData[0].id_bank_xero);
    //     data.append('organisationId', this.props.orgIdSelected);
            
    //     fetch('/convertBankStatement/BOD', {
    //         method: 'POST',
    //         body: data
    //     }).then(res => res.json()).then(result => console.log(result));
    // }

    onClickHandler = () => {

        var data = new FormData();
        data.append('file', this.state.selectedFile);
        data.append('id_bank_xero', this.props.bankData[0].id_bank_xero);
        data.append('organisationId', this.props.orgIdSelected);

        let _bank = util.bankType(this.props.bankData[0].name);

        calls.convertBankStatement(_bank[0]['url'], data).then(result => {
            console.log("data 3", result);
        });
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
                        <hr className="separator"/>
                        <li>Transformar estado de cuenta.
                            <ul>
                                <li>Adjunte el estado de cuenta en Examinar / Seleccionar Archivo / Browse / Choose File</li>
                                <li>Presione el botón Transformar archivo.</li>
                                <li>Descargue el estado de cuenta transformado en el botón Descargar</li>
                            </ul>
                            <br/>
                            <div className="container-button-load">
                                <input className="margin-left-button" type="file" name="file" onChange={this.onChangeHandler}/>
                                <button type="button" className="button-pill-blue" onClick={this.onClickHandler}>
                                    <div className="text"> Transformar Archivo </div>
                                </button>
                            </div>
                            <br/>
                        </li>
                        <hr className="separator"/>
                    </ol>
                </div>
            </div>
        );
    }
}

export default FileTransformationInformation;