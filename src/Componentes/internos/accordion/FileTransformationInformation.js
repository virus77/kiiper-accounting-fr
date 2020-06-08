import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import calls from '../../Js/calls';
import util from '../../Js/util';
import { AgGridReact } from 'ag-grid-react';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

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
            selectedFile: null,
            columnDefs: [
                { headerName: "Número de Conversión", field: "id" , cellStyle: {textAlign: 'center'}, width: 200}, 
                { headerName: "Fecha", field: "date", cellStyle: {textAlign: 'center'}, width: 200}, 
                { headerName: "Conversión", field: "file", width: 100, cellStyle: {textAlign: 'center'},  width: 200,
                cellRenderer: function(params) {
                    return (params.value == 1)? '<span><i class="fa fa-download"></i></span>': 'Sin Transacciones';
                }}
            ],
            rowData: [
                { id: "5879", date: "20/06/2019", file: 1 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
                { id: "5880", date: "20/06/2019", file: 0 },
            ],
            defaultColDef:{ width: 250 }
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
            <div>
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
                <br></br>
                <br></br>
                <div id="myGrid" className="container-transformation ag-theme-alpine"  style={{ height: "302px" }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                    >
                    </AgGridReact>
                </div>
            </div>
            
        );
    }
}

export default FileTransformationInformation;