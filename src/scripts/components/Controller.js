// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Controller extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className='controller' />
    );
  }

  // constructor(props) {
  //   super(props);
  // }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps, {
  }
)(Controller);
