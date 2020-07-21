import React, { Component } from 'react';

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ascSort: 'inactive',
      descSort: 'inactive',
      noSort: 'inactive',
    };

    props.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
  }

  componentDidMount() {
    this.onSortChanged();
  }

  render() {
    let sort = null;
    if (this.props.enableSorting) {
      sort = (
        <div style={{ display: 'inline-block' }}>
          <div
            onClick={this.onSortRequested.bind(this, 'asc')}
            onTouchEnd={this.onSortRequested.bind(this, 'asc')}
            className={`customSortDownLabel ${this.state.ascSort}`}
          >
            D
          </div>
          <div
            onClick={this.onSortRequested.bind(this, 'desc')}
            onTouchEnd={this.onSortRequested.bind(this, 'desc')}
            className={`customSortUpLabel ${this.state.descSort}`}
          >
            U
          </div>
        </div>
      );
    }

    return (
      <div style={{display:'flex', flex:1, justifyContent:'center', alignItems:'center'}}>
        <div className="customHeaderLabel">{this.props.displayName}</div>
        {sort}
      </div>
    );
  }

  onMenuClicked() {
    this.props.showColumnMenu(this.menuButton);
  }

  onSortChanged() {
    this.setState({
      ascSort: this.props.column.isSortAscending() ? 'active' : 'inactive',
      descSort: this.props.column.isSortDescending() ? 'active' : 'inactive',
      noSort:
        !this.props.column.isSortAscending() &&
        !this.props.column.isSortDescending()
          ? 'active'
          : 'inactive',
    });
  }

  onMenuClick() {
    this.props.showColumnMenu(this.menuButton);
  }

  onSortRequested(order, event) {
    this.props.setSort(order, event.shiftKey);
  }
}