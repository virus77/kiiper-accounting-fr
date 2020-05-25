import React from 'react';
import clsx from 'clsx';

//CSS
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


//Core
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

//Icons
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/AttachMoneySharp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import Busqueda from '../Imagenes/kiiper_buscar.png';
import Engrane from '../Imagenes/kiiper_engrane.png';
import Suma from '../Imagenes/kiiper_mas.png';
import Avatar from '../Imagenes/kiiper_avatar.png';
import K from '../Imagenes/kiiper_K.png';

//Componentes
import util from './Js/util';
import Compras from './internos/Compras';
import Ventas from './internos/Ventas';
import Title from './internos/Title';
import IframeComponent from './internos/iFrame';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };
  const handleListItemClick = (event, index) => { setSelectedIndex(index); }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {selectedIndex === 0 || selectedIndex === 1 || selectedIndex === 2 ?
              <img src={K} alt="img-K" /> :
              "Kipper"}
          </Typography>
          {/* icon Busqueda*/}
          <IconButton color="inherit">
            <img src={Busqueda} alt="img-Busqueda" />
          </IconButton>
          {/* icon Suma*/}
          <IconButton color="inherit">
            <img src={Suma} alt="img-Suma" />
          </IconButton>
          {/* icon Engrane*/}
          <IconButton color="inherit">
            <img src={Engrane} alt="img-Engrane" />
          </IconButton>
          {/* icon NotificationsIcon*/}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* icon*/}
          <IconButton color="inherit">
            <img src={Avatar} alt="img-Avatar" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Compras" />
          </ListItem>
          <ListItem button
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Ventas" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" style={{ height: "530px" }} className={classes.container}>
          {selectedIndex === 0 ?
            <Grid container spacing={2}>
              {/* Dashboard */}
              <Title>Dashboard</Title>
              <Grid item xs={12}>
                <Paper className={fixedHeightPaper} style={{ height: "715px" }}>
                  <IframeComponent src="https://gca.panatech.io/login?returnUrl=%2Fpractice%2F5eab0c49a81fa271945c5b37" height="710px" width="100%" />
                </Paper>
              </Grid>
            </Grid> :
            selectedIndex === 1 ?
              <Grid container spacing={2}>
                {/* Recent purchases */}
                <Title>Compras</Title>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Compras />
                  </Paper>
                </Grid>
              </Grid> :
              selectedIndex === 2 ?
                <Grid container spacing={2}>
                  {/* Recent Sales */}
                  <Title>Ventas</Title>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Ventas />
                    </Paper>
                  </Grid>
                </Grid> :
                null
          }
          <Box pt={4}>
            <util.Copyright />
          </Box>
        </Container>
      </main>
    </div >
  );
}