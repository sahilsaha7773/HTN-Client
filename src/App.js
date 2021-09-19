import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import "antd/dist/antd.css";
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import PrivateRoute from './middlewares/PrivateRoute';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import Requests from './pages/Requests';
import DonationRequests from './pages/DonationRequests';
import Donated from './pages/Donated';
import DonationsReceived from './pages/DonationsReceived';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>

          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/signup'>
              <Register />
            </Route>
            <PrivateRoute path='/onboarding' component={Onboarding} />
            <PrivateRoute path='/profile' component={Profile} />
            <PrivateRoute path='/donate/:id' component={Donate} />
            <PrivateRoute path='/requests' component={Requests} />
            <PrivateRoute path='/donationRequests' component={DonationRequests} />
            <PrivateRoute path='/yourDonations' component={Donated} />
            <PrivateRoute path='/donationsReceived' component={DonationsReceived} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
