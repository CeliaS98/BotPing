require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
    .setName("dispo")
    .setDescription("Envoie le message des disponibilités des modérateurs");

client.once("ready", async () => {

    console.log(`Connecté en tant que ${client.user.tag}`);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: [command.toJSON()]
            }
        );

        console.log("Commande /dispo enregistrée.");

    } catch (err) {

        console.error(err);

    }

});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "dispo") return;

    const message = await interaction.channel.send({

        content:
`<@&${process.env.ROLE_TWITCH}> <@&${process.env.ROLE_TIKTOK}>

📅 **Disponibilités pour le stream**

Merci de réagir selon votre disponibilité :

🟣 = Disponible pour modérer Twitch
🎵 = Disponible pour modérer TikTok
❌ = Pas disponible`,

        allowedMentions: {
            parse: ["roles"]
        }

    });

    await message.react("🟣");
    await message.react("🎵");
    await message.react("❌");

    await interaction.reply({
        content: "✅",
        ephemeral: true
    });

});

client.login(process.env.TOKEN);
