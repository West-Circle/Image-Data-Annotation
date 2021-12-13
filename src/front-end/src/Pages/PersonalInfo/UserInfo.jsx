
import React from "react";
import { PageHeader, Descriptions } from "antd";
import {Input , Button } from "antd";
import InfoUpdateForm from "./InfoUpdateForm";
import axios from "axios";

const server = "http://localhost:5000";

export default class UserInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name: "姚熙源",
            password:"123",
            email:"3190300677@zju.edu.cn",
            phone:"19817865057",
            hidden:true,
            buttonvalue:"Show"
        }
        this.toggleShow = this.toggleShow.bind(this);

        let address = server + "/user/info/" + localStorage.getItem("token");
        axios.get(address).then(response => {
            this.setState({
                name:response.data.data.name,
                password:response.data.data.password,
                email:response.data.data.email,
                phone:response.data.data.phone
            })
        });
    }
    toggleShow(){
        this.setState({
            hidden: !this.state.hidden,
        })
    }
    
    render(){
        return(
            <div>
                <PageHeader className="site-page-header" 
                title = "用户个人信息" subTitle="修改个人信息">
                </PageHeader>
                <Descriptions bordered size={'default'} column={1}>
                    <Descriptions.Item label="用户名">
                        {this.state.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="密码">
                        <Input 
                            type={this.state.hidden ? 'password' : 'text'}
                            value={this.state.password}
                        />
                        <Button type="ghost" 
                        onClick={this.toggleShow} >
                            {this.state.hidden ? "显示" : "隐藏"}
                        </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {this.state.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="手机号码">
                        {this.state.phone}
                    </Descriptions.Item>
                    
                </Descriptions>
                <InfoUpdateForm/>
            </div>
        );
    }
}