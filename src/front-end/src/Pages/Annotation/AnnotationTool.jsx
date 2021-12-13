import React , {Component} from 'react'
import {Button,Tag} from 'antd'
import styled from 'styled-components'
import { StarOutlined } from '@ant-design/icons';
import {TwoDimensionalImage} from 'react-annotation-tool'

const imageAnnotations = [{
    id: 'jlyjm4py',
    name: 'jlyjm4py',
    type: 'Polygon',
    color: 'rgba(227,0,255,1)',
    vertices: [{
        id: 'jlyjm4py', name: 'jlyjm4py', x: 0, y: 0,
    }, {
        id: 'jlyjm5em', name: 'jlyjm5em', x: 0, y: 0,
    }],
    selectedOptions: [{ id: '0', value: 'root' }, { id: '1', value: 'Object' }, { id: '1-1', value: 'Face' }],
}];
const options = {
    id: '0',
    value: 'root',
    children: [
        {
            id: '1',
            value: 'Object',
            children: [
                {
                    id:
                    '1-1',
                    value: 'Face',
                    children: [],
                },
            ],
        },
        {
            id: '2',
            value: 'Text',
            children: [
                { id: '2-1', value: 'Letter', children: [] },
            ],
        },
    ],
};

export default class AnnotationTool extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            url: '',
            annotations: [],
            annotation: {},
            activeAnnotations: [],
            image : null,
            result : null,
            crop : {aspect: 16 / 9},
        }
    }

    handleSubmit = (r) => {
        this.setState({
            url : r.url
        })
        console.log(this.state.url)
    }

    onClick = (e) =>{
        this.setState({
            url : this.props.urlFromUpload,
        })
        //FileSaver.saveAs(this.props.urlFromUpload, this.props.imgFileName) // Put your image url here.
        alert("由于本网站不支持导出已标注的图片，所以请用户自行截图已标注的图像并生成图片(jpg/jpeg/png等各式)以提交任务!")
    }
    

    render(){
        
        
        return(
            <div style={{textAlign:"center"}} >
                
                <div className='mb-5'>
                    {this.props.imgFileName}
                    <TwoDimensionalImage
                        //hasNextButton
                        //onNextClick={ handleSubmit }
                        //hasPreviousButton
                        //onPreviousClick={ handleSubmit }
                        //hasSkipButton
                        //onSkipClick={ this.handleSubmit }
                        isDynamicOptionsEnable
                        defaultAnnotations={ imageAnnotations }
                        isLabelOn
                        url={this.props.urlFromUpload}
                        imageWidth={ 1000 }
                        options={ options }
                        disabledOptionLevels={ [] }
                    >
                        
                    </TwoDimensionalImage>
                    <Tag style={{height:'30px',fontSize:"14px"}} color="red" icon={<StarOutlined className="site-form-item-icon"/>} >
                        选择你所标注的类型
                    </Tag>
                    <br/>
                    <Tag style={{height:'30px',fontSize:"14px"}} color="red" icon={<StarOutlined className="site-form-item-icon"/>} >
                        如果没有你想要的类型，可填写标注类型并点击Submit提交，然后再次选择类型即可出现标签!
                    </Tag>
                    <br/>
                    <Tag style={{height:'30px',fontSize:"14px"}} color="red" icon={<StarOutlined className="site-form-item-icon"/>} >
                        点击Add Annotation即可进行标注
                    </Tag>
                    <br/><br/>
                    <Button type="primary" onClick={this.onClick} disabled={this.props.urlFromUpload == '' ? true : false}>
                        下载标注图片
                    </Button>
                    
                </div>
            </div>
        )
    }
}