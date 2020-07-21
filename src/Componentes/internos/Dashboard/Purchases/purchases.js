import React from 'react';
import styles from './purchases.module.css';
import { Doughnut } from 'react-chartjs-2';
import {PieChart, Tooltip, Cell, Pie} from 'recharts';
import { AgGridReact, SortableHeaderComponent } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import PurchasesDataD from '../dataDumy/purchases.json'


// const data = {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(153, 102, 255, 0.2)',
//             'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//     }]
// }

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

const getData = PurchasesDataD.listPurchases.map((item)=>{
  arrayData.push({
    behind: item.behind,
    amount: `${item.currencyCode} ${item.amountDue}`,
  })
})

const dataJson = {
  rowData: arrayData
}

const arrayData2 = [];

const getData2 = PurchasesDataD.listPurchasesParClient.map((item)=>{
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
      {headerName: 'Overdue bills', headerClass: styles.Title,
        children: [
          {headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.SubTitle},
          {headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle},
        ]
      },
  ]
}

const columnDefs2 = {
  columnDefs: [
      {headerName: 'Main Suppliers', headerClass: styles.Title,
        children: [
          {headerName: "Contact", field: "contact", sortable: true, filter: false, headerClass: styles.SubTitle},
          {headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.SubTitle},
        ]
      },
  ]
}

const purchases = (props) =>{
  return (
    <div className={styles.Sales} >
      <div className={styles.Overdue}>
        <div className={styles.SalesTable}>
          <div className="ag-theme-alpine" style={ {height: '800px', width: '100%'} }>
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
            Overdue Bills
          </div>
          <Doughnut data={data} legend={false} />
        </div>
      </div>
      <div className={styles.Suppliers}>
        <div className={styles.SalesTable}>
          <div className="ag-theme-alpine" style={ {height: '800px', width: '100%'} }>
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
            Main Suppliers
          </div>
          <Doughnut data={data} legend={false} />
        </div>
      </div>
    </div>
  );
};

export default purchases;
