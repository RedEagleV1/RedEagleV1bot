const discord = require("discord.js");
const db = require("quick.db")
const {
    MessageButton,
    MessageActionRow
} = require('discord-buttons');

exports.run = async(client, message, args) => {

    const seçenekler = message.content.split(" ").slice(1).join(" ")

    var buttons = []
    var buttonscopy;
    var rows = []
    const opts = seçenekler.split(" ")
    var pushpls = []
    var desc = null
    var errmsg = null
    var sucstring = ""
    var desceklendimi = false
    const idsarr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const emojiler = [{
            "id": 1,
            "emoji": ":one:",
            "msg": null
        },
        {
            "id": 2,
            "emoji": ":two:",
            "msg": null
        },
        {
            "id": 3,
            "emoji": ":three:",
            "msg": null
        },
        {
            "id": 4,
            "emoji": ":four:",
            "msg": null
        },
        {
            "id": 5,
            "emoji": ":five:",
            "msg": null
        },
        {
            "id": 6,
            "emoji": ":six:",
            "msg": null
        },
        {
            "id": 7,
            "emoji": ":seven:",
            "msg": null
        },
        {
            "id": 8,
            "emoji": ":eight:",
            "msg": null
        },
        {
            "id": 9,
            "emoji": ":nine:",
            "msg": null
        },
        {
            "id": 10,
            "emoji": ":keycap_ten:",
            "msg": null
        }

    ]

    var hataatmalımıyım = false

    const extractQuote = seçenekler
        .match(/(?:"[^"]*"|^[^"]*$)/)[0]
        .replace(/"/g, "") //https://techstacker.com/how-to-extract-text-between-double-quotes-javascript/
    desc = extractQuote

    function embederr(author, desc, color) {
        const embed = new discord.MessageEmbed()
            .setColor(color)
            .setAuthor(author)
            .setDescription(desc)
        return message.channel.send(embed)
    }

    if (desc == "") {
        return embederr("❌ Hata!", "**Açıklama Boş Olamaz!**", "RED")
    }

    if (hataatmalımıyım == true) {
        return embederr("❌ Hata!", "**Seçenekler Boş Olamaz!**", "RED")
    }


    if (errmsg) {
        const embedhata = new discord.MessageEmbed()
            .setAuthor("❌ Hata!")
            .setDescription(errmsg)
            .setColor("RED")
        return message.channel.send(embedhata)
    }

    if (desc == null) {
        return embederr("❌ Hata!", "**Açıklama Belirtilmemiş!**", "RED")
    }
    if (pushpls.length == 0) {
        return embederr("❌ Hata!", "**Seçenek Belirtilmemiş!**", "RED")
    }
    if (pushpls.length == 1) {
        return embederr("❌ Hata!", "**Seçenek Sayısı En Az 2 Olmalıdır!**", "RED")
    } else {
        if (pushpls.length > 10) return embederr("❌ Hata!", "**Seçenek Sayısı En Fazla 10 Olmalıdır!**", "RED")

        pushpls.forEach(function (element, i) {
            const fetchfromobj = emojiler.filter(object => {
                return object.id === i + 1
            })
            fetchfromobj[0].msg = element
        })
        var count = 0
        const index1 = await idsarr.indexOf(pushpls.length)
        for (let index = 0; index < index1 + 1; index++) {
            const fetchfromobj = emojiler.filter(object => {
                return object.id === index + 1
            })
            if (desceklendimi == false) {
                sucstring += `**${desc}**` + "\n\n" + fetchfromobj[0].emoji + " " + fetchfromobj[0].msg + " | 0 Oy" + "\n"
            } else {
                sucstring += fetchfromobj[0].emoji + " " + fetchfromobj[0].msg + " | 0 Oy" + "\n"
            }
            desceklendimi = true
            var buton = new MessageButton()
                .setStyle("green")
                .setID(index + 1)
                .setLabel(index + 1)
            buttons.push(buton)
            count++
        }

    }

    if (count < 6) {
        buttons.length = 5;
        const actionrow = new MessageActionRow()
            .addComponents(buttons)
        rows.push(actionrow)
    } else {
        var buttonscopy = []
        buttons.forEach(function (element, i) {
            if (i < 5) {
                buttonscopy.push(element)
            }
        })


        const actionrow2 = new MessageActionRow()
            .addComponents(buttonscopy)
        rows.push(actionrow2)

        const actionrow3 = new MessageActionRow()
            .addComponents(buttons.slice(5))
        rows.push(actionrow3)
    }

    var sucembed = new discord.MessageEmbed()
        .setDescription(sucstring)
        .setColor("GREEN")
        .setAuthor("Oylama Başlatıldı!")
        .setFooter(`${message.author.username} Tarafından Başlatıldı`, message.author.avatarURL({
            "dynamic": true
        }))
    message.channel.send(sucembed, {
        components: rows
    }).then(async (mesaj) => {

        const objdb = {
            "msgid": mesaj.id,
            "content": sucstring,
            "authorpfp": message.author.avatarURL({
                "dynamic": true
            }),
            "authorusername": message.author.username
        }

        const objectdata = [{
                "id": 1,
                "oycount": 0,
                "emoji": emojiler[0].emoji,
                "msg": emojiler[0].msg
            },
            {
                "id": 2,
                "oycount": 0,
                "emoji": emojiler[1].emoji,
                "msg": emojiler[1].msg
            },
            {
                "id": 3,
                "oycount": 0,
                "emoji": emojiler[2].emoji,
                "msg": emojiler[2].msg
            },
            {
                "id": 4,
                "oycount": 0,
                "emoji": emojiler[3].emoji,
                "msg": emojiler[3].msg
            },
            {
                "id": 5,
                "oycount": 0,
                "emoji": emojiler[4].emoji,
                "msg": emojiler[4].msg
            },
            {
                "id": 6,
                "oycount": 0,
                "emoji": emojiler[5].emoji,
                "msg": emojiler[5].msg
            },
            {
                "id": 7,
                "oycount": 0,
                "emoji": emojiler[6].emoji,
                "msg": emojiler[6].msg
            },
            {
                "id": 8,
                "oycount": 0,
                "emoji": emojiler[7].emoji,
                "msg": emojiler[7].msg
            },
            {
                "id": 9,
                "oycount": 0,
                "emoji": emojiler[8].emoji,
                "msg": emojiler[8].msg
            },
            {
                "id": 10,
                "oycount": 0,
                "emoji": emojiler[9].emoji,
                "msg": emojiler[9].msg
            }

        ]
        db.set(`countlar_${message.guild.id}_${mesaj.id}`, objectdata)

        db.push(`oylamalar_${message.guild.id}`, objdb)

        mesaj.createButtonCollector(user => user.clicker.user.id == user.clicker.user.id).on('collect', async (button) => {
            const index1 = await idsarr.indexOf(pushpls.length)
            const fetch = db.fetch(`basildimi_${button.clicker.id}_${mesaj.id}`)
            if (fetch == "evet") {
                button.reply.defer()
            } else {
                var fetchleobj = db.fetch(`countlar_${message.guild.id}_${mesaj.id}`)
                const findit = fetchleobj.find(f => f.id == button.id)
                if (findit) {
                    findit.oycount = findit.oycount + 1
                }
                db.set(`countlar_${message.guild.id}_${mesaj.id}`, fetchleobj)
                const getartık = db.fetch(`countlar_${message.guild.id}_${mesaj.id}`)
                db.set(`basildimi_${button.clicker.id}_${mesaj.id}`, "evet")
                sucstring = ""
                desceklendimi = false
                for (let index = 0; index < index1 + 1; index++) {
                   const getfilter = getartık.filter(obj => {
                        return obj.id === index + 1
                    })
                    if (desceklendimi == false) {
                        desceklendimi = true
                        sucstring += `**${desc}**` + "\n\n" + getfilter[0].emoji + " " + getfilter[0].msg + ` | ${getfilter[0].oycount} Oy` + "\n"
                    } else {
                        sucstring += getfilter[0].emoji + " " + getfilter[0].msg + ` | ${getfilter[0].oycount} Oy` + "\n"
                    }
                }
                sucembed.description = sucstring
                mesaj.edit(sucembed)
                button.reply.defer()
            }
        })
    })
}


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["oylama"],
  permLevel: 0
};
exports.help = {
  name: "oylama",
  description: "oylama işte",
  usage: "oylama <oylama açıklaması> [seçenek1] [seçenek2] [seçenek3]..."
};