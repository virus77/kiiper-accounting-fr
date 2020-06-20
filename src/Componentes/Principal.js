import React, { useState } from 'react';
import clsx from 'clsx';

//CSS
import { makeStyles } from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/dist/css/react-widgets.css'
import '../Css/Menu.css'
//import CssBaseline from '@material-ui/core/CssBaseline';

//Core
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import { NavDropdown, Nav, Navbar } from 'react-bootstrap';
import DropdownList from 'react-widgets/lib/DropdownList'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

//Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
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
import BanksConvert from '../Componentes/internos/Banks/BanksConvert';
import Reports from '../Componentes/internos/Reports/Reports';
import FiscalReportSales from '../Componentes/internos/Reportes/LibroVentas'
import FiscalReportPurchase from '../Componentes/internos/Reportes/LibroCompras'

//#region estilo
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
//#endregion

//Función utilizada para llenar el dropdownlist
function fillDropDownList(props) {
  var organizations = props.org.map(res => {
    return {
      type: res.xeroOrgName ? "xeroOrgName" : "xeroGroupName",
      name: res.xeroOrgName ? res.xeroOrgName : res.xeroGroupName,
      id: res.organisationId ? res.organisationId : res.groupId,
      //Grupo: res.xeroGroupName ? '_____________________________________________' : "",
    }
  });

  return organizations;
}

export default function Dashboard(props) {
  const classes = useStyles();
  var rw_2_input = "";

  //Retrive data from organizarion and use for fill ddl
  var organizations = fillDropDownList(props);

  const [event, eventKey] = React.useState(-1);
  const handleListItemClick = (event, index) => { eventKey(index); selectMenuOption(event); }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // Change selected value from dropdownlist when press left button
  // Asign value "" to ddlprincipal
  const [Value, setValue] = useState("");

  // Selected option from organizations List. Initialazed at zero
  const [orgIdSelected, setorgIdSelected] = useState("");

  // Selected option from organizations List. Initialazed at zero
  const [orgNameSelected, setorgNameSelected] = useState("");

  // Stores banks show module again flag
  const [showModuleAgain, setShowModuleAgain] = useState(false);

  // Stores breadcrumb path
  const [breadcrumbPath, setBreadcrumbPath] = useState("");

  //Cambia el estatus del evento del clic en el DeopDownList
  let handleClick = (item) => {

    //Obtiene el elemento div del ddl principal
    rw_2_input = document.querySelector('[id*=rw_]').getElementsByTagName("div")[0];

    if (typeof item.type === "string") {
      eventKey(item.type);

      // Setting organization selected in React to component
      setorgIdSelected(item.id);
      setorgNameSelected(item.name);
      setValue(item.name)

      //Cambia el color en el ddlPrincipal dependiendo la selección
      rw_2_input.style = "background-color: #5540c2 !important; border-color: #5540c2 !important;";
    }
    else {
      rw_2_input = document.querySelector('[id*=rw_]').getElementsByTagName("div")[0];
      rw_2_input.style = "background-color: #232c51 !important; border-color: #232c51 !important;";
      eventKey(-1);
      setValue("")
      rw_2_input.style = "background-color: #232c51 !important; border-color: #232c51 !important;";
    }
  }

  // When selecting menu option
  const selectMenuOption = (event) => {
    const parent = event.target.parentNode;
    const parentId = parent.getAttribute("aria-labelledby");
    const selectedClass = "navBarOptionSelected";
    document.querySelectorAll(`.${selectedClass}`).forEach((item) => {
      item.classList.remove(selectedClass);
    });

    if (parentId) {
      document.getElementById(parentId).classList.add(selectedClass);
    }
    else {
      event.target.classList.add(selectedClass);
    }
  }

  //Asigna el cuadro al texto dependiendo si es org o grup
  let kiiper_PurpleSquare = "http://desacrm.quierocasa.com.mx:7002/Images/kiiper_PurpleSquare.png";
  let kiiper_BlueSquare = "http://desacrm.quierocasa.com.mx:7002/Images/kiiper_BlueSquare.png";
  let ValueInput = ({ item }) => (<span><strong><img border="0" width="10" height="10" src={util.contains(item.type, "xeroOrgName") ? kiiper_PurpleSquare : kiiper_BlueSquare}></img></strong>{'   ' + item.name}</span>);

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {event === -1 ? "Kiiper" :
              <img style={{ height: "20px" }} src={K} alt="img-K" />}
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
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
            {/*Menú principal principal */}
            <table>
              <thead></thead>
              <tbody>
                <tr>
                  <td>
                    {event === "xeroOrgName" || event === 0.1 || event === 1.1 || event === 1.2 ?
                      <div className={classes.toolbarIcon}>
                        <IconButton onClick={(event) => handleClick(-1)}>
                          <ChevronLeftIcon />
                        </IconButton>
                      </div> : null}
                  </td>
                  <td>
                    <div className={classes.toolbarIcon}>
                      <DropdownList
                        style={{ width: "240px" }}
                        filter
                        data={organizations}
                        allowCreate="onFilter"
                        onChange={value => handleClick(value)}
                        itemComponent={ValueInput}
                        valueField="id"
                        textField="name"
                        value={Value}
                        groupBy='Grupo' />
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {event === "xeroOrgName" || event === 0.1 || event === 1.1 || event === 1.2 || event === 2.1 || event === 3.1 || event === 3.2 ?
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link className="navBarOptionSelected" style={{ padding: "0 30px" }} eventKey={0.1} onClick={(event) => handleListItemClick(event, 0.1)} href="#home">Dashboard</Nav.Link>
                <NavDropdown style={{ padding: "0 30px" }} title="Negocio" id="ddlNegocioId">
                  <NavDropdown.Item eventKey={1.1} onClick={(event) => handleListItemClick(event, 1.1)} href="#Negocio/Ventas">Ventas</NavDropdown.Item>
                  <NavDropdown.Item eventKey={1.2} onClick={(event) => handleListItemClick(event, 1.2)} href="#Negocio/Compras">Compras</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown style={{ padding: "0 30px" }} title="Contabilidad" id="ddlContabilidadId">
                  <NavDropdown.Item eventKey={2.1} onClick={(event) => handleListItemClick(event, 2.1)} href="#Contabilidad/Bancos">Bancos</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown style={{ padding: "0 30px" }} title="Reportes" id="ddlReportesId">
                  <NavDropdown.Item eventKey={3.1} onClick={(event) => handleListItemClick(event, 3.1)} href="#Reportes/Impuestos">Impuestos</NavDropdown.Item>
                  {/* <NavDropdown.Item eventKey={3.2} onClick={(event) => handleListItemClick(event, 3.2)} href="#Reportes/Compras">Compras</NavDropdown.Item> */}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse> :
            null}
        </Navbar>
        <Container maxWidth="lg" style={{ height: "calc(100% - 105px)", padding: "20px!important" }} className={classes.container}>
          {event === "xeroOrgName" || event === 0.1 ?
            <Grid container spacing={2}>
              {/* Dashboard */}
              <Title>Dashboard</Title>
              <Grid item xs={12}>
                <Paper className={fixedHeightPaper} style={{ height: "715px" }}>
                  <IframeComponent src="https://gca.panatech.io/login?returnUrl=%2Fpractice%2F5eab0c49a81fa271945c5b37" height="710px" width="100%" />
                </Paper>
              </Grid>
            </Grid> :
            event === "xeroOrgName" || event === 1.1 ?
              <Grid container spacing={2}>
                {/* Recent Sales  */}
                <Title>Ventas</Title>
                <Grid item xs={12}>
                  <Ventas token={props.token} orgIdSelected={orgIdSelected} />
                </Grid>
              </Grid> :
              event === "xeroOrgName" || event === 1.2 ?
                <Grid container spacing={2}>
                  {/* Recent purchases */}
                  <Title>Compras</Title>
                  <Grid item xs={12}>
                    <Compras token={props.token} orgIdSelected={orgIdSelected} />
                  </Grid>
                </Grid> :
                event === "xeroOrgName" || event === 2.1 ?
                  <Grid container spacing={2}>
                    {/* Breadcrumb  */}
                    <div className="breadcrumbClass" style={{ display: "flex" }}>
                      <div id="moduleTitle" style={{ cursor: "pointer" }} onClick={(event) => { setShowModuleAgain(true); setBreadcrumbPath(""); }}>
                        <Title>Bancos</Title>
                      </div>
                      <span
                        id="breadcrumbPath"
                        style={{
                          marginLeft: 10,
                          fontWeight: 700,
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "flex-end",
                          fontSize: "1.2em",
                          color: "#9680ED"
                        }}
                      >{breadcrumbPath}</span>
                    </div>
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        < BanksConvert setBreadcrumbPath={setBreadcrumbPath} setShowModuleAgain={setShowModuleAgain} showModuleAgain={showModuleAgain} orgIdSelected={orgIdSelected} />
                      </Paper>
                    </Grid>
                  </Grid> :
                  event === "xeroOrgName" || event === 3.1 ?
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          < Reports orgIdSelected={orgIdSelected} />
                        </Paper>
                      </Grid>
                    </Grid> :
                    event === "xeroOrgName" || event === 3.2 ?
                      <Grid container spacing={2}>
                        <Title>Libro fiscal de compras</Title>
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                            <FiscalReportPurchase orgIdSelected={orgIdSelected} />
                          </Paper>
                        </Grid>
                      </Grid> :
                      null}
          {/* Copyright */}
          <Box pt={4}>
            <util.Copyright />
          </Box>
        </Container>
      </main>
    </div >
  );
}