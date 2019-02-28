import React from 'react';
import drawCircle from '../utilities/canvasLoadAnimation';

export default (props)=>{
    const {cpuLoad, cpuWidgetId} = props.cpuData;
    const canvas = document.querySelector(`.${cpuWidgetId}`);
    drawCircle(canvas, cpuLoad);
    return (
        <div className='col-sm-3 cpu'>
            <h3>CPU Load</h3>
            <div className='canvas-wrapper'>
                <canvas className={cpuWidgetId} width="200" height="200"></canvas>
                <div className='cpu-text'>{cpuLoad}%</div>
            </div>
        </div>
    )
}