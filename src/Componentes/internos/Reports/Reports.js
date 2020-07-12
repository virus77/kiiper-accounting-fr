import React, { Component } from 'react';

/// controles
import { Button, Card, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Variation
import es from 'date-fns/locale/es';

/// Componentes
import calls from '../../Js/calls';
import util from '../../Js/util';

/// CSS
import '../Css/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../Css/books.css'

/// Imágenes
import ExcelImage from '../Css/kiiper_Excel.png'

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
            taxbookIdVentas: "",
            taxbookIdCompras: "",
            IdStatementIVA: "",
            IdStatementISLR: "",
            open: false,
            setOpen: false,
            tipo: "",
            dueDate: new Date()
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
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"), "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookIdCompras: taxbookId.data });
                alert("El preriodo se guardo correctamente en Xero");
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
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"), "/purchasesBook");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ taxbookIdVenntas: taxbookId.data });
                alert("El preriodo se guardo correctamente en Xero");
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
            this.setState({ finishDateRetencionesIVA: date, msgRetencionesIVA: '', setOpen: true, tipo: "IVA" });
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
        let z = moment(this.state.duDate);

        if (x.isBefore(y)) {

            this.setState({ msgRetencionesIVA: '', });

            let taxbookId = await calls.getBookRetention(this.props.orgIdSelected, this.state.optionSelectedRetencionesIVA,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"), z.format("DD/MM/YYYY"), "/taxIVAReport");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ IdStatementIVA: taxbookId.data, setOpen: false });
                alert("El preriodo se guardo correctamente en Xero");
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
            this.setState({ finishDateRetencionesISLR: date, msgRetencionesISLR: '', setOpen: true, tipo: "ISLR" });
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
        let z = moment(this.state.duDate);
        if (x.isBefore(y)) {

            this.setState({ msgRetencionesISLR: '', });

            let taxbookId = await calls.getBookRetention(this.props.orgIdSelected, this.state.optionSelectedRetencionesISLR,
                y.format("DD/MM/YYYY"), x.format("DD/MM/YYYY"), z.format("DD/MM/YYYY"), "/taxISLRReport");

            if (taxbookId.data === false)
                console.log("Ocurrió un problema al momento de guardar en Xero");
            else {
                this.setState({ IdStatementISLR: taxbookId.data, setOpen: false });
                alert("El preriodo se guardo correctamente en Xero");
            }
        } else {
            this.setState({ msgRetencionesISLR: 'Las fechas son inválidas' });
        }
    };

    /// Funcion utilizada para generar el excel obteniendo desde 
    /// un get en base64 el archivo generado
    /// @param {text} origen - Texto para identificar de donde proviene el llamado
    onDownloadExcel = async (origen) => {
        let resp = "";
        switch (origen) {
            case "Ventas":
                //await calls.getDocumentByTaxbookId(this.state.taxbookIdVentas, "/generateSalesBook");
                resp = await calls.getDocumentByTaxbookId("5ee552b80446db0b64bf49f9", "/generateSalesBook");
                break;

            case "Compras":
                //await calls.getDocumentByTaxbookId(this.state.taxbookIdCompras, "/generatePurchasesBook");
                resp = await calls.getDocumentByTaxbookId("5ee552b80446db0b64bf49f9", "/generatePurchasesBook");
                break;

            case "IVA":
                //await calls.getDocumentByIdStatement(this.state.IdStatementIVA, "/downloadAuxiliarTaxReport");
                resp = await calls.getDocumentByIdStatement("5ee552b80446db0b64bf49f9", "/downloadAuxiliarTaxReport");
                break;

            case "ISLR":
                //await calls.getDocumentByIdStatement(this.state.IdStatementISLR, "/downloadAuxiliarTaxReport");
                resp = await calls.getDocumentByIdStatement("5ee552b80446db0b64bf49f9", "/downloadAuxiliarTaxReport");
                break;

            default:
                break;
        }

        if (resp === false)
            console.log("No se logro descargar el excel");
    }

    // función asignada para cerrar el modal
    handleClose = () => {
        this.setState({ setOpen: false });
    };

    // función asignada para obtener el duedate
    handleChangeDueDate = date => {
        this.setState({ dueDate: date });
    };

    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
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
                                    <div className="date-container">
                                        <br />
                                        <br />
                                        <div className="myPosition inline-date">
                                            <Button className="xeroGenerate" onClick={() => { this.onGetPeriodLibroCompras() }}>
                                                Generar
                                    </Button>
                                        </div>
                                        <div className="myPosition inline-date">
                                            <div>
                                                <span style={{ cursor: "pointer" }} onClick={(event) => this.onDownloadExcel("Compras")} >
                                                    <img border="0" src={ExcelImage} />
                                                </span>
                                            </div>
                                        </div>
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
                                    <div className="date-container">
                                        <div className="myPosition inline-date">
                                            <br />
                                            <Button className="xeroGenerate" onClick={() => { this.onGetPeriodLibroVentas() }}>Generar</Button>
                                        </div>
                                        <div className="myPosition inline-date" >
                                            <div>
                                                <span style={{ cursor: "pointer" }} onClick={(event) => this.onDownloadExcel("Ventas")} >
                                                    <img border="0" src={ExcelImage} />
                                                </span>
                                            </div>
                                        </div>
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
                                        <br />
                                        <div style={{ paddingLeft: "10px" }} >
                                            <span style={{ cursor: "pointer" }} onClick={(event) => this.onDownloadExcel("ISLR")} >
                                                <img border="0" src={ExcelImage} />
                                            </span>
                                        </div>
                                    </Card.Text>
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
                                        <br />
                                        <div style={{ paddingLeft: "10px" }} >
                                            <span style={{ cursor: "pointer" }} onClick={(event) => this.onDownloadExcel("IVA")} >
                                                <img border="0" src={ExcelImage} />
                                            </span>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Dialog open={this.state.setOpen} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">
                                    <span style={{ color: "white" }}>¡Atención!</span>
                                </DialogTitle>
                                <DialogContent style={{ color: "#212529" }}>
                                    <DialogContentText >
                                        ¿Está seguro que desea generar el reporte?
                                        <br />
                                        <br />
                                Este archivo será borrador de una declaración. De ser así,
                                favor de ingresar la fecha límite de pago
                                </DialogContentText>
                                Fecha Límite:
                                <br />
                                    <DatePicker
                                        id="dtpDueDate"
                                        className={"calendarDueDate"}
                                        selected={this.state.dueDate}
                                        onChange={this.handleChangeDueDate}
                                        locale="es"
                                        showMonthDropdown
                                        showYearDropdown
                                    />
                                </DialogContent>
                                <div className="date-container">
                                    <div className="inline-date">
                                        <Button className="xeroGenerate" onClick={(event) => this.state.tipo === "IVA" ? this.onGetPeriodRetencionesIVA() : this.onGetPeriodRetencionesISLR()} color="primary">
                                            Aceptar
                                    </Button>
                                    </div>
                                    <div className="inline-date">
                                        <div>
                                            <Button className="xeroGenerate" onClick={(event) => this.handleClose()} color="primary">
                                                Cancelar
                                        </Button>
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </Dialog>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default Reports;