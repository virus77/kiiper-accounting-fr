import React from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const columnDefs = {
    columnDefs: [
        {headerName: "Bank Accounts", field: "bank", sortable: false, filter: true},
        {headerName: "Action", field: "action", sortable: false, filter: true},
        {headerName: "Behind", field: "behind", sortable: false, filter: true},
        {headerName: "Date", field: "date", sortable: false, filter: true},
        {headerName: "Amount", field: "amount", sortable: false, filter: true},
        {headerName: "Verified", field: "verified", sortable: false, filter: true},
        {headerName: "Items", field: "items", sortable: false, filter: true},
        {headerName: "Total Amount", field: "totalAmount", sortable: false, filter: true},
        {headerName: "Behind", field: "behindB", sortable: false, filter: true}
    ]
}

const rowData = {
    rowData: [
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
        { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' }
    ]
}


const bank = (props) =>{
  return (
    <div className="ag-theme-alpine" style={ {height: '800px', width: '1200px'} }>
        <AgGridReact
            columnDefs={columnDefs.columnDefs}
            rowData={rowData.rowData}
            colWidth={150}
            >
        </AgGridReact>
      </div>
  );
};

export default bank;
