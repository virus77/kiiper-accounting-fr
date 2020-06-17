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
        var bankSelected = null;
        var bankInfo = null;

        this.state = { 
            openSections, 
            openConvert,
            accounts: [],
            bankSelected,
            bankInfo
        };
    }

    componentDidMount() {
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
        const {
            state: { openConvert, bankSelected, bankInfo, accounts },
        } = this;

        var _bankInfo = util.bankType(bank);
        var _bankData = this.state.accounts.filter(function(_bank) {
            return bank.indexOf(_bank.name) > -1
        });

        // Setting bank breadcrumb
        document.getElementById("breadcrumbPath").innerText = ` > ${label}`;

        this.setState({
            openConvert: !openConvert,
            bankSelected: _bankData,
            bankInfo: _bankInfo
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
                            <div label={mapping.name}>
                                <p className="color-blue-background">Estado de Cuenta</p>
                                <div className="accordion-flex">
                                    <a className="color-blue-background underline"  
                                        onClick={onClickConvert(mapping.name)}> 
                                        Convertir/Consultar
                                    </a>
                                </div>
                            </div> 
                        ))}    
                    </Accordion>:
                    <FileTransformationInformation bankData={this.state.bankSelected} 
                    bankInfo={this.state.bankInfo} orgIdSelected={this.props.orgIdSelected} />
                }
            </div>
        );
    }
}

export default BanksConvert;