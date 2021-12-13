
import React from "react";
import { PageHeader, Descriptions } from "antd";
import {Image, Button } from "antd";
import wechatcode from "../../image/wechatcode.jpg"

export default class AboutPageForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name: "Peter",
            email:"3190300677@zju.edu.cn",
            school:"浙江大学",
            class:
            <div>
                浙江大学计算机科学与技术学院 软件工程1902班
            </div>,
            hidden:true,
            preview:false,
            buttonvalue:"隐藏"
        }
        this.toggleShow = this.toggleShow.bind(this);
    }
    toggleShow(){
        this.setState({
            hidden: !this.state.hidden,
            preview : !this.state.preview,
        })
    }
    render(){
        return (
            <div style={{textAlign:'center'}}>
                <PageHeader className="site-page-header" 
                title = "关于我们" subTitle="关于开发者的联系方式">
                </PageHeader>
                <Descriptions bordered size={'default'} column={1}>
                    <Descriptions.Item label="开发者昵称">
                        {this.state.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="邮箱">
                        {this.state.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="学校名称">
                        {this.state.school}
                    </Descriptions.Item>
                    <Descriptions.Item label="班级">
                        {this.state.class}
                    </Descriptions.Item>
                    <Descriptions.Item label="微信">
                        <Image src={wechatcode} alt="微信二维码" 
                        style={{width:"200px", height:"200px",visibility:(this.state.hidden) ? 'hidden' : 'visible'}} 
                        preview={this.state.preview}>
                        </Image>
                        <br/>
                        <Button type="ghost" 
                        onClick={this.toggleShow} >
                            {this.state.hidden ?  "显示" : "隐藏" }
                        </Button>
                    </Descriptions.Item>
                </Descriptions>
            </div>

        )
    }
}