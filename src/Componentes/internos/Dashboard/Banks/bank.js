import React from 'react';
import { AgGridReact, AgGridColumn, HeaderGroupComponent, headerComponentFramework, headerGroupComponentFramework, SortableHeaderComponent } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import bankDataD from '../dataDumy/accounts.json';
import styles from './banks.module.css';
import ParamsRenderer  from './cellRenderer';
import Cust from './custom'


class Bank extends React.Component{

  
columnDefs = {
  columnDefs: [
      {headerName: '', headerClass: styles.HeaderGroupStyle,
        children: [
          {headerName: "Bank Accounts", field: "bank", sortable: true, filter: false, headerClass: styles.HeaderStyle},
        ]
      },
      {headerName: 'Bank statements importing', headerClass: styles.HeaderGroupStyle,
        children: [
          {headerName: "Action", field: "action", sortable: true, filter: false, headerClass: styles.HeaderStyle},
          {headerName: "Behind", field: "behind", sortable: true, filter: false, headerClass: styles.HeaderStyle},
        ]
      },
      {headerName: 'Bank balance review', headerClass: styles.HeaderGroupStyle,
        children: [
          {headerName: "Date", field: "date", sortable: true, filter: false, headerClass: styles.HeaderStyle},
          {headerName: "Amount", field: "amount", sortable: true, filter: false, headerClass: styles.HeaderStyle},
          {headerName: "Verified", field: "verified", cellRenderer: 'paramsRenderer' ,sortable: true, filter: false, headerClass: styles.HeaderStyle},
        ]
      },
      {headerName: 'Bank reconciliation', headerClass: styles.HeaderGroupStyle,
        children: [
          {headerName: "Items", field: "pendingItems", sortable: true, filter: false, headerClass: styles.HeaderStyle},
          {headerName: "Total Amount", field: "totalAmount", sortable: true, filter: false, headerClass: styles.HeaderStyle},
          {headerName: "Behind", field: "behindB", sortable: true, filter: false, headerClass: styles.HeaderStyle}
        ]
      },
  ]
}

rowData = {
  rowData: [
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' },
      { bank: "Banco Mercantil", action: "Celica", behind: 35000, date: '+3 months', amount: 'amount', verified:'verified', items: '10', totalAmount: '12301', behindB: '1123' }
  ]
}

arrayData2 = [];

getData2 = bankDataD.accounts.map((item)=>{
  this.arrayData2.push({
    bank: item.account_name,
    action: 'Review Importing',
    behind: '+3 months',
    date: 'input date',
    amount: 'amount',
    verified: 'verified',
    pendingItems: item.pending_items,
    totalAmount: item.total_pending_amount,
    behindB: ''
  })
})

dataJson2 = {
  rowData: this.arrayData2
}

CustomHeader2 = (props) => (
  <div className={styles.Title}>
    {props.displayName}
  </div>
)

Custom = (props) => (
  <div className={styles.SubTitle}>
    {props.displayName}
  </div>
)

  frameworkComponents = {
    paramsRenderer: ParamsRenderer,
  }

  methodFromParent = cell => {
    alert('Parent Component Method from ' + cell + '!');
  };

  render(){
    return (
      <div className="ag-theme-alpine" style={ {height: '800px', width: '1200px'} }>
          <AgGridReact
              columnDefs={this.columnDefs.columnDefs}
              groupHeaderHeight={50}
              headerHeight={50}
              rowData={this.dataJson2.rowData}
              allowDragFromColumnsToolPanel={false}
              enableMultiRowDragging={false}
              colWidth={135}
              frameworkComponents = {
                  this.frameworkComponents
              }
              defaultColDef={{
              sortable: true,
              filter: false,
              editable: false,
              enablePivot: true,
              // headerComponentFramework: SortableHeaderComponent,
          }}>
              {/* <AgGridColumn  field="bank"></AgGridColumn>
              <AgGridColumn  sortable={true} headerName="Bank statements importing" headerGroupComponentFramework={this.CustomHeader2}>
                  <AgGridColumn  sortable={true} field="action"></AgGridColumn>
                  <AgGridColumn  sortable={true} field="behindBank"></AgGridColumn>
              </AgGridColumn>
              <AgGridColumn  headerName="Bank balance review" headerGroupComponentFramework={this.CustomHeader2}>
                  <AgGridColumn  field="date"></AgGridColumn>
                  <AgGridColumn  field="amount"></AgGridColumn>
                  <AgGridColumn  field="verified"></AgGridColumn>
              </AgGridColumn>
              <AgGridColumn  headerName="Bank reconciliation" headerGroupComponentFramework={this.CustomHeader2}>
                  <AgGridColumn  field="pendingItems"></AgGridColumn>
                  <AgGridColumn  field="totalAmount"></AgGridColumn>
                  <AgGridColumn  field="behind"></AgGridColumn>
              </AgGridColumn> */}
          </AgGridReact>
        </div>
    );
  }
};

export default Bank;
