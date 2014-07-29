 /// <reference path="jquery-1.9.1-vsdoc.js" />
 /// <reference path="global_variables.js" />
//Options Page

$(document).ready(function () {
    
    $(window).resize(function (event) {
        fitBackground();
    });


    //Document initialize
    setRadios();
    fitBackground();

    //Set summoner name and region
    $("#id_summoner_name").val(handlerChoices.getSummonerName());
    $("#id_summoner_region").val(handlerChoices.getSummonerRegion());

    //Set which sections are enabled
    getAndSetEnabledSectionCheckboxes();

    //Handle clicks
    $(".input_guides").click(function () {
        handlerChoices.guides.saveChoice($(this).val());
    });
    $(".input_counters").click(function () {
        handlerChoices.counters.saveChoice($(this).val());
    });
    $(".input_games").click(function () {
        handlerChoices.games.saveChoice($(this).val());
    });

    //Handle checkbox clicks
    $("input[type='checkbox']").click(function () {
        saveSectionState($(this));
    });

    //Handle summoner info changes (name and region)
    $("#id_summoner_name").keyup(function () {
        handlerChoices.setSummonerName($(this).val());
    });
    $("#id_summoner_region").keyup(function () {
        handlerChoices.setSummonerRegion($(this).val());
    });
});


/**
  * Changes the background picture to match the window size
  */
function fitBackground() {
    var minwidth = 1200;
    var minheight = 1024;

    var bodye = $('body');

    var bodywidth = bodye.width();

    if (bodywidth < minwidth) {   // maintain minimum size
        bodye.css('backgroundSize', minwidth + 'px' + ' ' + minheight + 'px');
    }
    else {   // expand
        bodye.css('backgroundSize', '100% auto');
    }
}

/**
  * Gets and sets the sections the user has already choosen
  */
function getAndSetEnabledSectionCheckboxes() {
    var sections = handlerChoices.getEnabledSections();
    //Loop through all checkboxes
    $("input[type='checkbox']").each(function(i, obj) {
        if (sections[i] == "true") $(this).prop('checked', true);
    });   
}

/**
  * Saves whether the section should be shown or not
  */
function saveSectionState($checkboxClicked) {
    var sections = handlerChoices.getEnabledSections();
    var index = $("input[type='checkbox']").index($checkboxClicked);
    var state = $checkboxClicked.is(":checked"); //true or false
    sections[index] = state;

    //Create string to save to local storage
    var section_string = "";
    for (var i = 0; i < sections.length; i++) {
        section_string += (i != sections.length - 1) ? sections[i] + ";" : sections[i];
    }
    saveValue(LOCAL_STORAGE_CHOICE.ENABLED_SECTIONS, section_string);
}

/**
 * Saves an option to a given key
 * @param localStorageItem For example: optionGuides
 * @param input For example: Solomid
 */
function saveValue(localStorageItem, input) { 
	localStorage.setItem(localStorageItem, input);
}


function setRadios() {
    for (var key in handlerChoices) {
       var potentialWebsiteItem = handlerChoices[key];

       if (potentialWebsiteItem instanceof WebsiteItem) {
           var selected = potentialWebsiteItem.getChoice();
            $("#" + selected).attr("checked", true);
       } 
   }
}