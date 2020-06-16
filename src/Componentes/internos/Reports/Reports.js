import React, { Component } from 'react';
import '../Css/styles.scss';
import { Button, Card } from 'react-bootstrap';
import calls from '../../Js/calls';
import util from '../../Js/util';
import DropdownList  from 'react-widgets/lib/DropdownList';
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es)

class Reports extends Component {

    constructor(props) {
        super(props);

        var optionList = [
            { id: 0, text: 'Mes Actual' },
            { id: 1, text:'Mes Anterior' },
            { id: 2, text: 'Personalizado' },
        ];

        this.state = { 
            optionList,
            startDateLibroCompras: new Date(),
            finishDateLibroCompras: new Date(),
            showDateLibroCompras: false,
            startDateLibroVentas: new Date(),
            finishDateLibroVentas: new Date(),
            showDateLibroVentas: false,
            startDateDeclaracionIVA: new Date(),
            finishDateDeclaracionIVA: new Date(),
            showDateDeclaracionIVA: false,
            startDateDeclaracionISLR: new Date(),
            finishDateDeclaracionISLR: new Date(),
            showDateDeclaracionISLR: false,
        };
    }

    componentDidMount() {}

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
        console.log("handleClick LibroCompra", e)
        if (e.id === 2) {
            this.setState({
                showDateLibroCompras: true
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
        if (e.id === 2) {
            this.setState({
                showDateLibroVentas: true
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
        if (e.id === 2) {
            this.setState({
                showDateDeclaracionIVA: true
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
            finishDateDeclaracionISRL: date
        });
    };

    handleClickDeclaracionISLR  = e => {
        console.log("handleClick DeclaracionISLR", e);
        if (e.id === 2) {
            this.setState({
                showDateDeclaracionISLR: true
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
                                        <DropdownList
                                            style={{ width: "150px" }}
                                            onChange={value => this.handleClickLibroCompras(value)}
                                            data={this.state.optionList}
                                            valueField="id"
                                            textField="text"
                                            groupBy='Grupo' />
                                    </div>
                                    { this.state.showDateLibroCompras?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    selected={this.state.startDateLibroCompras}
                                                    onChange={this.handleChangeStartDateLibroCompras}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    selected={this.state.finishDateLibroCompras}
                                                    onChange={this.handleChangeFinishDateLibroCompras}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
                                    }
                                    
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="btn-width">Generar</Button>
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
                                        <DropdownList
                                            style={{ width: "150px" }}
                                            data={this.state.optionList}
                                            valueField="id"
                                            textField="text"
                                            onChange={value => this.handleClickLibroVentas(value)}
                                            groupBy='Grupo' />
                                    </div>
                                    { this.state.showDateLibroVentas?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    selected={this.state.startDateLibroVentas}
                                                    onChange={this.handleChangeStartDateLibroVentas}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    selected={this.state.finishDateLibroVentas}
                                                    onChange={this.handleChangeFinishDateLibroVentas}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>:null
                                    }
                                    
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="btn-width">Generar</Button>
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
                                        <DropdownList
                                            style={{ width: "150px" }}
                                            data={this.state.optionList}
                                            valueField="id"
                                            textField="text"
                                            onChange={value => this.handleClickDeclaracionIVA(value)}
                                            groupBy='Grupo' />
                                    </div>
                                    { this.state.showDateDeclaracionIVA ?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    selected={this.state.startDateDeclaracionIVA}
                                                    onChange={this.handleChangeStartDateDeclaracionIVA}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    selected={this.state.finishDateDeclaracionIVA}
                                                    onChange={this.handleChangeFinishDateDeclaracionIVA}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
                                    }
                                    
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="btn-width">Generar</Button>
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
                                        <DropdownList
                                            style={{ width: "150px" }}
                                            data={this.state.optionList}
                                            valueField="id"
                                            textField="text"
                                            onChange={value => this.handleClickDeclaracionISLR(value)}
                                            groupBy='Grupo' />
                                    </div>
                                    { this.state.showDateDeclaracionISLR?
                                        <div className="date-container">
                                            <div className="inline-date">
                                                <div>Desde:</div>
                                                <DatePicker
                                                    selected={this.state.startDateDeclaracionISLR}
                                                    onChange={this.handleChangeStartDateDeclaracionISLR}
                                                    locale="es"
                                                /> 
                                            </div>
                                            <div className="inline-date">
                                                <div>Hasta:</div>
                                                <DatePicker
                                                    selected={this.state.finishDateDeclaracionISLR}
                                                    onChange={this.handleChangeFinishDateDeclaracionISLR}
                                                    locale="es"
                                                /> 
                                            </div> 
                                        </div>: null
                                    }
                                    
                                </Card.Text>
                                <div className="btn-generate">
                                    <Button className="btn-width">Generar</Button>
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