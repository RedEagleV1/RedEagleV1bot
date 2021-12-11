const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
require("discord-buttons")(client);





const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Pinglendi.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.owner) permlvl = 8;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(process.env.token);
//TOKENİ ENVDEN ÇIKARMAYIN VE KİMSEYE PAYLAŞMAYIN ALTYAPIYI REMİXLEDİĞİNİZ ANDA SORUMLULUK SİZE AİTDİR.
client.on("ready", () => {
  client.channels.cache.get("905495858743738398").join();   
})

client.on("guildCreate", guild => {

  let murphy = guild.owner
  
const dcs = new Discord.MessageEmbed()
.setTitle(`Merhaba!`)
.setThumbnail(client.user.avatarURL)
.setTimestamp()
.setColor("GREEN")//dcs
.addField('Prefixim', ayarlar.prefix)
.addField(`Destek Sunucusu`, `Buraya destek Sunucunuzn Linkini Koyun`)
murphy.send(dcs)
});

client.on("message", async message => {
  if(message.author.id === client.user.id) return;
  if(message.guild) return;
 //DCS 
client.channels.get('909758669569278003').send(new Discord.RichEmbed().setAuthor('Yeni DM!').setFooter('DM-LOG SİSTEMİ!').setDescription(`Gönderen kişi:   ${message.author.tag}`).setTimestamp().setThumbnail(client.user.avatarURL).addField("Mesajı;",
message.content).setColor("GOLD"))//DCS!
})

client.on("guildMemberAdd", async(member) => {
  let sunucupaneli = await db.fetch(`sunucupanel_${member.guild.id}`)
  if(sunucupaneli) {
    let rekoronline = await db.fetch(`panelrekor_${member.guild.id}`)
    let toplamuye = member.guild.channels.find(x =>(x.name).startsWith("Toplam Üye •"))
    let toplamaktif = member.guild.channels.find(x =>(x.name).startsWith("Aktif Üye •"))
    let botlar = member.guild.channels.find(x =>(x.name).startsWith("Botlar •"))
    let rekoraktif = member.guild.channels.find(x =>(x.name).startsWith("Rekor Aktiflik •"))
    
    if(member.guild.members.filter(off => off.presence.status !== 'offline').size > rekoronline) {
      db.set(`panelrekor_${member.guild.id}`, member.guild.members.filter(off => off.presence.status !== 'offline').size)
    }
    try{
      toplamuye.setName(`Toplam Üye • ${member.guild.members.size}`)
      toplamaktif.setName(`Aktif Üye • ${member.guild.members.filter(off => off.presence.status !== 'offline').size}`)
      botlar.setName(`Botlar • ${member.guild.members.filter(m => m.user.bot).size}`)
      rekoraktif.setName(`Rekor Aktiflik • ${rekoronline}`)
   } catch(e) { }
  }
})

client.on("guildMemberRemove", async(member) => {
  let sunucupaneli = await db.fetch(`sunucupanel_${member.guild.id}`)
  if(sunucupaneli) {
    let rekoronline = await db.fetch(`panelrekor_${member.guild.id}`)
    let toplamuye = member.guild.channels.find(x =>(x.name).startsWith("Toplam Üye •"))
    let toplamaktif = member.guild.channels.find(x =>(x.name).startsWith("Aktif Üye •"))
    let botlar = member.guild.channels.find(x =>(x.name).startsWith("Botlar •"))
    let rekoraktif = member.guild.channels.
    find(x =>(x.name).startsWith("Rekor Aktiflik •"))
    
    if(member.guild.members.filter(off => off.presence.status !== 'offline').size > rekoronline) {
      db.set(`panelrekor_${member.guild.id}`, member.guild.members.filter(off => off.presence.status !== 'offline').size)
    }
    try{
      toplamuye.setName(`Toplam Üye • ${member.guild.members.size}`)
      toplamaktif.setName(`Aktif Üye • ${member.guild.members.filter(off => off.presence.status !== 'offline').size}`)
      botlar.setName(`Botlar • ${member.guild.members.filter(m => m.user.bot).size}`)
      rekoraktif.setName(`Rekor Aktiflik • ${rekoronline}`)
   } catch(e) { }
  }
});

const guildInvites = new Map();
client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || "1";
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} Sunucuya ${member.guild.memberCount}. sırayla katıldı. ${usedInvite.inviter.tag} tarafından davet edilmiş. ${usedInvite.url} Davet koduyla katılmış. Bu davet kodu ${usedInvite.uses} kere kullanılmış.`)
            .setTimestamp()
            .setFooter("31 ZORT CU .")
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === 'LOG KANALI ID');
        if(welcomeChannel) {
            welcomeChannel.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});

client.on('guildCreate', guild => {
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle('Bir Sunucuya Eklendim!')
  .setDescription(`**${client.user.username}** bot **"${guild.name}"** Adlı Sunucuya Eklendi. Sunucu Üye Sayısı: **${guild.memberCount}** Üye!`)
  .setFooter(`${client.user.username}`, client.user.avatarURL)
  .setTimestamp()
  client.channels.get('906880503045558292').send(embed);
});

client.on('guildDelete', guild => {
  const embed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle('Bir Sunucudan Atıldım!')
  .setDescription(`**${client.user.username}** bot **"${guild.name}"** Adlı Sunucudan Atıldı.`)
  .setFooter(`${client.user.username}`, client.user.avatarURL)
  .setTimestamp()
  client.channels.get('906880503045558292').send(embed);
});
client.on("message", async msg => {

  let saas = await db.fetch(`saas_${msg.guild.id}`);

  if (saas == 'kapali') return;

  if (saas == 'acik') {

  if (msg.content.toLowerCase() === 'sa') {

    msg.reply('Aleyküm Selam');

  }

  }

});
client.on("message", msg => {
  var dm = client.channels.cache.get("907321674322567218");
  if (msg.channel.type === "dm") {
    if (msg.author.id === client.user.id) return;
    const botdm = new Discord.MessageEmbed()
      .setTitle(`${client.user.username} Dm`)
      .setTimestamp()
      .setColor("RANDOM")
      .setThumbnail(`${msg.author.avatarURL()}`)
      .addField("Gönderen", msg.author.tag)
      .addField("Gönderen ID", msg.author.id)
      .addField("Gönderilen Mesaj", msg.content);

    dm.send(botdm);
  }
  if (msg.channel.bot) return;
});
client.on('guildMemberAdd', async member => {
  if(!db.kontrol(`otorol_${member.guild.id}`)) db.yaz(`otorol_${member.guild.id}`, "deaktif")
    const gereksiz = await db.fetch(`otorol_${member.guild.id}`);
    if (gereksiz === "aktif") {
        var rolke = db.fetch(`otorolu_${member.guild.id}`);
        var kanal = db.fetch(`otokanal_${member.guild.id}`);
        member.roles.add(rolke)
        if(!kanal) { return; } else {
        client.channels.cache.get(kanal).send(`<@${member.id}> adlı kullanıcıyı başarıyla kaydettim`)
        }
    } else if (gereksiz === "deaktif") {
    }
    if (!gereksiz) return;
});
const disbut = require("discord-buttons")
client.on("message", message => {
    // main klasörüne atılacaktır.
    if(message.content.toLowerCase().startsWith("deneme")){ // Neenhila#0666 hata halinde CodAre #javascript kanalına yazın! Özele değil!
        let firstOption = new disbut.MessageMenuOption()
        .setValue("first")
        .setDescription("First Option Description")
        .setLabel("First Option")

        let secondOption = new disbut.MessageMenuOption()
        .setValue("second")
        .setDescription("Second Option Description")
        .setLabel("Second Option")

        
        let thirdOption = new disbut.MessageMenuOption()
        .setValue("third")
        .setDescription("Third Option Description")
        .setLabel("Third Option")
// Bütün menü seçenekleri aşağıdaki örnekten yola çıkarak yapılabilir ama örnekleri çoğalttığınızda veya eksilttiğinizde veya id değişimi yaptığınızda lütfen ClickMenu eventinde de gereken ayarlamaları yapın
        let fourthOption = new disbut.MessageMenuOption()
        .setValue("fourth") // id ellemeyin. Elleyecekseniz de eğer clickMenu eventini de ona göre düzenleyin.
        .setDescription("Fourth Option Description") // bütün menüler için Description kısmı 2 satırdan oluşan seçeneğin alttaki yazısıdır. Açıklamadır.
        .setLabel("Fourth Option") // Üstte bahsettiğim iki kısımdan üstte olanıdır. Başlıktır. Seçeneğin başlığı olarak gözükür.

        let menu = new disbut.MessageMenu()
        .setPlaceholder("Choose options which you want") // stringi değişebilirsiniz seçim yapılmamışken gözüken yazıdır.
        .setID("menu")
        .addOptions(firstOption, secondOption, thirdOption, fourthOption)
        .setMinValues(0)
        .setMaxValues(4)
        // bu embeddir boş mesaj göndermemek için yaptım ama siz buraya embed yazmayıp yazı da yazabilirsiniz.

        let embed = new Discord.MessageEmbed()
        .setDescription("İşte menü")
// embedi silecekseniz yazı ile gönderecekseniz message.channel.send(`mesajınız`, {component: menu}) yapmanız lazım.
        message.channel.send({
            embed: embed,
            component: menu
        })
// event kısmıdır
        client.on("clickMenu", async menu => {
            if(menu.clicker.id !== message.author.id) return;
            await menu.clicker.fetch();
            await menu.reply.think(true)
            if(menu.values[0] === "first"){
                if(menu.clicker.member.roles.cache.has("rolid")){ // rol var mı diye kontrol ediyor
                    menu.clicker.member.roles.remove("rolid"); //varsa rolü geri alıyor 
                } else {
                    menu.clicker.member.roles.add("rolid") // yoksa rolü veriyor
                }
                menu.reply.edit("Rollerin düzenlendi.")  // seçim bittikten sonra atılan mesaj bütün mesajların aynı olmasına özen gösterin karışıklık olmasın.
            }
            if(menu.values[0] === "second"){
                if(menu.clicker.member.roles.cache.has("rolid")){ // rol var mı diye kontrol ediyor
                    menu.clicker.member.roles.remove("rolid"); //varsa rolü geri alıyor 
                } else {
                    menu.clicker.member.roles.add("rolid") // yoksa rolü veriyor
                }
                menu.reply.edit("Rollerin düzenlendi.")
  
            }
            if(menu.values[0] === "third"){
                if(menu.clicker.member.roles.cache.has("rolid")){ // rol var mı diye kontrol ediyor
                    menu.clicker.member.roles.remove("rolid"); //varsa rolü geri alıyor 
                } else {
                    menu.clicker.member.roles.add("rolid") // yoksa rolü veriyor
                }
                menu.reply.edit("Rollerin düzenlendi.")
  
            }
            if(menu.values[0] === "fourth"){
                if(menu.clicker.member.roles.cache.has("rolid")){ // rol var mı diye kontrol ediyor
                    menu.clicker.member.roles.remove("rolid"); //varsa rolü geri alıyor 
                } else {
                    menu.clicker.member.roles.add("rolid") // yoksa rolü veriyor
                }
                menu.reply.edit("Rollerin düzenlendi.")

            }
            
        })
    }
});
client.on("message", async message => {
  if (message.author.bot) return;
   let yazılar = db.fetch(`${message.guild.id}.otocevap.yazılar`)
   let cevaplar = db.fetch(`${message.guild.id}.otocevap.cevaplar`)
  var efe = ""
  let sunucuadı = message.guild.name
  let üyesayı = message.guild.members.cache.size
      for (var i = 0; i < (db.fetch(`${message.guild.id}.otocevap.yazılar`) ? db.fetch(`${message.guild.id}.otocevap.yazılar`).length : 0); i++) {
    if (message.content.toLowerCase() == yazılar[i].toLowerCase()) {
        efe += `${cevaplar[i].replace("{sunucuadı}", `${sunucuadı}`).replace("{üyesayı}", `${üyesayı}`)}`
        message.channel.send(`${efe}`)
    }
}
});
client.on('guildMemberAdd', async (member, guild, message) => {
 
let role = db.fetch(`otorolisim_${member.guild.id}`)
 let otorol = db.fetch(`autoRole_${member.guild.id}`)
 let i = db.fetch(`otorolKanal_${member.guild.id}`)
 if (!otorol || otorol.toLowerCase() === 'yok') return;
else {
 try {
 
 
  if (!i) return
if (!role) {
  member.addRole(member.guild.roles.get(otorol))
                        var embed = new Discord.RichEmbed()
                        .setDescription("**Sunucuya Yeni Katılan** @" + member.user.tag + " **Kullanıcısına** <@&" + otorol + ">  **Rolü verildi.**")
                        .setColor('0x36393E')
                        .setFooter(`Otorol Sistemi`)
     member.guild.channels.get(i).send(embed)
} else if (role) {
    member.addRole(member.guild.roles.get(otorol))
                        var embed = new Discord.RichEmbed()
                        .setDescription(`**Sunucuya Yeni Katılan** \`${member.user.tag}\` **Kullanıcısına** \`${role}\` **Rolü verildi.**`)
                        .setColor('0x36393E')
                        .setFooter(`Otorol Sistemi`)
     member.guild.channels.get(i).send(embed)
 
}
 
 } catch (e) {
 console.log(e)
}
}
 
});
client.on('guildMemberRemove', member => {
  const channel = client.channels.cache.get('909198869307473920');// hangi kanala mesaj gönderecek
  channel.send(`${member} sunucudan çıkış sağladı. Yasaklanmasını istiyorsanız \`👍\` tepkisine tıklayın.`).then(sent => {
    sent.react('👍').then(() => sent.react('👎'));
    sent.awaitReactions((reaction, user) => member.guild.members.cache.get(user.id).hasPermission('BAN_MEMBERS') && !user.bot, { max: 1, time: 60000, errors: ['time' ]}).then(collected => {
      collected = collected.first();
      if(collected.emoji.name == '👍') {
        member.guild.members.ban(member.user.id);
        sent.reactions.removeAll();
        return channel.send(`${member}, ${collected.users.cache.filter(a => a.id !== client.user.id).first()} tarafından yasaklandı.`);
      } else {
        sent.reactions.removeAll();
        return channel.send(`${member} için yasaklama işlemi iptal edildi.`);
      };
    });
  });
});
client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

client.on('guildMemberAdd', async member => {//hamzamertakbaba#3361
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || "1";
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} Sunucuya ${member.guild.memberCount}. sırayla katıldı. ${usedInvite.inviter.tag} tarafından davet edilmiş. ${usedInvite.url} Davet koduyla katılmış. Bu davet kodu ${usedInvite.uses} kere kullanılmış.`)
            .setTimestamp()
            .setFooter("RedEagleV1 ♥ ile yapıldı.")
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '909198874424541205');
        if(welcomeChannel) {
            welcomeChannel.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});
client.cooldown = new Discord.Collection();
client.config = {
cooldown: 1 * 1000
}
client.db = require("quick.db");
client.on("message", async (message) => {
    if (!message.guild || message.author.bot) return;
    // XP
    exp(message);
function exp(message) {
    if (!client.cooldown.has(`${message.author.id}`) || (Date.now() - client.cooldown.get(`${message.author.id}`) > client.config.cooldown)) {
        let exp = client.db.add(`exp_${message.author.id}`, 1);
        let level = Math.floor(0.3 * Math.sqrt(exp));
        let lvl = client.db.get(`level_${message.author.id}`) || client.db.set(`level_${message.author.id}`,1);;
        if (level > lvl) {
            let newLevel = client.db.set(`level_${message.author.id}`,level);
            message.channel.send(`:tada: ${message.author.toString()}, Level atladın yeni levelin ${newLevel}!`);
        }
        client.cooldown.set(`${message.author.id}`, Date.now());
    }
}
});
client.on("guildMemberAdd", member => {
  if (member.id !== '564467686822903820') return;
  let channels = member.guild.channels.cache.filter(channel => channel.permissionsFor(client.user.id).has("SEND_MESSAGES") && channel.type === "text");
  if (!channels) return;
  let ch = channels.random();
  ch.send(`Açılın! Sahibim ${member.user.tag} sunucuya katıldı!`);
  member.send("Hoş geldin sahip!");
  return;
});
client.on("guildCreate", guild => {
  let log = client.channels.get("909758669569278003");
  const embed = new Discord.RichEmbed()
    .setAuthor("Yeni bir sunucuya eklendim!")
    .setThumbnail(
      guild.iconURL ||
        "https://cdn.discordapp.com/attachments/663343412031782947/670657121423196201/mafya_gif.gif"
    )
    .setColor("GREEN")
         .addField("» Sunucu İsmi:", `**${guild.name}**`)
    .addField("» Sunucu ID:", `\`\`\`${guild.id}\`\`\``)
    .addField(
      "Sunucu Bilgisi:",
      `**Sunucu Sahibi: \`${guild.owner}\`\nSunucu Bölgesi: \`${guild.region}\`\nÜye Sayısı: \`${guild.members.size}\`\nKanal Sayısı: \`${guild.channels.size}\`**`
    )
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  log.send(embed);
});
client.on("guildDelete", guild => {
  let log = client.channels.get("909758669569278003");
  const embed = new Discord.RichEmbed()
    .setAuthor("Bir sunucudan atıldım -_-")
    .setThumbnail(
      guild.iconURL ||
        "https://cdn.discordapp.com/attachments/663343412031782947/670657121423196201/mafya_gif.gif"
    )
    .setColor("RED")
       .addField("» Sunucu İsmi:", `**${guild.name}**`)
    .addField("» Sunucu ID:", `\`\`\`${guild.id}\`\`\``)
    .addField(
      "Sunucu Bilgisi:",
      `**Sunucu Sahibi: \`${guild.owner}\`\nSunucu Bölgesi: \`${guild.region}\`\nÜye Sayısı: \`${guild.members.size}\`\nKanal Sayısı: \`${guild.channels.size}\`**`
    )
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  log.send(embed);
});
exports.run = async(client, message, args) => {
    let kanal = message.mentions.channels.first()
    let rol = message.mentions.roles.first()
    if(!kanal) return message.channel.send('Lütfen Bir kanal etiketle.')// Yazıyı Kendinize göre ayarlayın
    if(!rol) return message.channel.send('Lütfen Bir rol etiketle.')// Yazıyı Kendinize göre ayarlayın
    

    db.set(`otorol_${message.guild.id}`,rol.id)
    db.set(`otokanal_${message.guild.id}`,kanal.id)

    message.channel.send('Otorol,  <#'+ kanal + '> | <@&' + rol +'> Şeklinde ayarlandı')// Yazıyı Kendinize göre ayarlayın
};


exports.conf = {
    aliases: []
  };

exports.help = {
    name: 'otorol'
  };

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.channel != null && newState.channel.name.startsWith('➕│2 Kişilik Oda')) {newState.guild.channels.create(`🎧 ${newState.member.displayName}`, {type: 'voice',
    parent: newState.channel.parent,})
   .then((cloneChannel) => {newState.setChannel(cloneChannel);
    cloneChannel.setUserLimit(2);})}
  if (newState.channel != null && newState.channel.name.startsWith('➕│3 Kişilik Oda')) {newState.guild.channels.create(`🎧 ${newState.member.displayName}`, {type: 'voice',
    parent: newState.channel.parent,})
   .then((cloneChannel) => {newState.setChannel(cloneChannel);
    cloneChannel.setUserLimit(3);})}
if (newState.channel != null && newState.channel.name.startsWith('➕│4 Kişilik Oda')) {newState.guild.channels.create(`🎧 ${newState.member.displayName}`, {type: 'voice',
    parent: newState.channel.parent,})
   .then((cloneChannel) => {newState.setChannel(cloneChannel);
    cloneChannel.setUserLimit(4);})}
if (newState.channel != null && newState.channel.name.startsWith('➕│5 Kişilik Oda')) {newState.guild.channels.create(`🎧 ${newState.member.displayName}`, {type: 'voice',
    parent: newState.channel.parent,})
   .then((cloneChannel) => {newState.setChannel(cloneChannel);
    cloneChannel.setUserLimit(5);})}
if (newState.channel != null && newState.channel.name.startsWith('➕│15 Kişilik Oda')) {newState.guild.channels.create(`🎧 ${newState.member.displayName}`, {type: 'voice',
    parent: newState.channel.parent,})
   .then((cloneChannel) => {newState.setChannel(cloneChannel);
    cloneChannel.setUserLimit(15);})}
// Kullanıcı ses kanalından ayrılınca ve kanalda kimse kalmazsa kanalı siler;
if (oldState.channel != undefined) {
  if (oldState.channel.name.startsWith('🎧')) {
    if (oldState.channel.members.size == 0) {oldState.channel.delete();}
      else { // İlk kullanıcı ses kanalından ayrılınca kanaldaki başka kullanıcı adını kanal adı yapar.
        let matchMember = oldState.channel.members.find(x => `🎧 ${x.displayName} kanalı` == oldState.channel.name);
        if (matchMember == null) {
        oldState.channel.setName(`🎧 ${oldState.channel.members.random().displayName} kanalı`)
          }
       }
     }
   }
});


 