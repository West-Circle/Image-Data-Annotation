import React from "react";
import axios from 'axios';
import './RegisterForm.css';
import {Form, Input, Select,Button, Checkbox} from 'antd';
import {UserOutlined , LockOutlined, MailOutlined} from '@ant-design/icons';

const server = "http://localhost:5000";
const {Option} = Select;
const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select style={{width:70}}>
            <Option value="86">+86</Option>
            <Option value="60">+60</Option>
        </Select>
    </Form.Item>
);
const footForm = {
    wrappperCol:{
        xs:{
            span : 10,
            offset : 0,
        },
        sm:{
            span:0,
            offset:5,
        },
    },
};
class RegisterForm extends React.Component{
    constructor(props){
        super(props)
        this.onFinish = this.onFinish.bind(this);
        this.toLogin = this.toLogin.bind(this);
    }

    onFinish(values){
        console.log("values : ", values);
        let address = server + "/user/register";
        axios.post(address, values).then(response=>{
            if(response.data === 1){
                alert("恭喜用户"+values.name+"注册成功!请返回登录界面登录账号!")
                this.props.history.push('/login')
            }
            else if(response.data === -1){
                alert("该用户名已经被注册，请重新注册!")
            }
            else if(response.data === -2){
                alert("当前邮箱已经被注册，请重新注册!")
            }
            else if (response.data === -3 ){
                alert("输入数据到数据库出错，请重新注册!")
            }
            else if (response.data === -4){
                alert("POST方法出错!")
            }
        })
    }

    toLogin(){
        alert("返回登录界面");
        window.location.href = "http://localhost:3000/login"
    }

    render(){
        return(
            <Form name="registerform" className="register-form"
                initialValues={{remember:true, prefix:'86',}} 
                onFinish={this.onFinish}
            >
                <Form.Item name="title">
                    <h1>注册</h1>
                </Form.Item>
                <Form.Item name="name" label={"用户名"} rules={[{required:true, message:'请输入用户名!'}]}>
                    <Input type="text" prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名" className="input-text"></Input>
                </Form.Item>
                <Form.Item name="email" label={"邮箱"} 
                rules={[
                    {type:'email' , message:'无效邮箱，请重新输入正确邮箱!'},
                    {required:true, message:'请输入您的电子邮箱'}
                    ]}>
                    <Input type="email" prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="邮箱" className="input-text"></Input>
                </Form.Item>
                <Form.Item name="password"  label={"密码"} rules={[
                    {required:true, message:"请输入密码!"}, ()=>({
                        validator(_,value){
                            if(value.length >= 6 && value.length <= 25){
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('密码的安全性过低，密码必须在6-25位，请重新输入密码!'));
                        }
                    })
                    ]}>
                    <Input type="password" prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="密码" className="input-text"></Input>
                </Form.Item>
                <Form.Item name="confirm" label="确认密码" dependencies={['password']} hasFeedback 
                rules={[
                    {
                        required:true,
                        message:'请再次输入密码',
                    },
                    ({ getFieldValue }) =>({
                        validator(_,value){
                            if(!value || getFieldValue('password')=== value ){
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入密码不相同，请再次输入密码!'));
                        },
                    }),
                ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} className="input-text"></Input.Password>
                </Form.Item>
                <Form.Item name="phone" label="手机号码"
                rules={[
                    {
                        required:true,
                        message:'请输入您的手机号码!'
                    },
                ]}
                >
                    <Input addonBefore={prefixSelector} style={{width:'100%',}} className="input-text"></Input>
                </Form.Item>
                <Form.Item name="agreement" valuePropName="checked"
                rules={[
                    {
                        validator: (_,value) => value ? Promise.resolve() : Promise.reject(new Error('请先阅读用户须知')),
                    },
                ]}
                {...footForm}
                >
                    <Checkbox>我已阅读用户须知<a href="">&nbsp;用户须知</a></Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button">
                        注册
                    </Button>
                    <Input name='reset' type="reset" value='重置' className="register-form-reset" />
                    <Button className="register-form-button" onClick={this.toLogin}>
                        返回登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default RegisterForm;