const discord = require('discord.js'); //modüller

exports.run = async (client, message, args) => {
client.guilds.cache.forEach(guild => {
    let channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
channel.createInvite({ maxAge: 0, maxUses: 0 }).then(async (invite) => { 
message.channel.send(`${invite.url}`)
})
})
}
exports.conf = {
    enabled: true, //kullanıma açık mı değil mi
    guildOnly: true, //dmde kullanıma açık mı değil mi
    aliases: [], //kısayollar
    permLevel: 4 //perm level mainde karşıliklar yazar
  };
  
  exports.help = {
    name: "davet", //komutu çalıştıracak olan kelime
    description: "",//açıklama (isteğe bağlı)
    usage: ""//kullanım (isteğe bağlı)
  };