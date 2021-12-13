import React from 'react';
import { Layout } from 'antd';
import {Route, Switch} from "react-router";
import "./Content.css"
import Homepage from '../Pages/HomePage/HomePage';
import UserPage from '../Pages/PersonalInfo/UserPage';
import PostTaskPage from '../Pages/PostTask/PostTaskPage';
import TaskListPage from '../Pages/TaskList/TaskListPage';
import AboutPage from '../Pages/About/AboutPage';
import UserTaskPage from '../Pages/UserTask/UserTaskPage';
import AnnotationPage from '../Pages/Annotation/AnnotationPage';
const {Content} = Layout;

export default class ContentBox extends React.Component{
    render(){
        return(
            <Switch>
                <Route exact path={"/main"} component={Homepage}/>
                <Route exact path={"/main/user"} component = {UserPage}/>
                <Route exact path={"/main/post_task"} component = {PostTaskPage}/>
                <Route exact path={"/main/tasklist"} component = {TaskListPage}/>
                <Route exact path={"/main/usertask"} component={UserTaskPage}/>
                <Route exact path={"/main/annotation"} component={AnnotationPage}/>
                <Route exact path={"/main/about"} component = {AboutPage}/>
                
            </Switch>
        );
    }
}
