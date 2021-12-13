import React from "react";
import axios from 'axios';
import './LoginForm.css';
import '../../config.js';
import {Form, Input, Button, Checkbox, message} from 'antd';
import {UserOutlined , LockOutlined, LoadingOutlined} from '@ant-design/icons';

const server = "http://localhost:5000";

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.toRegister = this.toRegister.bind(this);
        this.toForgetPW = this.toForgetPW.bind(this);
    }

    onFinish(values){
        let address = server + "/user/login";
        console.log(values)
        /*let data = {
            "username":values.username,
            "password":values.password
        }*/
        axios.post(address,values).then(response =>{
            console.log(response.data);
            if(response.data.code === -1){
                alert(response.data.msg);
                window.location.reload()
            }
            else if(response.data.code === -2){
                //console.log(response.data.code)
                alert(response.data.msg);
                window.location.reload()
            }
            else if(response.data.code === 1){
                console.log(response.data.data.name + response.data.data.token)
                message.success(response.data.msg + "欢迎使用图像数据标注网站")
                //alert(response.data.msg + "欢迎使用图像数据标注网站");
                localStorage.setItem("user",response.data.data.name);
                localStorage.setItem("token",response.data.data.token);
                this.props.history.push("/main");
            }
        })
    }

    toRegister(){
        this.props.history.push('/register');
    }
    
    toForgetPW(){
        this.props.history.push('/forgetpw')
    }

    render(){
        return(
            <Form name="loginform" className="login-form" 
            initialValues={{remember:true}} onFinish={this.onFinish}>
                <Form.Item name="title">
                    <h1>登 录</h1>
                </Form.Item>
                <Form.Item name="username" label={"账号"} rules={[{required:true, message:"请输入用户名"}]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名" className={"input-text"}></Input>
                </Form.Item>
                <Form.Item name="password" label={"密码"} rules={[{required:true, message:"请输入密码"}]}>
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="密码" className={"input-text"} type="password">

                    </Input.Password>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" className="login-form-button">登录</Button>
                    <Button onClick={this.toRegister} className="login-form-button">注册</Button>
                    <br/>
                    <Button type="link" onClick={this.toForgetPW}>忘记密码</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default LoginForm;