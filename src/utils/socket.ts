import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

declare global {
    var io: Server;
}

export const createSocketServer = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        },
    });

    global.io = io;

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });

    io.on('Join room', (socket) => {
        socket.join();
    });

    return io;
};
