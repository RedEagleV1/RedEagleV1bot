const Discord = require('discord.js');
const db = require('inflames.db')

exports.run = async(client, message, args) => {

  if (!message.member.permissions.has("MANAGE_ROLES_OR_PERMISSIONS"))
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          "**Bu Komutu Kullanabilmek İçin `Rolleri/İzinleri Yönet` Yetkisine Sahip Olmalısın !**"
        )
        .setColor("RANDOM")
    );

    if(args[0] == "rol") {
        var rolke = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        db.set(`otorolu_${message.guild.id}`, rolke.id) 
            message.reply(`Rol ayarlandı! Kanal ayarlamak için **!otorol kanal #kanal** yazabilir sistemi açmak için **!otorol aç** yazabilirsiniz.`)
}

    if(args[0] == "kanal") {
        var kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        db.set(`otokanal_${message.guild.id}`, kanal.id)
            message.reply(`Kanal ayarlandı! Rol ayarlamak için **!otorol rol @rol** yazabilir sistemi açmak için **!otorol aç** yazabilirsiniz`)
}

  if (args[0] === 'aç') {
    
    db.set(`otorol_${message.guild.id}`, 'aktif')
    message.channel.send(`Otorol açıldı! Rol ayarlamak için **!otorol rol @rol** yazabilir, Kanal ayarlamak için **!otorol kanal #kanal** yazabilirsiniz.`)
 
  }
  
  if (args[0] === 'kapat') {
    
    db.set(`otorol_${message.guild.id}`, 'deaktif')
    message.channel.send(`Otorol kapatıldı.`)

  }
 
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};
 
exports.help = {
  name: 'otorol'
};  