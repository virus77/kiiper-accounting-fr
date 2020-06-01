import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Css/styles.scss';
import Accordion from '../accordion/Accordion';
import FileTransformationInformation from '../accordion/FileTransformationInformation';
import calls from '../../Js/calls';
import util from '../../Js/util';

class BanksConvert extends Component {
    
    static propTypes = {
    //children: PropTypes.instanceOf(Object).isRequired,
    };

    constructor(props) {
        super(props);
        var openConvert = false;
        const openSections = {};

        this.state = { 
            openSections, 
            openConvert,
            accounts: []
        };
    }

    componentDidMount() {
        console.log("entree", this.props.orgIdSelected);
        //Getting data from Xero and building data grid
        calls.getBankAccounts(this.props.orgIdSelected).then(result => {
            console.log("data", result.data);
            this.setState({ accounts: result.data });
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

    onClickConvert = bank => label => {
        console.log("bank", bank);
        const {
            state: { openConvert },
        } = this;

        util.bankType(bank);

        this.setState({
            openConvert: !openConvert,
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
                        {this.state.accounts.map( (mapping, index) => (
                            <div label={index + ". " + mapping.name}>
                                <p className="color-blue-background">Estado de Cuenta</p>
                                <div className="accordion-flex">
                                    <a className="color-blue-background underline"  
                                        onClick={onClickConvert(mapping.name)}> 
                                        Convertir 
                                    </a>
                                    <a className="color-blue-background underline"> Consultar </a>
                                </div>
                            </div> 
                        ))}    
                    </Accordion>:
                    <FileTransformationInformation/>
                }
            </div>
        );
    }
}

export default BanksConvert;