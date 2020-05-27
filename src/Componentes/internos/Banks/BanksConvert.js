import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import Accordion from '../accordion/Accordion';
import FileTransformationInformation from '../accordion/FileTransformationInformation';

class BanksConvert extends Component {
    
    static propTypes = {
    //children: PropTypes.instanceOf(Object).isRequired,
    };

    constructor(props) {
        super(props);
        var openConvert = false;
        const openSections = {};

        this.state = { openSections, openConvert };
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

    onClickConvert = label => {
        const {
            state: { openConvert },
        } = this;

        this.setState({
            openConvert: !openConvert
        });
    }

    render() {
        const {
            onClickConvert,
            state: { openConvert },
        } = this;

        return (
            <div className="padding-accordion-bank">
                { !openConvert? 
                <Accordion>
                    <div label='Banco de Venezuela #6835'>
                        <p className="color-blue-background">Estado de Cuenta</p>
                        <div className="accordion-flex">
                            <a className="color-blue-background underline"  onClick={onClickConvert}> Convertir </a>
                            <a className="color-blue-background underline"> Consultar </a>
                        </div>
                    </div> 
                    <div label='Banco Mercantil #0413'>
                        <p className="color-blue-background">Estado de Cuenta</p>
                        <div className="accordion-flex">
                            <a className="color-blue-background underline" onClick={onClickConvert}> Convertir </a>
                            <a className="color-blue-background underline"> Consultar </a>
                        </div>
                    </div>
                    <div label='Banco Nacional de Credito #2694'>
                        <p className="color-blue-background">Estado de Cuenta</p>
                        <div className="accordion-flex">
                            <a className="color-blue-background underline" onClick={onClickConvert}> Convertir </a>
                            <a className="color-blue-background underline"> Consultar </a>
                        </div>
                    </div>
                </Accordion>:
                <FileTransformationInformation/>
                }
            </div>
        );
    }
}

export default BanksConvert;