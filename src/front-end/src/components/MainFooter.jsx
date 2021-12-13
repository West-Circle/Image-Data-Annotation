import React from 'react';
import {Layout} from 'antd';
import {CopyrightOutlined} from '@ant-design/icons';
const {Footer} = Layout;

export default class MainFooter extends React.Component{
    render(){
        return(
            <Footer style = {{textAlign:'center'}}>
                浙江大学2021秋冬学期 B/S体系软件设计课程 数据标注网站
                <br/>
                {<CopyrightOutlined className="site-form-item-icon"/>}项目开发者 姚熙源
            </Footer>
        );
    }
}