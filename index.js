require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const command = new SlashCommandBuilder()
  .setName("dispo")
  .setDescription("Envoie le message des disponibilités");

client.once("ready", async () => {
  console.log(`${client.user.tag} est connecté.`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [command.toJSON()] }
    );

    console.log("Commande /dispo enregistrée.");
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== "dispo") return;

  const msg = await interaction.channel.send({
    content: `<@&${process.env.ROLE_TWITCH}> <@&${process.env.ROLE_TIKTOK}>

📅 **Disponibilités pour le stream**

Merci de réagir selon votre disponibilité :

🟣 = Disponible pour modérer Twitch
🎵 = Disponible pour modérer TikTok
❌ = Pas disponible`,
    allowedMentions: {
      roles: [
        process.env.ROLE_TWITCH,
        process.env.ROLE_TIKTOK,
      ],
    },
  });

  await msg.react("🟣");
  await msg.react("🎵");
  await msg.react("❌");

  await interaction.reply({
    content: "Message envoyé.",
    ephemeral: true,
  });
});

client.login(process.env.TOKEN);
