/**
 * This module is to handle subscriber notifications.
 */
(function() {
	var subMessage = $.getSetIniDbString('discordSettings', 'subMessage', '(name) hat dich gerade abonniert!'),
	    primeMessage = $.getSetIniDbString('discordSettings', 'primeMessage', '(name) hat dich gerade über Twitch Prime abonniert!'),
	    resubMessage = $.getSetIniDbString('discordSettings', 'resubMessage', '(name) hat dich seit (months) Monaten, in Folge, abonniert!'),
	    subToggle = $.getSetIniDbBoolean('discordSettings', 'subToggle', false),
	    primeToggle = $.getSetIniDbBoolean('discordSettings', 'primeToggle', false),
	    resubToggle = $.getSetIniDbBoolean('discordSettings', 'resubToggle', false),
	    channelName = $.getSetIniDbString('discordSettings', 'subChannel', ''),
	    announce = false;

    /**
     * @event webPanelSocketUpdate
     */
    $.bind('webPanelSocketUpdate', function(event) {
        if (event.getScript().equalsIgnoreCase('./discord/handlers/subscribeHandler.js')) {
            subMessage = $.getIniDbString('discordSettings', 'subMessage', '(name) hat dich gerade abonniert!');
            primeMessage = $.getIniDbString('discordSettings', 'primeMessage', '(name) hat dich gerade über Twitch Prime abonniert!');
            resubMessage = $.getIniDbString('discordSettings', 'resubMessage', '(name) hat dich seit (months) Monaten, in Folge, abonniert!');
            subToggle = $.getIniDbBoolean('discordSettings', 'subToggle', false);
            primeToggle = $.getIniDbBoolean('discordSettings', 'primeToggle', false);
            resubToggle = $.getIniDbBoolean('discordSettings', 'resubToggle', false);
            channelName = $.getIniDbString('discordSettings', 'subChannel', '');
        }
    });

	/**
	 * @event subscriber
	 */
	$.bind('subscriber', function(event) {
		var subscriber = event.getSubscriber(),
		    s = subMessage;

		if (announce === false || subToggle === false || channelName == '') {
			return;
		}

		if (s.match(/\(name\)/g)) {
            s = $.replace(s, '(name)', subscriber);
        }

        $.discord.say(channelName, s);
    });

    /**
	 * @event primeSubscriber
	 */
	$.bind('primeSubscriber', function(event) {
		var subscriber = event.getSubscriber(),
		    s = primeMessage;

		if (announce === false || primeToggle === false || channelName == '') {
			return;
		}

		if (s.match(/\(name\)/g)) {
            s = $.replace(s, '(name)', subscriber);
        }

        $.discord.say(channelName, s);
    });

    /**
	 * @event reSubscriber
	 */
	$.bind('reSubscriber', function(event) {
		var subscriber = event.getReSubscriber(),
		    months = event.getMonths(),
		    s = resubMessage;

		if (announce === false || resubToggle === false || channelName == '') {
			return;
		}

		if (s.match(/\(name\)/g)) {
            s = $.replace(s, '(name)', subscriber);
        }

        if (s.match(/\(months\)/g)) {
            s = $.replace(s, '(months)', months);
        }

        $.discord.say(channelName, s);
    });

    /**
	 * @event discordChannelCommand
	 */
	$.bind('discordChannelCommand', function(event) {
		var sender = event.getSender(),
            channel = event.getChannel(),
            command = event.getCommand(),
            mention = event.getMention(),
            arguments = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('subscribehandler')) {
        	if (action === undefined) {
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.usage'));
        		return;
        	}

        	/**
        	 * @discordcommandpath subscribehandler subtoggle - Toggles subscriber announcements.
        	 */
        	if (action.equalsIgnoreCase('subtoggle')) {
        		subToggle = !subToggle;
        		$.inidb.set('discordSettings', 'subToggle', subToggle);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.sub.toggle', (subToggle === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
        	}

        	/**
        	 * @discordcommandpath subscribehandler primetoggle - Toggles Twitch Prime subscriber announcements.
        	 */
        	if (action.equalsIgnoreCase('primetoggle')) {
        		primeToggle = !primeToggle;
        		$.inidb.set('discordSettings', 'primeToggle', primeToggle);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.prime.toggle', (primeToggle === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled')))); 
        	}

        	/**
        	 * @discordcommandpath subscribehandler resubtoggle - Toggles re-subscriber announcements.
        	 */
        	if (action.equalsIgnoreCase('resubtoggle')) {
        		resubToggle = !resubToggle;
        		$.inidb.set('discordSettings', 'resubToggle', resubToggle);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.resub.toggle', (resubToggle === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
        	}

        	/**
        	 * @discordcommandpath subscribehandler submessage [message] - Sets the subscriber announcement message.
        	 */
        	if (action.equalsIgnoreCase('submessage')) {
        		if (subAction === undefined) {
        			$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.sub.message.usage'));
        			return;
        		}

        		subMessage = args.slice(1).join(' ');
        		$.inidb.set('discordSettings', 'subMessage', subMessage);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.sub.message.set', subMessage));
        	}

        	/**
        	 * @discordcommandpath subscribehandler primemessage [message] - Sets the Twitch Prime subscriber announcement message.
        	 */
        	if (action.equalsIgnoreCase('primemessage')) {
        		if (subAction === undefined) {
        			$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.prime.sub.message.usage'));
        			return;
        		}

        		primeMessage = args.slice(1).join(' ');
        		$.inidb.set('discordSettings', 'primeMessage', primeMessage);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.prime.sub.message.set', primeMessage));
        	}

        	/**
        	 * @discordcommandpath subscribehandler resubmessage [message] - Sets the re-subscriber announcement message.
        	 */
        	if (action.equalsIgnoreCase('resubmessage')) {
        		if (subAction === undefined) {
        			$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.resub.message.usage'));
        			return;
        		}

        		resubMessage = args.slice(1).join(' ');
        		$.inidb.set('discordSettings', 'resubMessage', resubMessage);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.resub.message.set', resubMessage));
        	}

        	/**
        	 * @discordcommandpath subscribehandler channel [channel name] - Sets the channel that announcements from this module will be said in.
        	 */
        	if (action.equalsIgnoreCase('channel')) {
        		if (subAction === undefined) {
        			$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.channel.usage'));
        			return;
        		}

        		channelName = subAction.replace('#', '').toLowerCase();
        		$.inidb.set('discordSettings', 'subChannel', channelName);
        		$.discord.say(channel, $.discord.userPrefix(mention) + $.lang.get('discord.subscribehandler.channel.set', channelName));
        	}
        }
    });

	/**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./discord/handlers/subscribeHandler.js')) {
            $.discord.registerCommand('./discord/handlers/subscribeHandler.js', 'subscribehandler', 1);
            $.discord.registerSubCommand('subscribehandler', 'subtoggle', 1);
            $.discord.registerSubCommand('subscribehandler', 'primetoggle', 1);
            $.discord.registerSubCommand('subscribehandler', 'resubtoggle', 1);
            $.discord.registerSubCommand('subscribehandler', 'submessage', 1);
            $.discord.registerSubCommand('subscribehandler', 'primemessage', 1);
            $.discord.registerSubCommand('subscribehandler', 'resubmessage', 1);
            $.discord.registerSubCommand('subscribehandler', 'channel', 1);

            announce = true;
            // $.unbind('initReady'); Needed or not?
        }
    });
})();
