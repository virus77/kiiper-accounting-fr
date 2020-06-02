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
            background: isOpen ? '#ffffff' : '#E7E7E7',
            border: '1px solid #AAAAAA',
            padding: '5px 10px',
            width: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '6px',
            marginBottom: '5px'
        }}>
        <div onClick={onClick} style={{cursor: 'pointer', padding: '5px 0'}}>
          {label}
          <div style={{float: 'right'}}>
            {!isOpen && <span>&#9650;</span>}
            {isOpen && <span>&#9660;</span>}
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #AAAAAA',
              marginTop: 10,
              padding: '10px 20px',
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