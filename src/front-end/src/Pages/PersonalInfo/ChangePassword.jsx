import {Button, Form, Modal, Input, Select} from "antd";
import React from 'react';
import "./button.css"
import axios from "axios";
import {LockOutlined, MailOutlined, MobileOutlined} from '@ant-design/icons';

const server = "http://localhost:5000"

export default class ChangePassword extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isModalVisible:false,
            setIsModalVisible:false,
            loading : false
        }
        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.onFinish = this.onFinish.bind(this)
    }

    showModal(){
        this.setState({
            isModalVisible:true,
            setIsModalVisible:true
        })
    }
    handleOk(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false
        })
    }
    handleCancel(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false
        })
    }

    onFinish(values){
        this.setState({loading:true});
        values.name = localStorage.getItem("user");
        console.log(values);
        let address = server + "/user/info/editpassword";
        axios.post(address, values).then(response =>{
            if(response.data.code === -1){
                alert(response.data.msg)
                window.location.reload()
            }else if(response.data.code === 1){
                alert(response.data.msg)
                window.location.reload()
            }else if(response.data.code === -2){
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
            <div style={{textAlign:'center'}}>
            <Button className="user-button" onClick={this.showModal}>修改密码</Button>
            <Modal title="修改密码" visible={this.state.isModalVisible}
                onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form name="normal_form"
                    initialValues={{ remember: true, prefix:'86'}}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="old"  label={"旧密码"} rules={[
                        {required:true, message:"请输入密码!"}, ()=>({
                            validator(_,value){
                                if(value.length >= 5 && value.length <= 25){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('密码的安全性过低，密码必须在6-25位，请重新输入密码!'));
                            }
                        })
                    ]}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="旧密码" className="input-box"></Input.Password>
                    </Form.Item>
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