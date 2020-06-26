import React, { Component } from 'react';
import '../Css/styles.scss';
import { Button, Card, Form } from 'react-bootstrap';
import calls from '../../Js/calls';
import util from '../../Js/util';
import DropdownList from 'react-widgets/lib/DropdownList';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';

/// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../Css/books.css'

registerLocale('es', es);
var moment = require('moment'); /// require


class Reports extends Component {

    constructor(props) {
        super(props);

        var optionList = [
            { id: 0, text: 'Seleccionar...' },
            { id: 1, text: 'Mes Actual' },
            { id: 2, text: 'Mes Anterior' },
            { id: 3, text: 'Personalizado' },
        ];

        this.state = {
            optionList,
            startDateLibroCompras: new Date(),
            finishDateLibroCompras: new Date(),
            showDateLibroCompras: false,
            optionSelectedLibroCompras: 0,
            msgLibroCompras: "",
            startDateLibroVentas: new Date(),
            finishDateLibroVentas: new Date(),
            showDateLibroVentas: false,
            optionSelectedLibroVentas: 0,
            msgLibroVentas: "",
            startDateRetencionesIVA: new Date(),
            finishDateRetencionesIVA: new Date(),
            showDateRetencionesIVA: false,
            optionSelectedRetencionesIVA: 0,
            msgRetencionesIVA: "",
            startDateRetencionesISLR: new Date(),
            finishDateRetencionesISLR: new Date(),
            showDateRetencionesISLR: false,
            optionSelectedRetencionesISLR: 0,
            msgRetencionesISLR: "",
            taxbookId: ""
        };

        this.handleClickLibroCompras = this.handleClickLibroCompras.bind(this);
        this.handleClickLibroVentas = this.handleClickLibroVentas.bind(this);
        this.handleClickRetencionesIVA = this.handleClickRetencionesIVA.bind(this);
        this.handleClickRetencionesISLR = this.handleClickRetencionesISLR.bind(this);
    }

    componentDidMount() { }

    /* Funciones Comunes */

    /* Funciones Libro de Compras */

    handleChangeStartDateLibroCompras = date => {
        let startDate = moment(date).format("DD/MM/YYYY");
        let endDate = moment(document.getElementById("dtpkHastaCompras").value).format("DD/MM/YYYY");
        if (util.compareDates(startDate, endDate) === 1) {
            this.setState({ msgLibroCompras: 'Fecha desde, no puede ser mayor a fecha hasta' });
        } else {
            this.setState({ startDateLibroCompras: date, msgLibroCompras: '' });
        }
    };

    handleChangeFinishDateLibroCompras = date => {
        let endDate = moment(date).format("DD/MM/YYYY");
        let StartDate = moment(document.getElementById("dtpkDesdeCompras").value).format("DD/MM/YYYY");
        if (util.compareDates(endDate, StartDate) === -1) {
            this.setState({ msgLibroCompras: 'Fecha hasta, no puede ser menor a fecha desde' });
        } else {
            this.setState({ finishDateLibroCompras: date, msgLibroCompras: '' });
        }
    };

    handleClickLibroCompras = e => {
        console.log("handleClick LibroCompra", e.target.value)
        if (e.target.value === "3") {
            this.setState({
                showDateLibroCompras: true,
                optionSelectedLibroCompras: e.id
            });
        } else {
            this.setState({
                showDateLibroCompras: false,
                optionSelectedLibroCompras: e.id
            });
        }
    };

    /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodLibroCompras = async () => {

        let x = moment(this.state.startDateLibroCompras)
        let y = moment(this.state.finishDateLibroCompras)

        if (x.isBefore(y)) {

            this.setState({
                msgLibroCompras: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedLibroCompras,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"),
                "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookId: taxbookId.data });
                console.log("Se generó correctamente");
            }
        } else {
            this.setState({
                msgLibroCompras: 'Las fechas son inválidas',
            });
        }

    };

    /* Funciones Libro de Ventas */

    handleChangeStartDateLibroVentas = date => {
        let startDate = moment(date).format("DD/MM/YYYY");
        let endDate = moment(document.getElementById("dtpkHastaVentas").value).format("DD/MM/YYYY");
        if (util.compareDates(startDate, endDate) === 1) {
            this.setState({ msgLibroVentas: 'Fecha desde, no puede ser mayor a fecha hasta' });
        } else {
            this.setState({ startDateLibroVentas: date, msgLibroVentas: '' });
        }
    };

    handleChangeFinishDateLibroVentas = date => {
        let endDate = moment(date).format("DD/MM/YYYY");
        let StartDate = moment(document.getElementById("dtpkDesdeVentas").value).format("DD/MM/YYYY");
        if (util.compareDates(endDate, StartDate) === -1) {
            this.setState({ msgLibroVentas: 'Fecha hasta, no puede ser menor a fecha desde' });
        } else {
            this.setState({ finishDateLibroVentas: date, msgLibroVentas: '' });
        }
    };

    handleClickLibroVentas = e => {
        console.log("handleClick LibroVentas", e);
        if (e.target.value === "3") {
            this.setState({
                showDateLibroVentas: true,
                optionSelectedLibroVentas: e.id
            });
        } else {
            this.setState({
                showDateLibroVentas: false,
                optionSelectedLibroVentas: e.id
            });
        }
    };

    /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodLibroVentas = async () => {

        let x = moment(this.state.startDateLibroVentas);
        let y = moment(this.state.finishDateLibroVentas);

        if (x.isBefore(y)) {

            this.setState({
                msgLibroVentas: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedLibroVentas,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"),
                "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookId: taxbookId.data });
                console.log("Se generó correctamente");
            }

        } else {
            this.setState({
                msgLibroVentas: 'Las fechas son inválidas',
            });
        }
    };

    /* Funciones Retenciones de IVA */
    handleChangeStartDateRetencionesIVA = date => {
        let startDate = moment(date).format("DD/MM/YYYY");
        let endDate = moment(document.getElementById("dtpkHastaRetencionesIVA").value).format("DD/MM/YYYY");
        if (util.compareDates(startDate, endDate) === 1) {
            this.setState({ msgRetencionesIVA: 'Fecha desde, no puede ser mayor a fecha hasta' });
        } else {
            this.setState({ startDateRetencionesIVA: date, msgRetencionesIVA: '' });
        }
    };

    handleChangeFinishDateRetencionesIVA = date => {
        let endDate = moment(date).format("DD/MM/YYYY");
        let StartDate = moment(document.getElementById("dtpkDesdeRetencionesIVA").value).format("DD/MM/YYYY");
        if (util.compareDates(endDate, StartDate) === -1) {
            this.setState({ msgRetencionesIVA: 'Fecha hasta, no puede ser menor a fecha desde' });
        } else {
            this.setState({ finishDateRetencionesIVA: date, msgRetencionesIVA: '' });
        }
    };

    handleClickRetencionesIVA = e => {
        console.log("handleClick RetencionesIVA", e)
        if (e.target.value === "3") {
            this.setState({
                showDateRetencionesIVA: true,
                optionSelectedRetencionesIVA: e.id
            });
        } else {
            this.setState({
                showDateRetencionesIVA: false,
                optionSelectedRetencionesIVA: e.id
            });
        }
    };

    /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodRetencionesIVA = async () => {

        let x = moment(this.state.startDateRetencionesIVA);
        let y = moment(this.state.finishDateRetencionesIVA);

        if (x.isBefore(y)) {

            this.setState({
                msgRetencionesIVA: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedRetencionesIVA,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"),
                "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookId: taxbookId.data });
                console.log("Se generó correctamente");
            }
        } else {
            this.setState({
                msgRetencionesIVA: 'Las fechas son inválidas',
            });
        }

    };

    /* Funciones  Retenciones Retenciones de ISLR */

    handleChangeStartDateRetencionesISLR = date => {
        let startDate = moment(date).format("DD/MM/YYYY");
        let endDate = moment(document.getElementById("dtpkHastaRetencionesISLR").value).format("DD/MM/YYYY");
        if (util.compareDates(startDate, endDate) === 1) {
            this.setState({ msgRetencionesISLR: 'Fecha desde, no puede ser mayor a fecha hasta' });
        } else {
            this.setState({ startDateRetencionesISLR: date, msgRetencionesISLR: '' });
        }
    };

    handleChangeFinishDateRetencionesISLR = date => {
        let endDate = moment(date).format("DD/MM/YYYY");
        let StartDate = moment(document.getElementById("dtpkDesdeRetencionesISLR").value).format("DD/MM/YYYY");
        if (util.compareDates(endDate, StartDate) === -1) {
            this.setState({ msgRetencionesISLR: 'Fecha hasta, no puede ser menor a fecha desde' });
        } else {
            this.setState({ finishDateRetencionesISLR: date, msgRetencionesISLR: '' });
        }
    };

    handleClickRetencionesISLR = e => {
        console.log("handleClick RetencionesISLR", e);
        if (e.target.value === "3") {
            this.setState({
                showDateRetencionesISLR: true,
                optionSelectedRetencionesISLR: e.id
            });
        } else {
            this.setState({
                showDateRetencionesISLR: false,
                optionSelectedRetencionesISLR: e.id
            });
        }
    };

    /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodRetencionesISLR = async () => {


        let x = moment(this.state.startDateRetencionesISLR);
        let y = moment(this.state.finishDateRetencionesISLR);

        if (x.isBefore(y)) {

            this.setState({
                msgRetencionesISLR: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedRetencionesISLR,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"),
                "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookId: taxbookId.data });
                console.log("Se generó correctamente");
            }
        } else {
            this.setState({
                msgRetencionesISLR: 'Las fechas son inválidas',
            });
        }
    };

    render() {
        return (
            <div className="padding-accordion-bank">
                <div className="report-container">
                    <h2> Libros Fiscales </h2>
                    <div className="flex-container">
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Libro de Compras</Card.Title>
                                <hr className="separator" />
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedLibroCompras}
                                                    onChange={this.handleClickLibroCompras} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    {this.state.showDateLibroCompras ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div className="time-interval">Desde: </div>
                                                <DatePicker
                                                    id="dtpkDesdeCompras"
                                                    className={"calendar"}
                                                    selected={this.state.startDateLibroCompras}
                                                    onChange={this.handleChangeStartDateLibroCompras}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                            <div className="inline-date">
                                                <div className="time-interval">Hasta: </div>
                                                <DatePicker
                                                    id="dtpkHastaCompras"
                                                    className={"calendar"}
                                                    selected={this.state.finishDateLibroCompras}
                                                    onChange={this.handleChangeFinishDateLibroCompras}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                        </div> : null
                                    }
                                    <span className="error-msg">{this.state.msgLibroCompras}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate"
                                        onClick={() => { this.onGetPeriodLibroCompras() }}>
                                        Generar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Libros de Ventas</Card.Title>
                                <hr className="separator" />
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedLibroVentas}
                                                    onChange={this.handleClickLibroVentas} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    {this.state.showDateLibroVentas ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div className="time-interval">Desde:</div>
                                                <DatePicker
                                                    id="dtpkDesdeVentas"
                                                    className={"calendar"}
                                                    selected={this.state.startDateLibroVentas}
                                                    onChange={this.handleChangeStartDateLibroVentas}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                            <div className="inline-date">
                                                <div className="time-interval">Hasta:</div>
                                                <DatePicker
                                                    id="dtpkHastaVentas"
                                                    className={"calendar"}
                                                    selected={this.state.finishDateLibroVentas}
                                                    onChange={this.handleChangeFinishDateLibroVentas}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                        </div> : null
                                    }
                                    <span className="error-msg">{this.state.msgLibroVentas}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate"
                                        onClick={() => { this.onGetPeriodLibroVentas() }}>Generar</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <hr className="separator" />
                <div className="report-container">
                    <h2> Retenciones </h2>
                    <div className="flex-container">
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Retenciones de ISLR</Card.Title>
                                <hr className="separator" />
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedRetencionesISLR}
                                                    onChange={this.handleClickRetencionesISLR} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    {this.state.showDateRetencionesISLR ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div className="time-interval">Desde:</div>
                                                <DatePicker
                                                    id="dtpkDesdeRetencionesISLR"
                                                    className={"calendar"}
                                                    selected={this.state.startDateRetencionesISLR}
                                                    onChange={this.handleChangeStartDateRetencionesISLR}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                            <div className="inline-date">
                                                <div className="time-interval">Hasta:</div>
                                                <DatePicker
                                                    id="dtpkHastaRetencionesISLR"
                                                    className={"calendar"}
                                                    selected={this.state.finishDateRetencionesISLR}
                                                    onChange={this.handleChangeFinishDateRetencionesISLR}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                        </div> : null
                                    }
                                    <span className="error-msg">{this.state.msgRetencionesISLR}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate" onClick={() => { this.onGetPeriodRetencionesISLR() }}>
                                        Generar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Retenciones de IVA</Card.Title>
                                <hr className="separator" />
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedRetencionesIVA}
                                                    onChange={this.handleClickRetencionesIVA} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    {this.state.showDateRetencionesIVA ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div className="time-interval">Desde:</div>
                                                <DatePicker
                                                    id="dtpkDesdeRetencionesIVA"
                                                    className={"calendar"}
                                                    selected={this.state.startDateRetencionesIVA}
                                                    onChange={this.handleChangeStartDateRetencionesIVA}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                            <div className="inline-date">
                                                <div className="time-interval">Hasta:</div>
                                                <DatePicker
                                                    id="dtpkHastaRetencionesIVA"
                                                    className={"calendar"}
                                                    selected={this.state.finishDateRetencionesIVA}
                                                    onChange={this.handleChangeFinishDateRetencionesIVA}
                                                    locale="es"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                />
                                            </div>
                                        </div> : null
                                    }
                                    <span className="error-msg">{this.state.msgRetencionesIVA}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate" onClick={() => { this.onGetPeriodRetencionesIVA() }}>
                                        Generar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </div>
        );
    }
}

export default Reports;