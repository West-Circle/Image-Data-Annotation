import React from "react";
import { Layout, Menu} from 'antd';
import {Link} from 'react-router-dom'
import { Avatar } from "antd";
import {TagsTwoTone, FormOutlined, UnorderedListOutlined, HomeOutlined, UserOutlined, UploadOutlined,LogoutOutlined} from '@ant-design/icons';
const {SubMenu} = Menu;
const url = "http://localhost:3000"
export default class MainMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
        this.logOut = this.logOut.bind()
    }

    logOut(){
        alert("用户 " +localStorage.getItem("user")+ " 登出成功");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "http://localhost:3000/"
    }

    render(){
        let username = localStorage.getItem("user")
        let href=window.location.href
        //console.log(href)
        return(
            <Layout>
                <Menu theme="dark" 
                    defaultSelectedKeys={[href]}
                    selectedKeys={[href]}
                    mode="inline"
                    style={{ width: 250 }}>
                    <Menu.Item>
                        <Avatar size={40} icon={<UserOutlined/>}></Avatar>
                        &nbsp;&nbsp;&nbsp;&nbsp;{username}
                    </Menu.Item>
                    <Menu.Item key={url+"/main"} icon={<HomeOutlined/>}>               
                        <Link to={"/main"}>首页</Link>
                    </Menu.Item>
                    <Menu.Item key={url + "/main/user"} icon={<UserOutlined/>}>
                        <Link to={"/main/user"}>个人信息</Link>
                    </Menu.Item>
                    <Menu.Item key={url+"/main/post_task"} icon={<UploadOutlined/>}>
                        <Link to={"/main/post_task"}>发布任务</Link>
                    </Menu.Item>
                    <Menu.Item key={url+"/main/tasklist"} icon={<UnorderedListOutlined />}>
                        <Link to={"/main/tasklist"}>全网任务</Link>
                    </Menu.Item>
                    <Menu.Item key={url+"/main/usertask"} icon={<FormOutlined />}>
                        <Link to={"/main/usertask"}>个人任务信息</Link>
                    </Menu.Item>
                    <Menu.Item key={url+"/main/annotation"} icon={<TagsTwoTone />}>
                        <Link to={"/main/annotation"}>数据标注</Link>
                    </Menu.Item>
                    <Menu.Item key={url+"/main/about"} icon={<FormOutlined />}>
                        <Link to={"/main/about"}>关于我们</Link>
                    </Menu.Item>
                    <Menu.Item icon={<LogoutOutlined />}>
                        <Link onClick={this.logOut}>登出</Link>
                    </Menu.Item>
                </Menu>
            </Layout>
        );
    }
}