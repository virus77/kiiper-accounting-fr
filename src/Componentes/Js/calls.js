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
		// Fetch URL with parameters
		const fetchURL =
			"/getWithholdings" +
			`?id_organisation=${orgIdSelected}` +
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
	getDocumentById: (withholdingId) => {
		const fetchConfig = { method: "GET" };

		// Fetch URL with parameters
		const fetchURL = `/downloadWithholding?withholdingId=${withholdingId}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL, fetchConfig)
				.then((res) => {
					return res.url
				})
				.catch((error) => {
					console.log(error);
					return false;
				})
		);
	},

	/// Call base64 element
	/// @param {string} withholdingId - _Id from xero element
	getDeclarationDocumentById: (id_statement) => {
		const fetchConfig = { method: "GET" };

		// Fetch URL with parameters
		const fetchURL = `/downloadAuxiliarTaxReport?id_statement=${id_statement}`;

		return (
			// Fetching data from the endpoint
			fetch(fetchURL, fetchConfig)
				.then((res) => {
					return res.url
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
		const fetchURL = endPoint + `?id_organisation=${id_organisation}&initialDate=${initialDate}&endDate=${endDate}`;

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

	//Petición que regresa los grupos a los que tengo acceso en xero
	getGroupsList: async () => {

		// Get groups from logged user
		return await fetch('/getPractices')
			.then(res => res.json())
			.then(dataGroup => {
				return dataGroup
			})
			.catch((error) => {
				console.log(error);
			});
	},

	/// Petición para obtener las organizaciones a las que tengo acceso
	/// @param {string} practice_id - id de la práctica seleccionada
	getOrganizations: async (practice_id) => {

		// Fetch URL with parameters
		const fetchURL = `/getOrganisationsByPractice?practice_id=${practice_id}`;

		return await fetch(fetchURL)
			.then((res) => res.json())
			.then((dataOrg) => {
				let organizations = dataOrg.map((res) => {
					return {
						type: "xeroOrgName",
						name: res.xeroOrgName,
						id: res.organisationId,
						specialContrib: res.isSpecialContrib
					};
				});
				return organizations;
			}).catch((error) => {
				console.log(error);
				return false;
			});
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

	/// Petición para integrar el AccesToken de Xero a kiiper
	/// @param {text} accesToken - accesToken proveniente de xero desde el bot
	getFinalCallback: async (accestoken) => {

		var array = JSON.parse(accestoken);

		var param = {
			access_token: array,
		};

		return await fetch("/finalCallback", {
			method: "POST",
			body: JSON.stringify(param),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		}).then((res) => {
			return res.url
		}).catch((err) => {
			console.log(err);
		});;
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
			`/getStatements?id_organisation=${id_organisation}&id_tax_type=${id_tax_type}&id_statement_status=${id_statement_status}`,
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
	denyStatement: async (data) => {
		var param = { arrayStatement: data };

		return await fetch("/denyStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Registra la declaración
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	registerStatement: async (data) => {

		var param = { arrayStatement: data };

		return await fetch("/registerStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Generar el pago de la declaración
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	payStatement: async (data) => {

		var param = { arrayStatement: data };

		return await fetch("/payStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Generar una declaración (enviar una declaración desde el estatus Por generar a Por aprobar)
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	generateStatement: async (data) => {
		var param = { arrayStatement: data };

		return await fetch("/generateStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Aprobar una declaración (enviar una declaración desde el estatus Por aprobar a Aprobados)
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	approveStatement: async (data) => {

		var param = { arrayStatement: data };

		return await fetch("/approveStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Aprobar una declaración por parte del cliente (enviar una declaración desde el estatus
	/// Por aprobar a Aprobados dependiendo de acción enviada por correo electrónico)
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	approveStatementClient: async (id_statement, approve) => {
		var param = {
			id_statement: id_statement,
			approve: approve,
		};

		return await fetch("/approveStatementClient", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	/// Declarar un registro de declaración (enviar una declaración desde el estatus Aprobados a Declarados
	/// @param {array} arrayStatement el cual es un arreglo que contiene
	/// “id_statement” (ID de la declaración asociado a la petición /getStatements)
	declareStatement: async (data) => {

		var param = { arrayStatement: data };

		return await fetch("/declareStatement", {
			method: "POST",
			body: JSON.stringify(param),
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
		}).catch((err) => {
			console.log(err);
		});
	},

	//Función que desloguea al usuario actual y destruye la sessión
	logoutFunction: () => {
		return fetch("/logout")
			.then((res) => {
				window.location.reload(false)
			}).catch((err) => {
				console.log(err);
			});
	}
};

export default calls;
