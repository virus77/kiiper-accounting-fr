import React from 'react';

export default class IframeComponent extends React.Component {
  render() {
    return (
      <div>
        <iframe id="frmIfram" title="Iframe" src={this.props.src} height={this.props.height} width={this.props.width}/>
      </div>
    )
  }
}