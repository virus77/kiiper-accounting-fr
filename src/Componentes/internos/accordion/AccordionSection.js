import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AccordionSection extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Object).isRequired,
        isOpen: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        this.props.onClick(this.props.label);
    };

    render() {
        const {
        onClick,
        props: { isOpen, label },
    } = this;

    return (
      <div
        style={{
            background: '#f5f6fa',
            border: '1px solid #E5E5EA',
            padding: '5px 10px',
            width: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '10px',
            marginBottom: '5px',
            fontWeight: '600',
            color: 'rgba(35, 44, 81, 0.7)'
        }}>
        <div onClick={onClick} style={{cursor: 'pointer', padding: '5px 0'}}>
          {label}
          <div style={{float: 'right'}}>
            {!isOpen && <span className="acoordionOptionArrow"><img alt="abajo" src="./src/Imagenes/downArrow.svg"/></span>}
            {isOpen && <span className="acoordionOptionArrow arrowUp"><img alt="abajo" src="./src/Imagenes/downArrow.svg"/></span>}
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              background: '#ffffff',
              margin: '10px 0',
              padding: '10px 20px',
              borderRadius: '5px'
            }}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;