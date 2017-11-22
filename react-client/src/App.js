import React, { Component } from 'react';
import './App.css';
import OpportunityContainer from './components/OpportunityContainer';
import AuthConfiguration from './components/AuthConfiguration'; 
import SalesforceContainer from './components/SalesforceContainer';
import { Route } from  'react-router-dom';

class App extends Component {

  render() {
    return (
      <div className="container">
        <Route exact={true} path="/" component={OpportunityContainer} />
        <Route exact={true} path="/config" component={AuthConfiguration} />
        <Route exact={true} path="/send-salesforce" component={SalesforceContainer} />
      </div>
    );
  }
}

export default App;
