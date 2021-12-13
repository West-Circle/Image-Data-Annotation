import React from 'react';
import {Layout, Breadcrumb} from 'antd'
import "./UserPage.css"
import UserInfo from "./UserInfo"

const {Content} = Layout;

class UserPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>用户</Breadcrumb.Item>
                        <Breadcrumb.Item>个人信息</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background">
                        <UserInfo/>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default UserPage;