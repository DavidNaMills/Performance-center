const mongoose = require('mongoose');
const Machine = require('./models/Machine');
mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds155045.mlab.com:55045/perfdb`, {useNewUrlParser: true});

function socketMain(io, socket){
    let macA;

    socket.on('clientAuth', (key)=>{
        if(key==='fdaas'){
            socket.join('clients');
            console.log('computer connected');
        } else if(key ==='kjhbvfsbvxcbvcbnvd'){
            socket.join('ui');
            console.log('Client connected');
            Machine.find({}, (err, data)=>{
                data.forEach((am)=>{
                    am.isActive = false;
                    io.to('ui').emit('data', am);
                });
            })
        } else{
            socket.disconnect(true);
        }
    });

    socket.on('disconnect', ()=>{
        Machine.find({macA}, (err, doc)=>{
            if(doc.length>0){
                doc[0].isActive=false;
                io.to('ui').emit('data', doc[0])
            }
        })
    })

    socket.on('initPerfData', async (data)=>{
        macA = data.macA;
        const res = await checkAndAdd(data);
    });
    socket.on('perfData', (data)=>{
        io.to('ui').emit('data', data);
    });
}


function checkAndAdd(data){
    return new Promise((resolve, reject)=>{
        Machine.findOne(
            {macA: data.macA},
            (err, doc)=>{
                if(err){
                    throw err;
                    reject(err);
                } else if(doc == null){
                    const newMachine = new Machine(data);
                    newMachine.save();
                    resolve('added');
                } else {
                    resolve('found');
                }
            }
        )
    })
}
module.exports = socketMain;