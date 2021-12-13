import React from "react";
import './HeaderTitle.css';
import icon1 from "../image/icon1.png"
export default class MainHeader extends React.Component{
    
    render(){
        return (
            <img style ={{height:'150px', width:'300px'}} src={icon1} alt={"logo"}></img>
            /*<PageHeader title="数据标注网站" className="site-page-header" onBack={()=>null}>
                        
        </PageHeader>*/
        );
    }
}
