import React from 'react';
import {Layout, Breadcrumb,PageHeader,Tabs} from 'antd'
import PostTaskList from './PostTaskList';
import "./TaskListPage.css"
import ReceiveTaskList from './ReceiveTaskList';
import CompleteTaskList from './CompleteTaskList';

const {Content} = Layout;
const {TabPane} = Tabs;
function callback(key) {
    console.log(key);
  }
  
class TaskListPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>用户</Breadcrumb.Item>
                        <Breadcrumb.Item>全网任务</Breadcrumb.Item>
                    </Breadcrumb>
                    <PageHeader className="site-page-header" 
                        title = "全网任务" subTitle="发布任务 / 已领取任务 / 已完成任务">
                    </PageHeader>
                    <div className="site-layout-background">
                    <Tabs size="default" defaultActiveKey="1" onChange={callback}>
                        <TabPane tab={<span>发布任务</span>} key="1">
                            <PostTaskList/>
                        </TabPane>
                        <TabPane tab={<span>已领取任务</span>} key="2">
                            <ReceiveTaskList/>
                        </TabPane>
                        <TabPane tab={<span>已完成任务</span>} key="3">
                            <CompleteTaskList/>
                        </TabPane>
                    </Tabs>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default TaskListPage