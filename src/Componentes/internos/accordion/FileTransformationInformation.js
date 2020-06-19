import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import calls from '../../Js/calls';
import util from '../../Js/util';
import { AgGridReact } from 'ag-grid-react';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import { CSVLink, CSVDownload } from "react-csv";

class FileTransformationInformation extends Component {
    static propTypes = {
        //children: PropTypes.instanceOf(Object).isRequired,
    };

    constructor(props) {
        super(props);
        this.csvLink = React.createRef();

        const openSections = {};
        this.inputReference = React.createRef();

        const csvData = [
            { date: "2014-10-30", description: "COMISION DE MANTENIMIENTO DE C", amount: -4.5, reference: "19114800" },
            { date: "2014-10-30", description: "COMISION ENVIO ESTADOS DE CUEN", amount: -1.4, reference: "19114800" }
        ];

        this.state = {
            openSections,
            selectedFile: null,
            columnDefs: [],
            rowData: [],
            defaultColDef: { width: 250 },
            csvData,
            existFileTransformation: false,
            transformedFile: []
        };
    }

    onDownloadFile(id_conversion) {
        calls.getBankStatements(id_conversion,).then(result => {
            console.log("onDownloadFile data", result.data);

            this.setState({ transformedFile: result.data }, () => {
                // click the CSVLink component to trigger the CSV download

                setTimeout(function () {
                    this.csvLink.current.link.click();
                }.bind(this), 0);
            })
        });
    }

    onRowSelected(rowIndex, _rowData) {
        if (rowIndex != null) {
            if (_rowData['lastTransactionDate'] != "Sin transacciones")
                this.onDownloadFile(_rowData['id_conversion'])
        }
    }

    componentDidMount() {
        //Getting data from Xero and building data grid
        var _columnDefs = [
            //{ headerName: "Número de Conversión", field: "id_conversion", cellStyle: { textAlign: 'center' }, width: 150 },
            { headerName: "Fecha", field: "date", cellStyle: { textAlign: 'center' }, width: 150 },
            { headerName: "Última transacción", field: "lastTransactionDate", cellStyle: { textAlign: 'center' }, width: 150 },
            {
                headerName: "Descargar", field: "download", cellStyle: { textAlign: 'center' }, width: 150,
                cellRendererFramework: (props) => {
                    return (
                        (props.value === false) ? null :
                            <button> <span><i className="fa fa-download"></i></span> </button>
                    );
                }
            }
        ];
        var _rowData;
        calls.getConversions(this.props.orgIdSelected, this.props.bankData[0].id_bank_xero).then(result => {

            _rowData = result.data;
            let _newRowData = _rowData.map(function (e) {
                if (e.lastTransactionDate === "Sin transacciones") {
                    e['download'] = false;
                } else {
                    e['download'] = true;
                }
                return e;
            });

            console.log("getConversions List", result.data);

            this.setState({
                rowData: _newRowData,
                columnDefs: _columnDefs,
            });
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

    onChangeHandler = event => {
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
            console.log("onClickHandler data", result);

            this.setState({
                existFileTransformation: true
            });
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
                    <br />
                    <div>
                        <ol>
                            <li>
                                Descargue el estado de cuenta.
                                <ul>
                                    <li>Diríjase a la página web de su banco</li>
                                    <li>Se debe emitir el estado de cuenta desde el primer día del mes que desee cargar.</li>
                                    <li>Descargue el estado de cuenta en formato
                                        <span style={{ color: "#5540c2", fontWeight: "bold" }}> pdf </span>
                                        o
                                    <span style={{ color: "#5540c2", fontWeight: "bold" }}> txt</span></li>
                                </ul>
                                <br />
                            </li>
                            <hr className="separator" />
                            <li>
                                Transformar estado de cuenta.
                                <ul>
                                    <li>Adjunte el estado de cuenta en
                                        <span style={{ color: "#5540c2", fontWeight: "bold" }} > Examinar </span>
                                        /
                                        <span style={{ color: "#5540c2", fontWeight: "bold" }}> Seleccionar Archivo </span>
                                        /
                                        <span style={{ color: "#5540c2", fontWeight: "bold" }}> Browse </span>
                                        /
                                        <span style={{ color: "#5540c2", fontWeight: "bold" }}> Choose File </span>
                                    </li>
                                    <li>
                                        Presione el botón
                                    <span style={{ color: "#5540c2", fontWeight: "bold" }}> Transformar archivo.</span>
                                    </li>
                                    <li>
                                        Descargue el estado de cuenta transformado en el botón
                                    <span style={{ color: "#5540c2", fontWeight: "bold" }}> Descargar</span>
                                    </li>
                                </ul>
                                <br />
                                <div className="container-button-load">
                                    {/*<input className="margin-left-button" type="file" name="file" onChange={this.onChangeHandler}/>*/}
                                    <InputFile onChangeHandler={this.onChangeHandler} />
                                    <button type="button" className="button-pill-blue" onClick={this.onClickHandler}>
                                        <div className="text"> Transformar Archivo </div>
                                    </button>
                                </div>
                                {this.state.existFileTransformation ?
                                    <div className="file-path"> El archivo ha sido transformado exitosamente</div> : null
                                }
                                <CSVLink data={this.state.transformedFile}
                                    filename={`${this.props.bankData[0].name}-transformado.csv`}
                                    ref={this.csvLink}
                                    className="hidden">
                                </CSVLink>
                                <br />
                            </li>
                        </ol>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div id="myGrid" className="container-transformation ag-theme-alpine" style={{ height: "302px" }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        onCellFocused={e => {
                            this.onRowSelected(e.rowIndex, this.state.rowData[e.rowIndex])
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>

        );
    }
}

/// InputFile component
class InputFile extends Component {

    constructor(props) {
        super(props);
    }

    setFileInfo = event => {

        var fileName = "";
        var label = event.target.nextElementSibling,
            labelVal = label.innerHTML;

        if (event.target.files && event.target.files.length > 1)
            fileName = (event.target.getAttribute('data-multiple-caption') || '').replace('{count}', event.target.files.length);
        else
            fileName = event.target.value.split("\\").pop();

        if (fileName)
            label.innerHTML = fileName;
        else
            label.innerHTML = labelVal;

        this.props.onChangeHandler(event);
    }

    render() {
        return (
            <div className="inputFileContainer">
                <input
                    type="file"
                    name="file"
                    id="inputFile"
                    className="inputFile margin-left-button"
                    onChange={(event) => this.setFileInfo(event)}
                    data-multiple-caption="{count} files selected"
                    multiple
                />
                <label className="inputFileLabel" htmlFor="inputFile">Selecciona un archivo...</label>
            </div>
        );
    }
}

export default FileTransformationInformation;