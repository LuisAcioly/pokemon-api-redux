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

export default App;