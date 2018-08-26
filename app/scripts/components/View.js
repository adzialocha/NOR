import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  ControllerView,
  SettingsView,
} from '../views';

class View extends Component {
  static propTypes = {
    currentOrientation: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className='view'>
        { this.renderContent() }
      </div>
    );
  }

  renderContent() {
    if (this.props.currentOrientation.includes('portrait')) {
      return <SettingsView />;
    }

    return <ControllerView />;
  }
}

function mapStateToProps(state) {
  return state.view;
}

export default connect(
  mapStateToProps
)(View);
