/*
  Create By glów#0001
*/

const {
    token,
    prefix
} = require('./config.json')

const request = require("request");
const colors = require('colors')
const {
    Client
} = require('discord-selfbot-v12')
const rpc = require('discord-rpc')

const client = new Client(),
    rpcClient = new rpc.Client({
        transport: 'ipc'
    })

process.on('unhandledRejection', e => {})
process.on('uncaughtException', e => {})
process.on('uncaughtRejection', e => {})
process.warn = () => {};

client.on("error", () => {})

client.on("warn", () => {})

console.log(colors.bgCyan.white.bold("Aviso!") + " | " + colors.rainbow("starting..."))
process.title = "conecting...";

console.clear()
process.title = `Delete Message | purge`;
console.log("RDBUG".bgBlue.white.bold);
function printClear() {
    console.log(`




 ██████╗ ██╗      ██████╗ ██╗    ██╗    ██████╗ ███╗   ███╗    ██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗██████╗ 
██╔════╝ ██║     ██╔═══██╗██║    ██║    ██╔══██╗████╗ ████║    ██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
██║  ███╗██║     ██║   ██║██║ █╗ ██║    ██║  ██║██╔████╔██║    ██████╔╝██║   ██║██████╔╝██║  ███╗█████╗  ██████╔╝
██║   ██║██║     ██║   ██║██║███╗██║    ██║  ██║██║╚██╔╝██║    ██╔═══╝ ██║   ██║██╔══██╗██║   ██║██╔══╝  ██╔══██╗
╚██████╔╝███████╗╚██████╔╝╚███╔███╔╝    ██████╔╝██║ ╚═╝ ██║    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██║  ██║
 ╚═════╝ ╚══════╝ ╚═════╝  ╚══╝╚══╝     ╚═════╝ ╚═╝     ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
                                                                                                                 
                                                                                        
                                                                            
    • logged in as ${client.user.tag} | Type: '${prefix}' to delete every message in a dm. •
    `.blue)
}

console.clear()
process.title = `purge - Loading...`
console.log(`




██╗      ██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗          
██║     ██╔═══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝          
██║     ██║   ██║███████║██║  ██║██║██╔██╗ ██║██║  ███╗         
██║     ██║   ██║██╔══██║██║  ██║██║██║╚██╗██║██║   ██║         
███████╗╚██████╔╝██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝██╗██╗██╗
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝╚═╝
                                                                
                                                                `.blue)

function clear(authToken, authorId, channelId) {
    const wait = async (ms) => new Promise(done => setTimeout(done, ms))

    const headers = {
        "Authorization": authToken
    };

    const recurse = (before) => {
        let params = before ? `?before=${before}` : ``;

        request({
            url: `https://discord.com/api/v9/channels/${channelId}/messages${params}`,
            headers: headers,
            json: true
        }, async (error, response, result) => {
            if (response === undefined) {
                return recurse(before);
            }

            if (response.statusCode === 202) {
                const w = response.retry_after;

                console.log(`Ops, channel non-indexed, wait ${w}ms to index the messages.`);

                await wait(w);

                return recurse(before);
            }

            if (response.statusCode !== 200) {
                return console.log('Waiting for API!', result);
            }

            for (let i in result) {
                let message = result[i];

                if (message.author.id === authorId && message.type !== 3) {
                    await new Promise((resolve) => {

                        const deleteRecurse = () => {
                            request.delete({
                                url: `https://discord.com/api/v9/channels/${channelId}/messages/${message.id}`,
                                headers: headers,
                                json: true
                            }, async (error, response, result) => {
                                if (error) {
                                    return deleteRecurse();
                                }
                                if (result) {
                                    if (result.retry_after !== undefined) {
                                        console.log(`Rate-limited! Waiting ${result.retry_after}ms to continue the purge.`)
                                        await wait(result.retry_after * 1000);
                                        return deleteRecurse();
                                    }
                                }

                                resolve()
                            });
                        }

                        deleteRecurse();
                    });
                }
            }

            if (result.length === 0) {
                console.clear()
                printClear()
                console.log("Luna have purged all messages");
            } else {
                recurse(result[result.length - 1].id);
            }
        });
    }

    recurse();
}

client.on('ready', async () => {
    console.clear()
    process.title = `glow purger  | logged into account > ${client.user.username}`
    printClear()
})

client.on('message', async (message) => {
    if (message.author.id != client.user.id) return
    if (message.content.toLowerCase() === prefix) {
        message.delete()
        clear(token, client.user.id, message.channel.id);
        console.log(`prefix detected - starting purge messages....`)
    }
})

client.on('warn', () => {})
client.on('error', () => {})

client.login(token)

rpcClient.on('ready', () => {
    rpcClient.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: "-> purge | Message Clear",
            state: 'discord.gg/glowshop',
            assets: {
                large_image: "logo",
                small_image: 'glow',
                small_text: 'discord.gg/zUtXgsfr'
            },
            buttons: [{
                label: "Download",
                url: "https://discord.gg/zUtXgsfr"
            }]
        }
    })
})

rpcClient.login({
    clientId: '958782767255158876'
}).catch(() => {})
