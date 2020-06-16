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
            startDate: new Date()
        };
    }

    componentDidMount() {}


    handleChange = date => {
        this.setState({
          startDate: date
        });
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
                                            data={this.state.optionList}
                                            valueField="id"
                                            textField="text"
                                            groupBy='Grupo' />
                                    </div>
                                    <div className="date-container">
                                        <div className="inline-date">
                                            <div>Desde:</div>
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                                locale="es"
                                            /> 
                                        </div>
                                        <div className="inline-date">
                                            <div>Hasta:</div>
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                                locale="es"
                                            /> 
                                        </div> 
                                    </div>
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
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
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
                                <Card.Title>Retenciones IVA</Card.Title>
                                <hr className="separator"/>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>
                        <Card className="card-container">
                            <Card.Body>
                                <Card.Title>Retenciones ISLR</Card.Title>
                                <hr className="separator"/>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default Reports;