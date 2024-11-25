import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT = process.env.DISCORD_CLIENT;

const __dirname = dirname(fileURLToPath(import.meta.url));
const foldersPath = join(__dirname, "commands");
const commandFolders = readdirSync(foldersPath);

const commands = [];

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter((file) =>
        file.endsWith(".js")
    );

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const { command } = await import(`./commands/${folder}/${file}`);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(DISCORD_CLIENT),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
