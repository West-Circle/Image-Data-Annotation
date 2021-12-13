
import React from "react";
import axios from "axios";
import {Image,Button,Modal,Input,message,Tag,Avatar,List,Form} from 'antd'
import _ from 'lodash';
import { Progress } from 'reactstrap';
import {StarOutlined, UserOutlined,StopOutlined} from '@ant-design/icons';
import moment from 'moment';
const server = "http://localhost:5000";
const datas = [];
const images = [];
const temps=[];
const fp = "../../../src/uploadimage/"
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
export default class UserReceiveTask extends React.Component{
    constructor(props){
        super(props);
        while(images.length > 0) images.pop() //pop out to initial images/datas 避免跳转到其他页面回来时会出现重复的数据（因为又做请求了）
        while(datas.length > 0) datas.pop()
        this.state={
            id: localStorage.getItem("token"),
            name: localStorage.getItem("user"),
            msgtag:'',
            data : [],//get
            image: [],//get
            modalVisible: [],
            loading:false,//complete task loading
            loading1 : false,//image loading
            progress:0, //image loading progress
            previewVisible: false,//image visible
            previewImage: [], //show image
            fileList: [], //send image data to flask backend
        }
        this.handleCancel2= this.handleCancel2.bind(this)
    }
    
    showModal(e){
        var temp = this.state.modalVisible
        temp[e] = true;
        this.setState({
            modalVisible:temp,
        })
    };
    
    handleOk = (e) =>{
        //console.log("eeee : ",e.imageid)
        let address = server + "/user/task/complete";
        const formData = new window.FormData();
        //console.log("21312321321",this.state.fileList)
        _.forEach(this.state.fileList, file => {
            //console.log(msg)
            formData.append('files',file)
        })
        _.forEach(this.state.image[e.key], img=>{
            //console.log(img)
            formData.append('images',img)
        })
        this.setState({loading:true});
        formData.append('id',localStorage.getItem("token"))
        formData.append('username',localStorage.getItem("user"))
        formData.append('imageid',e.imageid)
        formData.append('taskname',e.taskname)
        formData.append('description',e.description)
        formData.append('datetime',e.datetime)
        console.log(formData);
        axios.post(address, formData).then(response =>{
            if(response.data.code === 1){
                window.location.reload()
                alert(response.data.msg)
            }else if(response.data.code === -1){
                alert(response.data.msg)
                window.location.reload()
            }else if(response.data.code === -2){
                alert(response.data.msg)
                window.location.reload()
            }else{
                window.location.reload()
                alert("提交任务出错，请重新提交任务!");
            }
            setTimeout(() =>{
                this.setState({
                    loading:false,
                    ModalVisible:false,
                });
            }, 300);
        })
        
        
    };
    
    handleCancel(e){
        console.log(e)
        var temp = this.state.modalVisible
        temp[e] = false;
        this.setState({
            modalVisible:temp,
            previewVisible:false,
            previewImage:[],
            loading:false,
            loading1:false,
            progress:0,
            fileList:[],
        })
    };

    handleCancel2(){
        this.setState({
            previewVisible: false,
            previewImage:[],
            loading1:false,
            progress:0,
            fileList:[],
        })
    }

    handleChange = async e => {
        const path = "/images/multi-upload"
        let {files}= e.target;
        //console.log("123",e.target.files)
        //console.log("12345",e.target)
        this.state.fileList=files;
        console.log("!23",this.state.fileList)
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
            if(msg == true){
                formdata.append('files',file)
                //console.log(formdata,"...")
            }else{
                window.location.reload()
                alert("上传的图片大小必须小于2MB或图片格式出错，只允许jpg, jpeg, png格式，请重新发布任务")
            }
        })
        //get progress value
        let { d } = await axios.post(server+path, formdata, {
            onUploadProgress: ({ loaded, total }) => {
                let progress = 100;
                this.setState({
                    progress: progress,
                })
            }
        });
        console.log(d)
    }

    componentWillMount(){
        console.log("willmount")
        let address = server + "/usertask/receiveinfo/" +localStorage.getItem("user") ;
        var temp = []
        axios.get(address).then(response => {
            if(response.data.code == 1){
                for(let i = 0 ; i < response.data.result.length ; i++){
                    datas.push({
                        key : String(i),
                        imageid : String(response.data.result[i].imageid),
                        name : String(response.data.result[i].username),
                        taskname : String(response.data.result[i].taskname),
                        receiveusername : String(response.data.result[i].receiveusername),
                        description : String(response.data.result[i].description),
                        datetime : moment(response.data.result[i].datetime).format("YYYY-MM-DD HH:mm:ss"),
                    })
                    //console.log(datas)
                    temp = temps.concat(
                        response.data.result[i].image1,
                        response.data.result[i].image2,
                        response.data.result[i].image3,
                        response.data.result[i].image4,
                        response.data.result[i].image5,
                        response.data.result[i].image6,
                        response.data.result[i].image7,
                        response.data.result[i].image8,
                        response.data.result[i].image9)
                    console.log(temp)
                    var index;
                    for(let a = 0 ; a < 9; a++){
                        if(temp[a] == 'NULL'){
                            while(temp[a]){
                                temp.pop()
                            }
                            //delete(temp[a])
                            //console.log("popppppp out null image path")
                        }   
                    }
                    //console.log("temptemptemp",temp)
                    images.push({
                        imgs : temp,
                    })
                    while (temps.length > 0) {
                        temps.pop();
                    }
                    //console.log(temps, images)
                }
                this.setState({
                    data : datas,
                    image : images,
                    msgtag:response.data.msg,
                })
                for(let a = 0 ; a < this.state.image.length ; a++){
                    this.state.image[a].imgs.map(img => (
                        console.log("img : ", img)
                    ))
                }
            }else if(response.data.code == -1){
                this.setState({
                    msgtag:response.data.msg
                })
            }
        }).catch((error) =>{
            alert(error)
        })
    }

    render(){
        return(
            <div>
                <div style={{textAlign:"center" }} >
                    <Tag style={{height:'30px', fontSize:'15px'}} visible={true} 
                        color="red" icon={<StarOutlined className="site-form-item-icon"/>} > 
                            {this.state.msgtag}
                    </Tag>
                </div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 5,
                    }}
                    dataSource={this.state.data}
                    renderItem={item=> (
                    <List.Item
                        key={item.taskname}
                        extra={
                            <div style={{width:"600px"}}>
                            <p>点击图片放大观看</p>
                            {this.state.image[item.key] ? this.state.image[item.key].imgs.map(img => (
                                <Image width={200} height={200} title={img}  alt={img}
                                src={require("../../../src/uploadimage/"+img).default} visible={true}>
                                    
                                </Image>
                            )) : null}
                            </div>
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar size={30} icon={<UserOutlined/>}/>}
                            title={item.name}
                            description={
                            <div>
                                <p>任务标题 : {item.taskname}</p>
                                <p>发布时间 : {item.datetime}</p>
                                <p>领取任务用户 : {(item.receiveusername != 'null' )? item.receiveusername : "无"}</p>
                            </div>
                            }
                        />
                        {"任务内容 : " + item.description}
                        <br/><br/>
                        <div style={{textAlign:'center'}}>
                        <Button type="primary" onClick={()=>this.showModal(item.imageid)}>
                                提交任务
                        </Button>
                        <Modal
                            title={"提交任务!"}
                            visible={this.state.modalVisible[item.imageid]}
                            onOk={()=>this.handleCancel(item.imageid)}
                            onCancel={()=>this.handleCancel(item.imageid)}
                            okText="再考虑"
                            cancelText="取消"
                            >
                            <Form name="normal_form"
                                initialValues={{ remember: true}}
                                onFinish={() => this.handleOk(item)}>
                                <Form.Item name="imageid" label="任务ID">
                                    {item.imageid}
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
                                </Form.Item>
                                <Form.Item>
                                    <Tag style={{height:'30px'}} visible={this.state.fileList.length >= 9 ? true : false} 
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
                                            type="reset" value='重置' onClick={this.handleCancel2} className="user-reset">
                                        </Input>
                                        <Button style={{width:"100px"}} type ="primary" onClick={()=>this.handleCancel(item.imageid)}>
                                            取消
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Modal>
                        </div>
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}