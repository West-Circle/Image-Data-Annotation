import React from 'react';
import LoginForm from './LoginForm'
import "./LoginPage.css";


class LoginPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='bgimg'>
                <LoginForm history={this.props.history}></LoginForm>
            </div>
        );
    }
}

export default LoginPage