import { Upload, Input,message,Form,Tag,Progress} from 'antd';
import { PlusOutlined,StopOutlined } from '@ant-design/icons';
import React from 'react'
import axios from "axios";
import _ from 'lodash';
import AnnotationTool from './AnnotationTool';

const server = "http://localhost:5000";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
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
export default class UploadImage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            previewVisible: false,//image visible
            previewImage: [], //show image
            fileList: [],
            filename: '',
            urlFromUpload : '',
        };
        this.handleCancel = this.handleCancel.bind(this)
    }
    

    handleCancel(){
      this.setState({
          previewVisible: false,
          previewImage:[],
          fileList:[],
          filename : '',
      })
    }


    handleChange = async e => {
      const path = "/images/multi-upload"
      let {files}= e.target;
      //console.log("123",e.target.files[0].name)
      this.state.filename = e.target.files[0].name
      this.state.urlFromUpload = URL.createObjectURL(e.target.files[0]);
      //console.log(this.state.urlFromUpload)
      this.state.fileList=files;
      //console.log("!23",e.target.files)
      var i = 0;
      //display image
      for(i=0 ; i < files.length ;i++){
          this.state.previewImage[i] = URL.createObjectURL(e.target.files[i]);
          this.setState({
              previewVisible:true,
          })
          //console.log("123456",this.state.previewImage)
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
              alert("上传的图片大小必须小于2MB或图片格式出错，只允许jpg, jpeg, png格式，请重新上传图片!")
          }
      })
      //get progress value
      let { data } = await axios.post(server+path, formdata, {
          onUploadProgress: ({ loaded, total }) => {
              let progress = 100;
          }
      });
      console.log(data)
  }

  render() {
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
        <div style={{textAlign:"center"}}>
        <Form name="normal_form"
            initialValues={{ remember: true}}
            style={{textAlign:"center"}}
            labelCol={{ span: 2 }}
            >
            <Form.Item name="upload" label={"上传图片"} 
                rules={[{ required: this.state.fileList.length >= 1 ? false : true, message: '请上传图片' }]}>
                <div style={{textAlign:"center"}}>
                    
                    <input type="file" name="files[]" 
                      id="fileInput" className="file-input" 
                      onChange={this.handleChange} onClick={this.handleCancel}
                      style={{marginTop:"8" ,textAlign:"center"}}
                      prefix={<PlusOutlined className="site-form-item-icon"/>}
                    >
                    
                    </input>
                </div>
            </Form.Item>
            <Form.Item>
                <Tag style={{height:'30px',fontSize:"13px"}} visible={this.state.fileList.length >= 1? true : false} 
                color="red" icon={<StopOutlined className="site-form-item-icon"/>} >
                    最多上传1张图片，如果需要重新标注，请重新上传!!!
                </Tag>
            </Form.Item>
          </Form>
          <div style={{textAlign:"center"}}>
                {/*
                  this.state.previewImage ? (
                    this.state.previewImage.map(uploadedImage => (
                      <img src={uploadedImage} key={uploadedImage} 
                          height={"80%"} width={"80%"}
                          alt="UploadedImage" visible={true}/>
                        ))
                  ) : null
                    */}
              
            <AnnotationTool urlFromUpload={this.state.urlFromUpload} imgFileName={this.state.filename}></AnnotationTool>
          </div>
        </div>
    );
  }
}
