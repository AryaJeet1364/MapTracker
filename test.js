const io = require("socket.io")

const client = io.Socket()

client.connect("172.17.50.139:5050");