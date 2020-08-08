import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./dashboard.css";
import BankPanel from "./Banks/bank";
import SalesPanel from "./Sales/sales";
import PurchasesPanel from "./Purchases/purchases";
import { Menu } from "semantic-ui-react";

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


export default function SimpleTabs(props) {
	const [value, setValue] = useState(0);
	const [tabItem, selectTabItem] = useState("CuentasBancarias");

	const handleChange = (name,index) => {
		selectTabItem(name)
		setValue(index);
	};

	return (
		<div id="dashboardWorkspace">
			{/*Pintado de grid dependiendo del menu superior del grid*/}
			<Menu style={{ display: "flex" }}>
				<Menu.Item
					name="CuentasBancarias"
					active={tabItem === "CuentasBancarias" ? true : false}
					onClick={(event) => handleChange("CuentasBancarias",0)}
				>
					{tabItem === "CuentasBancarias" ? (
						<span style={{ color: "#7158e2" }}>Cuentas bancarias</span>
					) : tabItem === "CuentasBancariasSel" ? (
						<span style={{ color: "#7158e2" }}>Cuentas bancarias</span>
					) : (
						<span>Cuentas bancarias</span>
					)}
				</Menu.Item>
				<Menu.Item
					name="Ventas"
					active={tabItem === "Ventas" ? true : false}
					onClick={(event) => handleChange("Ventas",1)}
				>
					{tabItem === "Ventas" ? (
						<span style={{ color: "#7158e2" }}>Ventas</span>
					) : tabItem === "VentasSel" ? (
						<span style={{ color: "#7158e2" }}>Ventas</span>
					) : (
						<span>Ventas</span>
					)}
				</Menu.Item>
				<Menu.Item
					name="Compras"
					active={tabItem === "Compras" ? true : false}
					onClick={(event) => handleChange("Compras",2)}
				>
					{tabItem === "Compras" ? (
						<span style={{ color: "#7158e2" }}>Compras</span>
					) : tabItem === "ComprasSel" ? (
						<span style={{ color: "#7158e2" }}>Compras</span>
					) : (
						<span>Compras</span>
					)}
				</Menu.Item>
			</Menu>
			<TabPanel value={value} index={0}>
				<BankPanel orgIdSelected={props.orgIdSelected} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SalesPanel orgIdSelected={props.orgIdSelected}/>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<PurchasesPanel orgIdSelected={props.orgIdSelected}/>
			</TabPanel>
		</div>
	);
}
