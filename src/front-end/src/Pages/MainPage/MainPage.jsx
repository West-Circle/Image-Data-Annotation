import React from "react";
import {Layout} from "antd";
import {Redirect} from "react-router-dom";
import MainHeader from "../../components/MainHeader";
import MainFooter from "../../components/MainFooter";
import ContentBox from "../../components/ContentBox"
import MainMenu from "../../components/MainMenu";
const {Header, Footer, Sider, Content} = Layout;

export default class MainPage extends React.Component{
    render(){
        if(!localStorage.getItem("token")){
            console.log("hi");
            return(
                <Redirect to={{pathname: "/login",}}/>
            )
        }
        return(
            <div>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider width={250}>
                        <MainMenu />
                    </Sider>
                    <Layout>
                        <Header style={{height:"150px"}}>
                            <div style={{textAlign:"left"}}>
                                <text style={{color:"white", fontSize:"25px"}} >
                                    数据标注网站
                                </text>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;               
                                <MainHeader>
                                </MainHeader>
                            </div>
                        </Header>
                        <Content>
                            <ContentBox/>
                        </Content>
                        <Footer>
                            <MainFooter/>
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

