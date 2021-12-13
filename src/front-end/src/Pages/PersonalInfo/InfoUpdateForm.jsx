import React from 'react';
import {Space} from 'antd';
import ChangeInfo from './ChangeInfo';
import ChangePassword from './ChangePassword';


export default class InfoUpdateForm extends React.Component{
    render(){
        return (
            <div style={{textAlign:'center'}}>
                <Space>
                    <ChangeInfo/>
                    <ChangePassword/>
                </Space>
            </div>

        )
    }
}