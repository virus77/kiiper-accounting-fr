import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styles from './dashboard.module.css'
import BankPanel from './Banks/bank';
import SalesPanel from './Sales/sales';
import PurchasesPanel from './Purchases/purchases';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  label: {
      backgroundColor:'green',
      fontSize:10
  },
  tabsStyle: {
    backgroundColor:'#F3F3F3'
  }
}));

const Label = (props) =>(
    <div className={styles.TabStyle}>
        {props.label}
    </div>
)

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <div >
          <Tabs className={styles.TabsContainer} value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab  label={<Label label={'Back Accounts'} />}  {...a11yProps(0)} />
            <Tab  label={<Label label={'Sales'} />} {...a11yProps(1)} />
            <Tab  label={<Label label={'Purchases'} />} {...a11yProps(2)} />
          </Tabs>
        </div>
      </AppBar>
      <TabPanel value={value} index={0}>
        <BankPanel />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SalesPanel/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PurchasesPanel />
      </TabPanel>
    </div>
  );
}