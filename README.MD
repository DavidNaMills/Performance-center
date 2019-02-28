# PerformanceCenter
An app suite that tracks computer performance.

Full app to track CPU usage and memory usage. 
multiple computers can be tracked simultaneously.

There are 3 parts:  
## Server:  
Node  
### Requirements:  
Redis server connection  
MongoDB connection  
### Description:  
manages connections from the nodeClient  
A redis connection is required to manage dropped connections  
MongoDB is used to persist the connected devices  

## nodeClient:  
Node  
gathers system information on device  
connects and sends data to the server  

## userClient:  
React  
requires a URL to the server (currently hard coded)  