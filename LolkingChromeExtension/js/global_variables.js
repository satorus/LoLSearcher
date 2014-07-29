 /// <reference path="choice.js" />
var LOCAL_STORAGE_CHOICE = {
    SUMMONER: "optionSummonerSearch",
	GUIDES : "optionGuides",
	COUNTERS: "optionCounters",
	GAMES  : "optionGames",
	SUMMONER_NAME   : "optionSummonerName",
	SUMMONER_REGION : "optionSummonerRegion",
    ENABLED_SECTIONS: "sections"
};

var SEARCH_TYPE = {
		SUMMONER : "1",
		GUIDES   : "2",
		COUNTERS : "3"
};

var CHOICES = { //These are the strings that appear on the buttons
    SUMMONER : { LOLKING  : "LolKing",
    			 OPGG     : "OP.GG" }, //NOT IMPLEMENTED YET
	GUIDES   : { SOLOMID  : "SoloMid",
			     LOLKING  : "LolKing",
			     LOLPRO   : "LolPro", 
			     PROBUILDS: "Pro Builds" },
	COUNTERS : { CHAMPIONSELECT: "ChampionSelect" ,
				 LOLCOUNTER: "LolCounter" },
	GAMES    : { LOLNEXUS : "LolNexus", 
				 LOLSTATS : "Lolstats",
				 QUICKFIND: "Quickfind",
                 ARAMWL:    "ARAMWL" }
};

//This needs to be changed when a new section is added
var NUMBER_SECTIONS = 5;
var DEFAULT_SECTIONS = "";
for (var i = 0; i < NUMBER_SECTIONS; i++ ) {
    DEFAULT_SECTIONS += (i != NUMBER_SECTIONS - 1) ? "true;" : "true";
}

var DEFAULT_CHOICE = {
    SUMMONER: CHOICES.SUMMONER.LOLKING,
    GUIDES: CHOICES.GUIDES.SOLOMID,
    COUNTERS: CHOICES.COUNTERS.CHAMPIONSELECT,
    GAMES: CHOICES.GAMES.LOLNEXUS,
    ENABLED_SECTIONS: DEFAULT_SECTIONS
};

var WEBSITES = {
	SUMMONER : { LOLKING  : "http://www.lolking.net/search?name=",
				 OPGG     : "op.gg/summoner/userName="}, //http://euw.op.gg/summoner/userName=zhadok, NOT IMPLEMENTED YET
	GUIDES   : { SOLOMID  : "http://www.solomid.net/guides.php?champ=",
				 LOLKING  : "http://www.lolking.net/guides/list.php?champion=",
				 LOLPRO   : "http://www.lolpro.com/guides/",
			     PROBUILDS: "http://www.probuilds.net/champions/" },
	COUNTERS : { CHAMPIONSELECT : "http://www.championselect.net/champ/",
				 LOLCOUNTER     : "http://lolcounter.com/champ/" },
	GAMES    : { LOLNEXUS : "http://www.lolnexus.com/scouter/search?", //name=NAME&server=EUW
				 LOLSTATS : "http://www.lolstats.com/search?", //q=NAME&region=EUW
				 QUICKFIND: "http://quickfind.kassad.in/profile/", //REGION/NAME/
                 ARAMWL:    "http://www.aramwl.net/?" } //pseudo=NAME&server=REGION
};