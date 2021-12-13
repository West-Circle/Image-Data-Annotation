import React from 'react';
import {Layout, Breadcrumb} from 'antd'
import "./AboutPage.css"
import AboutPageForm from "./AboutPageForm"
const {Content} = Layout;

class AboutPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>关于我们</Breadcrumb.Item>
                        <Breadcrumb.Item>关于开发者联系方式</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background">
                        <AboutPageForm/>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default AboutPage