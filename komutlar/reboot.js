const Discord = require('discord.js');
const fetch = require("node-fetch");
exports.run = (client, message, args) => {
    if(!global.config.bot.owners.includes(message.author.id)) return  message.reply('Bu Komudu Sadece Bot Owners Kullanabilir!')
	message.channel.send("Bot Yeniden Başlatılıyor!").then(msg => {
		console.log(`BOT : Yeniden başlatılıyor...`);
		process.exit(1);
	})
};
exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'reboot',
	description: 'Botu Yeniden Başlatır.',
	usage: 'reboot'
};