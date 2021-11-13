const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args) => {

  const  muptimeE = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniyedir]");
  
  const uptime = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setFooter(message.author.username, message.author.avatarURL())  
  .setDescription(`Ben **( ${muptimeE} )** Hizmet Veriyorum!`)
  
   message.channel.send(uptime)
  
};
exports.conf = {

  aliases: [ ]
};

exports.help = {
  name: "uptime"
}; 