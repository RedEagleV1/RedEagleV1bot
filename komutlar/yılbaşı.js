const Discord = require("discord.js")

exports.run = async (client, message, args) => {
    function sayac(endtime){
        var t = Date.parse(endtime) - Date.parse(new Date());
        var saniye = Math.floor( (t/1000) % 60 );
        var dakika = Math.floor( (t/1000/60) % 60 );
        var saat = Math.floor( (t/(1000*60*60)) % 24 );
        var gun = Math.floor( t/(1000*60*60*24) );
        return {'toplam': t,'gun': gun, 'saat': saat, 'dakika': dakika, 'saniye': saniye };
      };    
      
    var gn = new Date();
    var son = 'January 1 ' + (gn.getFullYear() + 1) + " 00:00:00";
    if (gn.getMonth() == 0 && gn.getDate() == 1) {
        son = 'January 1 ' + (gn.getFullYear()) + " 00:00:00";
    };
        var t = sayac(son);
        message.channel.send(new Discord.MessageEmbed().setDescription(`▬▬▬▬▬▬[ ⏳ **Yılbaşı Sayacı** ⏳ ]▬▬▬▬▬▬\n\n**Kalan Gün:** ${t.gun} :fire: \n **Kalan Saat:** ${t.saat} :fire:  \n **Kalan Dakika:** ${t.dakika} :fire:  \n **Kalan Saniye:** ${t.saniye} :fire: `))
        if(t.total<=0){
            message.channel.send(new Discord.MessageEmbed().setDescription(`⌛️ Yeni Yılınız Kutlu Olsun! ⌛️`)) 
        }

};





  exports.help = {
    name:"newyear",
    usage:"newyear",
    description:""
    }
    
    exports.conf = {
    aliases:["yılbaşı"],
    kategori:"eğlence"
    }