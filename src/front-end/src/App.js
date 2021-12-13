
import './App.css';
import React, { useEffect } from 'react'
import LoginPage from './Pages/Login/LoginPage';
import MainPage from "./Pages/MainPage/MainPage";
import RegisterPage from './Pages/Login/RegisterPage';
import PrivateRoute from './Route/PrivateRoute';
import ForgetPWPage from './Pages/Login/ForgetPWPage';
import {Route , Router, Switch} from "react-router-dom";


//class App extends React.Component{
function App(){
  useEffect(() => {
    document.title = "数据标注网站"
  }, [])
  return (
    <div className="App">
      <Switch>
        <Route path={'/login'} component={LoginPage}></Route>
        <Route path={'/register'} component={RegisterPage}></Route>
        <Route path={'/forgetpw'} component={ForgetPWPage}></Route>
        <Route path={'/main'} component={MainPage}/>
        <PrivateRoute path={'/'} component={MainPage}/>
      </Switch>
    </div>
  )
}

export default App;
