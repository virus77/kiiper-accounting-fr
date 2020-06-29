import React from 'react';
import styles from './sales.module.css';
import { Doughnut } from 'react-chartjs-2';
import {PieChart, Tooltip, Cell, Pie} from 'recharts'


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

// const data = {
//     datasets: [{
//         data: [1440000, 2000000, 3000000],
//         backgroundColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//         ]
//     }],

//     // These labels appear in the legend and in the tooltips when hovering different arcs
//     labels: [
//         'Red',
//         'Yellow',
//         'Blue'
//     ],
    
//     options: {

//     }
// };

// const sales = (props) =>{
//   return (
//     <div className={styles.Sales} >
//       <div className={styles.SalesTable}>
//         <div className={styles.Title}>
//             Overdue invoices
//         </div>
//       </div>
//       <div className={styles.SalesChart}>
//         <div className={styles.Title}>
//           Top Customers to pay
//         </div>
//         <Doughnut data={data} legend={false} />
//       </div>
//     </div>
//   );
// };

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


// const CustomTooltip = (props) =>(
//   <div className={styles.MyTooltip} >
//     Test
//   </div>
// )

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div  className={styles.MyTooltip}>
        <p >{`${label} : ${payload[0].value}`}</p>
        {/* <p >{getIntroOfPage(label)}</p> */}
        <p >Anything you want can be displayed here.</p>
      </div>
    );
  }

  return null;
};

const sales = (props) =>{
  return (
    <div className={styles.Sales} >
      <div className={styles.SalesTable}>
        <div className={styles.Title}>
            Overdue invoices
        </div>
      </div>
      <div className={styles.SalesChart}>
        <div className={styles.Title}>
          Top Customers to pay
        </div>
        <PieChart width={200} height={200} style={{display:'flex', justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
          <Pie
            data={data}
            cx={80}
            cy={80}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
        </PieChart>
      </div>
    </div>
  );
};

export default sales;
