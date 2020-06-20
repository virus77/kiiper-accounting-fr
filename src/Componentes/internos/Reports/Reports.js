import React, { Component } from 'react';
import '../Css/styles.scss';
import { Button, Card, Form } from 'react-bootstrap';
import calls from '../../Js/calls';
import util from '../../Js/util';
import DropdownList  from 'react-widgets/lib/DropdownList';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
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
            { id: 2, text:'Mes Anterior' },
            { id: 3, text: 'Personalizado' },
        ];

        this.state = { 
            optionList,
            startDateLibroCompras: new Date(),
            finishDateLibroCompras: new Date(),
            showDateLibroCompras: false,
            optionSelectedLibroCompras: 0,
            msgLibroCompras:"",
            startDateLibroVentas: new Date(),
            finishDateLibroVentas: new Date(),
            showDateLibroVentas: false,
            optionSelectedLibroVentas: 0,
            msgLibroVentas:"",
            startDateDeclaracionIVA: new Date(),
            finishDateDeclaracionIVA: new Date(),
            showDateDeclaracionIVA: false,
            optionSelectedDeclaracionIVA: 0,
            msgDeclaracionIVA:"",
            startDateDeclaracionISLR: new Date(),
            finishDateDeclaracionISLR: new Date(),
            showDateDeclaracionISLR: false,
            optionSelectedDeclaracionISLR: 0,
            msgDeclaracionISLR:"",
            taxbookId: ""
        };

        this.handleClickLibroCompras = this.handleClickLibroCompras.bind(this);
        this.handleClickLibroVentas = this.handleClickLibroVentas.bind(this);
        this.handleClickDeclaracionIVA = this.handleClickDeclaracionIVA.bind(this);
        this.handleClickDeclaracionISLR = this.handleClickDeclaracionISLR.bind(this);
    }

    componentDidMount() {}

    /* Funciones Comunes */

    /* Funciones Libro de Compras */

    handleChangeStartDateLibroCompras = date => {
        console.log("start day LibroCompras ", date)
        this.setState({
            startDateLibroCompras: date
        });
    };

    handleChangeFinishDateLibroCompras = date => {
        console.log("finish day LibroCompras", date)
        this.setState({
            finishDateLibroCompras: date
        });
    };

    handleClickLibroCompras  = e => {
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

        console.log("dateeeee", x.isBefore(y))
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
        console.log("star day LibroVentas", date)
        this.setState({
            startDateLibroVentas: date
        });
    };

    handleChangeFinishDateLibroVentas = date => {
        console.log("finish day LibroVentas", date)
        this.setState({
            finishDateLibroVentas: date
        });
    };

    handleClickLibroVentas  = e => {
        console.log("handleClick LibroVentas", e);
        if (e.target.value === "3")  {
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


    /* Funciones Declaracion de IVA */
    handleChangeStartDateDeclaracionIVA = date => {
        console.log("star day DeclaracionIVA", date)
        this.setState({
            startDateDeclaracionIVA: date
        });
    };

    handleChangeFinishDateDeclaracionIVA = date => {
        console.log("finish day DeclaracionIVA", date)
        this.setState({
            finishDateDeclaracionIVA: date
        });
    };

    handleClickDeclaracionIVA  = e => {
        console.log("handleClick DeclaracionIVA", e)
        if (e.target.value === "3")  {
            this.setState({
                showDateDeclaracionIVA: true,
                optionSelectedDeclaracionIVA: e.id
            });
        } else {
            this.setState({
                showDateDeclaracionIVA: false,
                optionSelectedDeclaracionIVA: e.id
            });
        }
    };

        /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodDeclaracionIVA  = async () => {

        let x = moment(this.state.startDateDeclaracionIVA);
        let y = moment(this.state.finishDateDeclaracionIVA);

        if (x.isBefore(y)) {

            this.setState({
                msgDeclaracionIVA: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedDeclaracionIVA,
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
                msgDeclaracionIVA: 'Las fechas son inválidas',
            });
        }
        
    };

    /* Funciones  Declaracion Retenciones de ISLR */

    handleChangeStartDateDeclaracionISLR = date => {
        console.log("star day DeclaracionISLR", date)
        this.setState({
            startDateDeclaracionISLR: date
        });
    };

    handleChangeFinishDateDeclaracionISLR = date => {
        console.log("finish day DeclaracionISLR", date)
        this.setState({
            finishDateDeclaracionISLR: date
        });
    };

    handleClickDeclaracionISLR  = e => {
        console.log("handleClick DeclaracionISLR", e);
        if (e.target.value === "3") {
            this.setState({
                showDateDeclaracionISLR: true,
                optionSelectedDeclaracionISLR: e.id
            });
        } else {
            this.setState({
                showDateDeclaracionISLR: false,
                optionSelectedDeclaracionISLR: e.id
            });
        }
    };

            /// Funcion utilizada para obtener el periodo y enviar los parámetros 
    /// solicitados por medio de post para generar el guardado en Xero
    onGetPeriodDeclaracionISLR  = async () => {


        let x = moment(this.state.startDateDeclaracionISLR);
        let y = moment(this.state.finishDateDeclaracionISLR);

        if (x.isBefore(y)) {

            this.setState({
                msgDeclaracionISLR: '',
            });

            let taxbookId = await calls.getBook(this.props.orgIdSelected, this.state.optionSelectedDeclaracionISLR,
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
                msgDeclaracionISLR: 'Las fechas son inválidas',
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
                                <hr className="separator"/>
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
                                    { this.state.showDateLibroCompras?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div className="time-interval">Desde: </div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.startDateLibroCompras}
                                                    onChange={this.handleChangeStartDateLibroCompras}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div className="time-interval">Hasta: </div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.finishDateLibroCompras}
                                                    onChange={this.handleChangeFinishDateLibroCompras}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
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
                                <hr className="separator"/>
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
                                    { this.state.showDateLibroVentas?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.startDateLibroVentas}
                                                    onChange={this.handleChangeStartDateLibroVentas}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.finishDateLibroVentas}
                                                    onChange={this.handleChangeFinishDateLibroVentas}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>:null
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
                <hr className="separator"/>
                <div className="report-container">
                    <h2> Declaraciones </h2>
                    <div className="flex-container">
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Declaración de IVA</Card.Title>
                                <hr className="separator"/>
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedDeclaracionIVA}  
                                                    onChange={this.handleClickDeclaracionIVA} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    { this.state.showDateDeclaracionIVA ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.startDateDeclaracionIVA}
                                                    onChange={this.handleChangeStartDateDeclaracionIVA}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.finishDateDeclaracionIVA}
                                                    onChange={this.handleChangeFinishDateDeclaracionIVA}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
                                    }
                                    <span className="error-msg">{this.state.msgDeclaracionIVA}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate"  onClick={() => { this.onGetPeriodDeclaracionIVA() }}>
                                        Generar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Retenciones de ISLR</Card.Title>
                                <hr className="separator"/>
                                <Card.Text>
                                    <div className="flex-container">
                                        <div>Período:</div>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control as="select" className="ddlPeriodo" value={this.state.optionSelectedDeclaracionISLR}  
                                                    onChange={this.handleClickDeclaracionISLR} >
                                                    <option value="0">Seleccionar...</option>
                                                    <option value="1">Mes actual</option>
                                                    <option value="2">Mes anterior</option>
                                                    <option value="3">Personalizado</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    { this.state.showDateDeclaracionISLR?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.startDateDeclaracionISLR}
                                                    onChange={this.handleChangeStartDateDeclaracionISLR}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    className={"calendar"}
                                                    selected={this.state.finishDateDeclaracionISLR}
                                                    onChange={this.handleChangeFinishDateDeclaracionISLR}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
                                    }
                                    <span className="error-msg">{this.state.msgDeclaracionISLR}</span>
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="xeroGenerate" onClick={() => { this.onGetPeriodDeclaracionISLR() }}>
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