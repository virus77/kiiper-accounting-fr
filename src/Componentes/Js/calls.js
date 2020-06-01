//import React from "react";
//import ReactDOM from "react-dom"
//import Link from '@material-ui/core/Link';
//import Typography from '@material-ui/core/Typography';
//import { AgGridReact } from 'ag-grid-react';
//import { $ } from 'jquery/dist/jquery';
//var moment = require('moment'); // require

const calls = {

    /// Helps to request and build the data structure to render it
    /// inside the workspace grid. The information represented 
    /// corresponds to the different concepts from the organization
    /// selected like: sales, purchases, banks, etc.
    /// @param {string} conceptType - concept type: sales, purchases...
    /// @param {integer} taxInfo - tax info with id and name
    /// @param {integer} statusInfo - status info with id and name
    getOrgConceptsInfo: (conceptType, taxInfo, statusInfo) => {

        // Organization selected by user previously
        let orgIdDefault = "5ea086c97cc16250b45f82e1"; //this.props.orgIdSelected

        // Fetch URL with parameters
        const fetchURL =
            "/getWithholdings" +
            `?id_organisation=${orgIdDefault}` +
            `&id_tax_type=${taxInfo.id}` +
            `&id_status=${statusInfo.id}`;

        return (

            // Fetching data from the endpoint
            fetch(fetchURL)
                .then(res => res.json())
                .then(data => {
                    return {
                        data: data,
                        conceptType: conceptType,
                        taxInfo: taxInfo
                    }
                })
        );
    },
    /// Start a process to request information from Xero to build
    /// Insert data when change status to "Archivados" or "Recibidos":
    /// @param {id} id_invoice_xero - idXero
    setDataVoidWidthHoldings: (arrayWithholdings) => {

        return fetch('/voidWithholding', {
            method: 'POST',
            body: { arrayWithholdings: arrayWithholdings },
            headers: {
                'X-Mashape-Key': 'required',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })//.then(res => {
            //  console.log(res)
            //  return true;
            //})
            .catch(err => {
                console.log(err)
            });
    },
    /// Start a process to request information from Xero to build
    /// Insert data when change status to "Archivados" or "Recibidos":
    /// @param {id} id_invoice_xero - idXero
    setDataWidthHoldings: (Tipo, rowsSelected, iterationCounter) => {

        // Knowing endpoint to fetch for an approval based on tax type
        let fetchEndpoint =
            Tipo === "ISLR" ?
                "approveWithholdingISLR" :
                "/approveWithholdingIVA";

        // Changing status from each rowsSelected
        rowsSelected.forEach(item => {

            const fetchInit = {
                body: JSON.stringify(item)
            };

            fetch(fetchEndpoint, fetchInit)
                .then(res => res.json())
                .then(res => {
                    if (iterationCounter === rowsSelected.length) {
                        return true;
                    }
                    else
                        iterationCounter++;
                }).catch(err => {
                    console.log(err)
                });;
        });
    },

    // Petición para obtener cuentas bancarias de una empresa en Xero
    // @param {integer} id_organisation - organisation id
    getBankAccounts: (id_organisation) => {
        console.log("entreee", id_organisation);
        const fetchConfig = {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        };

        return fetch(`/getBankAccounts?id_organisation=${id_organisation}`, fetchConfig)
            .then(res => res.json())
            .then(data => {
                return {
                    data: data
                }
            }).catch(err => {
                console.log(err)
            });
    
    },
}

export default calls;