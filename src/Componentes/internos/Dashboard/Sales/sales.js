import React from 'react';
import styles from './sales.module.css';
import { Doughnut } from 'react-chartjs-2';
import {PieChart, Tooltip, Cell, Pie} from 'recharts'
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


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

const dataTable = [
    {behind: 'Carlos',  amount: '12345', percentage: '5'},
    {behind: 'Andres',  amount: '1235', percentage: '6'},
    {behind: 'Maria',   amount: '2356', percentage: '20'},
    {behind: 'Andrea',  amount: '49058', percentage: '10'},
    {behind: 'Pedro',   amount: '03945', percentage: '42'}
]

const TableData = () =>(
    dataTable.map((item)=>(
        <>
        <tr className={styles.TableData} >
            <td className={styles.TableRow}>
                {item.behind}
            </td>
            <td className={styles.TableRow}>
                {item.amount}
            </td>
            <td className={styles.TableRow}>
                {item.percentage}
            </td>
        </tr>
        </>
    ))
)


const columnDefs = {
  columnDefs: [
      {headerName: "Behind", field: "behind", sortable: false, filter: true},
      {headerName: "Amount", field: "amount", sortable: false, filter: true},
      {headerName: "%", field: "percentage", sortable: false, filter: true},
  ]
}

const rowData = {
  rowData: [
      { behind: "1 month", amount: "12345", percentage:'3%'},
      { behind: "1 month", amount: "12345", percentage:'3%'},
      { behind: "1 month", amount: "12345", percentage:'3%'},
      { behind: "1 month", amount: "12345", percentage:'3%'},
      { behind: "1 month", amount: "12345", percentage:'3%'},
      { behind: "1 month", amount: "12345", percentage:'3%'}
  ]
};

const sales = (props) =>{
  return (
    <div className={styles.Sales} >
      <div className={styles.SalesTable}>
        <div className={styles.Title}>
            Overdue Bills
        </div>
        <div className="ag-theme-alpine" style={ {height: '800px', width: '100%'} }>
            <AgGridReact
                columnDefs={columnDefs.columnDefs}
                rowData={rowData.rowData}
                colWidth={150}
                >
            </AgGridReact>
        </div>
      </div>
      <div className={styles.SalesChart}>
        <div className={styles.Title}>
          Main suppliers to be paid
        </div>
        <Doughnut data={data} legend={false} />
      </div>
    </div>
  );
};

export default sales;
