import React, { Component } from 'react';

/// Controles
import { Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import calls from '../../Js/calls';

/// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../Css/books.css'

/// Imágenes
import ExcelImage from '../Css/kiiper_Excel.png'

/// Variables
/// Funcion utilizada para registrar el idioma del calendario
registerLocale('es', es); /// require
var moment = require('moment'); /// require

class salesBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDateB: "",
            startDateA: "",
            value: '',
            visible: false,
            taxbookId: ""
        };

        this.handleChange = this.handleChange.bind(this);
    };

    /// Set calendar "From" option selected in state
    handleChangeDatePkB = date => { this.setState({ startDateB: date }); };

    /// Set calendar "To" option selected in state
    handleChangeDatePkA = date => { this.setState({ startDateA: date }); };

    /// Ses selected option in seelct field and uodate state visible
    /// @param {object} event - Object get array elements from field select
    handleChange(event) {
        if (event.target.value === "3")
            this.setState({ value: event.target.value, visible: true });
        else
            this.setState({ value: event.target.value, visible: false });
    }

    /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriod = async () => {
        if (this.state.value !== "") {
            let taxbookId = await calls.getSalesBook(this.props.orgIdSelected, this.state.value,
                moment(this.state.startDateB).format("DD/MM/YYYY"), moment(this.state.startDateA).format("DD/MM/YYYY"),
                "/salesBook");

            if (taxbookId.data === false)
                alert("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookId: taxbookId.data });
                alert("Se generó correctamente");
            }
        }
        else {
            alert("Favor de seleccionar un periodo");
        }
    }

    /// Funcion utilizada para generar el excel obteniendo desde un get 
    /// en base64 el archivo generado
    onDownloadExcel = async () => {
        let resp = false;//await calls.getDocumentByTaxbookId(this.state.taxbookId, "/generateSalesBook");

        if (resp === false)
            resp = await calls.getDocumentByTaxbookId("5ee552b80446db0b64bf49f9", "/generateSalesBook");

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/octet-stream;base64,' + resp.data);
        element.setAttribute('download', "excel.xls");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row" style={{ paddingTop: "1.5%" }}>
                        <div style={{ paddingTop: "8px" }} >
                            <Form>
                                <Form.Group>
                                    <Form.Label>Periodo: </Form.Label>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="col-md-11"  >
                            <Form>
                                <Form.Group>
                                    <Form.Control as="select" id="ddlPeriodo" value={this.state.value} onChange={this.handleChange} >
                                        <option value="0">Seleccionar...</option>
                                        <option value="1">Mes actual</option>
                                        <option value="2">Mes anterior</option>
                                        <option value="3">Personalizado</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </div >
                    </div>
                    {this.state.visible === true ?
                        <div className="row">
                            <div style={{ paddingTop: "8px" }} >
                                <Form>
                                    <Form.Group>
                                    </Form.Group>
                                    <Form.Group  >
                                        <Form.Label>Desde: &nbsp;</Form.Label>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div className="col-md-2">
                                <Form>
                                    <Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <DatePicker
                                            id="txtBefore"
                                            locale="es"
                                            className={"calendar"}
                                            selected={this.state.startDateB}
                                            onChange={this.handleChangeDatePkB}
                                            showMonthDropdown
                                            showYearDropdown
                                        />
                                    </Form.Group>
                                </Form>
                            </div>
                            <div className="col-md-1" style={{ marginLeft: 20, paddingTop: "8px" }} >
                                <Form >
                                    <Form.Group>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Hasta: </Form.Label>
                                    </Form.Group>
                                </Form>
                            </div >
                            <div className="col-md-2">
                                <Form >
                                    <Form.Group>
                                    </Form.Group>
                                    <Form.Group>
                                        <DatePicker
                                            id="txtAfter"
                                            locale="es"
                                            className={"calendar"}
                                            selected={this.state.startDateA}
                                            onChange={this.handleChangeDatePkA}
                                            showMonthDropdown
                                            showYearDropdown
                                        />
                                    </Form.Group>
                                </Form>
                            </div >
                            <div className="col-md-6"></div>
                        </div >
                        : null}
                    <div className="row" style={{ paddingTop: "2%", paddingBottom: "15%" }}>
                        <Form>
                            <span id="xeroGenerate" style={{ cursor: "pointer" }} onClick={() => { this.onGetPeriod() }} >
                                Generar
                            </span>
                        </Form>
                        <div style={{ paddingTop: "1.5%" }} className="col-md-12">
                            <Form>
                                <div>
                                    <span style={{ cursor: "pointer" }} onClick={this.onDownloadExcel} >
                                        <img border="0" src={ExcelImage} />
                                    </span>
                                </div>
                            </Form>
                        </div >
                    </div>
                </div>
            </div >
        );
    }
}

export default salesBook;