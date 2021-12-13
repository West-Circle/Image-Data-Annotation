import {Button, Form, Modal, Input, Select} from "antd";
import React from 'react';
import "./button.css"
import axios from "axios";
import {LockOutlined, MailOutlined, MobileOutlined} from '@ant-design/icons';

const server = "http://localhost:5000"
const {Option} = Select;
const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select style={{width:70}}>
            <Option value="86">+86</Option>
            <Option value="60">+60</Option>
        </Select>
    </Form.Item>
);
export default class ChangeInfo extends React.Component{
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
        let address = server + "/user/info/edit";
        axios.post(address, values).then(response =>{
            if(response.data.code === -1){
                window.location.reload()
                alert(response.data.msg)
            }else if(response.data.code === 1){
                alert(response.data.msg)
                window.location.reload()
            }else{
                window.location.reload()
                alert("修改信息出错，请重新修改个人信息!");
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
            <Button className="user-button" onClick={this.showModal}>修改个人信息</Button>
            <Modal title="修改个人信息" visible={this.state.isModalVisible}
                onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form name="normal_form"
                    initialValues={{ remember: true, prefix:'86'}}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="email" label={"邮箱"} 
                        rules={[
                            {type:'email' , message:'无效邮箱，请重新输入正确邮箱!'},
                            {required:true, message:'请输入您的电子邮箱'}
                            ]}>
                            <Input type="email" prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="邮箱" className="input-box"></Input>
                    </Form.Item>

                    
                    
                    <Form.Item name="phone" label="手机号码"
                    rules={[
                        {
                            required:true,
                            message:'请输入您的手机号码!'
                        },
                    ]}
                    >
                        <Input prefix={<MobileOutlined className="site-form-item-icon"/>} addonBefore={prefixSelector} style={{width:'100%',}} className="input-box"></Input>
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