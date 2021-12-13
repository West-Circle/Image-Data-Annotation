import {Button, Form, Modal,message, Input, DatePicker, Tag} from "antd";
import React from 'react';
import "./button.css"
import axios from "axios";
import moment from 'moment'
import _ from 'lodash';
import { Progress } from 'reactstrap';
import {PlusOutlined,CalendarOutlined,StarOutlined, EditOutlined, StopOutlined, FileTextTwoTone} from '@ant-design/icons';
const server = "http://localhost:5000";
//"YYYY-MM-DD HH:mm:ss"

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      //reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' 
        || file.type==='image/jpg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      return message.error('你只允许上传JPG/JPEG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error('图片大小必须小于2MB！');
    }
    return isJpgOrPng && isLt2M;
}
export default class ImageTask extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            isModalVisible:false,
            setIsModalVisible:false,
            loading : false,
            loading1 : false,
            progress:0,
            date : moment().format("YYYY-MM-DD HH:mm:ss"),
            previewVisible: false,
            previewImage: [],
            previewTitle: '',
            fileList: [],
            timestamp:0,
        }
        this.showModal = this.showModal.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleCancel2 = this.handleCancel2.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.onFinish = this.onFinish.bind(this)
        this.handleOk2 = this.handleOk2.bind(this)
        this.handleChange2 = this.handleChange2.bind(this)
    }

    componentDidMount(){
        let tt = new Date()
        this.state.timestamp = tt.getTime()
        //console.log(this.state.timestamp)
    }

    setvalue=(e)=>{
        this.setState({
            templateStr:e
        })
    }

    showModal(){
        this.setState({
            isModalVisible:true,
            setIsModalVisible:true
        })
        //console.log(this.state.date)
        //console.log(today,moment(today,this.state.date).format("YYYY-MM-DD HH:mm:ss"))
    }
    handleOk(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false
        })
    }
    handleOk2(){
        this.setState({
            previewVisible:false,
            loading:false
        })
    }
    handleCancel(){
        this.setState({
            isModalVisible:false,
            setIsModalVisible:false,
            previewVisible: false,
            loading:false,
            previewImage:[],
            fileList:[],
        })
    }
    handleCancel2(){
        this.setState({
            previewVisible: false,
            previewImage:[],
            progress:0,
            fileList:[],
        })
    }
    handleChange = async e => {
        const path = "/images/multi-upload"
        let {files}= e.target;
        console.log("123",e.target.files)
        console.log("12345",e.target)
        this.state.fileList=files;
        //console.log("!23",e.target.files)
        var i = 0;
        //display image
        for(i=0 ; i < files.length ;i++){
            this.state.previewImage[i] = URL.createObjectURL(e.target.files[i]);
            this.setState({
                previewVisible:true,
            })
            console.log("123456",this.state.previewImage)
        }
        //check file 格式
        const formdata = new FormData();
        _.forEach(files, file => {
            const msg = beforeUpload(file)
            //console.log(msg)
            if(msg === true){
                formdata.append('files',file)
                //console.log(formdata,"...")
            }else{
                window.location.reload()
                alert("上传的图片大小必须小于2MB或图片格式出错，只允许jpg, jpeg, png格式，请重新发布任务")
            }
        })
        //get progress value
        let { data } = await axios.post(server+path, formdata, {
            onUploadProgress: ({ loaded, total }) => {
                let progress = 100;
                this.setState({
                    progress: progress,
                })
            }
        });
        console.log(data)
        
    }

    handleChange2(date){
        this.state.date = moment(date).format("YYYY-MM-DD HH:mm:ss")
        //console.log("123",this.state.date)
    };

    handlePreview = async file => {
        if (!file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.preview,
          previewVisible: true,
          previewTitle: file.name //|| file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    onFinish(values){
        const formData = new window.FormData();
        //console.log("21312321321",this.state.fileList)
        _.forEach(this.state.fileList, file => {
            //console.log(msg)
            formData.append('files',file)
        })
        this.setState({loading:true});
        formData.append('id',localStorage.getItem("token"))
        formData.append('username',localStorage.getItem("user"))
        formData.append('taskname',values.taskname)
        formData.append('description',values.description)
        formData.append('datetime',this.state.date)
        formData.append('timestamp',this.state.timestamp)
        console.log(formData);
        let address = server + "/user/task/postimage";
        axios.post(address, formData).then(response =>{
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
        })
    }
    
    render(){
        
        return(
            <div style={{textAlign:'center'}}>
                <Button className="task-button" onClick={this.showModal}>
                    发布图片任务
                </Button>
                <Modal title="发布图片任务" visible={this.state.isModalVisible}
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
                            <DatePicker onOk={this.handleChange2} 
                                defaultValue={moment(this.state.date,"YYYY-MM-DD HH:mm:ss")} 
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime prefix={<CalendarOutlined className="site-form-item-icon"/>}/>
                        </Form.Item>
                        <Form.Item name="upload" label={"上传图片"} 
                            rules={[{ required: this.state.fileList.length >= 1 ? false : true, message: '请上传图片' }]}>
                            
                            <div>
                                <input type="file" name="files[]" 
                                id="fileInput" className="file-input" multiple 
                                onChange={this.handleChange} onClick={this.handleCancel2}
                                />
                            </div>
                            {
                                !this.state.loading1? (
                                <div className="flex-grow-1 px-2">
                                    <div className="text-center">{this.state.progress}%</div>
                                    <Progress value={[this.state.progress]} />
                                </div>
                            ) : null
                        }
                            <div >
                                {
                                    !this.state.loading1 && this.state.previewImage ? (
                                        this.state.previewImage.map(uploadedImage => (
                                            <img src={uploadedImage} key={uploadedImage} 
                                            height={"200px"} width={"200px"}
                                            alt="UploadedImage" visible={true}/>
                                        ))
                                    ) : null
                                }
                            </div>
                            {/*<img src={this.state.previewImage}></img>
                            */}
                        </Form.Item>
                        <Form.Item>
                            <Tag style={{height:'30px'}} visible={this.state.fileList.length > 9 ? true : false} 
                            color="red" icon={<StopOutlined className="site-form-item-icon"/>} >
                                最多上传9张图片，请点击重置或上传按钮重新上传！
                            </Tag>
                            <Tag style={{height:'30px'}} visible={true} 
                            color="red" icon={<StarOutlined className="site-form-item-icon"/>} > 
                                如果有图片上传错误，请点击重置或上传按鈕重新上传一遍即可！
                            </Tag>
                        </Form.Item>
                        <Form.Item>
                        <div style={{textAlign:'center'}}>
                            <Button style={{width:"100px"}} type="primary" 
                            htmlType="submit" loading={this.state.loading}
                            disabled={this.state.fileList.length > 9 ? true : false}>
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