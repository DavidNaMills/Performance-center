require('dotenv').config();
const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
const socketMain = require('./socketMain');
// const port = process.env.PORT;
const num_processes = 2;
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');

if (cluster.isMaster) {
	let workers = [];

	let spawn = function(i) {
		workers[i] = cluster.fork();

		workers[i].on('exit', function(code, signal) {
			spawn(i);
		});
    };

	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = function(ip, len) {
		return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
	};

	const server = net.createServer({ pauseOnConnect: true }, (connection) =>{
		let worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	});
	
    server.listen(process.env.PORT);
} else {
    let app = express();
    const server = app.listen(0, process.env.SERVER);
	const io = socketio(server);

	io.adapter(io_redis({ host: `${process.env.REDISHOST}`, port: process.env.REDISPORT, auth_pass: process.env.REDISAUTH}));

    io.on('connection', function(socket) {
		socketMain(io,socket);
    });

	process.on('message', function(message, connection) {
		if (message !== 'sticky-session:connection') {
			return;
		}
		server.emit('connection', connection);

		connection.resume();
	});
}
