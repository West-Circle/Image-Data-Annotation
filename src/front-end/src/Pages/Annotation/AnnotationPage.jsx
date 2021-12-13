import React from 'react';
import {Layout, Breadcrumb,PageHeader} from 'antd'
import "./AnnotationPage.css"
import UploadImage from './UploadImage';

const {Content} = Layout;

class AnnotationPage extends React.Component{
    render(){
        return(
            <Layout className="site-layout">
                <Content style={{margin:'0px 16px', textAlign:'left'}} >
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>数据标注</Breadcrumb.Item>
                        <Breadcrumb.Item>图像数据标注</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" >
                        <PageHeader className="site-page-header" 
                            title = "图像数据标注" subTitle="数据标注页">
                        </PageHeader>
                        <UploadImage/>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default AnnotationPage