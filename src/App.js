import './App.css';
import { Component, Fragment, useEffect,useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import Sport_Event from './components/SportEvent/sport_event';
import Country from './components/Country/Country';
import Medals from './components/Medals/medals';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

class App extends Component {

  render() {
    return(
      <Router>
           <div className="App">
           <nav className="navbar navbar-light bg-light">
      
      <div className="container-fluid">
          <a className="navbar-brand px-4" >      <h3>Tokio 2021</h3>     </a>
         

            <Link to="/Country"> <button className="btn btn-danger" >Ver Paises</button></Link>
 
            <Link to="/Medals"><button className="btn btn-danger" >Ver Medallas</button></Link>
            <Link to="/Sport_Event"><button className="btn btn-danger" >Ver Eventos</button></Link>
   
          <form className="d-flex px-4">
           <img src="/images/olym.png" alt="" width="76" height="38" className="d-inline-block align-text-top"></img>       

          </form>
          
          
      </div>
  </nav>
            <Switch>
       
              <Route exact path='/Country' component={Country}></Route>
              <Route exact path='/Medals' component={Medals}></Route>
              <Route exact path='/Sport_Event' component={Sport_Event}></Route>
            </Switch>
          </div>
       </Router>
     
    )
  }

}
export default App;
