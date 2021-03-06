const Discord = require("discord.js");
const titanxyz = new Discord.Client();
const prefix = '!';
const os = require('os');
const weather = require('weather-js');

function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function clear (channel) {
    channel.bulkDelete(99).then(messages => {
        if (messages.size === 99) {
            clear(channel);
        } else {
            channel.send(`del. all done.`).then((msg) => {msg.delete(7000);});
        }
    })
}

function clear_count (channel, count, count_all = 0) {
    if (count > 100) {
        count_all = count_all + 100;
        channel.bulkDelete(100).then(() => {clear(channel, count-100, count_all)});
    } else {
	channel.bulkDelete(count).then(messages => {
	count_all = count_all + messages.size;
	channel.send(`del. ${count_all} ${declOfNum(count_all, ['сообщение','сообщения','сообщений'])}.`).then((msg) => {msg.delete(3000);});
        });
    }
}

titanxyz.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
	  
    if (command === 'servers') {
         embed = new Discord.RichEmbed()
            .setTitle(`onair ${titanxyz.guilds.size}`);
        message.channel.send({embed: embed});
    } 
	
    if (command === 'clear') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('reboot.');
        if (!args[0]) return message.reply('reboot.');
        clear_count(message.channel, parseInt(args[0])+1);
    }
	
    if (command === 'clear_all') {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('reboot.');
        clear(message.channel);
    }
	
	if (command === 'ping') {
		message.reply('pong!');
	}
	
	if (command === 'userinfo') {
		const member = message.mentions.members.first();
		if (!member) return message.reply('reboot.');
		const embed = new Discord.RichEmbed()
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setDescription(`reg.d.: ${member.user.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\nsid: ${member.user.id}`);
		message.channel.send({embed});
	}
	
	if (command === 'help') {
		message.reply('ican\'thelpu!\n"Благодарные животные (Латышская народная сказка)\nЖил на свете богатый крестьянин, звали его Петерис. Был у него батрак, тоже Петерис. Чтобы их не путать, люди называли хозяина большой Петерис, а батрака - малый Петерис. Уже лет десять верно прослужил батрак хозяину, но не получил еще ни полушки.\nПодал за это малый Петерис на хозяина в суд. Суд не смог их помирить, поэтому дело перешло в другой суд, потом еще выше, пока не дошло до самого короля. И вот король назначил день, когда и хозяин, и батрак должны предстать пред его судом.\nВ назначенный день рано утром отправились оба Петериса в столицу. Прошли они немного, и видит малый Петерис: муравей на дороге...\nТут и король пришел, на чудесный мост не надивится, не нарадуется. Похвалил он малого Петериса за умение и приказал щедро его наградить. А большому Петерису король велел расплатиться с батраком за все годы. Слугам же своим приказал хорошенько отлупить обманщика."');
	}
	
	if (command === 'info') {
		message.channel.send({embed: new Discord.RichEmbed(). setDescription(`serv.id: ${message.guild.id}\nserv.reg.d.: ${(new Date(message.guild.createdAt.getTime() + 3*60*60*1000)).toISOString().replace(/T/, ' ').replace(/\..+/, '')} MSK\n"Получайте удовольствие от развлечений, но не забывайте, что спорт - это уникальный метод решения проблем со здоровьем с доказанной стопроцентной эффективностью!"\nONYSΛ`)});
	}
	
	if (command === 'time') {
		let query = args.join(' ');
		if (!query) return message.channel.send({embed: new Discord.RichEmbed().setTitle((new Date(new Date().getTime() + 3*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+' MSK')});
		weather.find({search: query, degreeType: 'C', lang: 'ru-RU'}, function(err, result) {
			let timezone, name;
			if (result.length < 1) {
				message.channel.send({embed: new Discord.RichEmbed().setTitle((new Date(new Date().getTime() + 3*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+' MSK')});
			}
			else {
				timezone = result[0].location.timezone;
				name = result[0].location.name;	
			}
			if (!timezone.startsWith('-')) timezone = '+'+timezone;
			message.channel.send({embed: new Discord.RichEmbed().setTitle(name).setDescription((new Date(new Date().getTime() + parseFloat(timezone.replace(/,/g, '.'))*60*60*1000)).toISOString().replace(/(.*?)T/, '').replace(/\..+/, '')+` (UTC ${timezone})`)});
		});
	}
	
	if (command === 'recall' && message.author.id == '292934598227263488') { 
		titanxyz.guilds.get(args[0]).leave().then(() =>{
		embed = new Discord.RichEmbed()
			.setTitle(`onair ${titanxyz.guilds.size}`);
				message.channel.send({embed: embed});
			})
	}
	
	if (command === 'uhodi'&& message.author.id == '292934598227263488') {
		titanxyz.guilds.forEach(guild => {
			if (guild.id != '308591299353640960') guild.leave()
		})
		embed = new Discord.RichEmbed()
            .setTitle(`onair ${titanxyz.guilds.size}`);
        message.channel.send({embed: embed});
	}	

	if (command == 'weather') {
		let query = args.join(' ');
		weather.find({search: query, degreeType: 'C', lang: 'ru-RU'}, function(err, result) {
			if(err) console.log(err);
			if (result.length < 1) return message.channel.send(new Discord.RichEmbed().setDescription('Погода не найдена'));
			let data = result[0];
			let embed = new Discord.RichEmbed()
				.setTitle(data.location.name)
				.setDescription(`${data.current.skytext}, ${data.current.temperature} °C\nПо ощущениям ${data.current.feelslike} °C\nВетер: ${data.current.winddisplay}`)
				.setThumbnail(data.current.imageUrl);
			message.channel.send(embed);
		});
	}

	if (command == 'forecast') {
		let query = args.join(' ');
		weather.find({search: query, degreeType: 'C', lang: 'ru-RU'}, function(err, result) {
			if(err) console.log(err);
			if (result.length < 1) return message.channel.send(new Discord.RichEmbed().setDescription('Погода не найдена'));
			let data = result[0];
			let forecast = `${data.location.name}`;
			data.forecast.forEach((obj) => {
				forecast+=`\n\n**${obj.day.charAt(0).toUpperCase()}${obj.day.slice(1)} (${obj.date}):**\n${obj.low} °C — ${obj.high} °C\n${obj.skytextday}`
			})
			let embed = new Discord.RichEmbed()
				.setTitle('Прогноз погоды')
				.setDescription(forecast);
			message.channel.send(embed);
		});
	}
});

titanxyz.login(process.env.HTOKEN);
