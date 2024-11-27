import { SlashCommandBuilder } from "discord.js";
import axios from "axios";

const fetchQuotes = async () => {
    try {
        const response = await axios.get("https://zenquotes.io/api/quotes");
        const quotes = response.data;

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length )];

        return randomQuote;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    };
};

export const command = {
    data: new SlashCommandBuilder()
        .setName("cheerup") // placeholder name - can be changed to something we both like
        .setDescription("Replies with a positive quote to help you cheer up!"),
        async execute(interaction) {
            const quote = await fetchQuotes();

            if (quote) {
                await interaction.reply(`Here's a positive quote: "${quote.q}" - ${quote.a}`)
            } else {
                await interaction.reply("Sorry, I couldn't fetch a quote at the moment. 😣")
            };
        },
};