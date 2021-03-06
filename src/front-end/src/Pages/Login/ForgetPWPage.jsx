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
                alert("????????????????????????????????????????????????!");
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
                        <h5>????????????</h5>
                    </Form.Item>
                    <Form.Item name="email" label={"??????"} 
                    rules={[
                        {type:'email' , message:'??????????????????????????????????????????!'},
                        {required:true, message:'???????????????????????????'}
                        ]}>
                        <Input type="email" prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="??????" className="input-text"></Input>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button htmlType="submit" type="primary" className="login-form-button">??????</Button>
                        <Button onClick={this.toLogin} className="login-form-button">??????</Button>
                    </Form.Item>
                </Form>
                <Modal title="??????????????????" visible={this.state.isModalVisible}
                onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form name="normal_form"
                    initialValues={{ remember: true, prefix:'86'}}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="password"  label={"?????????"} rules={[
                        {required:true, message:"???????????????!"}, ()=>({
                            validator(_,value){
                                if(value.length >= 6 && value.length <= 25){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('??????????????????????????????????????????6-25???????????????????????????!'));
                            }
                        })
                    ]}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="??????" className="input-box"></Input.Password>
                    </Form.Item>

                    <Form.Item name="confirm" label="????????????" dependencies={['password']} hasFeedback 
                    rules={[
                        {
                            required:true,
                            message:'?????????????????????',
                        },
                        ({ getFieldValue }) =>({
                            validator(_,value){
                                if(!value || getFieldValue('password')=== value ){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('???????????????????????????????????????????????????!'));
                            },
                        }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="????????????" className="input-box"></Input.Password>
                    </Form.Item>

                    <Form.Item>
                        <div style={{textAlign:'center'}}>
                            <Button style={{width:"100px"}} type="primary" htmlType="submit" loading={this.state.loading}>
                                ??????
                            </Button>
                            <Input style={{width:"100px"}} name='reset' type="reset" value='??????' className="user-reset" />
                            <Button style={{width:"100px"}} type ="primary" onClick={this.handleCancel}>
                                ??????
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal> 
            </div>
        );
    }
}