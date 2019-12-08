import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Homepage } from './Homepage';
import { StreetViewComponent } from './components/StreetViewComponent';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={() => <Homepage />}
      />
      <Route
        // exact
        path="/location"
        render={() => <StreetViewComponent />}
      />
    </Switch>
  </BrowserRouter>
)

export default App;
