import React from 'react';
import {Layout, Breadcrumb, Carousel, PageHeader} from 'antd';
import "./HomePage.css";
import img1 from "../../image/data1.jpg";
import img2 from "../../image/data2.jpg";
import img3 from "../../image/data3.jpg";
import img4 from "../../image/data4.jpeg";
import img5 from "../../image/data5.png";
import img6 from "../../image/data6.jpeg";
import img7 from "../../image/data7.jpg";
const {Content} = Layout;
const contentStyle = {
    height: '500px',
    width:'1200px',
    color: '#000',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#d0d0d0',
};

export default class Homepage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}}>
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>数据标注网站概述</Breadcrumb.Item>
                    </Breadcrumb>
                    
                    <div className="site-layout-background" style={{padding:24, minHeight:540, textAlign:'left'}}>
                        <PageHeader 
                        className="site-page-header" 
                        title="欢迎体验本网站的数据标注服务。"
                        subTitle="您可以在本网站修改个人信息、发布任务、领取数据标注任务等。">
                        </PageHeader>
                        <Carousel autoplay>
                            <div>
                                <img src={img1} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img2} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img3} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img4} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img5} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img6} style={contentStyle}></img>
                            </div>
                            <div>
                                <img src={img7} style={contentStyle}></img>
                            </div>
                        </Carousel>
                    </div>
                </Content>
            </Layout>
        );
    }
}
