import React from 'react';
import drawCircle from '../utilities/canvasLoadAnimation';

export default ({memData})=>{
    const {ttlMem,memUsage, freeMem, memWidgetId}=memData;
    const mcanvas = document.querySelector(`.${memWidgetId}`);
    drawCircle(mcanvas, memUsage);
    const ttlMemGb = Math.floor((ttlMem/1073741824*100))/100;
    const freeMemGb = Math.floor((freeMem/1073741824*100))/100;
return (
    <div className='col-sm-3 mem'>
        <h3>Memory Usage</h3>
        <div className='canvas-wrapper'>
            <canvas className={memWidgetId} width="200" height="200"></canvas>
            <div className='mem-text'>
                {memUsage}%
            </div>
        </div>
        <div>
            Total Memory: {ttlMemGb}Gb
        </div>
        <div>
            Free Memory: {freeMemGb}Gb
        </div>
    </div>
    )
}