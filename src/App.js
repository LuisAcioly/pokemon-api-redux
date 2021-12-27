<<<<<<< HEAD
import Home from './containers/Home';
import Pokemon from './containers/Pokemon';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/:name">
          <Pokemon />
        </Route>
      </Switch>
    </Router>
  );
}

=======
import Home from './containers/Home';
import Pokemon from './containers/Pokemon';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/:name">
          <Pokemon />
        </Route>
      </Switch>
    </Router>
  );
}

>>>>>>> cefc3fa36f356e0f33d4941f6d5c0df1e5a3a6b7
export default App;