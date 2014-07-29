 /// <reference path="global_variables.js" />

var handlerChoices = {
    summoners: new WebsiteItem(LOCAL_STORAGE_CHOICE.SUMMONER,
                                DEFAULT_CHOICE.SUMMONER),
    guides: new WebsiteItem(LOCAL_STORAGE_CHOICE.GUIDES,
                                DEFAULT_CHOICE.GUIDES),
    counters: new WebsiteItem(LOCAL_STORAGE_CHOICE.COUNTERS,
                                DEFAULT_CHOICE.COUNTERS),
    games: new WebsiteItem(LOCAL_STORAGE_CHOICE.GAMES,
                                DEFAULT_CHOICE.GAMES),

    getSummonerName: function () {
        return handlerLocalStorage.getSummonerInfo(LOCAL_STORAGE_CHOICE.SUMMONER_NAME);
    },
    setSummonerName: function (newName) {
        handlerLocalStorage.setSummonerInfo(LOCAL_STORAGE_CHOICE.SUMMONER_NAME, newName);
    },
    getSummonerRegion: function () {
        return handlerLocalStorage.getSummonerInfo(LOCAL_STORAGE_CHOICE.SUMMONER_REGION);
    },
    setSummonerRegion: function (newRegion) {
        handlerLocalStorage.setSummonerInfo(LOCAL_STORAGE_CHOICE.SUMMONER_REGION, newRegion);
    },

    getEnabledSections: function () { //remember to adapt constant in global_variables
        return handlerLocalStorage.getEnabledSections();
    }
};

//For example: Guide search
function WebsiteItem(name, defaultChoice) {
    this.name = name; //for  example optionGuides
    this.getChoice = function() { //gets the choice from local storage, if null save default value
        return handlerLocalStorage.getWebsiteChoice(this);
    };
    this.getUrl = function() {
        return handlerWebsite.getWebsiteItemUrl(this);
    };

    this.saveChoice = function(newChoice) {
        handlerLocalStorage.setWebsiteChoice(this, newChoice);
    };
    this.getTransformedInput = function(input) {
        return handlerTransformInput.getTransformedInput(this, input);
    };
    this.defaultChoice = defaultChoice;
}

var handlerLocalStorage = {
    getSummonerInfo: function(key) {
        return localStorage.getItem(key);
    },
    setSummonerInfo: function(key, value) {
        localStorage.setItem(key, value);
    },

    getWebsiteChoice: function(websiteItem) {
        var value = localStorage.getItem(websiteItem.name);
        if (value == null) {
            localStorage.setItem(websiteItem.name, websiteItem.defaultChoice);
            value = websiteItem.defaultChoice;
        }
        return value;
    },
    setWebsiteChoice: function(websiteItem, newChoice) {
        localStorage.setItem(websiteItem.name, newChoice);
    },
    getEnabledSections: function() {
        var sections = localStorage.getItem(LOCAL_STORAGE_CHOICE.ENABLED_SECTIONS);
        if (sections == null || sections.split(";").length != NUMBER_SECTIONS) {
            localStorage.setItem(LOCAL_STORAGE_CHOICE.ENABLED_SECTIONS, 
                                 DEFAULT_CHOICE.ENABLED_SECTIONS);
            sections = DEFAULT_CHOICE.ENABLED_SECTIONS;
        }
        return sections.split(";");
    }
};

var handlerTransformInput = {
    getTransformedInput: function (websiteItem, input) {
        switch (websiteItem.getChoice()) {
            case CHOICES.GUIDES.SOLOMID: return getSoloMidGuideName(input);
            case CHOICES.GUIDES.LOLKING: return getLolKingGuideName(input);
            case CHOICES.GUIDES.LOLPRO: return getChampionSelectName(input);
            case CHOICES.GUIDES.PROBUILDS: return getLolKingGuideName(input);

            case CHOICES.COUNTERS.CHAMPIONSELECT: return getChampionSelectName(input);
            case CHOICES.COUNTERS.LOLCOUNTER: return getLolCounterName(input);

                //Forms the append part for ongoing games (different for each website)
            case CHOICES.GAMES.LOLNEXUS:  return "name=" + handlerChoices.getSummonerName() + "&server=" + handlerChoices.getSummonerRegion();
            case CHOICES.GAMES.LOLSTATS:  return "q=" + handlerChoices.getSummonerName() + "&region=" + handlerChoices.getSummonerRegion();
            case CHOICES.GAMES.QUICKFIND: return handlerChoices.getSummonerRegion().toLowerCase() + "/" + handlerChoices.getSummonerName();
            case CHOICES.GAMES.ARAMWL:    return "pseudo=" + handlerChoices.getSummonerName() + "&server=" + handlerChoices.getSummonerRegion();
        }
    }
};

var handlerWebsite = {
    getWebsiteItemUrl: function (websiteItem) {
    	console.log(websiteItem);
        switch (websiteItem.getChoice()) {
            case CHOICES.SUMMONER.LOLKING: //LolKing summoner and LolKing guides has same value
            	if (websiteItem.name === LOCAL_STORAGE_CHOICE.SUMMONER) 
            		return WEBSITES.SUMMONER.LOLKING;
            	else if (websiteItem.name === LOCAL_STORAGE_CHOICE.GUIDES) 
            		return WEBSITES.GUIDES.LOLKING;
            		
            case CHOICES.GUIDES.SOLOMID: return WEBSITES.GUIDES.SOLOMID;  					
            //case CHOICES.GUIDES.LOLKING: return WEBSITES.GUIDES.LOLKING;  				
            case CHOICES.GUIDES.LOLPRO: return WEBSITES.GUIDES.LOLPRO;				
            case CHOICES.GUIDES.PROBUILDS: return WEBSITES.GUIDES.PROBUILDS;				

            case CHOICES.COUNTERS.CHAMPIONSELECT: return WEBSITES.COUNTERS.CHAMPIONSELECT;	
            case CHOICES.COUNTERS.LOLCOUNTER: return WEBSITES.COUNTERS.LOLCOUNTER;			

            case CHOICES.GAMES.LOLNEXUS: return WEBSITES.GAMES.LOLNEXUS;					
            case CHOICES.GAMES.LOLSTATS: return WEBSITES.GAMES.LOLSTATS;					
            case CHOICES.GAMES.QUICKFIND: return WEBSITES.GAMES.QUICKFIND;					
            case CHOICES.GAMES.ARAMWL: return WEBSITES.GAMES.ARAMWL;						
        }
    }
};

/**
 * Forms a champion name for solomid.net, for champion guides.
 * @param Champion
 */
function getSoloMidGuideName(champ) {
	champ = champ.replace(" ", "");
	champ = champ.replace(".", "");
	champ = champ.replace("'", "");
	return champ;
}

/**
 * Forms a champion name for lolking.net, for champion guides.
 * @param Champion
 */
function getLolKingGuideName(champ) {
	champ = champ.toLowerCase();
	champ = champ.replace(" ", "");
	champ = champ.replace(".", "");
	champ = champ.replace("'", "");
	return champ;
}

/**
 * Need to change champion name format for championselect.net or LolPro
 */
function getChampionSelectName(champ) {
	champ = champ.replace(" ", "-");
	champ = champ.replace("'", "");
	champ = champ.replace(".", "");
	return champ;
}

/**
 * Need to change champion name format for lolcounter.com
 * @param 
 */
function getLolCounterName(champ) {
	champ = champ.replace(" ", "");
	champ = champ.replace(".", "");
	champ = champ.replace("'", "");
	return champ;
}