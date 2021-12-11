const Discord = require("discord.js");


exports.run = async (client, message, args) => {

  
const darkside = new Discord.MessageEmbed()
  .addField(` »  Pingim` ,`${client.ws.ping}ms`,true)
  .addField(` » Yapımcım` ,`RedEagleV1#6847`,true)
  .addField(` » Node.js`, `${process.version}`, true)
 .addField(` » Kanal Sayısı`, `${client.channels.cache.size  }`, true)
 .addField(` » Kullanıcı Sayısı`, `${client.users.cache.size}`, true)
 .addField(` » Sunucu Sayısı`, `${client.guilds.cache.size}`, true)
 .addField(`» Linkler`, `[Destek Sunucusu](https://discord.gg/WUMTJNRGjB) | [Davet](https://discord.com/api/oauth2/authorize?client_id=808827174604767232&permissions=8&scope=bot)`, true)
  message.channel.send(darkside)
  
  
}
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['i'],
  permLevel: 0
};

exports.help = {
  name: 'istatistik',
  description: 'Botun İstatistiklerini Atar',
  usage: 'istatistik'
};