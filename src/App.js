import './App.css';
import {BrowserRouter as Router, Switch, Route,Redirect, Link} from "react-router-dom";
import Login from './features/users/login'
import Dashboard from './features/users/dashboard';
import {ProvideAuth} from './features/auth/use-auth'
import Ws_login from './features/users/ws_login';

function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <main role="main" className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lf-12">
              <div id="main">
                <div className="pad-0">
                  <Router>
                    <Switch>
                      <Route path='/ws_login'>
                        <Ws_login/>
                      </Route>
                      <Route path='/dashboard'>
                        <Dashboard/>
                      </Route>
                      <Route path='/'>
                        <Login/>
                      </Route>
                    </Switch>
                  </Router>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProvideAuth>
  )

}

export default App;
