import findRoom from '../findRoom.js'
function connectWS(token) {
	//证明为房主
	if(global.TOKENS.indexOf(token) !== -1){
		// 销毁申请的token
		global.TOKENS.splice(global.TOKENS.indexOf(token),1);
		let room = global.ROOMS[findRoom(token)];
        global.IO.on('connection', (socket) => {
	        console.log('create room');
	        room.connectPool.push(socket);
	        socket.on('message', (data) => {
	                //console.log('emit event message, token is ' + token);
	                room.historyData.push(data);
	                //console.log(data);
	                for(let link of room.connectPool.slice(1)){
	                    link.emit('message', data);
	                };
	        });
        });
        return;
	} else {
		global.IO.on('connection', (socket) => {
	        console.log('client connection use ' + token);
		    let room = global.ROOMS[findRoom(token)];
		    
		    // 观众连接
		    console.log('add connect pool ' + token);
		    console.log(findRoom(token));
		    room.connectPool.push(socket);
		    // 将所有历史数据推过去
		    //console.log(room.historyData);
		    if(room.historyData.length !== 0) {
		    	room.historyData.forEach((data) => {
			        socket.emit('message',data);
			    });
		    }
	    });
	}
}
export default connectWS;



    