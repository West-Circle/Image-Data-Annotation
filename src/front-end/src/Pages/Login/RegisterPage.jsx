import React from 'react';
import RegisterForm from "./RegisterForm";
import bg from "../../image/register.jpg";

let backg = {
    width:"100%",
    height:"100%",
    backgroundImage:`url(${bg})`,
    display:"flex",
}

class RegisterPage extends React.Component{
    render(){
        return(
            <div style={backg}>
                <RegisterForm history={this.props.history}/>
            </div>
        );
    }
}

export default RegisterPage