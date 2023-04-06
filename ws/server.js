import { createClient, commandOptions } from 'redis';
import { WebSocketServer } from 'ws';

const WEB_SOCKET_HOST = process.env.SOCKET_HOST ? process.env.SOCKET_HOST : "localhost"
const WEB_SOCKET_PORT = process.env.SOCKET_PORT ? process.env.SOCKET_PORT : 3000;
const REDIS_HOST = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost";
const REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379;
const APPS_NAMES = process.env.APPS_NAMES ? process.env.APPS_NAMES.split(" ") : ["log_generator"];

const server = new WebSocketServer({ host: WEB_SOCKET_HOST, port: WEB_SOCKET_PORT });


server.on('connection', async function connection(ws) {
    console.log("Client connected on WS")

    // we create one Redis client per connection
    const client = createClient({
        socket: {
            host: REDIS_HOST,
            port: REDIS_PORT
        }
    });
    await client.connect();

    let appsIds = APPS_NAMES.reduce(function (map, name) {
        map[name] = '0-0';
        return map;
    }, {});

    while (true) {
        try {
            let response = await client.xRead(
                commandOptions({
                    isolated: true
                }),
                APPS_NAMES.map((name) => { return { key: name, id: appsIds[name] } }),
                {
                    // Read 1 entry at a time, block for 5000 milliseconds if there are none.
                    COUNT: 1,
                    BLOCK: 5000,
                }
            );

            if (response) {
                ws.send(JSON.stringify(response));

                // Get the ID of the first (only) entry returned.
                for (let resp of response) {
                    appsIds[resp.name] = resp.messages[0].id
                }
            } else {
                console.log('No new stream entries.');
            }
        } catch (err) {
            console.error(err);
        }
    }
});

console.log(`WS started on port ${WEB_SOCKET_PORT}`)