const { Client, Events, GatewayIntentBits } = require("discord.js");
const dictionary = require("./assets/british_transformations.json");
const TOKEN = require("./config.json").token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function captialize(t) {
  return t.replace(/(?:^|[.!?]\s+)([a-z])/g, (match, char) =>
    match.replace(char, char.toUpperCase())
  );
}

function matchCase(original, replacement) {
  if (original.toUpperCase() === original) return replacement.toUpperCase();
  if (original.toLowerCase() === original) return replacement.toLowerCase();
  if (original[0].toUpperCase() + original.slice(1).toLowerCase() === original)
    return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
  return replacement;
}

client.on(Events.MessageCreate, (message) => {
  if (message.author === client.user) return;
  let result = message.content;

  for (const [key, value] of Object.entries(dictionary)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escapedKey, "gi");
    result = result.replace(pattern, (match) => matchCase(match, value));
  }

  // this approach doesn't support phrases
  /* 
  const pattern = new RegExp(
    `\\b(${Object.keys(dictionary).join("|")})\\b`,
    "gi"
  );
  result = result.replace(pattern, (match) => dictionary[match.toLowerCase()]);
  */

  result = captialize(result.replaceAll(/t/gi, "'"));
  message.reply(result);
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(TOKEN);
