import React from 'react';
import styles from './sales.module.css';
import { Doughnut } from 'react-chartjs-2';
import { AgGridReact, SortableHeaderComponent } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import salesDataD from '../dataDumy/sales.json';
import './styles.css'

const data = {
  datasets: [{
    data: [1440000, 2000000, 3000000],
    backgroundColor: [
      '#5EFEFF',
      '#9680ED',
      '#232C51',
    ]
  }],
  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
    'Dayne Guarimara',
    'Eduardo Alvarez',
    'Alcaldia Municipio Girardot'
  ],
  options: {

		// Component state
		this.state = {
			overdueInvoice: {
				columnDefs: [
					{
						headerName: "Cuentas por cobrar",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Antigüedad",
								field: "behind",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Cantidad",
								field: "amount",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
						],
					},
				],
				rowData: [],
				defaultColDef: {
					flex: 1,
					resizable: false,
					filterable: false,
					sortable: true,
				},
			},
			mainClients: {
				columnDefs: [
					{
						headerName: "Clientes principales",
						headerClass: "dashboardGridColumnGroup",
						children: [
							{
								headerName: "Cliente",
								field: "contact",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
							{
								headerName: "Cantidad",
								field: "amount",
								headerClass: "dashboardGridColumn",
								cellClass: "dashboardGridCellBusiness",
							},
						],
					},
				],
				rowData: [],
				defaultColDef: {
					flex: 1,
					resizable: false,
					filterable: false,
					sortable: true,
				},
			},
			charts: {
				plugins: [ChartDataLabels],
				data: {
					datasets: [
						{
							data: [0.2, 0.3, 0.2, 0.3],
							backgroundColor: ["#44CDDB", "#9680ED", "#232C51", "#86FFF5"],
						},
					],
					labels: ["1 months", "2 months", "3 months", "+3 months"],
				},
				options: {
					maintainAspectRatio: false,
					plugins: {
						datalabels: {
							color: "#fff",
							font: {
								family: "'Goldplay',sans-serif",
								weight: "700",
							},
							formatter: function(value) {
								return Math.round(value*100) + '%';
							 },
						},
					},
					legend: {
						display: true,
						labels: {
							fontColor: "#232C51",
							fontFamily: "'Muli',sans-serif",
							boxWidth: 10,
							fontSize: 10,
						},
						position: "bottom",
						align: "start",
					},
				},
			},
		};
	}

const arrayData = []

const getData = salesDataD.listSalesbyGroup.map((item) => {
  arrayData.push({
    behind: item.behind,
    amount: `${item.currencyCode} ${item.amountDue}`,
  })
})

const dataJson = {
  rowData: arrayData
}

const arrayData2 = [];

const getData2 = salesDataD.listSalesParClient.map((item) => {
  arrayData2.push({
    amount: `${item.currencyCode} ${item.amountDue}`,
    contact: item.contactName,
  })
})

const dataJson2 = {
  rowData: arrayData2
}

const columnDefs = {
  columnDefs: [
    {
      headerName: 'Overdue Invoices', headerClass: styles.Title,
      children: [
        { headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.SubTitle },
        { headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle },
      ]
    },
  ]
}

	// Component rendering
	render() {
		return (
			<div className={styles.Sales}>
				<div className={styles.Invoices}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.overdueInvoice.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.overdueInvoice.rowData}
								defaultColDef={this.state.overdueInvoice.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>Antigüedad</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
							/>
						</div>
					</div>
				</div>
				<div className={styles.Customers}>
					<div className={styles.SalesTable}>
						<div className="ag-theme-alpine dashboardBusiness">
							<AgGridReact
								columnDefs={this.state.mainClients.columnDefs}
								groupHeaderHeight={50}
								headerHeight={50}
								rowData={this.state.mainClients.rowData}
								defaultColDef={this.state.mainClients.defaultColDef}
							></AgGridReact>
						</div>
					</div>
					<div className={styles.SalesChart}>
						<div className={styles.ChartTitle}>
						Clientes principales (por definir)
						</div>
						<div className={styles.ChartContainer}>
							<Doughnut
								data={this.state.charts.data}
								options={this.state.charts.options}
								width={200}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


// const frameworkComponents = {
//   customHeaderGroupComponent: CustomHeader2,
//   agColumnHeader: Custom,
// }

const sales = (props) => {
  return (
    <div className={styles.Sales} >
      <div className={styles.Invoices}>
        <div className={styles.SalesTable}>
          <div className="ag-theme-alpine" style={{ height: '1000px', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs.columnDefs}
              groupHeaderHeight={50}
              headerHeight={50}
              rowData={dataJson.rowData}
              allowDragFromColumnsToolPanel={false}
              enableMultiRowDragging={false}
              colWidth={160}
              // frameworkComponents = {frameworkComponents}
              defaultColDef={{
                sortable: true,
                filter: false,
                headerComponentFramework: SortableHeaderComponent,
              }}>
            </AgGridReact>
          </div>
        </div>
        <div className={styles.SalesChart}>
          <div className={styles.ChartTitle}>
            Overdue Invoices
          </div>
          <Doughnut data={data} legend={false} />
        </div>
      </div>
      <div className={styles.Customers}>
        <div className={styles.SalesTable}>
          <div className="ag-theme-alpine" style={{ height: '800px', width: '100%', border: 'none' }}>
            <AgGridReact
              columnDefs={columnDefs2.columnDefs}
              groupHeaderHeight={50}
              headerHeight={50}
              rowData={dataJson2.rowData}
              allowDragFromColumnsToolPanel={false}
              enableMultiRowDragging={false}
              colWidth={160}
              // frameworkComponents = {frameworkComponents}
              defaultColDef={{
                sortable: true,
                filter: false,
                headerComponentFramework: SortableHeaderComponent,
              }}>
            </AgGridReact>
          </div>
        </div>
        <div className={styles.SalesChart}>
          <div className={styles.ChartTitle}>
            Top Customers To Pay
          </div>
          <Doughnut data={data} legend={false} />
        </div>
      </div>
    </div>
  );
};

export default sales;
