// ================= SETNICK =================

if (commandName === "setnick") {

  const user = i.options.getUser("user");
  const nickname = i.options.getString("nickname");

  const member =
    i.guild.members.cache.get(user.id);

  await member.setNickname(nickname);

  return i.reply({
    content: "✅ Nickname Updated"
  });

}

// ================= ROLE ADD =================

if (commandName === "roleadd") {

  if (
    !i.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {
    return i.reply({
      content: "❌ Admin Only",
      ephemeral: true
    });
  }

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

  if (
    !i.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {
    return i.reply({
      content: "❌ Admin Only",
      ephemeral: true
    });
  }

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
    })
    .setTimestamp();

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

    return i.reply({
      content: `✅ ${user.tag} Verified As Boy`
    });

  }

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

    return i.reply({
      content: `✅ ${user.tag} Verified As Girl`
    });

  }

});

// ================= AFK MENTION =================

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
