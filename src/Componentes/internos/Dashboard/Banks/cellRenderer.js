import React, { Component } from 'react';
import styles from './banks.module.css'

const CustomButton = (props) => {
    return (
        <div onClick={()=>alert('Action')} className={styles.Button}>
            {props.title}
        </div>
    )
}

export default class ChildMessageRenderer extends Component {
  constructor(props) {
    super(props);

    this.invokeParentMethod = this.invokeParentMethod.bind(this);
  }

  invokeParentMethod() {
    this.props.context.componentParent.methodFromParent(
      `Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`
    );
  }


  render() {
    console.log(this.props.data)

    return (
        <CustomButton title="Verify" data={this.props.data}/>
    );
  }
}
