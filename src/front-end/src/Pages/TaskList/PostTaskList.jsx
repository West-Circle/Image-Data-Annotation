import React from 'react'
import {Image,Button,Tag,Avatar,List,Popconfirm} from 'antd'
import { StarOutlined, UserOutlined} from '@ant-design/icons';
import axios from "axios";
import moment from 'moment'
const server = "http://localhost:5000";
const datas = [];
const images = [];
const temps=[];
const fp = "../../../src/uploadimage/"
export default class PostTaskList extends React.Component{
    constructor(props){
        super(props);
        while(images.length > 0) images.pop() //pop out to initial images/datas 避免跳转到其他页面回来时会出现重复的数据（因为又做请求了）
        while(datas.length > 0) datas.pop()
        this.state={
            popVisible: [],
            loading:false,
            name:localStorage.getItem("user"),
            id:localStorage.getItem("token"),
            msgtag:'',
            data : [],
            image: [],
        }
        
    }
    
    showPopconfirm(e){
        var temp = this.state.popVisible
        temp[e] = true;
        this.setState({
            popVisible:temp,
        })
    };

    handleOk = (e) =>{
        console.log("eeee : ",e)
        let address = server + "/user/task/receive";
        this.setState({
            loading:true
        })
        const formData = new window.FormData();
        formData.append('id',localStorage.getItem("token"))
        formData.append('username',localStorage.getItem("user"))
        formData.append('imageid',e)
        axios.post(address, formData).then(response =>{
            if(response.data.code === -1){
                window.location.reload()
                alert(response.data.msg)
            }else if(response.data.code === 1){
                alert(response.data.msg)
                window.location.reload()
            }else if(response.data.code === -2){
                alert(response.data.msg)
                window.location.reload()
            }
            else{
                //window.location.reload()
                alert("领取任务出错，请重新领取任务!");
            }
            setTimeout(() => {
                this.setState({
                    popVisible:false,
                    loading:false,
                })
            }, 300);
        })
        
    };
    
    handleCancel(e){
        var temp = this.state.popVisible
        temp[e] = false;
        this.setState({
            popVisible:temp,
        })
    };

    componentWillMount(){
        console.log("willmount")
        let address = server + "/tasklist/postlist" ;
        var temp = []
        axios.get(address).then(response => {
            if(response.data.code == 1){
                for(let i = 0 ; i < response.data.result.length ; i++){
                    datas.push({
                        key : String(i),
                        imageid : String(response.data.result[i].imageid),
                        name : String(response.data.result[i].username),
                        taskname : String(response.data.result[i].taskname),
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
                    for(let a = 0 ; a < temp.length ; a++){
                        if(temp[a] == 'NULL'){
                            delete(temp[a])
                            console.log("popppppp out null image path")
                        }
                    }
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
                //while(images.length > 0) images.pop() //pop out to initial images/datas 避免跳转到其他页面回来时会出现重复的数据（因为又做请求了）
                //while(datas.length > 0) datas.pop()
                console.log(this.state.data)
                /*for(let j = 0 ; j < this.state.image.length ; j++){
                    for(let k = 0 ; k < 9 ; k++){
                        if(this.state.image[j].imgs[k] != '../../../src/uploadimage/NULL')
                            console.log(j+ " : " + this.state.image[j].imgs[k])
                    }
                }*/
                //console.log("1234",this.state.image)
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
                            </div>
                            }

                        />
                        {"任务内容 : " + item.description}
                        <br/><br/>
                        <div style={{textAlign:'center'}}>
                        <Popconfirm
                            title={"用户 "+this.state.name+" 确认领取任务!"}
                            visible={this.state.popVisible[item.imageid]}
                            onConfirm={() => this.handleOk(item.imageid)}
                            onCancel={()=>this.handleCancel(item.imageid)}
                            okText="确认"
                            cancelText="取消"
                            >
                            <Button type="primary" onClick={()=>this.showPopconfirm(item.imageid)}
                            disabled={this.state.name === 'admin' ? true : false}>
                                领取任务
                            </Button>
                        </Popconfirm>
                        </div>
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}