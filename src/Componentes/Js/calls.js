
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
        let orgIdDefault = orgIdSelected ? orgIdSelected : "5ea086c97cc16250b45f82e1";

        // Testing validation purposes
        orgIdDefault =
            orgIdDefault === "5ec440712075680004eff014" ?
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