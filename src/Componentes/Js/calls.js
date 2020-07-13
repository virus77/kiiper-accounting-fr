
import util from './util'

/* Script que contiene las llamadas a funciones */
const calls = {

    /// Helps to request and build the data structure to render it
    /// inside the workspace grid. The information represented 
    /// corresponds to the different concepts from the organization
    /// selected like: sales, purchases, banks, etc.
    /// @param {integer} taxInfo - tax info with id and name
    /// @param {integer} statusInfo - status info with id and name
    /// @param {string} orgIdSelected - organization id from Xero
    getOrgConceptsInfo: (taxInfo, statusInfo, orgIdSelected) => {

        // Organization selected by user previously
        let orgIdDefault = orgIdSelected ? orgIdSelected : "5ee993a0f9addb8a8cf25c4f";
        // Testing validation purposes
        orgIdDefault =
            orgIdDefault === "5ee993a0f9addb8a8cf25c4f" ?
                "5ea086c97cc16250b45f82e1" :
                orgIdDefault;

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
                        taxInfo: taxInfo,
                        statusInfo: statusInfo
                    }
                }).catch((error) => {
                    console.log(error);
                    return false;
                })
        );
    },

    /// Call base64 element
    /// @param {string} withholdingId - _Id from xero element
    getDocumentById: async (withholdingId) => {

        const fetchConfig = { method: 'GET' };

        // Fetch URL with parameters
        const fetchURL = `/downloadWithholding?withholdingId=${withholdingId}`;

        return (

            // Fetching data from the endpoint
            fetch(fetchURL, fetchConfig)
                .then(res => res.text())
                .then(data => { return { data: data } })
                .catch((error) => {
                    console.log(error);
                    return false;
                })
        );
    },

    /// Start a process to request information from Xero to build
    /// Insert data when change status to "Archivados" or "Recibidos":
    /// @param {id} id_invoice_xero - idXero
    setDataVoidWidthHoldings: async (WithholdingsArr) => {

        let arrayWithholding = { "arrayWithholding": WithholdingsArr };

        return (
            await fetch('/voidWithholding', {
                method: 'POST',
                body: JSON.stringify(arrayWithholding),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
            }).then(res => {
                if (res.ok) {
                    console.log("request sucess");
                    return true;
                } else {
                    console.log("request fail");
                    return false;
                }
            })
        )
    },

    /// Start a process to request information from Xero to build
    /// Insert data when change status to "Anulados"
    /// @param {WithholdingsArr} id_invoice_xero - idXero
    setDataReissueWidthHoldings: async (WithholdingsArr) => {
        WithholdingsArr.map(async (array) => {
            return (
                await fetch('/reissueWithholding', {
                    method: 'POST',
                    body: JSON.stringify(array),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                    },
                }).then(res => {
                    if (res.ok) {
                        console.log("request sucess");
                        return true;
                    } else {
                        console.log("request fail");
                        return false;
                    }
                })
            )
        })
    },

    /// Start a process to send information to Xero to 
    /// change vouchers from pending to received status
    /// @param {string} taxType - tax type from the voucher
    /// @param {array} rowsSelected - rows selected by user in vouchers grid
    setDataWidthHoldings: async (taxType, rowsSelected) => {

        // Knowing endpoint to fetch for an approval based on tax type
        let fetchEndpoint = `/approveWithholding${taxType}`;
        let arrayWithholding = { "arrayWithholding": rowsSelected };

        // Knowing endpoint to fetch for an approval based on tax type
        return (
            await fetch(fetchEndpoint, {
                method: 'POST',
                body: JSON.stringify(arrayWithholding),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
            }).then(res => {
                if (res.ok) {
                    console.log("request sucess");
                    return true;
                } else {
                    console.log("request fail");
                    return false;
                }
            })
        )
    },

    // Petición para obtener cuentas bancarias de una empresa en Xero
    // @param {integer} id_organisation - organisation id
    getBankAccounts: (id_organisation) => {
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

    convertBankStatement: (fetchEndpoint, data) => {

        return (
            fetch(fetchEndpoint, {
                method: 'POST',
                body: data,
            }).then(res => {
                if (res.ok) {
                    console.log("request sucess");
                    return true;
                } else {
                    console.log("request fail");
                    return false;
                }
            })
                .then(res => {
                    if (res.ok) {
                        console.log("request sucess");
                        return true;
                    } else {
                        console.log("request fail");
                        return false;
                    }
                })
        );
    },

    getConversions: (id_organisation, id_bank_xero) => {
        const fetchConfig = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        return fetch(`/getConversions?id_organisation=${id_organisation}&id_bank_xero=${id_bank_xero}`, fetchConfig)
            .then(res => res.json())
            .then(data => {
                return {
                    data: data
                }
            }).catch(err => {
                console.log(err)
            });
    },

    /// Petición para obtener el libro de Compras y ventas en Xero
    /// deppendiendo del periodo
    /// @param {text} id_organisation - organisation id
    /// @param {text} initialDate - Format date DD/MM/YYYY"
    /// @param {text} endDate -  Format date DD/MM/YYYY"
    /// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
    getBook: async (id_organisation, Periodo, initialDate, endDate, endPoint) => {

        switch (Periodo) {
            case "1":
                let Range = util.getmonthRange();
                initialDate = Range.firstDay;
                endDate = Range.lastDay;
                break;

            case "2":
                let PreviousRange = util.getPreviousRange();
                initialDate = PreviousRange.firstDay;
                endDate = PreviousRange.lastDay;
                break;

            default:
                break;
        }

        var param = {
            id_organisation: id_organisation,
            initialDate: initialDate,
            endDate: endDate
        };

        return (
            await fetch(endPoint, {
                method: 'POST',
                body: JSON.stringify(param),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
            }).then(res => res.text()
            ).then(data => {
                return { data: data }
            })
        );
    },

    /// Petición para obtener cuentas bancarias de una empresa en Xero
    /// @param {text} taxbookId - id que regresa getSalesBook or getPurchaseBook
    /// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
    getDocumentByTaxbookId: (valor, endPoint) => {
        let taxbookId = valor;
        taxbookId = taxbookId.replace(/['"]+/g, '');

        // Fetch URL with parameters
        const fetchURL = endPoint + `?taxbookId=${taxbookId}`;

        return (
            // Fetching data from the endpoint
            fetch(fetchURL)
                .then(res => res.json())
                .then(data => {
                    return {
                        data: data
                    }
                }).catch((error) => {
                    console.log(error);
                    return false;
                })
        )
    },

    /// Petición para obtener el libro de Compras y ventas en Xero
    /// deppendiendo del periodo
    /// @param {text} id_organisation - organisation id
    /// @param {text} initialDate - Format date DD/MM/YYYY"
    /// @param {text} endDate -  Format date DD/MM/YYYY"
    /// @param {text} dueDate -  Format date DD/MM/YYYY"
    /// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
    getBookRetention: async (id_organisation, Periodo, initialDate, endDate, endPoint, dueDate) => {

        switch (Periodo) {
            case "1":
                let Range = util.getmonthRange();
                initialDate = Range.firstDay;
                endDate = Range.lastDay;
                break;

            case "2":
                let PreviousRange = util.getPreviousRange();
                initialDate = PreviousRange.firstDay;
                endDate = PreviousRange.lastDay;
                break;

            default:
                break;
        }

        var param = {
            id_organisation: id_organisation,
            initialDate: initialDate,
            endDate: endDate,
            dueDate: dueDate
        };

        return (
            await fetch(endPoint, {
                method: 'POST',
                body: JSON.stringify(param),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                },
            }).then(res => res.text()
            ).then(data => {
                return { data: data }
            })
        );
    },

    /// Petición para obtener cuentas bancarias de una empresa en Xero
    /// @param {text} taxbookId - id que regresa getSalesBook or getPurchaseBook
    /// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
    getDocumentByIdStatement: (valor, endPoint) => {
        let id_statement = valor;
        id_statement = id_statement.replace(/['"]+/g, '');

        // Fetch URL with parameters
        const fetchURL = endPoint + `?id_statement=${id_statement}`;

        return (
            // Fetching data from the endpoint
            fetch(fetchURL)
                .then(res => res.json())
                .then(data => {
                    return {
                        data: data
                    }
                }).catch((error) => {
                    console.log(error);
                    return false;
                })
        )
    },
}

export default calls;