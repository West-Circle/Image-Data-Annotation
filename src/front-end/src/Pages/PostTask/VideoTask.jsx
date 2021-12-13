import {Button, Form, Modal, Input, Tag, message, DatePicker} from "antd";
import React from 'react';
import "./button.css"
import axios from "axios";
import moment from 'moment'
import {CalendarOutlined,EditOutlined,FileTextTwoTone,CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

const server = "http://localhost:5000";

function isVideo(file){
    //var ext = getExtension(filename);
    const isvideo = file.type === 'video/mp4' || file.type==='video/m4v' || file.type === 'video/mpg' || file.type ==='video/avi';
    if(!isvideo){
        return message.error('视频格式错误,只允许mp4、m4v、mpg、avi格式,请重新上传!');
    }
    return isvideo
}
export default class VideoTask extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isModalVisible:false,
            setIsModalVisible:false,
            loading : false,
            file : [],
            filename: '',
            msgtag: '',
            date : moment().format("YYYY-MM-DD HH:mm:ss"),
        }
        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleCancel2 = this.handleCancel2.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onFinish = this.onFinish.bind(this)
    }

    showModal(){
        this.setState({
            isModalVisible:true,
            setIsModalVisible:true
        })
    }
    handleOk(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false
        })
    }
    handleCancel(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false,
            file:[],
            filename : '',
            loading:false,
            msgtag: '',
        })
    }
    
    handleCancel2(){
        this.setState({
            file:[],
            filename:'',
            msgtag: '',
        })
    }

    handleChange(date){
        this.state.date = moment(date).format("YYYY-MM-DD HH:mm:ss")
        //console.log("123",this.state.date)
    };

    onChange = async e => {
        let {files} = e.target
        //console.log(files)
        this.setState({
            file : e.target.files[0],
        })
        const msg = isVideo(files[0]) 
        if(msg == true){
            this.setState({
                msgtag: "视频上传成功!"
            })
        }else{
            this.setState({
                msgtag: "视频上传错误!"
            })
        }
        
    }

    onFinish(values){
        this.setState({
            filename : this.state.file.name,
            loading:true,
        })
        const formData = new window.FormData()
        console.log(this.state.file)
        formData.append("files",this.state.file)
        formData.append("filename",this.state.filename)
        formData.append('id',localStorage.getItem("token"))
        formData.append('username',localStorage.getItem("user"))
        formData.append('taskname',values.taskname)
        formData.append('description',values.description)
        formData.append('datetime',this.state.date)
        //console.log(this.state)
        let address = server + "/user/task/postvideo";
        axios.post(address,formData).then(response => {
            if(response.data.code === -1){
                window.location.reload()
                alert(response.data.msg)
            }else if(response.data.code === 1){
                alert(response.data.msg)
                window.location.reload()
            }else{
                //window.location.reload()
                alert("发布任务出错，请重新发布任务!");
            }
            setTimeout(() =>{
                this.setState({
                    loading:false,
                    isModalVisible:false,
                    setIsModalVisible:false
                });
            }, 300);
        }).catch((error) =>{
            alert(error)
        })
    }

    render(){
        return(
            <div style={{textAlign:'center'}}>
                <Button className="task-button" onClick={this.showModal}>
                    发布视频任务
                </Button>
                <Modal title="发布视频任务" visible={this.state.isModalVisible}
                    onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form name="normal_form"
                        initialValues={{ remember: true}}
                        onFinish={this.onFinish}>
                        <Form.Item name="taskname" label={"任务标题"} 
                        rules={[
                            {required:true, message:'请输入您的任务标题'}
                            ]}>
                            <Input type="text" prefix={<FileTextTwoTone className="site-form-item-icon"/>} placeholder="任务标题" className="input-box"></Input>
                        </Form.Item>
                        <Form.Item name="description" label={"任务描述"} 
                        rules={[
                            {required:true, message:'请描述您的任务'}
                            ]}>
                            <Input type="text" prefix={<EditOutlined className="site-form-item-icon"/>} placeholder="任务描述" className="input-box"></Input>
                        </Form.Item>
                        <Form.Item name="datetime" label={"当前发布时间"} >
                            <DatePicker onOk={this.handleChange} 
                                defaultValue={moment(this.state.date,"YYYY-MM-DD HH:mm:ss")} 
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime prefix={<CalendarOutlined className="site-form-item-icon"/>}/>
                        </Form.Item>
                        <Form.Item name="upload" label={"上传视频"} 
                            rules={[{ required: this.state.file.length >= 1 ? false : true, message: '请上传视频' }]}>
                            
                            <div>
                                <input type="file" name="file" 
                                id="fileInput" className="file-input"
                                onChange={this.onChange} onClick={this.handleCancel2}
                                />
                            </div>
                        </Form.Item>
                        <Tag icon={<CheckCircleOutlined />} color="success" visible={this.state.msgtag == '视频上传成功!' ? true : false}> 
                            {this.state.msgtag}
                        </Tag>
                        <Tag icon={<CloseCircleOutlined />} color="error" visible={this.state.msgtag == "视频上传错误!" ? true : false}>
                            {this.state.msgtag + ",请重新上传"}
                        </Tag>
                        <Form.Item>
                            <div style={{textAlign:'center'}}>
                                <Button style={{width:"100px"}} type="primary" 
                                htmlType="submit" loading={this.state.loading} disabled={this.state.msgtag =="视频上传错误!" ? true : false}>
                                    确定
                                </Button>
                                <Input style={{width:"100px"}} name='reset' 
                                    type="reset" value='重置' onClick={this.handleCancel2} className="task-reset" />
                                <Button style={{width:"100px"}} type ="primary" onClick={this.handleCancel}>
                                    取消
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}