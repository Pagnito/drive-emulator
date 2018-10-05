var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var PORT = process.env.PORT || 4000;

io.on('connection', (socket)=>{
    var i = 0;
    var connected = true;
    var stopped = false;
    socket.on('disconnect', ()=>{
        connected=false;
        
    })
    socket.on('breakEgo', (data)=>{
        stopped=true;
    })
    console.log('socket connected');
    socket.on('egoPoints', (egoPoints)=>{
       stopped = false;
       egoPoints = egoPoints.map(feat => {
           feat.id = feat.id.indexOf('.') > 0 ? feat.id.replace('.','') : feat.id
            let connections = feat.properties.connections;
            for(var key in connections){
                                
                  connections[key] = connections[key].map(connectId =>{         
                    return connectId.indexOf('.') > 0 ? connectId.replace('.','') : connectId
                  })                
              } 
              return feat;
        })
       
        let promise = new Promise((resolve,promise)=>{      
            io.emit('firstPoint', egoPoints[0].geometry.coordinates[0]);
            resolve();
        })
        promise.then(()=>{
            
            const sendPointByPoint = setInterval(()=>{
                let egoPointsArr = [egoPoints[i], egoPoints[i-1]];
                io.emit('sendingPoint',egoPointsArr );
                i++;
                if(i===egoPoints.length-1){
                    clearInterval(sendPointByPoint);
                    i=0;
                    io.emit('finished', egoPoints);
                }
                if(connected==false || stopped==true){
                    clearInterval(sendPointByPoint);
                    i=0;
                }
               
            },30)
          
        })
        
    })
    
})


app.use(express.static('arc/build'))
app.get('*', (req,res)=>{
    res.sendFile.bind(path.resolve(__dirname, 'arc', 'build', 'index.html'))
})
server.listen(PORT);