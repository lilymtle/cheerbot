import { Client, Events, GatewayIntentBits } from "discord.js";

// import bot token
const { token } = process.env;

// create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]}); // allows bot to receive info about servers

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logging in as ${readyClient.user.tag}`);
});

// login to Discord with token
client.login(token);