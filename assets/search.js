// source script by /u/Will_Eccles
// released under Apache-2.0 license
// significant changes have been made from source
// see README for more details

var box = document.getElementById("search");

// this should catch most URLs, or at least the ones I would type.
var urlPattern = /^(https?:\/\/)?[^ ]+[.][^ ]+([.][^ ]+)*(\/[^ ]+)?$/i;

// add on here with more handy things
var handy = /^(google|gmail|dropbox)$/i;

// search for text in text box
function search() {
	console.log("Googling \"" + box.value + "\"");
	console.log("Encoded query: \n" + encodeURIComponent(box.value));
	document.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(box.value);
}

// if not search, nav to somewhere
function nav(address) {
	// if the address starts with "https?|ftp ://"
	if (/^(?:(?:https?|ftp):\/\/).*/i.test(address)) {
		document.location.href = address;
	} else {
		document.location.href = "http://" + address;
	}
}

// Handle enter key press in text box
// also handle the command parsing in the event that the text in the box is a command
function searchKeyPress(e) {
	e = e || window.event;
	if (e.keyCode == 13) {
		parseCom(box.value);
	}
}

// focus the search box on load
window.onload = function() {
	document.getElementById("search").focus();
};

// parse the user's command
function parseCom(com) {
	// handle help command
	if (/^h[ea]lp$/i.test(com) || /^commands$/i.test(com)) {
		document.location.href = "assets/commands.txt";
	}


	// handle pinboard command
	else if (com.startsWith("pin")==true) {
		// if any of the custom pinboard commands are matched
		if (/^pin [A-Za-z]{2,2}$/i.test(com)) {
			var subargs = com.split(" ");
			switch (subargs.pop()) {
				case "me":
					nav("https://pinboard.in/u:NOPE");
					break;
				default:
					nav("https://pinboard.in");
					break;
			}
		}

		// if the global search command is matched
		else if (/^pin -sa .{1,140}$/i.test(com)) {
			var query = com.replace(/^pin -sa /i, "");
			nav("https://pinboard.in/search/?query=" + encodeURIComponent(query));
		}
		// if the user search command is matched
		else if (/^pin -s .{1,140}$/i.test(com)) {
			var query = com.replace(/^pin -s /i, "");
			nav("https://pinboard.in/search/u:inblanco?query=" + encodeURIComponent(query));
		}
		// if the user command is matched
		else if (/^pin -u .*$/i.test(com)) {
			var pinuargs = com.split(" ");
			nav("https://pinboard.in/u:" + pinuargs.pop());
		}
		// if all else fails, google it
		else {
			search();
		}
}


	// handle reddit command
	else if (com.startsWith("rdt")==true) {
		// if any of the custom subreddit commands are matched
		if (/^rdt [A-Za-z]{2,2}$/i.test(com)) {
			var subargs = com.split(" ");
			switch (subargs.pop()) {
				case "df":
					nav("https://www.reddit.com/r/deliciousfails");
					break;
				case "wg":
					nav("https://www.reddit.com/r/weekendgunnit");
					break;
				case "up":
					nav("https://www.reddit.com/r/unixporn");
					break;
				case "sp":
					nav("https://www.reddit.com/r/startpages");
					break;
				default:
					nav("https://www.reddit.com/");
					break;
			}
		}
		// if the subreddit command is matched
		else if (/^rdt -r .*$/i.test(com)) {
			var rargs = com.split(" ");
			nav("https://www.reddit.com/r/" + rargs.pop());
		}
		// if the user command is matched
		else if (/^rdt -u .*$/i.test(com)) {
			var uargs = com.split(" ");
			nav("https://www.reddit.com/u/" + uargs.pop());
		}
		// if the search command is matched
		else if (/^rdt -s .{1,140}$/i.test(com)) {
			var query = com.replace(/^rdt -s /i, "");
			nav("https://www.reddit.com/search?q=" + encodeURIComponent(query));
		}
		// if the plain old reddit command is matched
		else if (/^rdt$/i.test(com)) {
			nav("https://www.reddit.com/");
		}
		// if anything else, it'll just google it because who cares
		else if (urlPattern.test(com)){
			nav(com);
		}
		// if all else fails, google it
		else {
			search();
		}
	}
	// handle twt command
	else if (com.startsWith("twt")==true) {
		// if matches the "twt" command
		if (/^twt$/i.test(com)) {
			nav("https://www.twitter.com/");
		}
		// if the twt [@]user_name command
		else if (/^twt @?[A-Za-z0-9_]{1,15}$/i.test(com)) {
			var targs = com.split(" ");
			nav("https://www.twitter.com/" + targs.pop());
		}
		// search twitter for text
		else if (/^twt -s .{1,140}$/i.test(com)) {
			var query = com.replace(/^twt -s /i, "");
			nav("https://www.twitter.com/search?q=" + encodeURIComponent(query));
		}
		// search twitter for text from user
		else if (/^twt -su @?[A-Za-z0-9_]{1,15} .{1,140}$/i.test(com)) {
			var qparts = com.split(" ");
			var query = com.replace(/^twt -su @?[A-Za-z0-9_]{1,15} /i, "");

			nav("https://www.twitter.com/search?q=" + encodeURIComponent(query + " from:" + qparts[2]));
		}
		// search twitter for tweets with a hashtag
		else if (/^twt -sh " + hashtag + "$/i.test(com)) {
			var tag = com.replace(/^twt -sh #?/i, "");
			nav("https://www.twitter.com/search?q=" + encodeURIComponent("#" + tag));
		}
		// search twitter for hashtags from user
		else if (/^twt -sh @?[A-Za-z0-9_]{1,15} " + hashtag + "$/i.test(com)) {
			var comparts = com.split(" ");
			nav("https://www.twitter.com/search?q=" + encodeURIComponent(comparts[3] + " from:" + comparts[2]));
		}
		// if anything else, it'll just google it because who cares
		else if (urlPattern.test(com)){
			nav(com);
		}
		// if all else fails, google it
		else {
			search();
		}
	}
	// handle twd command
	else if (com.startsWith("twd")==true) {
		if (/^twd$/i.test(com)) {
			nav("https://tweetdeck.twitter.com/");
		}
		// if anything else, it'll just google it because who cares
		else if (urlPattern.test(com)){
			nav(com);
		}
		// if all else fails, google it
		else {
			search();
		}
	}

	// SEARCH COMMANDS //

	// handle google search command
	else if (com.startsWith("ggl")==true) {
		if (/^ggl$/i.test(com)) {
			nav("https://www.google.com/");
		}
		else if (/^ggl .{1,140}$/i.test(com)) {
			var query = com.replace(/^ggl /i, "");
			nav("https://www.google.com/?gws_rd=ssl#safe=off&q=" + encodeURIComponent(query));
		}
	}
	// handle google maps search command
	else if (com.startsWith("gmaps")==true) {
		if (/^gmaps$/i.test(com)) {
			nav("https://maps.google.com");
		}
		else if (/^gmaps .{1,140}$/i.test(com)) {
			var query = com.replace(/^gmaps /i, "");
			nav("https://www.google.com/maps/search/" + encodeURIComponent(query));
		}
	}
	// handle ig command
	else if (com.startsWith("ig")==true) {
		// just plain old ig
		if (/^ig$/i.test(com)) {
			nav("https://www.instagram.com/");
		}
		// ig [@]username command
		else if (/^ig @?[A-Za-z0-9_.]{1,30}/i.test(com)) {
			var iargs = com.split(" ");
			nav("https://www.instagram.com/" + iargs.pop());
		}
		// if anything else, it'll just google it because who cares
		else if (urlPattern.test(com)){
			nav(com);
		}
		// if all else fails, google it
		else {
			search();
		}
	}
	// handle aliexpress command
	else if (com.startsWith("ali")==true) {
		if (/^ali$/i.test(com)) {
			nav("https://home.aliexpress.com/");
		}
		else if (/^ali .{1,140}$/i.test(com)) {
			var query = com.replace(/^ali /i, "");
			nav("http://www.aliexpress.com/wholesale?SearchText=" + encodeURIComponent(query));
		}
	}
	// handle allegro command
	else if (com.startsWith("allegro")==true) {
		if (/^allegro$/i.test(com)) {
			nav("http://allegro.pl/favourites/offers");
		}
		else if (/^allegro .{1,140}$/i.test(com)) {
			var query = com.replace(/^allegro /i, "");
			nav("http://www.allegro.pl/listing/listing.php?string=" + encodeURIComponent(query));
		}
	}
	// handle olx command
	else if (com.startsWith("olx")==true) {
		if (/^olx$/i.test(com)) {
			nav("https://www.olx.pl/mojolx/");
		}
		else if (/^olx .{1,140}$/i.test(com)) {
			var query = com.replace(/^olx /i, "");
			nav("https://olx.pl/oferty/q-" + encodeURIComponent(query));
		}
	}

  // handle playstation store command
  else if (com.startsWith("psn")==true) {
		if (/^psn$/i.test(com)) {
			nav("https://store.playstation.com/");
		}
		else if (/^psn .{1,140}$/i.test(com)) {
			var query = com.replace(/^psn /i, "");
			nav("https://store.playstation.com/#!/search/q=" + encodeURIComponent(query));
		}
	}

	// handle imdb command
	else if (com.startsWith("imdb")==true) {
		if (/^imdb$/i.test(com)) {
			nav("https://www.imdb.com/");
		}
		else if (/^imdb .{1,140}$/i.test(com)) {
			var query = com.replace(/^imdb /i, "");
			nav("http://www.imdb.com/find?q=" + encodeURIComponent(query));
		}
	}
	// handle metacritic command
	else if (com.startsWith("meta")==true) {
		if (/^meta$/i.test(com)) {
			nav("http://www.metacritic.com/");
		}
		else if (/^meta .{1,140}$/i.test(com)) {
			var query = com.replace(/^meta /i, "");
			nav("http://www.metacritic.com/search/all/" + encodeURIComponent(query) + "/results");
		}
	}
	// handle youtube command
	else if (com.startsWith("yt")==true) {
		if (/^yt$/i.test(com)) {
			nav("https://www.youtube.com/");
		}
		else if (/^yt .{1,140}$/i.test(com)) {
			var query = com.replace(/^yt /i, "");
			nav("https://www.youtube.com/results?search_query=" + encodeURIComponent(query));
		}
	}
	// handle github command
	else if (com.startsWith("gh")==true) {
		if (/^gh$/i.test(com)) {
			nav("https://www.github.com");
		}
		else if (/^gh .{1,140}$/i.test(com)) {
			var query = com.replace(/^gh /i, "");
			nav("https://www.github.com/search?q=" + encodeURIComponent(query));
		}
	}
		// handle stackexchange command
	else if (com.startsWith("stack")==true) {
		if (/^stack$/i.test(com)) {
			nav("https://www.stackexchange.com");
		}
		else if (/^stack .{1,140}$/i.test(com)) {
			var query = com.replace(/^stack /i, "");
			nav("https://www.stackexchange.com/search?q=" + encodeURIComponent(query));
		}
	}
	// handle tpb command
	else if (com.startsWith("tpb")==true) {
		if (/^tpb$/i.test(com)) {
			nav("https://www.thepiratebay.org");
		}
		else if (/^tpb .{1,140}$/i.test(com)) {
			var query = com.replace(/^tpb /i, "");
			nav("https://thepiratebay.org/search/" + encodeURIComponent(query));
		}
	}
		// handle torrentproject command
	else if (com.startsWith("tp")==true) {
		if (/^tp$/i.test(com)) {
			nav("http://torrentproject.se");
		}
		else if (/^tp .{1,140}$/i.test(com)) {
			var query = com.replace(/^tp /i, "");
			nav("http://torrentproject.se/?t=" + encodeURIComponent(query));
		}
	}
	else if (com.startsWith("wiki")==true) {
		if (/^wiki$/i.test(com)) {
			nav("https://en.wikipedia.org");
		}
		else if (/^wiki .{1,140}$/i.test(com)) {
			var query = com.replace(/^wiki /i, "");
			nav("https://en.wikipedia.org/wiki/" + encodeURIComponent(query));
		}
	}

	// misc commands

	else if (/^imgur$/i.test(com)) {
		nav("http://www.imgur.com");
	}
	else if (/^inbox$/i.test(com)) {
		nav("http://inbox.google.com");
	}
	else if (/^drive$/i.test(com)) {
		nav("http://drive.google.com");
	}

	// Media commands
	else if (/^(twitch|ttv)$/i.test(com)) {
		nav("http://www.twitch.tv/following");
	}
	else if (/^(twitch|ttv) [^ ]+$/i.test(com)) {
		var parts = com.split(" ");
		nav("http://www.twitch.tv/" + parts.pop());
	}
	else if (/^spotify$/i.test(com) || /^sptfy$/i.test(com)) {
		nav("https://play.spotify.com");
	}
	else if (/^soundcloud$/i.test(com) || /^sc$/i.test(com)) {
		nav("https://soundcloud.com/stream");
	}

	// Here are some really handy ones I'll probably have to use
	else if (handy.test(com)) {
		nav("http://www."+com+".com/");
	}
	else if (/^about:[A-Za-z0-9_-]+$/i.test(com)) {
		document.location.href = com;
	}
	// These are some commands that are just for fun, and probably won't be added to the list
	else if (/^cout << .*$/i.test(com)) {
		var message = com.replace(/^cout << /i, "");
		alert(message);
	}
	// if it doesn't match any of the commands...
	// ... but is a valid URL
	else if (urlPattern.test(com)) {
		nav(com);
	}
	// ... or should be searched
	else {
		search();
	}
}
