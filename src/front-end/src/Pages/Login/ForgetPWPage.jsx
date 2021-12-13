import React from "react";
import axios from 'axios';
import './LoginForm.css';
import {Button,Input,Form,Modal, message} from 'antd'
import {MailOutlined, LockOutlined} from '@ant-design/icons';
const server = "http://localhost:5000";
export default class ForgetPWPage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isModalVisible:false,
            loading:false,
            email:'',
        }
        this.toLogin = this.toLogin.bind(this)
        this.checkEmail = this.checkEmail.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.onFinish = this.onFinish.bind(this)
    }

    toLogin(){
        this.props.history.push('/login');
    }

    handleOk(){
        this.setState({
            isModalVisible:false,
        })
    }
    handleCancel(){
        this.setState({
            isModalVisible:false,
        })
    }

    checkEmail(values){
        let address = server + "/user/checkemail";
        console.log(values.email)
        axios.post(address,values).then(response => {
            if(response.data.code === 1){
                message.success(response.data.msg);
                this.setState({
                    isModalVisible:true,
                    email:values.email,
                })
            }
            else{
                alert(response.data.msg);
                window.location.reload()
            }
        })
    }

    onFinish(values){
        this.setState({loading:true});
        console.log(values);
        values.email = this.state.email
        let address = server + "/user/forgetpw";
        axios.post(address, values).then(response =>{
            if(response.data.code === -1){
                alert(response.data.msg)
                window.location.reload()
            }else if(response.data.code === 1){
                alert(response.data.msg)
                window.location.reload()
            }
            else{
                window.location.reload()
                alert("修改密码出错，请重新修改个人密码!");
            }
            setTimeout(() =>{
                this.setState({
                    loading:false,
                    isModalVisible:false,
                    setIsModalVisible:false
                });
            }, 300);
        })
    }

    render(){
        return(
            <div className="forgetpwbgimg">
                <Form name="loginform" className="login-form" 
                initialValues={{remember:true}} onFinish={this.checkEmail}>
                    <Form.Item name="title">
                        <h5>邮箱验证</h5>
                    </Form.Item>
                    <Form.Item name="email" label={"邮箱"} 
                    rules={[
                        {type:'email' , message:'无效邮箱，请重新输入正确邮箱!'},
                        {required:true, message:'请输入您的电子邮箱'}
                        ]}>
                        <Input type="email" prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="邮箱" className="input-text"></Input>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button htmlType="submit" type="primary" className="login-form-button">确认</Button>
                        <Button onClick={this.toLogin} className="login-form-button">返回</Button>
                    </Form.Item>
                </Form>
                <Modal title="输入新的密码" visible={this.state.isModalVisible}
                onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form name="normal_form"
                    initialValues={{ remember: true, prefix:'86'}}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="password"  label={"新密码"} rules={[
                        {required:true, message:"请输入密码!"}, ()=>({
                            validator(_,value){
                                if(value.length >= 6 && value.length <= 25){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('密码的安全性过低，密码必须在6-25位，请重新输入密码!'));
                            }
                        })
                    ]}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="密码" className="input-box"></Input.Password>
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
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="确认密码" className="input-box"></Input.Password>
                    </Form.Item>

                    <Form.Item>
                        <div style={{textAlign:'center'}}>
                            <Button style={{width:"100px"}} type="primary" htmlType="submit" loading={this.state.loading}>
                                确定
                            </Button>
                            <Input style={{width:"100px"}} name='reset' type="reset" value='重置' className="user-reset" />
                            <Button style={{width:"100px"}} type ="primary" onClick={this.handleCancel}>
                                取消
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal> 
            </div>
        );
    }
}