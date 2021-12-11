const Discord = require("discord.js");
const ayarlar = require('../ayarlar.json');
let talkedRecently = new Set();

module.exports = message => {
  if (talkedRecently.has(message.author.id)) {
    return;
  }
  talkedRecently.add(message.author.id);
	setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 2500);
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require('quick.db')

module.exports = async message => {
  let client = message.client;
  let prefix = ayarlar.prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) { 
    
let dcsa = await db.fetch(`dcs`,'aktif')
if(dcsa) {
 
  if(message.author.id !== "564467686822903820")  {
 
 let dcs = new Discord.MessageEmbed()
 .setTitle('Bakımda Dcs')
 .setDescription(`\`Bot Bakımda Dcs / Discord Code Share   `) // \`
 .setColor('RANDOM') // \`
message.channel.send(dcs).then(dcs1 => dcs1.delete(5000))
 return
 } 
  
}

    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
}
    const csdb = require("croxydb")
   const csdiscord = require("discord.js");
    let csdd = csdb.get(`csrules.${message.author.id}`);
    if (!csdd) {
      let dcs15 = new csdiscord.MessageEmbed()
        .setTitle(client.user.username + " KURALLAR")
        .setTimestamp()
        .setFooter("LightSide bot kuralları")
        .setThumbnail()
        .setDescription(
          `**Botu laga sokmak yasaktır.\Botun sahibiymiş gibi davranmak yasaktır.\Bu kadar iyi kullanımlar :)
          Kuralları Kabul Ediyor İseniz ✅ Emojisine Basın!\n
          Kabul Etmiyor İseniz ❌ Emojisine Basın!\n
          Eğer Kuralları Kabul Etmez İseniz Bu Botu Kullanamazsınız!\n\n
Şuana Kadar ${csdb.get("csrulessize") || 0} Kişi Kuralları Kabul Etti!**`
        )
        .setColor("BLUE");
      return message.channel.send(dcs15).then(sunucu => {
        sunucu.react("✅").then(() => sunucu.react("❌"));

        let cso = (reaction, user) =>
          reaction.emoji.name === "✅" && user.id === message.author.id;
        let csr = (reaction, user) =>
          reaction.emoji.name === "❌" && user.id === message.author.id;

        let csv = sunucu.createReactionCollector(cso, { time: 0 });
        let csn = sunucu.createReactionCollector(csr, { time: 0 });

        csv.on("collect", async r => {
csdb.add("csrulessize", 1)
          message
            .reply(
              "**Kurallarımızı Kabul Ettiğiniz İçin Teşekkürler Botumuzu Artık Sorunsuz Bir Şekilde Kullana Bilirsiniz!**"
            )
            .then(cs => cs.delete({ timeout: 5000 }));
          message.delete({ timeout: 100 });
          sunucu.delete({ timeout: 100 });
          csdb.set(`csrules.${message.author.id}`, "VERIFY");
        });

        csn.on("collect", async r => {
          message
            .reply(
              "**Kuralları Kabul Etmediğiniz İçin Malesef Botu Kullanamazsınız!**"
            )
            .then(cs => cs.delete({ timeout: 5000 }));
          message.delete({ timeout: 100 });
          sunucu.delete({ timeout: 100 });
        });
      });
    }
   if (cmd.conf.enabled === false) {
      if (!ayarlar.owner.includes(message.author.id) && !ayarlar.owner.includes(message.author.id)) {
        const embed = new Discord.MessageEmbed()
                    .setDescription(`:x: **${cmd.help.name}** isimli komut şuanda geçici olarak kullanıma kapalıdır!`)
                    .setColor("RED")
                message.channel.send({embed})
                return
      }
    }
    
    if (cmd.conf.permLevel === 1) {
			if (!message.member.hasPermission("MANAGE_MESSAGES")) {
				const embed = new Discord.MessageEmbed()
					.setDescription(`Bu komutu kullanabilmek için **Mesajları Yönet** iznine sahip olmalısın!`)
          .setColor("RED")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 2) {
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				const embed = new Discord.MessageEmbed()
					.setDescription(`Bu komutu kullanabilmek için **Üyeleri At** iznine sahip olmalısın!`)
					.setColor("RED")
				message.channel.send({embed})
				return
			}
		}
    if (cmd.conf.permLevel === 3) {
			if (!message.member.hasPermission("BAN_MEMBERS")) {
				const embed = new Discord.MessageEmbed()
					.setDescription(`Bu komutu kullanabilmek için **Üyeleri Yasakla** iznine sahip olmalısın!`)
					.setColor("RED")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 4) {
			if (!message.member.hasPermission("ADMINISTRATOR")) {
				const embed = new Discord.MessageEmbed()
					.setDescription(`Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`)
					.setColor("RED")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 5) {
			if (!ayarlar.owner.includes(message.author.id)) {
				const embed = new Discord.MessageEmbed()
					.setDescription(`Bu komutu sadece **sahibim** kullanabilir!`)
					.setColor("RED")
				message.channel.send({embed})
				return
			}
		}
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }

};







