import io from 'socket.io-client';

// const socket = io.connect(process.env.SOCKET, {transports: ['websocket']});
const socket = io.connect('http://localhost:8181', {transports: ['websocket']});
socket.emit('clientAuth', 'kjhbvfsbvxcbvcbnvd');

export default socket;