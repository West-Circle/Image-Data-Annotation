import React from 'react';
import {Tabs, Layout, Breadcrumb,PageHeader,Descriptions} from 'antd'
import "./UserTaskPage.css"
import UserTaskInfo from './UserPostTask'
import UserReceiveTask from './UserReceiveTask';
import UserCompleteTask from './UserCompleteTask';

const {Content} = Layout;
const {TabPane} = Tabs;
function callback(key) {
    console.log(key);
}
  
class UserTaskPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>用户</Breadcrumb.Item>
                        <Breadcrumb.Item>个人发布任务信息</Breadcrumb.Item>
                    </Breadcrumb>
                    <PageHeader className="site-page-header" 
                        title = "个人任务信息" subTitle="查看个人任务信息">
                    </PageHeader>
                    <div className="site-layout-background">
                    <Descriptions bordered size={'default'} column={1}>
                        <Descriptions.Item label="用户名">
                            {localStorage.getItem("user")}
                        </Descriptions.Item>
                    </Descriptions>
                    <Tabs size="default" defaultActiveKey="1" onChange={callback}>
                        <TabPane tab={<span>发布的任务</span>} key="1">
                           <UserTaskInfo/>
                        </TabPane>
                        <TabPane tab={<span>领取的任务</span>} key="2">
                            <UserReceiveTask/>
                        </TabPane>
                        <TabPane tab={<span>完成的任务</span>} key="3">
                            <UserCompleteTask/>
                        </TabPane>
                    </Tabs>
                    </div>
                    
                </Content>
            </Layout>
        );
    }
}

export default UserTaskPage