import './button.css'
import React from 'react'
import { Space, PageHeader, Descriptions } from "antd";
import ImageTask from './ImageTask'
import VideoTask from './VideoTask'

export default class PostTaskForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name : localStorage.getItem("user")
        }
    }

    render(){
        return(
            <div style={{textAlign:'center'}}>
                <PageHeader className="site-page-header" 
                    title = "用户发布任务" subTitle="发布任务">
                </PageHeader>
                <Descriptions bordered size={'default'} column={1}>
                    <Descriptions.Item label="用户名">
                        {this.state.name}
                    </Descriptions.Item>
                </Descriptions>
                <Space>
                    <ImageTask/>
                    <VideoTask/>
                </Space>
            </div>
            
        )
    }
}