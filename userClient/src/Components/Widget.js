import './widget.css';
import React from 'react';
import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';


class Widget extends React.Component{ 
    // constructor(){
    //     super();
    // }

    render(){
        const {freeMem,ttlMem,memUsage, usedMem, osType,uptime,cpuType,cpuCores,cpuSpeed,cpuLoad, macA, isActive} = this.props.data;
        const cpuWidgetId = `cpu-widget-${macA.replace(/:/g, "")}`;
        const memWidgetId = `memo-widget-${macA.replace(/:/g, "")}`;
        const cpu ={cpuLoad, cpuWidgetId};
        const mem ={ttlMem,memUsage, usedMem, freeMem, memWidgetId};
        const info = {osType, uptime, cpuType,cpuCores,cpuSpeed};


        return(
            <div className='widget col-sm-12'>
                {!isActive&&<div className='not-active'>Offline</div>}
                <Cpu cpuData={cpu} />
                <Mem memData={mem}/>
                <Info infoData={info}/>

            </div>
);
    }

}

export default Widget;