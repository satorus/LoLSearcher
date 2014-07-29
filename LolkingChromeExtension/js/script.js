/**
 * @author Oliver Frendo
 *
 * New features to think of:
 * Options: 
 * Opt in or out of only one tab
 * Opt in or out of tab stuff
 * Remember which tab
 */
 /// <reference path="jquery-1.9.1-vsdoc.js" />
 /// <reference path="global_variables.js" />
 /// <reference path="choices.js" />

$(document).ready(function () {

    //Initialize Document
    $(document).bind("contextmenu", function (e) {
        return false;
    });

    $("#button_settings").button({
        text: false, /* Don't include text on the button */
        icons: {
            primary: 'ui-icon-wrench'
        }
    }).click(function () {
        openSettings();
    });

    $(".button_submit").button();

    //Cycle through settings to see if sections are hidden
    //Rules for hiding? Able to hide all? Yes I think
    var enabledSections = handlerChoices.getEnabledSections();
    $("form").each(function (i, obj) {
        if (enabledSections[i] != "true") {
            $(this).hide();
        }
    });

    setInputFocus();

    //Initialize Summoner Search
    var summonerChoice = handlerChoices.summoners.getChoice();
    var urlSummoner = handlerChoices.summoners.getUrl();

    $("#button_summoner_search").html("Search " + summonerChoice);

    //Initialize Guides
    var guideChoice = handlerChoices.guides.getChoice();
    var urlGuide = handlerChoices.guides.getUrl();
    console.log(urlGuide);
    $("#button_guides_search").html("Search " + guideChoice);

    //Initialize Counters
    var counterChoice = handlerChoices.counters.getChoice();
    var urlCounter = handlerChoices.counters.getUrl();

    $("#button_counters_search").html("Search " + counterChoice);

    //Initialize Ongoing games
    var gamesChoice = handlerChoices.games.getChoice();
    var urlGame = handlerChoices.games.getUrl();

    var summonerName = handlerChoices.getSummonerName();
    var summonerRegion = handlerChoices.getSummonerRegion();

    var summonerInfoSet = false;

    if (summonerName != null && summonerName != "" &&
        summonerRegion != null && summonerRegion != "") {
        summonerInfoSet = true;
    }

    var gamesText = (summonerInfoSet == true) ? gamesChoice + " " + summonerName + "@" + summonerRegion : "Please enter summoner information";
    $("#button_ongoing_games_search").html(gamesText);

    //bind tabs
    changeState(1);
    $("#tab1").click(function () {
        changeState(1);
    });
    $("#tab2").click(function () {
        changeState(2);
    });

    //tab1 stuff
    var summoners = getSearchedSummoners();
    if (summoners != null) {
        summoners.sort(
				  function (a, b) {
				      if (a.toLowerCase() < b.toLowerCase()) return -1;
				      if (a.toLowerCase() > b.toLowerCase()) return 1;
				      return 0;
				  }
		);

        $("#input_summoner").autocomplete({
            source: function (request, response) {
                var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep(summoners, function (item) {
                    return matcher.test(item);
                }).slice(0, 8));
            },
            minLength: 0,
            autoFocus: true,
            delay: 0,
            select: function (event, ui) {
                $(this).val(ui.item.value);
                var form = $(this).closest("form").get();
                $(form).submit();
            }
        });
    }




    //Store searched results for summoner
    $("#form_search_summoner").submit(function () {
        var name = $("#input_summoner").val().replace(";", "");
        var newURL = urlSummoner + encodeURIComponent(name);

        if (/\S/.test(name)) {
            // string is not empty and not just whitespace
            addToSearchedSummoners(name);
            addQueryToHistory(SEARCH_TYPE.SUMMONER, name);

            createTab(newURL);
        }

        return false;
    });

    //Lolking charts
    $("#input_charts").click(function () {
        var newURL = "http://www.lolking.net/charts";

        createTab(newURL);
        return false;
    });

    //usability stuff
    $('input').addClass("ui-corner-all");
    
    
    //Champions using LoL - API
    var champs_string = "";  
    var actVersion = "";
    var champs = localStorage.getItem('champs');
    
    var old_champs_string =
		"Aatrox;Ahri;Akali;Alistar;Amumu;Anivia;Annie;Ashe;Blitzcrank;Brand;Braum;Caitlyn;Cassiopeia;Cho'Gath;Corki;" +
		"Darius;Diana;Dr. Mundo;Draven;Elise;Evelynn;Ezreal;Fiddlesticks;Fiora;Fizz;Galio;Gangplank;Garen;" +
		"Gragas;Graves;Hecarim;Heimerdinger;Irelia;Janna;Jarvan IV;Jax;Jayce;Jinx;Karma;Karthus;Kassadin;" +
		"Katarina;Kayle;Kennen;Kha'Zix;Kog'Maw;LeBlanc;Lee Sin;Leona;Lissandra;Lucian;Lulu;Lux;Malphite;Malzahar;Maokai;" +
		"Master Yi;Miss Fortune;Mordekaiser;Morgana;Nami;Nasus;Nautilus;Nidalee;Nocturne;Nunu;Olaf;Orianna;" +
		"Pantheon;Poppy;Quinn;Rammus;Renekton;Rengar;Riven;Rumble;Ryze;Sejuani;Shaco;Shen;Shyvana;" +
		"Singed;Sion;Sivir;Skarner;Sona;Soraka;Swain;Syndra;Talon;Taric;Teemo;Thresh;Tristana;Trundle;" +
		"Tryndamere;Twisted Fate;Twitch;Udyr;Urgot;Varus;Vayne;Veigar;Vel'Koz;Vi;Viktor;Vladimir;Volibear;Warwick;" +
		"Wukong;Xerath;Xin Zhao;Yasuo;Yorick;Zac;Zed;Ziggs;Zilean;Zyra";
    
    $.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/versions?api_key=c844dd52-06ee-4f6a-897f-e845f60d46dd",function(responseData){
    	actVersion = responseData[0];
    }).fail(function(){
    	if(champs != null){
    		actVersion = champs.version;	//set actVersion to version of champ objet so that the champ names are not loaded again when the version request failed
    	}
    });
    
    if(champs == null || champs.version != actVersion){
	    champs = {
	    	data: [],
	    	version: ""
	    };
	    $.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?api_key=c844dd52-06ee-4f6a-897f-e845f60d46dd",function(responseData){
	    	console.log(responseData);
			var champData = responseData.data;
			for(var key in champData){
				if(champData.hasOwnProperty(key)){
					champs_string += champData[key].name + ";";
				}
			}
			champs.data = champs_string.split(";");
			champs.version = responseData.version;
			localStorage.setItem('champs',champs);
	    }).fail(function(){
	    	champs.data = old_champs_string.split(";");		//set champs with old_Chmap_String when request failed
	    	console.log(champs);
	    });
	}

   
    //last check if there is something in champs...may by useless to check again...
    if(champs == null || champs == undefined || champs.data == []){
    	champs.data = old_champs_string.split(";");
    }

    $(".input_champion_search").autocomplete({
        source: function (request, response) {
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            response($.grep(champs.data, function (item) {
                return matcher.test(item);
            }).slice(0, 2));
        },
        minLength: 1,
        autoFocus: true,
        delay: 0,
        select: function (event, ui) {
            $(this).val(ui.item.value);
            var form = $(this).closest("form").get();
            $(form).submit();
        }
    });

    //Handle champion guide submit
    $("#form_search_guides").submit(function () {
        var champ = $("#input_champion_guide").val().replace(";", "");

        if (/\S/.test(champ)) {
            addQueryToHistory(SEARCH_TYPE.GUIDES, champ);

            champ = handlerChoices.guides.getTransformedInput(champ);
            var newURL = urlGuide + encodeURIComponent(champ);

            createTab(newURL);
        }
        return false;
    });

    //Handle champion counter submit
    $("#form_search_counters").submit(function () {
        var champ = $("#input_champion_counter").val().replace(";", "");

        if (/\S/.test(champ)) {
            addQueryToHistory(3, champ);

            champ = handlerChoices.counters.getTransformedInput(champ);
            var newURL = urlCounter + encodeURIComponent(champ);

            createTab(newURL);
        }

        return false;
    });

    //Handle ongoing game search submit
    $("#button_ongoing_games_search").click(function () {
        if (summonerInfoSet == true) {
            var newURL = urlGame;
            var append = handlerChoices.games.getTransformedInput(null);

            createTab(newURL + append);
        }
        else {
            openSettings();
        }
        return false;
    });

    //Handle ongoing aram game submit
    $("#button_ongoing_aram_search").click(function() {
        
    });

    //tab2 stuff	
    var history_full = getHistory();
    var history_search_terms = new Array();
    var searched_type = "";

    if (history_full != false) {
        var prepend = "";
        for (var i = 0; i < history_full.length; i++) {
            t = history_full[i][0];
            if (t === SEARCH_TYPE.SUMMONER)
                prepend = "Summoner: ";
            if (t === SEARCH_TYPE.GUIDES)
                prepend = "Guides:   ";
            if (t === SEARCH_TYPE.COUNTERS)
                prepend = "Counters: ";
            history_search_terms[i] = prepend + history_full[i][1];
        }

        history_search_terms = history_search_terms.reverse();

        $("#input_history_search").autocomplete({
            source: history_search_terms,
            minLength: 0,
            autoFocus: true,
            delay: 0,
            select: function (event, ui) {
                var val = ui.item.value.substring(10);
                //need to get searched_type from
                if (ui.item.value.indexOf("Summoner") !== -1) {
                    searched_type = SEARCH_TYPE.SUMMONER;
                }
                if (ui.item.value.indexOf("Guides") !== -1) {
                    searched_type = SEARCH_TYPE.GUIDES;
                }
                if (ui.item.value.indexOf("Counters") !== -1) {
                    searched_type = SEARCH_TYPE.COUNTERS;
                }
                $(this).val(val);
                var form = $(this).closest("form").get();
                $(form).submit();
            }
        }).focus(function () {
            //change this
            $(this).autocomplete("search", "");
        });

    }
    $("#form_search_history").submit(function () {
        var search_term = $("#input_history_search").val();
        var type = "";
        var newURL = "";

        //search in history search terms for correct to get type
        for (var i = 0; i < history_full.length; i++) {
            //alert(history_full[i][0] + " : " + searched_type);
            if (history_full[i][1] === search_term &&
				history_full[i][0] === searched_type) {
                //found it
                type = history_full[i][0];
            }
        }

        if (type != "") {
            addQueryToHistory(type, search_term);
            var champ = search_term;

            switch (type) {
                case SEARCH_TYPE.SUMMONER:
                    newURL = urlGuide + encodeURIComponent(search_term);
                    break;
                case SEARCH_TYPE.GUIDES:
                    champ = handlerChoices.guides.getTransformedInput(champ);
                    newURL = urlGuide + encodeURIComponent(champ);
                    break;
                case SEARCH_TYPE.COUNTERS:
                    champ = handlerChoices.counters.getTransformedInput(champ);
                    newURL = urlGuide + encodeURIComponent(champ);
                    break;
            }

            createTab(newURL);
        }

        return false;
    });

});

/**
 * Gets information about a summoner from local storage
 * @param localStorageItem
 */
function getSummonerInfo(localStorageItem) {
	var info = localStorage.getItem(localStorageItem);
	if (info != undefined && info != "") {
		return info;
	}
	else return null;
}

    
    //set focus to the first one that is not hidden
function setInputFocus() {
    var focusSet = false;
    $("input").each(function (i, obj) {
        if ($(this).is(":visible") && focusSet == false) {
            $(this).focus();
            focusSet = true;
        }
    });
}


/**
 * 
 * @param tabNumber The tabNumber to change to. Either 1 = 3 forms or 2 = history tab
 */
function changeState(tabNumber) {
	if (tabNumber == 1) {
	    setInputFocus();
		$(".ui-autocomplete").css("max-height", "")
		 					 .css("overflow-y", "");
		$("#wrapper1").show();
		$("#wrapper2").hide();
		$("#tab1").addClass("tabact").removeClass("tabinact");
		$("#tab2").addClass("tabinact").removeClass("tabact");
	}
	else if (tabNumber == 2) {
	    $("#wrapper2").css("height", "290px");
		$(".ui-autocomplete").css("max-height", "270px")
		 .css("overflow-y", "scroll");
		$("#wrapper1").hide();
		$("#wrapper2").show();
		$("#tab1").addClass("tabinact").removeClass("tabact");
		$("#tab2").addClass("tabact").removeClass("tabinact");
		$("#input_history_search").focus();
	}
	
}
/**
 * 
 * @param type SEARCH_TYPE 1 summoner name, 2 champion guide, 3, champion counter
 * @param value
 */
function addQueryToHistory(type, value) {
	if (value != null && value != "") {
		
		var soFar = localStorage.getItem("history");		
		var historyAdd = "";
		
		if (soFar == null) { //first item to add to history
			historyAdd = type + ":" + value;
			localStorage.setItem("history", historyAdd);
		}
		else if (soFar.indexOf(type + ":" + value) === -1) { //previous items
			historyAdd = soFar;
			historyAdd += ";" + type + ":" + value;
			localStorage.setItem("history", historyAdd);
		}
		else { //value is already inside: need to update the string
			//example:
			var index = soFar.indexOf(type + ":" + value);
			//include type
			//index = index;
			//length of value
			var l = value.length + 2;
			
			var valueToBeMoved = "";
			var frontString = "";
			var backString = "";
			
			
			//only value
			if (soFar.indexOf(";") === -1) {
				valueToBeMoved = soFar;
			}
			//first value
			else if (index == 0) {
				valueToBeMoved = ";" + soFar.substr(index, l);
				backString = soFar.substring(index + l + 1);
			}
			//last value
			else if (index + l + 1 > soFar.length) {
				//doesnt really need to be changed
				frontString = soFar.substring(0, index-1);
				valueToBeMoved = ";" + soFar.substr(index, l);
			}
			//middle value
			else {
				frontString = soFar.substring(0, index-1);
				valueToBeMoved = ";" + soFar.substr(index, l);
				backString = soFar.substring(index + l);
			}
			var finishedString = frontString + backString + valueToBeMoved;
			localStorage.setItem("history", finishedString);
		}
		
	}
	
	
}

/**
 * @returns An array of searched terms.
 */
function getHistory() {
	var history_string = localStorage.getItem("history");
	if (history_string != null) {
		var history = history_string.split(";");
		for ( var i = 0; i < history.length; i++ ) {
			history[i] = history[i].split(":");
		}
		return history;
	}
	else return false;
}


/**
 * Creates a new tab. 
 * If this plugin already opened one tab, it will continue to use that one and switch to it.
 * If no tab has been opened this session, it will create a new tab.
 * @param newURL
 */
function createTab(newURL) {
	
	var myTabId = parseInt(localStorage.getItem("myTabId"));
	//no localStorage set - first session
	if ( isNaN(myTabId) ) {
		chrome.tabs.create({ url: newURL }, function(tab){
			localStorage.setItem("myTabId", tab.id);
		});
	}
	//localstorage is set - have to do it via try catch
	else {
		try {
			chrome.tabs.get(myTabId, function(tab) {
				//Tab already exists: Update it and change focus to it
				chrome.tabs.update(myTabId, { url: newURL, selected : true }, function(tab) {
					if (tab == null) {
						chrome.tabs.create({ url: newURL }, function(tab) {
							localStorage.setItem("myTabId", tab.id);
						});
					}
				});
			});
		}
		catch (e) {
			chrome.tabs.create({ url: newURL }, function(tab){
				localStorage.setItem("myTabId", tab.id);
			});
		}
	}
}

/**
 * Adds a summoner name to local storage for the first input
 * @param summonerName
 */
function addToSearchedSummoners(summonerName) {
	//get string (in string form atm)
	if (summonerName != null && summonerName != "") {
		var a = localStorage.getItem("searchedNames");
		if (a != null) {
			if (a.indexOf(summonerName) === -1) {
				a += ";" + summonerName;
			}
		}
		else {
			a = summonerName;
		}
		localStorage.setItem("searchedNames", a);
	}
}

/**
 * Gets summoner names for the first input (autocomplete)
 * @returns
 */
function getSearchedSummoners() {
	var a_string = localStorage.getItem("searchedNames");
	if (a_string != null) {
		return a_string.split(";");
	}
	else {
		return null;
	}
}

/**
 * Opens the settings page
 */
function openSettings() {
	var newURL = chrome.extension.getURL("options.html");
	chrome.tabs.create( { url: newURL } );
}
