const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

// ================= CONFIG =================

const TOKEN = process.env.TOKEN;

const CLIENT_ID = "1507322298284244993";
const GUILD_ID = "1506394750410821805";

// CHANNELS
const REQUEST_CHANNEL_ID = "1507330365486796842";
const WELCOME_CHANNEL_ID = "1506405747133517996";
const CLIPS_CHANNEL_ID = "1506403896308928583";

// ROLES
const VERIFIED_ROLE_ID = "1506608492062969866";
const MEMBER_ROLE_ID = "1506397247670190201";
const BOY_ROLE_ID = "1506608301851283608";
const GIRL_ROLE_ID = "1506608451453718611";
const UNVERIFIED_ROLE_ID = "1506608698355613827";
const VERIFY_STAFF_ROLE_ID = "1506614299957792768";

// ================= CLIENT =================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ================= AFK =================

const afkUsers = new Map();

// ================= COMMANDS =================

const commands = [

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show commands"),

  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show avatar")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move member")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("setnick")
    .setDescription("Change nickname")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("nickname")
        .setDescription("New nickname")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("roleadd")
    .setDescription("Add role")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("roleremove")
    .setDescription("Remove role")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Send video request")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("Video URL")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("vb")
    .setDescription("Verify Boy")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("vg")
    .setDescription("Verify Girl")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Target user")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set AFK"),

  new SlashCommandBuilder()
    .setName("unafk")
    .setDescription("Remove AFK")

].map(cmd => cmd.toJSON());

// ================= REGISTER =================

const rest = new REST({
  version: "10"
}).setToken(TOKEN);

(async () => {

  try {

    console.log("Registering Commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log("✅ Commands Registered");

  } catch (err) {

    console.log(err);

  }

})();

// ================= READY =================

client.once("ready", () => {

  console.log(`🤖 ${client.user.tag} Online`);

});

// ================= WELCOME =================

client.on("guildMemberAdd", async (member) => {

  const welcomeChannel =
    member.guild.channels.cache.get(
      WELCOME_CHANNEL_ID
    );

  if (!welcomeChannel) return;

  try {

    await member.roles.add(
      UNVERIFIED_ROLE_ID
    );

  } catch (err) {

    console.log(err);

  }

  const embed = new EmbedBuilder()
    .setColor("#090914")
    .setAuthor({
      name: "Welcome to Algeria Wave"
    })
    .setDescription(`
Hello ${member}

Welcome To Algeria Wave 🌊
Enjoy Your Stay.
    `)
    .addFields(
      {
        name: "Username",
        value: member.user.username,
        inline: true
      },
      {
        name: "Member Count",
        value: `${member.guild.memberCount}`,
        inline: true
      }
    )
    .setThumbnail(
      member.user.displayAvatarURL({
        dynamic: true,
        size: 1024
      })
    )
    .setTimestamp();

  welcomeChannel.send({
    content: `${member}`,
    embeds: [embed]
  });

});
// ================= INTERACTION CREATE =================

client.on("interactionCreate", async (i) => {

  if (i.isButton()) {

    if (i.customId === "sendclip") {

      const clipsChannel =
        i.guild.channels.cache.get(
          CLIPS_CHANNEL_ID
        );

      const url =
        i.message.embeds[0].footer.text;

      await clipsChannel.send({
        content:
`@everyone 🔥

📹 New Video Posted

${url}`
      });

      return i.update({
        content: "✅ Clip Sent",
        embeds: [],
        components: []
      });

    }

    if (i.customId === "cancel_clip") {

      return i.update({
        content: "❌ Cancelled",
        embeds: [],
        components: []
      });

    }

  }

  if (!i.isChatInputCommand()) return;

  const { commandName } = i;

  // ================= AFK =================

  if (commandName === "afk") {

    afkUsers.set(i.user.id, true);

    return i.reply({
      content: "💤 You Are Now AFK"
    });

  }

  // ================= UNAFK =================

  if (commandName === "unafk") {

    afkUsers.delete(i.user.id);

    return i.reply({
      content: "✅ You Are No Longer AFK"
    });

  }

  // ================= HELP =================

  if (commandName === "help") {

    const embed = new EmbedBuilder()
      .setColor("#00ffee")
      .setTitle("📜 Algeria Wave Commands")
      .setDescription(`
/help
/avatar
/move
/setnick
/roleadd
/roleremove
/afk
/unafk
/link
/vb
/vg
      `);

    return i.reply({
      embeds: [embed]
    });

  }

  // ================= AVATAR =================

  if (commandName === "avatar") {

    const user =
      i.options.getUser("user") || i.user;

    const embed = new EmbedBuilder()
      .setColor("#00ffee")
      .setTitle(`${user.tag} Avatar`)
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024
        })
      );

    return i.reply({
      embeds: [embed]
    });

  }

  // ================= MOVE =================

  if (commandName === "move") {

    const user =
      i.options.getUser("user");

    const member =
      i.guild.members.cache.get(user.id);

    if (!i.member.voice.channel) {

      return i.reply({
        content: "❌ Join VC First",
        ephemeral: true
      });

    }

    await member.voice.setChannel(
      i.member.voice.channel
    );

    return i.reply({
      content: `✅ Moved ${user.tag}`
    });

  }

  // ================= SETNICK =================

  if (commandName === "setnick") {

    const user =
      i.options.getUser("user");

    const nickname =
      i.options.getString("nickname");

    const member =
      i.guild.members.cache.get(user.id);

    await member.setNickname(nickname);

    return i.reply({
      content: "✅ Nickname Updated"
    });

  }

  // ================= ROLE ADD =================

  if (commandName === "roleadd") {

    const user =
      i.options.getUser("user");

    const role =
      i.options.getRole("role");

    const member =
      i.guild.members.cache.get(user.id);

    await member.roles.add(role);

    return i.reply({
      content: "✅ Role Added"
    });

  }

  // ================= ROLE REMOVE =================

  if (commandName === "roleremove") {

    const user =
      i.options.getUser("user");

    const role =
      i.options.getRole("role");

    const member =
      i.guild.members.cache.get(user.id);

    await member.roles.remove(role);

    return i.reply({
      content: "✅ Role Removed"
    });

  }

  // ================= LINK =================

  if (commandName === "link") {

    const url =
      i.options.getString("url");

    await i.reply({
      content: "✅ Request Sent",
      ephemeral: true
    });

    const embed = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle("🎬 VIDEO REQUEST")
      .setDescription(`
👤 Creator:
${i.user}

🔗 URL:
${url}
      `)
      .setThumbnail(
        i.user.displayAvatarURL({
          dynamic: true
        })
      )
      .setFooter({
        text: url
      });

    const row =
      new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId("sendclip")
            .setLabel("SEND")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId("cancel_clip")
            .setLabel("CANCEL")
            .setStyle(ButtonStyle.Danger)

        );

    const requestChannel =
      i.guild.channels.cache.get(
        REQUEST_CHANNEL_ID
      );

    await requestChannel.send({
      embeds: [embed],
      components: [row]
    });

  }

  // ================= VB =================

  if (commandName === "vb") {

    const user =
      i.options.getUser("user");

    const member =
      i.guild.members.cache.get(user.id);

    await member.roles.remove(
      UNVERIFIED_ROLE_ID
    );

    await member.roles.add([
      VERIFIED_ROLE_ID,
      MEMBER_ROLE_ID,
      BOY_ROLE_ID
    ]);

const embed = new EmbedBuilder()
  .setColor("#57F287")
  .setTitle("✔ Verification Process")
  .setDescription(
    `👥 **${user.username}** has been successfully verified!`
  );

return i.reply({
  embeds: [embed]
});
  // ================= VG =================

  if (commandName === "vg") {

    const user =
      i.options.getUser("user");

    const member =
      i.guild.members.cache.get(user.id);

    await member.roles.remove(
      UNVERIFIED_ROLE_ID
    );

    await member.roles.add([
      VERIFIED_ROLE_ID,
      MEMBER_ROLE_ID,
      GIRL_ROLE_ID
    ]);

const embed = new EmbedBuilder()
  .setColor("#57F287")
  .setTitle("✔ Verification Process")
  .setDescription(
    `👥 **${user.username}** has been successfully verified!`
  );

return i.reply({
  embeds: [embed]
});

// ================= AFK MENTION =================

});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  message.mentions.users.forEach(user => {

    if (afkUsers.has(user.id)) {

      message.reply(
        `💤 ${user.username} Is AFK`
      );

    }

  });

});

// ================= LOGIN =================

client.login(TOKEN);
