import React, { Component } from 'react';

//Core
import DropdownList from 'react-widgets/lib/DropdownList'

//Css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-widgets/dist/css/react-widgets.css'
import '../Css/Menu.css'

class Menu extends Component {
    constructor(...args) {
        super(...args)

        this.state = {
            value: "■ Organización 1",
            people: [
                { id: '1', name: '■ Organización 1' },
                { id: '2', name: '■ Organización 2' },
                { id: '3', name: '■ Organización 3' },
                { id: '4', name: '■ Grupo 1', Grupo: '_______________________' },
                { id: '6', name: '■ Grupo 3', Grupo: '_______________________' }
            ],
        }
    }

    handleCreate(name) {
        let { people, value } = this.state;
        let newOption = { name, id: people.length + 1 }

        this.setState({
            value: newOption,  //select new option
            people: [...people, newOption] //add new option to our dataset
        })
    }

    render() {
        let { value, people } = this.state;
        return (
            <DropdownList
                filter
                data={people}
                value={value}
                allowCreate="onFilter"
                onCreate={name => this.handleCreate(name)}
                onChange={value => this.setState({ value })}
                textField={"name"}
                groupBy='Grupo'
            //onSelect={(event)=>{console.log(event);}}
            //onClick={(event) =>{console.log(event.target);}}
            />
        )
    }
}

export default Menu;