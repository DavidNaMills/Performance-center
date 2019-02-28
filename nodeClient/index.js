const PORT = 8181;
const SERVERADD='http://127.0.0.1';

const os = require('os');
const io = require('socket.io-client');
let socket = io(`${SERVERADD}:${PORT}`);

socket.on('connect', ()=>{
    const ni = os.networkInterfaces();
    let mac;
    for(let key in ni){
        if(!ni[key][0].internal){
            mac=ni[key][0].mac;
            break;
        }
    }

    socket.emit('clientAuth', 'fdaas');

    performanceData().then((allData)=>{
        allData.macA = mac;
        socket.emit('initPerfData', allData);    
    })


    let dataInt = setInterval(()=>{
        performanceData().then((allData)=>{
            allData.macA = mac;
            socket.emit('perfData', allData);
        })
    }, 1000);

    socket.on('disconnect', ()=>{
        clearInterval(dataInt);
    })
})

function performanceData(){
    return new Promise (async (resolve, reject)=>{
        const cpus = os.cpus();
        const osType = os.type();
        const uptime = os.uptime()
        const freeMem = os.freemem();
        const ttlMem = os.totalmem();
        const usedMem = ttlMem-freeMem;
        const memUsage = Math.floor(usedMem/ttlMem*100)
        const cpuType = cpus[0].model;
        const cpuCores = cpus.length;
        const cpuSpeed = cpus[0].speed;
        const cpuLoad = await getCPULoad();
        const isActive=true;
        resolve({
            freeMem,
            ttlMem,
            usedMem,
            memUsage,
            osType,
            uptime,
            cpuType,
            cpuCores,
            cpuSpeed,
            cpuLoad,
            isActive
        });
    })
}

function cpuAverage(){
    const cpus = os.cpus();
    let idleMs = 0;
    let ttlMs = 0;
    cpus.forEach((aCore)=>{
        for(type in aCore.times){
            ttlMs+=aCore.times[type];
        }
        idleMs+=aCore.times.idle;
    });
    return {
        idle: idleMs/cpus.length,
        total: ttlMs/cpus.length,
    };
};

function getCPULoad(){
    return new Promise((resolve, reject)=>{
    const start = cpuAverage();
        setTimeout(()=>{
            const end = cpuAverage();
            const idleDiff = end.idle - start.idle;
            const totalDiff = end.total - start.total;
            const percent = 100-Math.floor(100*idleDiff/totalDiff);
            resolve(percent) ;
        }, 100);
    })
}


