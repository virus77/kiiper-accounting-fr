import util from "./util";

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
		let orgIdDefault = orgIdSelected
			? orgIdSelected
			: "5ee993a0f9addb8a8cf25c4f";
		// Testing validation purposes
		orgIdDefault =
			orgIdDefault === "5ee993a0f9addb8a8cf25c4f"
				? "5ea086c97cc16250b45f82e1"
				: orgIdDefault;

		// Fetch URL with parameters
		const fetchURL =
			"/getWithholdings" +
			`?id_organisation=${orgIdDefault}` +
			`&id_tax_type=${taxInfo.id}` +
			`&id_status=${statusInfo.id}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL)
				.then((res) => res.json())
				.then((data) => {
					return {
						data: data,
						taxInfo: taxInfo,
						statusInfo: statusInfo,
					};
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

	/// Call base64 element
	/// @param {string} withholdingId - _Id from xero element
	getDocumentById: async (withholdingId) => {
		const fetchConfig = { method: "GET" };

		// Fetch URL with parameters
		const fetchURL = `/downloadWithholding?withholdingId=${withholdingId}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL, fetchConfig)
				.then((res) => res.text())
				.then((data) => {
					return { data: data };
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

		/// Call base64 element
	/// @param {string} withholdingId - _Id from xero element
	getFinalCallback: async (accestoken) => {
		const fetchConfig = { method: "GET" };

		// Fetch URL with parameters
		const fetchURL = `/finalCallback?accessToken=${accestoken}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL, fetchConfig)
				.then((res) => res.text())
				.then((data) => {
					return { data: data };
				})
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
		let arrayWithholding = { arrayWithholding: WithholdingsArr };

		return await fetch("/voidWithholding", {
			method: "POST",
			body: JSON.stringify(arrayWithholding),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		}).then((res) => {
			if (res.ok) {
				console.log("request sucess");
				return true;
			} else {
				console.log("request fail");
				return false;
			}
		});
	},

	/// Start a process to request information from Xero to build
	/// Insert data when change status to "Anulados"
	/// @param {WithholdingsArr} id_invoice_xero - idXero
	setDataReissueWidthHoldings: async (WithholdingsArr) => {
		WithholdingsArr.map(async (array) => {
			return await fetch("/reissueWithholding", {
				method: "POST",
				body: JSON.stringify(array),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					"Access-Control-Allow-Origin": "*",
				},
			}).then((res) => {
				if (res.ok) {
					console.log("request sucess");
					return true;
				} else {
					console.log("request fail");
					return false;
				}
			});
		});
	},

	/// Start a process to send information to Xero to
	/// change vouchers from pending to received status
	/// @param {string} taxType - tax type from the voucher
	/// @param {array} rowsSelected - rows selected by user in vouchers grid
	setDataWidthHoldings: async (taxType, rowsSelected) => {
		// Knowing endpoint to fetch for an approval based on tax type
		let fetchEndpoint = `/approveWithholding${taxType}`;
		let arrayWithholding = { arrayWithholding: rowsSelected };

		// Knowing endpoint to fetch for an approval based on tax type
		return await fetch(fetchEndpoint, {
			method: "POST",
			body: JSON.stringify(arrayWithholding),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		}).then((res) => {
			if (res.ok) {
				console.log("request sucess");
				return true;
			} else {
				console.log("request fail");
				return false;
			}
		});
	},

	// Petición para obtener cuentas bancarias de una empresa en Xero
	// @param {integer} id_organisation - organisation id
	getBankAccounts: (id_organisation) => {
		const fetchConfig = {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		return fetch(
			`/getBankAccounts?id_organisation=${id_organisation}`,
			fetchConfig
		)
			.then((res) => res.json())
			.then((data) => {
				return {
					data: data,
				};
			})
			.catch((err) => {
				console.log(err);
			});
	},

	convertBankStatement: (fetchEndpoint, data) => {
		return fetch(fetchEndpoint, {
			method: "POST",
			body: data,
		}).then((res) => {
			if (res.ok) {
				console.log("request sucess");
				return true;
			} else {
				console.log("request fail");
				return false;
			}
		});
	},

	getConversions: (id_organisation, id_bank_xero) => {
		const fetchConfig = {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		return fetch(
			`/getConversions?id_organisation=${id_organisation}&id_bank_xero=${id_bank_xero}`,
			fetchConfig
		)
			.then((res) => res.json())
			.then((data) => {
				return {
					data: data,
				};
			})
			.catch((err) => {
				console.log(err);
			});
	},

	/// Petición para obtener el libro de Compras y ventas en Xero
	/// deppendiendo del periodo
	/// @param {text} id_organisation - organisation id
	/// @param {text} initialDate - Format date DD/MM/YYYY"
	/// @param {text} endDate -  Format date DD/MM/YYYY"
	/// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
	getBook: (id_organisation, Periodo, initialDate, endDate, endPoint) => {
		
		// Fetch URL with parameters
		const fetchURL = endPoint +`?id_organisation=${id_organisation}&initialDate=${initialDate}&endDate=${endDate}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL)
				.then((res) => res.text())
				.then((data) => {
					return {
						data: data,
					};
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

	/// Petición para obtener cuentas bancarias de una empresa en Xero
	/// @param {text} taxbookId - id que regresa getSalesBook or getPurchaseBook
	/// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
	getDocumentByTaxbookId: (valor, endPoint) => {
		let taxbookId = valor;
		taxbookId = taxbookId.replace(/['"]+/g, "");

		// Fetch URL with parameters
		const fetchURL = endPoint + `?taxbookId=${taxbookId}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL)
				.then((res) => res.json())
				.then((data) => {
					return {
						data: data,
					};
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

	/// Petición para obtener los libros fiscales generados desde Xero
	/// @param {string} organizationId - ID de la organización seleccionada en el menú
	/// @param {string} startDate - Fecha de inicio de libro fiscal 
	/// @param {string} endDate - Fecha de fin de libro fiscal
	getFiscalBooks: (organizationId, startDate, endDate) => {

		// Fetch URL with parameters
		const fetchURL = `/getTaxbooks?id_organisation=${organizationId}&init_date=${startDate}&end_date=${endDate}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL)
				.then((res) => res.json())
				.then((data) => {
					return {
						data: data,
					};
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},
	/// Petición para obtener el libro de Compras y ventas en Xero
	/// deppendiendo del periodo
	/// @param {text} id_organisation - organisation id
	/// @param {text} initialDate - Format date DD/MM/YYYY"
	/// @param {text} endDate -  Format date DD/MM/YYYY"
	/// @param {text} dueDate -  Format date DD/MM/YYYY"
	/// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
	getBookRetention: async (
		id_organisation,
		Periodo,
		initialDate,
		endDate,
		endPoint,
		dueDate
	) => {
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
			dueDate: dueDate,
		};

		return await fetch(endPoint, {
			method: "POST",
			body: JSON.stringify(param),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Petición para obtener cuentas bancarias de una empresa en Xero
	/// @param {text} taxbookId - id que regresa getSalesBook or getPurchaseBook
	/// @param {text} endPoint - Ruta de acceso al Endpoint dependiendo si es compras o venntas
	getDocumentByIdStatement: (valor, endPoint) => {
		let id_statement = valor;
		id_statement = id_statement.replace(/['"]+/g, "");

		// Fetch URL with parameters
		const fetchURL = endPoint + `?id_statement=${id_statement}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL)
				.then((res) => res.json())
				.then((data) => {
					return {
						data: data,
					};
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

	/// Consultar lista de declaraciones
	/// @param {string} id_organisation - ID de la organización en la base de datos asociado a la petición
	// /getGrantedOrganisations
	/// @param {int} endPoint - Tipo de impuesto, donde 1 corresponde a Retenciones de IVA, y
	//  2 corresponde a Retenciones de ISLR
	/// @param {int} id_statement_status - Estatus de la declaración, donde 1 es Por generar, 2 es Por aprobar,
	//  3 es Aprobados, 4 es Declarados, 5 es Por pagar y 6 es Pagados
	getStatements: (id_organisation, id_tax_type, id_statement_status) => {
		const fetchConfig = {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		return fetch(
			`/getStatements?id_organisation=5ea086c97cc16250b45f82e1&id_tax_type=${id_tax_type}&id_statement_status=${id_statement_status}`,
			fetchConfig
		)
			.then((res) => res.json())
			.then((data) => {
				return {
					data: data,
				};
			})
			.catch((err) => {
				console.log(err);
			});
	},

	/// Descargar archivo auxiliar de declaración
	/// @param {string} id_statement - ID de la declaración asociado a la petición /getStatements
	getDownloadAuxiliarTaxReport: (id_statement) => {
		const fetchConfig = {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		return fetch(
			`/downloadAuxiliarTaxReport?id_statement=${id_statement}`,
			fetchConfig
		)
			.then((res) => res.json())
			.then((data) => {
				return {
					data: data,
				};
			})
			.catch((err) => {
				console.log(err);
			});
	},

	/// Recalcular una declaración en status Por generar
	/// @param {string} id_statement - ID de la declaración asociado a la petición /getStatements
	updateStatement: async (id_statement) => {
		var param = {
			id_statement: id_statement,
		};

		return await fetch("/updateStatement", {
			method: "POST",
			body: JSON.stringify(param),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Rechazar una declaración (enviar una declaración desde el estatus Por aprobar a Por generar)
	/// @param {string} id_statements - el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	denyStatement: async (id_statements) => {
		var param = {
			arrayStatement: id_statements,
		};

		return await fetch("/denyStatement", {
			method: "POST",
			body: JSON.stringify(param),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Registrar una declaración (enviar una declaración desde el estatus Declarados a Por pagar o Pagados):
	/// @param {formData} con
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	/// “commitmentFile” (archivo PDF de compromiso de declaración en formato base64)
	/// “warrantFile” (archivo PDF de certificado de declaración en formato base64).
	/// Cabe destacar que sólo se puede cargar uno de los archivos previamente mencionados
	registerStatement: async (data) => {
		var param = {
			arrayStatement: data,
		};

		return await fetch("/registerStatement", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Pagar una declaración (enviar una declaración desde el estatus Por pagar a Pagados)
	/// @param {formData} con
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	/// “paymentFile” (archivo PDF de pago  de declaración en formato base64),
	/// “bankReference” (número de referencia bancaria)
	/// “bankAccountCode” (código de cuenta bancaria asociado a la petición /getBankAccounts).
	payStatement: async (data) => {
		var param = {
			arrayStatement: data,
		};

		return await fetch("/payStatement", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Generar una declaración (enviar una declaración desde el estatus Por generar a Por aprobar)
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	generateStatement: async (data) => {
		var param = {
			arrayStatement: data,
		};

		return await fetch("/generateStatement", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Aprobar una declaración (enviar una declaración desde el estatus Por aprobar a Aprobados)
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	approveStatement: async (data) => {
		var param = {
			arrayStatement: data,
		};

		return await fetch("/approveStatement", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Aprobar una declaración por parte del cliente (enviar una declaración desde el estatus
	/// Por aprobar a Aprobados dependiendo de acción enviada por correo electrónico)
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	approveStatementClient: async (id_statement) => {
		var param = {
			id_statement: id_statement,
		};

		return await fetch("/approveStatementClient", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},

	/// Declarar un registro de declaración (enviar una declaración desde el estatus Aprobados a Declarados
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	declareStatement: async (id_statement) => {
		var param = {
			id_statement: id_statement,
		};

		return await fetch("/declareStatement", {
			method: "POST",
			body: param,
		})
			.then((res) => res.text())
			.then((data) => {
				return { data: data };
			});
	},
};

export default calls;
