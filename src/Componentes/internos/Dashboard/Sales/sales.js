import React from 'react';
import styles from './sales.module.css';
import { Doughnut } from 'react-chartjs-2';
import {PieChart, Tooltip, Cell, Pie} from 'recharts'
import { AgGridReact, AgGridColumn, HeaderGroupComponent, headerGroupComponentFramework, SortableHeaderComponent } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import salesDataD from '../dataDumy/sales.json';
import CustomHeader from './CustomHeader';
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

    }
};

const arrayData = []

const getData = salesDataD.listSalesbyGroup.map((item)=>{
  arrayData.push({
    behind: item.behind,
    amount: `${item.currencyCode} ${item.amountDue}`,
  })
})

const dataJson = {
  rowData: arrayData
}

const arrayData2 = [];

const getData2 = salesDataD.listSalesParClient.map((item)=>{
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
      {headerName: 'Overdue Invoices', headerClass: styles.Title,
        children: [
          {headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.SubTitle},
          {headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle},
        ]
      },
  ]
}

const columnDefs2 = {
  columnDefs: [
      {headerName: 'Main Customers', headerClass: styles.Title,
        children: [
          {headerName: "Contact", field: "contact", sortable: true, filter: false, headerClass: styles.SubTitle},
          {headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle},
        ]
      },
  ]
}


// const frameworkComponents = {
//   customHeaderGroupComponent: CustomHeader2,
//   agColumnHeader: Custom,
// }

const sales = (props) =>{
  return (
    <div className={styles.Sales} >
      <div className={styles.Invoices}>
        <div className={styles.SalesTable}>
          <div className="ag-theme-alpine" style={ {height:'1000px',width: '100%'} }>
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
          <div className="ag-theme-alpine" style={ {height: '800px', width: '100%', border:'none'} }>
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
