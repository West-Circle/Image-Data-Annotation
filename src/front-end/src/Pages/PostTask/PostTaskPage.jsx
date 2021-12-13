import React from 'react';
import {Layout, Breadcrumb} from 'antd'
import "./PostTaskPage.css"
import PostTaskForm from './PostTaskForm';

const {Content} = Layout;

class PostTaskPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>用户发布任务</Breadcrumb.Item>
                        <Breadcrumb.Item>发布任务到全网做数据标注</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background">
                        <PostTaskForm/>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default PostTaskPage