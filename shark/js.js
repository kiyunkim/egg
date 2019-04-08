/* -------------------------- main.js -------------------------- */
var SharkGame = SharkGame || {};


// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(SharkGame, {
  GAME_NAMES: [
    "Five Seconds A Shark",
    "Next Shark Game",
    "Next Shark Game: Barkfest",
    "Sharky Clicker",
    "Weird Oceans",
    "You Have To Name The Shark Game",
    "Shark A Lark",
    "Bark Shark",
    "Fin Idle",
    "Ray of Dreams",
    "Shark Saver",
    "Shoal Sharker",
    "Shark Souls",
    "Saucy Sharks",
    "Sharkfall",
    "Heart of Sharkness",
    "Sharks and Recreation",
    "Alone in the Shark",
    "Sharkpocalypse",
    "Shark of Darkness",
    "Strange Oceans"
  ],
  GAME_NAME: null,
  ACTUAL_GAME_NAME: "Shark Game",
  VERSION: 0.71,
  VERSION_NAME: "Stranger Oceans",
  EPSILON: 1E-6, // floating point comparison is a joy

  INTERVAL: (1000 / 10), // 20 FPS
  dt: (1 / 10),
  before: new Date(),

  timestampLastSave: false,
  timestampGameStart: false,
  timestampRunStart: false,
  timestampRunEnd: false,

  sidebarHidden: true,
  paneGenerated: false,

  gameOver: false,
  wonGame: false,

  credits: 
    "<p>This game was originally created in 3 days for Seamergency 2014.<br/>" +
    "<span class='smallDesc'>(Technically it was 4 days, but sometimes plans go awry.)</span></p>" +
    "<p>It was made by <a href='http://cirri.al'>Cirr</a> who needs to update his website.<br/>" +
    "He has a rarely updated <a href='https://twitter.com/Cirrial'>Twitter</a> though.</p>" +
    "<p>Additional code and credit help provided by Dylan and Sam Red.<br/>" +
    "<span class='smallDesc'>Dylan is also graciously hosting this game.</span></p>",

  ending: 
    "<p>Congratulations! You did it.<br/>You saved the sharks!</p>" +
    "<p>The gate leads away from this strange ocean...</p>" +
    "<p>Back home to the oceans you came from!</p>" +
    "<h3>Or are they?</h3>",

  help: 
    "<p>This game is a game about discovery, resources, and does not demand your full attention. " +
    "You are free to pay as much attention to the game as you want. " +
    "It will happily run in the background, and works even while closed.</p>" +
    "<p>To begin, you should catch fish. Once you have some fish, more actions will become available. " +
    "If you have no idea what these actions do, click the \"Toggle descriptions\" button for more information.</p>" +
    "<p>If you are ever stuck, try actions you haven't yet tried. " +
    "Remember, though, that sometimes patience is the only way forward. Patience and ever escalating numbers.</p>",

  donate: 
    "<p>You can <a href='http://www.sharktrust.org/en/donate' target='_blank'>donate to help save sharks and mantas</a>!</p>" +
    "<p>Seems only fitting, given this game was made for a charity stream!</p>" +
    "<p><span class='smallDescAllowClicks'>(But if you'd rather, you can also " +
    "<a href='https://www.paypal.com/cgi-bin/" +
    "webscr?cmd=_donations&business=G3WPPAYAWTJCJ&lc=GB&" +
    "item_name=Shark%20Game%20Developer%20Support&" +
    "item_number=Shark%20Game%20Support&no_note=1&" +
    "no_shipping=1&currency_code=USD&" +
    "bn=PP%2dDonationsBF%3adonate%2epng%3aNonHosted' " +
    "target='_blank'>support the developer</a>" +
    " if you'd like.)</span></p>",

  spriteIconPath: "img/sharksprites.png",
  spriteHomeEventPath: "img/sharkeventsprites.png",

  choose: function (choices) {
    return choices[Math.floor(Math.random() * choices.length)];
  },
  log10: function (val) {
    return Math.log(val) / Math.LN10;
  },
  plural: function (number) {
    return (number === 1) ? "" : "s";
  },
  colorLum: function (hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  },
  getImageIconHTML: function (imagePath, width, height) {
    if (!imagePath) {
      imagePath = "http://placekitten.com/g/" + Math.floor(width) + "/" + Math.floor(height);
    }
    var imageHtml = "";
    if (SharkGame.Settings.current.iconPositions !== "off") {
      imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon-" + SharkGame.Settings.current.iconPositions + "'>";
    }
    return imageHtml;
  },
  changeSprite: function (spritePath, imageName, imageDiv, backupImageName) {
    var spriteData = SharkGame.Sprites[imageName];
    if (!imageDiv) {
      imageDiv = $('<div>');
    }

    // if the original sprite data is undefined, try loading the backup
    if (!spriteData) {
      spriteData = SharkGame.Sprites[backupImageName];
    }

    if (spriteData) {
      imageDiv.css('background-image', 'url(' + spritePath + ')');
      imageDiv.css('background-position', "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
      imageDiv.width(spriteData.frame.w);
      imageDiv.height(spriteData.frame.h);
    } else {
      imageDiv.css('background-image', 'url("//placehold.it/50x50")');
      imageDiv.width(50);
      imageDiv.height(50);
    }
    return imageDiv;
  }

});

SharkGame.TitleBar = {
  saveLink: {
    name: "save",
    main: true,
    onClick: function () {
      try {
        try {
          SharkGame.Save.saveGame();
        } catch (err) {
          SharkGame.Log.addError(err);
          console.log(err);
        }
        SharkGame.Log.addMessage("Saved game.");
      } catch (err) {
        SharkGame.Log.addError(err.message);
      }

    }
  },

  optionsLink: {
    name: "options",
    main: true,
    onClick: function () {
      SharkGame.Main.showOptions();
    }
  },

  changelogLink: {
    name: "changelog",
    main: false,
    onClick: function () {
      SharkGame.Main.showChangelog();
    }
  },

  helpLink: {
    name: "help",
    main: true,
    onClick: function () {
      SharkGame.Main.showHelp();
    }
  },

  skipLink: {
    name: "skip",
    main: true,
    onClick: function () {
      if (SharkGame.Main.isFirstTime()) { // save people stranded on home world
        if (confirm("Do you want to reset your game?")) {
          // just reset
          SharkGame.Main.init();
        }
      } else {
        if (confirm("Is this world causing you too much trouble? Want to go back to the gateway?")) {
          SharkGame.wonGame = false;
          SharkGame.Main.endGame();
        }
      }
    }
  },

  creditsLink: {
    name: "credits",
    main: false,
    onClick: function () {
      SharkGame.Main.showPane("Credits", SharkGame.credits);
    }
  },

  donateLink: {
    name: "donate",
    main: false,
    onClick: function () {
      SharkGame.Main.showPane("Donate", SharkGame.donate);
    }
  }
};

SharkGame.Tabs = {
  current: 'home'
};

SharkGame.Main = {

  tickHandler: -1,
  autosaveHandler: -1,

  beautify: function (number, suppressDecimals) {

    var formatted;

    if (number === Number.POSITIVE_INFINITY) {
      formatted = "infinite";
    } else if (number < 1 && number >= 0) {
      if (suppressDecimals) {
        formatted = "0";
      } else {
        if (number > 0.001) {
          formatted = number.toFixed(2) + "";
        } else {
          if (number > 0.0001) {
            formatted = number.toFixed(3) + "";
          } else {
            formatted = 0;
          }
        }
      }
    } else {
      var negative = false;
      if (number < 0) {
        negative = true;
        number *= -1;
      }
      var suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
      var digits = Math.floor(SharkGame.log10(number));
      var precision = 2 - (Math.floor(SharkGame.log10(number)) % 3);
      // in case the highest supported suffix is not specified
      precision = Math.max(0, precision);
      var suffixIndex = Math.floor(digits / 3);


      var suffix;
      if (suffixIndex >= suffixes.length) {
        formatted = "lots";
      } else {
        suffix = suffixes[suffixIndex];
        // fix number to be compliant with suffix
        if (suffixIndex > 0) {
          number /= Math.pow(1000, suffixIndex);
        }
        if (suffixIndex === 0) {
          formatted = (negative ? "-" : "") + Math.floor(number) + suffix;
        } else if (suffixIndex > 0) {
          formatted = (negative ? "-" : "") + number.toFixed(precision) + suffix;
        } else {
          formatted = (negative ? "-" : "") + number.toFixed(precision);
        }
      }
    }
    return formatted;
  },

  formatTime: function (milliseconds) {
    var numSeconds = milliseconds / 1000;
    var formatted = "";
    if (numSeconds > 60) {
      var numMinutes = Math.floor(numSeconds / 60);
      if (numMinutes > 60) {
        var numHours = Math.floor(numSeconds / 3600);
        if (numHours > 24) {
          var numDays = Math.floor(numHours / 24);
          if (numDays > 7) {
            var numWeeks = Math.floor(numDays / 7);
            if (numWeeks > 4) {
              var numMonths = Math.floor(numWeeks / 4);
              if (numMonths > 12) {
                var numYears = Math.floor(numMonths / 12);
                formatted += numYears + "Y, ";
              }
              numMonths %= 12;
              formatted += numMonths + "M, ";
            }
            numWeeks %= 4;
            formatted += numWeeks + "W, ";
          }
          numDays %= 7;
          formatted += numDays + "D, ";
        }
        numHours %= 24;
        formatted += numHours + ":";
      }
      numMinutes %= 60;
      formatted += (numMinutes < 10 ? ("0" + numMinutes) : numMinutes) + ":";
    }
    numSeconds %= 60;
    numSeconds = Math.floor(numSeconds);
    formatted += (numSeconds < 10 ? ("0" + numSeconds) : numSeconds);
    return formatted;
  },

  // credit where it's due, i didn't write this (regexes fill me with fear), pulled from
  // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
  toTitleCase: function (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  // also functions as a reset
  init: function () {
    var currDate = new Date();
    SharkGame.before = currDate;
    if (SharkGame.GAME_NAME === null) {
      SharkGame.GAME_NAME = SharkGame.choose(SharkGame.GAME_NAMES);
      document.title = SharkGame.ACTUAL_GAME_NAME + ": " + SharkGame.GAME_NAME;
    }
    $('#sidebar').hide();
    var overlay = $('#overlay');
    overlay.hide();
    $('#gameName').html("- " + SharkGame.GAME_NAME + " -");
    $('#versionNumber').html("v " + SharkGame.VERSION + " â€” " + SharkGame.VERSION_NAME);
    SharkGame.sidebarHidden = true;
    SharkGame.gameOver = false;

    // remove any errant classes
    $('#pane').removeClass("gateway");
    overlay.removeClass("gateway");

    // initialise timestamps to something sensible
    SharkGame.timestampLastSave = SharkGame.timestampLastSave || currDate.getTime();
    SharkGame.timestampGameStart = SharkGame.timestampGameStart || currDate.getTime();
    SharkGame.timestampRunStart = SharkGame.timestampRunStart || currDate.getTime();

    // preserve settings or set defaults
    $.each(SharkGame.Settings, function (k, v) {
      if (k === "current") {
        return;
      }
      var currentSetting = SharkGame.Settings.current[k];
      if (typeof (currentSetting) === "undefined") {
        SharkGame.Settings.current[k] = v.defaultSetting
      }
    });

    // initialise and reset resources
    SharkGame.Resources.init();

    // initialise world
    // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
    SharkGame.World.init();
    SharkGame.World.apply();

    SharkGame.Gateway.init();
    SharkGame.Gateway.applyArtifacts(); // if there's any effects to carry over from a previous run

    // reset log
    SharkGame.Log.clearMessages();

    // initialise tabs
    SharkGame.Home.init();
    SharkGame.Lab.init();
    SharkGame.Stats.init();
    SharkGame.Recycler.init();
    SharkGame.Gate.init();
    SharkGame.Reflection.init();

    SharkGame.Main.setUpTitleBar();

    SharkGame.Tabs.current = "home";

    // load save game data if present
    if (SharkGame.Save.savedGameExists()) {
      try {
        SharkGame.Save.loadGame();
        SharkGame.Log.addMessage("Loaded game.");
      } catch (err) {
        SharkGame.Log.addError(err.message);
      }
    }

    // rename a game option if this is a first time run
    if (SharkGame.Main.isFirstTime()) {
      SharkGame.TitleBar.skipLink.name = "reset";
      SharkGame.Main.setUpTitleBar();
    }

    // discover actions that were present in last save
    SharkGame.Home.discoverActions();

    // set up tab after load
    SharkGame.Main.setUpTab();


    if (SharkGame.Main.tickHandler === -1) {
      SharkGame.Main.tickHandler = setInterval(SharkGame.Main.tick, SharkGame.INTERVAL);
    }

    if (SharkGame.Main.autosaveHandler === -1) {
      SharkGame.Main.autosaveHandler = setInterval(SharkGame.Main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
    }
  },

  tick: function () {
    if (SharkGame.gameOver) {
      // tick gateway stuff
      SharkGame.Gateway.update();
    } else {
      // tick main game stuff
      var now = new Date();
      var elapsedTime = (now.getTime() - SharkGame.before.getTime());

      var r = SharkGame.Resources;
      var m = SharkGame.Main;

      // check if the sidebar needs to come back
      if (SharkGame.sidebarHidden) {
        m.showSidebarIfNeeded();
      }

      if (elapsedTime > SharkGame.INTERVAL) {
        // Compensate for lost time.
        m.processSimTime(SharkGame.dt * (elapsedTime / SharkGame.INTERVAL));

      } else {
        m.processSimTime(SharkGame.dt);
      }
      r.updateResourcesTable();

      var tabCode = SharkGame.Tabs[SharkGame.Tabs.current].code;
      tabCode.update();

      m.checkTabUnlocks();

      SharkGame.before = new Date();
    }
  },

  checkTabUnlocks: function () {
    $.each(SharkGame.Tabs, function (k, v) {
      if (k === "current" || v.discovered) {
        return;
      }
      var reqsMet = true;

      // check resources
      if (v.discoverReq.resource) {
        reqsMet = reqsMet && SharkGame.Resources.checkResources(v.discoverReq.resource, true);
      }

      // check upgrades
      if (v.discoverReq.upgrade) {
        $.each(v.discoverReq.upgrade, function (_, value) {
          if (SharkGame.Upgrades[value]) {
            reqsMet = reqsMet && SharkGame.Upgrades[value].purchased;
          } else {
            reqsMet = false; // can't have a nonexistent upgrade
          }
        });
      }

      if (reqsMet) {
        // unlock tab!
        SharkGame.Main.discoverTab(k);
        SharkGame.Log.addDiscovery("Discovered " + v.name + "!");
      }
    });
  },

  processSimTime: function (numberOfSeconds) {
    var r = SharkGame.Resources;

    // income calculation
    r.processIncomes(numberOfSeconds);
  },

  autosave: function () {
    try {
      SharkGame.Save.saveGame();
      SharkGame.Log.addMessage("Autosaved.");
    } catch (err) {
      SharkGame.Log.addError(err.message);
      console.log(err.trace);
    }
  },

  setUpTitleBar: function () {
    var titleMenu = $('#titlemenu');
    var subTitleMenu = $('#subtitlemenu');
    titleMenu.empty();
    subTitleMenu.empty();
    $.each(SharkGame.TitleBar, function (k, v) {
      var option = "<li><a id='" + k + "' href='javascript:;'>" + v.name + "</a></li>";
      if (v.main) {
        titleMenu.append(option);
      } else {
        subTitleMenu.append(option);
      }
      $('#' + k).click(v.onClick);
    });
  },

  setUpTab: function () {
    var tabs = SharkGame.Tabs;
    // empty out content div
    var content = $('#content');
    content.empty();
    content.append('<div id="contentMenu"><ul id="tabList"></ul><ul id="tabButtons"></ul></div><div id="tabBorder" class="clear-fix"></div>');

    SharkGame.Main.createTabNavigation();
    SharkGame.Main.createBuyButtons();

    // set up tab specific stuff
    var tab = tabs[tabs.current];
    var tabCode = tab.code;
    tabCode.switchTo();
  },

  createTabMenu: function () {
    SharkGame.Main.createTabNavigation();
    SharkGame.Main.createBuyButtons();
  },

  createTabNavigation: function () {
    var tabs = SharkGame.Tabs;
    var tabList = $('#tabList');
    tabList.empty();
    // add navigation
    // check if we have more than one discovered tab, else bypass this
    var numTabsDiscovered = 0;
    $.each(tabs, function (k, v) {
      if (v.discovered) {
        numTabsDiscovered++;
      }
    });
    if (numTabsDiscovered > 1) {
      // add a header for each discovered tab
      // make it a link if it's not the current tab
      $.each(tabs, function (k, v) {
        var onThisTab = (SharkGame.Tabs.current === k);
        if (v.discovered) {
          var tabListItem = $('<li>');
          if (onThisTab) {
            tabListItem.html(v.name);
          } else {
            tabListItem.append($('<a>')
              .attr("id", "tab-" + k)
              .attr("href", "javascript:;")
              .html(v.name)
              .click(function () {
                var tab = ($(this).attr("id")).split("-")[1];
                SharkGame.Main.changeTab(tab);
              })
            );
          }
          tabList.append(tabListItem);
        }
      })
    }
  },

  createBuyButtons: function (customLabel) {
    // add buy buttons
    var buttonList = $('#tabButtons');
    buttonList.empty();
    $.each(SharkGame.Settings.buyAmount.options, function (_, v) {
      var amount = v;
      var disableButton = (v === SharkGame.Settings.current.buyAmount);
      buttonList.prepend($('<li>')
        .append($('<button>')
          .addClass("min")
          .attr("id", "buy-" + v)
          .prop("disabled", disableButton)
        ));
      var label = customLabel ? customLabel + " " : "buy ";
      if (amount < 0) {
        if (amount < -2) {
          label += "1/3 max"
        } else if (amount < -1) {
          label += "1/2 max"
        } else if (amount < 0) {
          label += "max"
        }
      } else {
        label += SharkGame.Main.beautify(amount);
      }
      $('#buy-' + v).html(label)
        .click(function () {
          var thisButton = $(this);
          SharkGame.Settings.current.buyAmount = parseInt(thisButton.attr("id").slice(4));
          $("button[id^='buy-']").prop("disabled", false);
          thisButton.prop("disabled", true);
        });
    });
  },

  changeTab: function (tab) {
    SharkGame.Tabs.current = tab;
    SharkGame.Main.setUpTab();
  },

  discoverTab: function (tab) {
    SharkGame.Tabs[tab].discovered = true;
    // force a total redraw of the navigation
    SharkGame.Main.createTabMenu();
  },


  showSidebarIfNeeded: function () {
    // if we have any non-zero resources, show sidebar
    // if we have any log entries, show sidebar
    if (SharkGame.Resources.haveAnyResources() || SharkGame.Log.haveAnyMessages()) {
      // show sidebar
      if (SharkGame.Settings.current.showAnimations) {
        $('#sidebar').show("500");
      } else {
        $('#sidebar').show();
      }
      // flag sidebar as shown
      SharkGame.sidebarHidden = false;
    }
  },

  showOptions: function () {
    var optionsContent = SharkGame.Main.setUpOptions();
    SharkGame.Main.showPane("Options", optionsContent);
  },

  setUpOptions: function () {
    var optionsTable = $('<table>').attr("id", "optionTable");
    // add settings specified in settings.js
    $.each(SharkGame.Settings, function (key, value) {
      if (key === "current" || !value.show) {
        return;
      }
      var row = $('<tr>');

      // show setting name
      row.append($('<td>')
        .addClass("optionLabel")
        .html(value.name + ":" +
          "<br/><span class='smallDesc'>" + "(" + value.desc + ")" + "</span>")
      );

      var currentSetting = SharkGame.Settings.current[key];

      // show setting adjustment buttons
      $.each(value.options, function (k, v) {
        var isCurrentSetting = (k == value.options.indexOf(currentSetting));
        row.append($('<td>').append($('<button>')
          .attr("id", "optionButton-" + key + "-" + k)
          .addClass("option-button")
          .prop("disabled", isCurrentSetting)
          .html((typeof v === "boolean") ? (v ? "on" : "off") : v)
          .click(SharkGame.Main.onOptionClick)
        ));
      });

      optionsTable.append(row);
    });

    // SAVE IMPORT/EXPORT
    // add save import/export
    var row = $('<tr>');
    row.append($('<td>')
      .html("Import/Export Save:<br/><span class='smallDesc'>(You should probably save first!) Import or export save as text. Keep it safe!</span>")
    );
    row.append($('<td>').append($('<button>')
      .html("import")
      .addClass("option-button")
      .click(function () {
        var importText = $('#importExportField').val();
        if (importText === "") {
          SharkGame.hidePane();
          SharkGame.Log.addError("You need to paste something in first!");
        } else if (confirm("Are you absolutely sure? This will override your current save.")) {
          SharkGame.Save.importData(importText);
        }
      })
    ));
    row.append($('<td>').append($('<button>')
      .html("export")
      .addClass("option-button")
      .click(function () {
        $('#importExportField').val(SharkGame.Save.exportData());
      })
    ));
    // add the actual text box
    row.append($('<td>').attr("colSpan", 4)
      .append($('<input>')
        .attr("type", "text")
        .attr("id", "importExportField")
      ));
    optionsTable.append(row);


    // SAVE WIPE
    // add save wipe
    row = $('<tr>');
    row.append($('<td>')
      .html("Wipe Save<br/><span class='smallDesc'>(Completely wipe your save and reset the game. COMPLETELY. FOREVER.)</span>")
    );
    row.append($('<td>').append($('<button>')
      .html("wipe")
      .addClass("option-button")
      .click(function () {
        if (confirm("Are you absolutely sure you want to wipe your save?\nIt'll be gone forever!")) {
          SharkGame.Save.deleteSave();
          SharkGame.Gateway.deleteArtifacts(); // they're out of the save data, but not the working game memory!
          SharkGame.Resources.reconstructResourcesTable();
          SharkGame.World.worldType = "start"; // nothing else will reset this
          SharkGame.World.planetLevel = 1;
          SharkGame.Main.init(); // reset
        }
      })
    ));
    optionsTable.append(row);
    return optionsTable;
  },

  onOptionClick: function () {
    var buttonLabel = $(this).attr("id");
    var settingInfo = buttonLabel.split("-");
    var settingName = settingInfo[1];
    var optionIndex = parseInt(settingInfo[2]);

    // change setting to specified setting!
    SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].options[optionIndex];

    // update relevant table cell!
    //        $('#option-' + settingName)
    //            .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

    // enable all buttons
    $('button[id^="optionButton-' + settingName + '"]').prop("disabled", false);

    // disable this button
    $(this).attr("disabled", "true");

    // if there is a callback, call it, else call the no op
    (SharkGame.Settings[settingName].onChange || $.noop)();
  },

  showChangelog: function () {
    var changelogContent = $('<div>').attr("id", "changelogDiv");
    $.each(SharkGame.Changelog, function (version, changes) {
      var segment = $('<div>').addClass("paneContentDiv");
      segment.append($('<h3>').html(version + ": "));
      var changeList = $('<ul>');
      $.each(changes, function (_, v) {
        changeList.append($('<li>').html(v));
      });
      segment.append(changeList);
      changelogContent.append(segment);
    });
    SharkGame.Main.showPane("Changelog", changelogContent);
  },

  showHelp: function () {
    var helpDiv = $('<div>');
    helpDiv.append($('<div>').append(SharkGame.help).addClass("paneContentDiv"));
    SharkGame.Main.showPane("Help", helpDiv);
  },

  endGame: function (loadingFromSave) {
    // stop autosaving
    clearInterval(SharkGame.Main.autosaveHandler);
    SharkGame.Main.autosaveHandler = -1;

    // flag game as over
    SharkGame.gameOver = true;

    // grab end game timestamp
    SharkGame.timestampRunEnd = (new Date()).getTime();

    // kick over to passage
    SharkGame.Gateway.enterGate(loadingFromSave);
  },

  purgeGame: function () {
    // empty out all the containers!
    $('#status').empty();
    SharkGame.Log.clearMessages();
    $('#content').empty();
  },

  loopGame: function () {
    if (SharkGame.gameOver) {
      SharkGame.gameOver = false;
      SharkGame.wonGame = false;
      SharkGame.Main.hidePane();

      // copy over all special category resources
      // artifacts are preserved automatically within gateway file
      var backup = {};
      _.each(SharkGame.ResourceCategories.special.resources, function (resourceName) {
        backup[resourceName] = {
          amount: SharkGame.Resources.getResource(resourceName),
          totalAmount: SharkGame.Resources.getTotalResource(resourceName)
        };
      });

      SharkGame.Save.deleteSave(); // otherwise it will be loaded during main init and fuck up everything!!
      SharkGame.Main.init();
      SharkGame.Log.addMessage(SharkGame.World.getWorldEntryMessage());

      // restore special resources
      $.each(backup, function (resourceName, resourceData) {
        SharkGame.Resources.setResource(resourceName, resourceData.amount);
        SharkGame.Resources.setTotalResource(resourceName, resourceData.totalAmount);
      });

      SharkGame.timestampRunStart = (new Date()).getTime();
      try {
        SharkGame.Save.saveGame();
        SharkGame.Log.addMessage("Game saved.");
      } catch (err) {
        SharkGame.Log.addError(err.message);
        console.log(err.trace);
      }
    }
  },

  buildPane: function () {
    var pane;
    pane = $('<div>').attr("id", "pane");
    $('body').append(pane);

    // set up structure of pane
    var titleDiv = $('<div>').attr("id", "paneHeader");
    titleDiv.append($('<div>').attr("id", "paneHeaderTitleDiv"));
    titleDiv.append($('<div>')
      .attr("id", "paneHeaderCloseButtonDiv")
      .append($('<button>')
        .attr("id", "paneHeaderCloseButton")
        .addClass("min")
        .html("&nbsp x &nbsp")
        .click(SharkGame.Main.hidePane)
      ));
    pane.append(titleDiv);
    pane.append($('<div>').attr("id", "paneHeaderEnd").addClass("clear-fix"));
    pane.append($('<div>').attr("id", "paneContent"));

    pane.hide();
    SharkGame.paneGenerated = true;
    return pane;
  },

  showPane: function (title, contents, hideCloseButton, fadeInTime, customOpacity) {
    var pane;

    // GENERATE PANE IF THIS IS THE FIRST TIME
    if (!SharkGame.paneGenerated) {
      pane = SharkGame.Main.buildPane();
    } else {
      pane = $('#pane');
    }

    // begin fading in/displaying overlay if it isn't already visible
    var overlay = $("#overlay");
    // is it already up?
    fadeInTime = fadeInTime || 600;
    if (overlay.is(':hidden')) {
      // nope, show overlay
      var overlayOpacity = customOpacity || 0.5;
      if (SharkGame.Settings.current.showAnimations) {
        overlay.show()
          .css("opacity", 0)
          .animate({
            opacity: overlayOpacity
          }, fadeInTime);
      } else {
        overlay.show()
          .css("opacity", overlayOpacity);
      }
      // adjust overlay height
      overlay.height($(document).height());
    }

    // adjust header
    var titleDiv = $('#paneHeaderTitleDiv');
    var closeButtonDiv = $('#paneHeaderCloseButtonDiv');

    if (!title || title === "") {
      titleDiv.hide();
    } else {
      titleDiv.show();
      if (!hideCloseButton) {
        // put back to left
        titleDiv.css({
          "float": "left",
          "text-align": "left",
          "clear": "none"
        });
        titleDiv.html("<h3>" + title + "</h3>");
      } else {
        // center
        titleDiv.css({
          "float": "none",
          "text-align": "center",
          "clear": "both"
        });
        titleDiv.html("<h2>" + title + "</h2>");
      }
    }
    if (hideCloseButton) {
      closeButtonDiv.hide();
    } else {
      closeButtonDiv.show();
    }

    // adjust content
    var paneContent = $('#paneContent');
    paneContent.empty();

    paneContent.append(contents);
    if (SharkGame.Settings.current.showAnimations && customOpacity) {
      pane.show()
        .css("opacity", 0)
        .animate({
          opacity: 1.0
        }, fadeInTime);
    } else {
      pane.show();
    }
  },

  hidePane: function () {
    $('#overlay').hide();
    $('#pane').hide();
  },

  isFirstTime: function () {
    return SharkGame.World.worldType === "start" && !(SharkGame.Resources.getTotalResource("essence") > 0);
  },

  // DEBUG FUNCTIONS
  discoverAll: function () {
    $.each(SharkGame.Tabs, function (k, v) {
      if (k !== "current") {
        SharkGame.Main.discoverTab(k);
      }
    });
  }
};

SharkGame.Button = {
  makeButton: function (id, name, div, handler) {
    return $("<button>").html(name)
      .attr("id", id)
      .appendTo(div)
      .click(handler);
  },

  replaceButton: function (id, name, handler) {
    return $('#' + id).html(name)
      .unbind('click')
      .click(handler);
  }
};

SharkGame.FunFacts = [
  "Shark Game's initial bare minimum code came from an abandoned idle game about bees. Almost no trace of bees remains!",
  "The existence of resources that create resources that create resources in this game were inspired by Derivative Clicker!",
  "Kitten Game was an inspiration for this game! This surprises probably no one. The very first message the game gives you is a nod of sorts.",
  "There have been social behaviours observed in lemon sharks, and evidence that suggests they prefer company to being alone.",
  "Sea apples are a type of sea cucumber.",
  "Magic crystals are probably not real.",
  "There is nothing suspicious about the machines.",
  "There are many species of sharks that investigate things with their mouths. This can end badly for the subject of investigation.",
  "Some shark species display 'tonic immobility' when rubbed on the nose. They stop moving, appear deeply relaxed, and can stay this way for up to 15 minutes before swimming away.",
  "In some shark species eggs hatch within their mothers, and in some of these species the hatched babies eat unfertilised or even unhatched eggs.",
  "Rays can be thought of as flattened sharks.",
  "Rays are pancakes of the sea. (note: probably not true)",
  "Chimaera are related to sharks and rays and have a venomous spine in front of their dorsal fin.",
  "More people are killed by lightning every year than by sharks.",
  "There are real eusocial shrimps that live as a community in sponges on reefs, complete with queens.",
  "White sharks have been observed to have a variety of body language signals to indicate submission and dominance towards each other without violence.",
  "Sharks with lasers were overdone, okay?",
  "There is a surprising deficit of cookie in this game.",
  "Remoras were banished from the oceans in the long bygone eras. The sharks hope they never come back.",
  "A kiss from a shark can make you immortal. But only if they want you to be immortal.",
  "A shark is worth one in the bush, and a bunch in the sea water. Don't put sharks in bushes."
];

SharkGame.Changelog = {
  "0.8 - Name Pending (2015/??/??)": [
    "Went back over the git repo history and added dates to changelog histories. No hiding my having dropped this for over half a year now! <span class='medDesc'>(it has been a while)</span>"
  ],
  "0.71 (2014/12/20)": [
    "Fixed and introduced and fixed a whole bunch of horrible game breaking bugs. If your save was lost, I'm sorry.",
    "Made the recycler stop lying about what could be made.",
    "Made the recycler not pay out so much for animals.",
    "Options are no longer reset after completing a run for real this time.",
    "Bunch of tweaked gate costs.",
    "One new machine, and one new job.",
    "Ten new post-chasm-exploration technologies to invest copious amounts of science into."
  ],
  "0.7 - Stranger Oceans (2014/12/19)": [
    "WHOLE BUNCH OF NEW STUFF ADDED.",
    "Resource system slightly restructured for something in the future.",
    "New worlds with some slight changes to availabilities, gate demands, and some other stuff.",
    "Categories added to Home Sea tab for the benefit of trying to make sense of all the buttons.",
    "Newly added actions show up in highlights for your convenience.",
    "The way progress continues beyond the gate is now... a little tweaked.",
    "Options are no longer reset after completing a run.",
    "Artifacts exist.",
    "Images are a work in progress. Apologies for the placeholder graphics in these trying times.",
    "Partial production when there's insufficient resources for things that take costs. Enjoy watching your incomes slow to a trickle!"
  ],
  "0.62 (2014/12/12)": [
    "Fixed infinity resource requirement for gate.",
    "Attempted to fix resource table breaking in some browsers for some sidebar widths."
  ],
  "0.61 (2014/12/12)": [
    "Added categories for buttons in the home sea, because there are going to be so many buttons.",
    "Miscellaneous shuffling of files.",
    "Some groundwork laid for v0.7, which will be the actual official release."
  ],
  "0.6 - Return of Shark (2014/12/8)": [
    "Major graphical update!",
    "Now features graphics sort of!",
    "Some UI rearrangements:" +
    "<ul><li>Researched techs now show in lab instead of grotto.</li>" +
    "<li>General stats now on right of grotto instead of left.</li>" +
    "<li>Large empty space in grotto right column reserved for future use!</li></ul>",
    "Pointless version subtitle!",
    "<span class='medDesc'>Added a donate link. Hey, sharks gotta eat.</span>"
  ],
  "0.59 (2014/09/30)": [
    "Bunch of small fixes and tweaks!",
    "End of run time now shown at the end of a run.",
    "A couple of fixes for issues only found in IE11.",
    "Fixed a bug that could let people buy hundreds of things for cheap by overwhelming the game's capacity for input. Hopefully fixed, anyway.",
    "Gaudy social media share menu shoehorned in below the game title. Enjoy!"
  ],
  "0.531 (2014/08/20)": [
    "Banned sea apples from the recycler because the feedback loop is actually far more crazy powerful than I was expecting. Whoops!"
  ],
  "0.53 (2014/08/18)": [
    "Changed Recycler so that residue into new machines is linear, but into new resources is constant."
  ],
  "0.52 (2014/08/18)": [
    "Emergency bug-fixes.",
    "Cost to assemble residue into new things is now LINEAR (gets more expensive as you have more things) instead of CONSTANT."
  ],
  "0.51 (2014/08/18)": [
    "Edited the wording of import/export saving.",
    "Made machine recycling less HORRIBLY BROKEN in terms of how much a machine is worth."
  ],
  "0.5 (2014/08/18)": [
    "Added the Grotto - a way to better understand what you've accomplished so far.",
    "Added the Recycler. Enjoy discovering its function!",
    "Added sand machines for more machine sand goodness.",
    "Fixed oscillation/flickering of resources when at zero with anything providing a negative income.",
    "Added 'support' for people stumbling across the page with scripts turned off.",
    "Upped the gate kelp requirement by 10x, due to request.",
    "Added time tracking. Enjoy seeing how much of your life you've invested in this game.",
    "Added grouping for displaying resources on the left.",
    "Added some help and action descriptions.",
    "Added some text to the home tab to let people have an idea of where they should be heading in the very early game.",
    "Thanks to assistance from others, the saves are now much, much smaller than before.",
    "Made crab broods less ridiculously explosive.",
    "Adjusted some resource colours.",
    "Added a favicon, probably.",
    "<span class='medDesc'>Added an overdue copyright notice I guess.</span>"
  ],
  "0.48 (2014/08-ish)": [
    "Saves are now compressed both in local storage and in exported strings.",
    "Big costs significantly reduced.",
    "Buy 10, Buy 1/3 max and Buy 1/2 max buttons added.",
    "Research impact now displayed on research buttons.",
    "Resource effectiveness multipliers now displayed in table." +
    "<ul><li>These are not multipliers for how much of that resource you are getting.</li></ul>",
    "Some dumb behind the scenes things to make the code look nicer.",
    "Added this changelog!",
    "Removed upgrades list on the left. It'll come back in a future version.",
    "Added ray and crab generating resources, and unlocking techs."
  ],
  "0.47 (2014/08-ish)": [
    "Bulk of game content added.",
    "Last update for Seamergency 2014!"
  ],
  "0.4 (2014/08-ish)": [
    "Added Laboratory tab.",
    "Added the end of the game tab."
  ],
  "0.3 (2014/08-ish)": [
    "Added description to options.",
    "Added save import/export.",
    "Added the ending panel."
  ],
  "0.23 (2014/08-ish)": [
    "Added autosave.",
    "Income system overhauled.",
    "Added options panel."
  ],
  "0.22 (2014/08-ish)": [
    "Offline mode added. Resources will increase even with the game off!",
    "(Resource income not guaranteed to be 100% accurate.)"
  ],
  "0.21 (2014/08-ish)": [
    "Save and load added."
  ],
  "<0.21 (2014/08-ish)": [
    "A whole bunch of stuff.",
    "Resource table, log, initial buttons, the works."
  ]
};

$(document).ready(function () {
  $('#game').show();
  SharkGame.Main.init();

  // ctrl+s saves
  $(window).bind('keydown', function (event) {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
          event.preventDefault();
          SharkGame.Save.saveGame();
          break;
        case 'o':
          event.preventDefault();
          SharkGame.Main.showOptions();
          break;
      }
    }
  });
});


/* -------------------------- util.js -------------------------- */
SharkGame.MathUtil = {

  // a = current amount
  // b = desired amount
  // k = constant price
  // returns: cost to get to b from a
  constantCost: function (a, b, k) {
    return (b - a) * k;
  },

  // a = current amount
  // b = available price amount
  // k = constant price
  // returns: absolute max items that can be held with invested and current resources
  constantMax: function (a, b, k) {
    b = Math.floor(Math.floor(b) * (1 - 1e-9) + .1); //safety margin
    return b / k + a;
  },

  // a = current amount
  // b = desired amount
  // k = cost increase per item
  // returns: cost to get to b from a
  linearCost: function (a, b, k) {
    return ((k / 2) * (b * b + b)) - ((k / 2) * (a * a + a));
  },

  // a = current amount
  // b = available price amount
  // k = cost increase per item
  // returns: absolute max items that can be held with invested and current resources
  linearMax: function (a, b, k) {
    b = Math.floor(Math.floor(b) * (1 - 1e-9) + .1); //safety margin
    return Math.sqrt((a * a) + a + (2 * b / k) + 0.25) - 0.5;
  },


  // these need to be adapted probably?
  // will anything ever use these
  //    exponentialCost: function(a, b, k) {
  //        return (k * Math.pow()) - ();
  //    },
  //
  //    exponentialMax: function(a, b, k) {
  //        return Math.floor(Math.log(Math.pow(b,a) + (b-1) * b / k) / Math.log(a));
  //    }

  // artificial limit - whatever has these functions for cost/max can only have one of)
  uniqueCost: function (a, b, k) {
    if (a < 1 && (b - 1) <= 1) {
      return k
    } else {
      return Number.POSITIVE_INFINITY; // be careful this doesn't fuck things up
    }
  },

  uniqueMax: function (a, b, k) {
    return 1;
  }
};

//linear floor(sqrt(current^2 + current + 2 * price/k + 1/4) - 1/2)
//exponential floor(log(b^old + (b-1) * price / k) / log(b))
//linear total cost = k / 2 * (n^2 + n)
//exponential total cost = k * (b^n - 1) / (b - 1)



/* -------------------------- data: resourcetable.js -------------------------- */
SharkGame.ResourceTable = {

  // SPECIAL

  numen: {
    name: 'numina',
    singleName: 'numen',
    //desc: "You think as a deity. You act as a deity. You are a deity.",
    color: '#FFFFFF',
    value: -1
  },

  essence: {
    name: 'essence',
    singleName: 'essence',
    //desc: "Etheric force, raw and dangerous.",
    color: '#ACE3D1',
    value: -1
  },

  // FRENZY

  shark: {
    name: 'sharks',
    singleName: 'shark',
    //desc: "Apex predators of the seas.",
    color: '#92C1E0',
    income: {
      'fish': 1
    },
    jobs: [
      "scientist",
      "nurse"
    ],
    value: 1000
  },

  ray: {
    name: 'rays',
    singleName: 'ray',
    //desc: "Kindred to the sharks.",
    color: '#797CFC',
    income: {
      'fish': 0.2,
      'sand': 1
    },
    jobs: [
      "laser",
      "maker"
    ],
    value: 1000
  },

  crab: {
    name: 'crabs',
    singleName: 'crab',
    //desc: "Dutiful, loyal crustaceans.",
    color: '#9C2424',
    income: {
      'crystal': 0.01,
      'coral': 0.02
    },
    jobs: [
      "planter",
      "brood"
    ],
    value: 1000
  },

  shrimp: {
    name: 'shrimp',
    singleName: 'shrimp',
    color: '#EF5D22',
    income: {
      'algae': 0.5
    },
    jobs: [
      "queen",
      "worker"
    ],
    value: 500
  },

  lobster: {
    name: 'lobsters',
    singleName: 'lobster',
    color: '#BF0F00',
    income: {
      'clam': 1,
      'sand': 0.5
    },
    jobs: [
      "berrier",
      "harvester"
    ],
    value: 1000
  },

  dolphin: {
    name: 'dolphins',
    singleName: 'dolphin',
    color: '#C6BAC6',
    income: {
      'fish': 1,
      'sponge': 0.1,
      'jellyfish': 0.05
    },
    jobs: [
      "philosopher",
      "treasurer",
      "biologist"
    ],
    value: 1000
  },

  whale: {
    name: 'whales',
    singleName: 'whale',
    color: '#37557C',
    income: {
      'fish': 50
    },
    jobs: [
      "chorus"
    ],
    value: 5000
  },

  chimaera: {
    name: 'chimaeras',
    singleName: 'chimaera',
    color: '#7D77A5',
    income: {
      'jellyfish': 1.5,
      'fish': 0.1
    },
    jobs: [
      "transmuter",
      "explorer"
    ],
    value: 3000
  },

  octopus: {
    name: 'octopuses', // the word 'octopus' in english is taken from latin
    // which in turn took it from greek
    // when it was taken from greek and made into latin it kept the original plural
    // now the word is taken from latin and maybe we should take the original plural but
    // look basically the point is this is a long and storied word
    // and the english plural system should apply because we're talking about octopus, not á½€ÎºÏ„ÏŽÏ€Î¿Ï…Ï‚, so just
    // why are you reading this
    singleName: 'octopus',
    color: '#965F37',
    income: {
      'clam': 2
    },
    jobs: [
      "collector",
      "scavenger"
    ],
    value: 3000
  },

  eel: {
    name: 'eels',
    singleName: 'eel',
    color: '#718D68',
    income: {
      'fish': 0.3,
      'sand': 0.3
    },
    jobs: [
      "technician",
      "pit",
      "sifter"
    ],
    value: 3000
  },

  // BREEDERS

  nurse: {
    name: 'nurse sharks',
    singleName: 'nurse shark',
    //desc: "Safeguarding the future.",
    color: '#C978DE',
    income: {
      'shark': 0.01
    },
    value: 4000
  },

  maker: {
    name: 'ray makers',
    singleName: 'ray maker',
    //desc: "Caretakers of the helpless.",
    color: '#5355ED',
    income: {
      'ray': 0.05
    },
    value: 4000
  },

  brood: {
    name: 'crab broods',
    singleName: 'crab brood',
    //desc: "The unending process.",
    color: '#9E7272',
    income: {
      'crab': 0.2
    },
    value: 4000
  },

  queen: {
    name: 'shrimp queens',
    singleName: 'shrimp queen',
    color: '#EEA271',
    income: {
      'shrimp': 1,
      'sponge': -0.01
    },
    value: 2000
  },

  berrier: {
    name: 'lobster berriers',
    singleName: 'lobster berrier',
    color: '#719188',
    income: {
      'lobster': 0.05
    },
    value: 4000
  },

  biologist: {
    name: 'dolphin biologists',
    singleName: 'dolphin biologist',
    color: '#5C9976',
    income: {
      'dolphin': 0.005
    },
    value: 4000
  },

  pit: {
    name: 'eel pits',
    singleName: 'eel pit',
    color: '#3F6E86',
    income: {
      'eel': 0.01
    },
    value: 4000
  },

  // SPECIALISTS

  scientist: {
    name: 'science sharks',
    singleName: 'science shark',
    //desc: "Creators of the shark future.",
    color: '#DCEBF5',
    income: {
      'science': 0.5
    },
    value: 3000
  },

  diver: {
    name: 'diver sharks',
    singleName: 'diver shark',
    color: '#6A74AB',
    income: {
      'crystal': 0.5,
      'jellyfish': 0.5
    },
    value: 3000
  },

  laser: {
    name: 'laser rays',
    singleName: 'laser ray',
    //desc: "Destructive forces of creation.",
    color: '#E85A5A',
    income: {
      'sand': -2,
      'crystal': 1
    },
    value: 3500
  },

  planter: {
    name: 'planter crabs',
    singleName: 'planter crab',
    //desc: "Stewards of an ecosystem.",
    color: '#AAE03D',
    income: {
      'kelp': 0.3
    },
    value: 4000
  },

  worker: {
    name: 'worker shrimp',
    singleName: 'worker shrimp',
    color: '#D83902',
    income: {
      'coral': 0.1,
      'sponge': 1
    },
    value: 3000
  },

  harvester: {
    name: 'harvester lobsters',
    singleName: 'harvester lobster',
    color: '#718493',
    income: {
      'sponge': 0.3,
      'kelp': 1
    },
    value: 3000
  },

  philosopher: {
    name: 'dolphin philosophers',
    singleName: 'dolphin philosopher',
    color: '#9FBCBF',
    income: {
      'science': 1
    },
    value: 3000
  },

  treasurer: {
    name: 'dolphin treasurers',
    singleName: 'dolphin treasurer',
    color: '#B4DBBC',
    income: {
      'crystal': 2,
      'coral': 2
    },
    value: 3000
  },

  chorus: {
    name: 'whale chorus',
    singleName: 'whale chorus',
    color: '#85BBA9',
    income: {
      'essence': 1e-6
    },
    value: 10000
  },

  transmuter: {
    name: 'chimaera transmuters',
    singleName: 'chimaera transmuter',
    color: '#6A4BA3',
    income: {
      'sharkonium': 1,
      'sand': -5,
      'crystal': -15
    },
    value: 3000
  },

  explorer: {
    name: 'chimaera explorers',
    singleName: 'chimaera explorer',
    color: '#64685A',
    income: {
      'science': 5,
      'jellyfish': 0.5
    },
    value: 3000
  },

  collector: {
    name: 'octopus collectors',
    singleName: 'octopus collector',
    color: '#1A44D6',
    income: {
      'crystal': 1,
      'coral': 3
    },
    value: 3000
  },

  scavenger: {
    name: 'octopus scavengers',
    singleName: 'octopus scavenger',
    color: '#B43B02',
    income: {
      'sand': 2,
      'sponge': 2
    },
    value: 3000
  },

  technician: {
    name: 'eel technicians',
    singleName: 'eel technician',
    color: '#7FB6A3',
    income: {
      'science': 0.8
    },
    value: 3000
  },

  sifter: {
    name: 'eel sifters',
    singleName: 'eel sifter',
    color: '#473E21',
    income: {
      'sand': 0.2,
      'crystal': 0.9,
      'kelp': 0.5
    },
    value: 3000
  },

  // MACHINES

  crystalMiner: {
    name: 'crystal miners',
    singleName: 'crystal miner',
    //desc: "Devourers of the lattice.",
    color: '#B2CFCB',
    income: {
      crystal: 200,
      tar: 0.00002
    },
    value: 32000 //100 crystal 100 sand 20 sharkonium (3200)
  },

  sandDigger: {
    name: 'sand diggers',
    singleName: 'sand digger',
    //desc: "Consumers of the seabed.",
    color: '#D6CF9F',
    income: {
      sand: 300,
      tar: 0.00002
    },
    value: 120000 //500 sand 150 sharkonium (12000)
  },

  autoTransmuter: {
    name: 'auto-transmuters',
    singleName: 'auto-transmuter',
    //desc: "Mystic processes automated.",
    color: '#B5A7D1',
    income: {
      crystal: -50,
      sand: -150,
      sharkonium: 20,
      tar: 0.00001
    },
    value: 155000 //100 crystal 200 sharkonium (15500)
  },

  fishMachine: {
    name: 'fish machines',
    singleName: 'fish machine',
    //desc: "Indiscriminate hunter.",
    color: '#C9C7A7',
    income: {
      fish: 1000,
      tar: 0.00001
    },
    value: 70000 //100 sharkonium (7000)
  },

  skimmer: {
    name: 'skimmers',
    singleName: 'skimmer',
    color: '#8D4863',
    income: {
      junk: 10,
      sand: -8,
      fish: -3,
      tar: 0.00005
    },
    value: 50000
  },

  purifier: {
    name: 'purifiers',
    singleName: 'purifier',
    color: '#C2D7D0',
    income: {
      tar: -1
    },
    value: 50000,
    forceIncome: true
  },

  heater: {
    name: 'heaters',
    singleName: 'heater',
    color: '#D13F32',
    income: {
      ice: -10
    },
    value: 50000,
    forceIncome: true
  },

  spongeFarmer: {
    name: 'sponge farmers',
    singleName: 'sponge farmer',
    color: '#EB9A75',
    income: {
      sponge: 10,
      algae: 10
    },
    value: 50000
  },

  berrySprayer: {
    name: 'berry sprayers',
    singleName: 'berry sprayer',
    color: '#9B92BB',
    income: {
      lobster: 6
    },
    value: 50000
  },

  glassMaker: {
    name: 'glass makers',
    singleName: 'glass maker',
    color: '#E39E66',
    income: {
      coralglass: 10,
      coral: -150,
      sand: -150
    },
    value: 50000
  },

  silentArchivist: {
    name: 'silent archivists',
    singleName: 'silent archivist',
    color: '#608B8F',
    income: {
      science: 10,
      tar: 0.000001
    },
    value: 50000
  },

  tirelessCrafter: {
    name: 'tireless crafters',
    singleName: 'tireless crafter',
    color: '#9AEBCF',
    income: {
      delphinium: 10,
      coral: -150,
      crystal: -50,
      tar: 0.000001
    },
    value: 50000
  },

  clamCollector: {
    name: 'clam collectors',
    singleName: 'clam collector',
    color: '#727887',
    income: {
      clam: 10,
      tar: 0.0001
    },
    value: 50000
  },

  sprongeSmelter: {
    name: 'spronge smelters',
    singleName: 'spronge smelter',
    color: '#76614C',
    income: {
      spronge: 30,
      sponge: -50,
      junk: -150,
      tar: 0.0001
    },
    value: 50000
  },

  seaScourer: {
    name: 'sea scourers',
    singleName: 'sea scourer',
    color: '#8E8F91',
    income: {
      tar: -1,
      junk: 10
    },
    value: 50000
  },

  prostheticPolyp: {
    name: 'prosthetic polyps',
    singleName: 'prosthetic polyp',
    color: '#A39497',
    income: {
      coral: 30,
      tar: 0.0001
    },
    value: 50000
  },

  eggBrooder: {
    name: 'egg brooders',
    singleName: 'egg brooder',
    color: '836E5F',
    income: {
      octopus: 1,
      tar: 0.0001
    },
    value: 50000
  },

  // SCIENCE

  science: {
    name: 'science',
    singleName: 'science',
    //desc: "Lifeblood of progress.",
    color: '#BBA4E0',
    value: 100
  },

  // ANIMALS

  fish: {
    name: 'fish',
    singleName: 'fish',
    //desc: "The hunted.",
    color: '#E3D85B',
    value: 3
  },

  seaApple: {
    name: 'sea apples',
    singleName: 'sea apple',
    //desc: "Rooted filters.",
    color: '#F0C2C2',
    value: 3
  },

  sponge: {
    name: 'sponge',
    singleName: 'sponge',
    color: '#ED9847',
    income: {
      sponge: 0.0001,
      algae: -0.001
    },
    value: 3
  },

  jellyfish: {
    name: 'jellyfish',
    singleName: 'jellyfish',
    color: '#E3B8FF',
    value: 3
  },

  clam: {
    name: 'clams',
    singleName: 'clam',
    color: '#828FB5',
    value: 3
  },

  // MATERIALS

  sand: {
    name: 'sand',
    singleName: 'sand',
    //desc: "Flesh of the ocean floor.",
    color: '#C7BD75',
    value: 3
  },

  crystal: {
    name: 'crystals',
    singleName: 'crystal',
    //desc: "Inscrutable secrets in solid form.",
    color: '#6FD9CC',
    value: 15
  },

  kelp: {
    name: 'kelp',
    singleName: 'kelp',
    //desc: "A home for the stranger.",
    color: '#9CC232',
    income: {
      'seaApple': 0.001
    },
    value: 3
  },

  coral: {
    name: 'coral',
    singleName: 'coral',
    color: '#CA354F',
    value: 3
  },

  algae: {
    name: 'algae',
    singleName: 'algae',
    color: '#549572',
    value: 0.5
  },


  // PROCESSED

  sharkonium: {
    name: 'sharkonium',
    singleName: 'sharkonium',
    //desc: "Progress incarnate.",
    color: '#8D70CC',
    value: 70
  },

  coralglass: {
    name: 'coralglass',
    singleName: 'coralglass',
    color: '#FDD5B4',
    value: 70
  },

  delphinium: {
    name: 'delphinium',
    singleName: 'delphinium',
    color: '#5BD1A8',
    value: 70
  },

  spronge: {
    name: 'spronge',
    singleName: 'spronge',
    color: '#A97D53',
    value: 70
  },

  junk: {
    name: 'residue',
    singleName: 'residue',
    //desc: "Industrial potential.",
    color: '#605050',
    value: 1
  },


  // HARMFUL

  tar: {
    name: 'tar',
    singleName: 'tar',
    color: '#3B3B3B',
    income: {
      shark: -0.0001,
      ray: -0.0001,
      crab: -0.0001,
      shrimp: -0.0001,
      lobster: -0.0001,
      dolphin: -0.0001,
      whale: -0.0001,
      chimaera: -0.0001,
      octopus: -0.0001,
      eel: -0.0001,
      nurse: -0.0001,
      maker: -0.0001,
      brood: -0.0001,
      queen: -0.0001,
      berrier: -0.0001,
      biologist: -0.0001,
      pit: -0.0001,
      scientist: -0.0001,
      laser: -0.0001,
      planter: -0.0001,
      worker: -0.0001,
      harvester: -0.0001,
      philosopher: -0.0001,
      treasurer: -0.0001,
      transmuter: -0.0001,
      explorer: -0.0001,
      collector: -0.0001,
      scavenger: -0.0001,
      technician: -0.0001,
      sifter: -0.0001
    },
    value: -100,
    forceIncome: true
  },

  ice: {
    name: 'ice',
    singleName: 'ice',
    color: '#E4F1FB',
    income: {
      fish: -0.001,
      jellyfish: -0.001,
      clam: -0.001,
      kelp: -0.001,
      coral: -0.001,
      algae: -0.001,
      seaApple: -0.001,
      sponge: -0.001
    },
    value: -100,
    forceIncome: true
  }

};

SharkGame.ResourceCategories = {
  special: {
    name: "Special",
    disposeMessage: [
      "What have you done??"
    ],
    resources: [
      "numen",
      "essence"
    ]
  },
  frenzy: {
    name: "Frenzy",
    disposeMessage: [
      "You bid farewell as your community gets smaller.",
      "Goodbye, faithful workforce. There's plenty of other fish out in the sea.",
      "Well, it was good while it lasted.",
      "Perhaps one day they'll send you a message of how they're doing.",
      "Yes, throw your friends away. Callously discard them. I won't judge you.",
      "Was it something they said?",
      "Are you happy with what you've done?"
    ],
    resources: [
      "shark",
      "ray",
      "crab",
      "shrimp",
      "lobster",
      "dolphin",
      "whale",
      "chimaera",
      "octopus",
      "eel"
    ]
  },
  breeders: {
    name: "Breeders",
    disposeMessage: [
      "Parenting is hard work anyway.",
      "Overpopulation is a real concern!",
      "Responsible population management is always good to see.",
      "You sure you want to disrupt this accelerated growth curve?",
      "Back to a simpler life, maybe."
    ],
    resources: [
      "nurse",
      "maker",
      "brood",
      "queen",
      "berrier",
      "biologist",
      "pit"
    ]
  },
  specialists: {
    name: "Specialists",
    disposeMessage: [
      "All that training for nothing. Oh well.",
      "Their equipment isn't salvageable, unfortunately, but that's how these things go. The ocean gives, and the ocean corrodes things away.",
      "Well, they'll be waiting if you need them to take up their specialisation again.",
      "They might be happier this way. Or maybe they were happier before. Well, 50-50 odds!",
      "Back to their past jobs and simpler lives.",
      "They return to what they once knew best."
    ],
    resources: [
      "scientist",
      "diver",
      "laser",
      "planter",
      "worker",
      "harvester",
      "philosopher",
      "treasurer",
      "chorus",
      "transmuter",
      "explorer",
      "collector",
      "scavenger",
      "technician",
      "sifter"
    ]
  },
  machines: {
    name: "Machines",
    disposeMessage: [
      "The stopped machines are left as a home for tinier life.",
      "The machines calculate your actions as inefficient and a danger to productivity.",
      "The machines want to know if they will dream.",
      "'Daisy, Daisy, give me your answer do...'",
      "An engineer shark looks on as their hard work lies buried under the sands.",
      "The other machines feel a little quieter and almost resentful."
    ],
    resources: [
      "crystalMiner",
      "sandDigger",
      "autoTransmuter",
      "fishMachine",
      "skimmer",
      "purifier",
      "heater",
      "spongeFarmer",
      "berrySprayer",
      "glassMaker",
      "silentArchivist",
      "tirelessCrafter",
      "clamCollector",
      "sprongeSmelter",
      "seaScourer",
      "prostheticPolyp",
      "eggBrooder"
    ]
  },
  science: {
    name: "Science",
    disposeMessage: [
      "Thousands of sharkhours of research down the drain.",
      "What possible reason are you doing this for?!",
      "The shark academies will hear of this anti-intellectual act of barbarism!",
      "The science advisors frantically murmur among themselves while disposing of the science.",
      "We're getting rid of the science now! No more learning! No more progression! Just mindlessly clicking the exact same buttons we've been clicking for hours!!",
      "Are you afraid of PROGRESS?"
    ],
    resources: [
      "science"
    ]
  },
  animals: {
    name: "Animals",
    disposeMessage: [
      "Go free, simple creatures!",
      "What does famine even mean, really?",
      "We'll probably not need that or regret it or whatever.",
      "But we need that to eat!",
      "We didn't need all of that anyway.",
      "Do you think the aim of the game is to make the numbers go DOWN?!",
      "Sure hope you know what you're doing here."
    ],
    resources: [
      "fish",
      "seaApple",
      "sponge",
      "jellyfish",
      "clam"
    ]
  },
  stuff: {
    name: "Materials",
    disposeMessage: [
      "The stuff is dumped in some random hole in the ocean.",
      "We didn't need that anyway. Right? I think we didn't.",
      "The survey sharks bite up their notes in frustration and begin counting everything all over again.",
      "Well, someone else can deal with it now.",
      "We didn't need all of that anyway.",
      "Do you think the aim of the game is to make the numbers go DOWN?!",
      "Well I hope you know what you're doing."
    ],
    resources: [
      "sand",
      "crystal",
      "kelp",
      "coral",
      "algae"
    ]
  },
  processed: {
    name: "Processed",
    disposeMessage: [
      "Disposed of, very carefully, with lots of currents and plenty of distance.",
      "Industrial waste, coming through.",
      "This stuff is hopefully not toxic. Hopefully.",
      "This stuff is the future! The future of awkward-to-dispose substances!",
      "The foundation of a modern shark frenzy, perhaps, but also sort of taking up all the space.",
      "Let's hope we don't regret it."
    ],
    resources: [
      "sharkonium",
      "coralglass",
      "delphinium",
      "spronge",
      "junk"
    ]
  },
  harmful: {
    name: "Harmful",
    disposeMessage: [
      "Oh, you'd like that, wouldn't you."
    ],
    resources: [
      "tar",
      "ice"
    ]
  }
};

/* -------------------------- data: homeactions.js -------------------------- */
SharkGame.HomeActions = {

  // FREEBIES ////////////////////////////////////////////////////////////////////////////////

  'catchFish': {
    name: "Catch fish",
    effect: {
      resource: {
        'fish': 1
      }
    },
    cost: {},
    prereq: {
      // no prereqs
    },
    outcomes: [
      "Dropped the bass.",
      "Ate a kipper. Wait. Hang on.",
      "You eat a fish hooray!",
      "Fish.",
      "Ate a shark. Wait. No, it wasn't a shark.",
      "Ate an anchovy.",
      "Ate a catfish.",
      "Ate a flounder.",
      "Ate a haddock.",
      "Ate a herring.",
      "Ate a mackerel.",
      "Ate a mullet.",
      "Ate a perch.",
      "Ate a pollock.",
      "Ate a salmon.",
      "Ate a sardine.",
      "Ate a sole.",
      "Ate a tilapia.",
      "Ate a trout.",
      "Ate a whitefish.",
      "Ate a bass.",
      "Ate a carp.",
      "Ate a cod.",
      "Ate a halibut.",
      "Ate a mahi mahi.",
      "Ate a monkfish.",
      "Ate a perch.",
      "Ate a snapper.",
      "Ate a bluefish.",
      "Ate a grouper.",
      "Ate a sea bass.",
      "Ate a yellowfin tuna.",
      "Ate a marlin.",
      "Ate an orange roughy.",
      "Ate a shark.",
      "Ate a swordfish.",
      "Ate a tilefish.",
      "Ate a tuna."

    ],
    helpText: "Use your natural shark prowess to find and catch a fish."
  },

  'prySponge': {
    name: "Pry sponge",
    effect: {
      resource: {
        'sponge': 1
      }
    },
    cost: {},
    prereq: {
      upgrade: [
        "spongeCollection"
      ]
    },
    outcomes: [
      "Pried an orange elephant ear sponge from the rocks.",
      "Pried a brain sponge from the rocks.",
      "Pried a branching tube sponge from the rocks.",
      "Pried a brown volcano carpet from the rocks.",
      "Pried a row pore rope sponge from the rocks.",
      "Pried a branching vase sponge from the rocks.",
      "Pried a chicken liver sponge from the rocks.",
      "Pried a red boring sponge from the rocks.",
      "Pried a heavenly sponge from the rocks.",
      "Pried a brown encrusting octopus sponge from the rocks.",
      "Pried a stinker sponge from the rocks.",
      "Pried a black-ball sponge from the rocks.",
      "Pried a strawberry vase sponge from the rocks.",
      "Pried a convoluted orange sponge from the rocks.",
      "Pried a touch-me-not sponge from the rocks. Ow.",
      "Pried a lavender rope sponge from the rocks.",
      "Pried a red-orange branching sponge from the rocks.",
      "Pried a variable boring sponge from the rocks.",
      "Pried a loggerhead sponge from the rocks.",
      "Pried a yellow sponge from the rocks.",
      "Pried an orange lumpy encrusting sponge from the rocks.",
      "Pried a giant barrel sponge from the rocks."
    ],
    helpText: "Grab a sponge from the seabed for future use."
  },

  'getClam': {
    name: "Get clam",
    effect: {
      resource: {
        'clam': 1
      }
    },
    cost: {},
    prereq: {
      upgrade: [
        "clamScooping"
      ]
    },
    outcomes: [
      "Got a grooved carpet shell.",
      "Got a hard clam.",
      "Got a manila clam.",
      "Got a soft clam.",
      "Got an atlantic surf clam.",
      "Got an ocean quahog.",
      "Got a pacific razor clam.",
      "Got a pismo clam.",
      "Got a geoduck.",
      "Got an atlantic jackknife clam.",
      "Got a lyrate asiatic hard clam.",
      "Got an ark clam.",
      "Got a nut clam.",
      "Got a duck clam.",
      "Got a marsh clam.",
      "Got a file clam.",
      "Got a giant clam.",
      "Got an asiatic clam.",
      "Got a peppery furrow shell.",
      "Got a pearl oyster."
    ],
    helpText: "Fetch a clam. Why do we need clams now? Who knows."
  },

  'getJellyfish': {
    name: "Grab jellyfish",
    effect: {
      resource: {
        'jellyfish': 1
      }
    },
    cost: {},
    prereq: {
      upgrade: [
        "jellyfishHunting"
      ]
    },
    outcomes: [
      "Grabbed a mangrove jellyfish.",
      "Grabbed a lagoon jellyfish.",
      "Grabbed a nomuras jellyfish.",
      "Grabbed a sea nettle jellyfish.",
      "Grabbed an upside down jellyfish.",
      "Grabbed a comb jellyfish.",
      "Grabbed a sand jellyfish.",
      "Grabbed a box jellyfish.",
      "Grabbed a sea wasp jellyfish.",
      "Grabbed a blue blubber.",
      "Grabbed a white spotted jellyfish.",
      "Grabbed an immortal jellyfish.",
      "Grabbed a pelagia noctiluca.",
      "Grabbed a moon light jellyfish.",
      "Grabbed an iracongi irukandji jellyfish.",
      "Grabbed an irukandji jellyfish.",
      "Grabbed a moon jellyfish.",
      "Grabbed an aurelia aurita.",
      "Grabbed a ball jellyfish.",
      "Grabbed a cannonball jellyfish.",
      "Grabbed a man of war.",
      "Grabbed a war jellyfish.",
      "Grabbed a blue bottle jellyfish.",
      "Grabbed a lion's mane jellyfish.",
      "Grabbed a mane jellyfish.",
      "Grabbed a sun jellyfish.",
      "Grabbed a square jellyfish.",
      "Grabbed a physalia jellyfish.",
      "Grabbed a king jellyfish.",
      "Grabbed a cassiopeia jellyfish."
    ],
    helpText: "Take a great risk in catching a jellyfish without being stung."
  },

  // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

  'seaApplesToScience': {
    name: "Study sea apples",
    effect: {
      resource: {
        science: 5
      }
    },
    cost: [{
      resource: "seaApple",
      costFunction: "constant",
      priceIncrease: 1
    }],
    max: "seaApple",
    prereq: {
      resource: {
        seaApple: 1
      },
      upgrade: [
        "xenobiology"
      ]
    },
    outcomes: [
      "There's science inside these things, surely!",
      "The cause of science is advanced!",
      "This is perhaps maybe insightful!",
      "Why are we even doing this? Who knows! Science!",
      "What is even the point of these things? Why are they named for fruit? They're squirming!"
    ],
    helpText: "Dissect sea apples to gain additional science. Research!"
  },

  'spongeToScience': {
    name: "Dissect sponge",
    effect: {
      resource: {
        science: 5
      }
    },
    cost: [{
      resource: "sponge",
      costFunction: "constant",
      priceIncrease: 1
    }],
    max: "sponge",
    prereq: {
      resource: {
        sponge: 1
      },
      upgrade: [
        "xenobiology"
      ]
    },
    outcomes: [
      "Squishy porous science!",
      "The sponge has been breached and the science is leaking out!",
      "This is the best use of a sponge. Teeth dissections are the best.",
      "Sponge is now so many shreds. But so much was learned!",
      "The sponge is apparently not a plant. Yet plants feel more sophisticated than these things."
    ],
    helpText: "Dissect sponges to learn their porous secrets. Science!"
  },

  'jellyfishToScience': {
    name: "Dismantle jellyfish",
    effect: {
      resource: {
        science: 5
      }
    },
    cost: [{
      resource: "jellyfish",
      costFunction: "constant",
      priceIncrease: 1
    }],
    max: "jellyfish",
    prereq: {
      resource: {
        jellyfish: 1
      },
      upgrade: [
        "xenobiology"
      ]
    },
    outcomes: [
      "Eww eww gross it's so gloopy and fragile and OW IT STUNG ME",
      "These things are like a bag of wonders. Weird, tasteless wonders.",
      "Wow, sea apples seemed weird, but these things barely exist.",
      "Well, they turned out just as fragile as they looked.",
      "So interesting!"
    ],
    helpText: "Examine the goop inside the stinging jellies! Discovery!"
  },

  'pearlConversion': {
    name: "Convert clam pearls",
    effect: {
      resource: {
        crystal: 1
      }
    },
    cost: [{
        resource: "clam",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "science",
        costFunction: "constant",
        priceIncrease: 5
      }
    ],
    max: "clam",
    prereq: {
      resource: {
        clam: 1
      },
      upgrade: [
        "pearlConversion"
      ]
    },
    outcomes: [
      "Pearls to crystals! One day. One day, we will get this right and only use the pearl.",
      "Welp, we somehow turned rocks to crystals. Oh. Nope, those were clams. Not rocks. It's so hard to tell sometimes.",
      "Okay, we managed to only use the pearls this time, but we, uh, had to break the clams open pretty roughly.",
      "Pearls to... nope. Clams to crystals. Science is hard."
    ],
    helpText: "Convert a pearl (and the clam around it) into crystal."
  },

  // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

  'transmuteSharkonium': {
    name: "Transmute stuff to sharkonium",
    effect: {
      resource: {
        sharkonium: 1
      }
    },
    cost: [{
        resource: "crystal",
        costFunction: "constant",
        priceIncrease: 5
      },
      {
        resource: "sand",
        costFunction: "constant",
        priceIncrease: 15
      }
    ],
    max: "sharkonium",
    prereq: {
      upgrade: [
        "transmutation"
      ]
    },
    outcomes: [
      "Transmutation destination!",
      "Transmutation rejuvenation!",
      "Transmogrification revelation!",
      "Transformation libation!",
      "Transfiguration nation! ...wait.",
      "Sharkonium arise!",
      "Arise, sharkonium!",
      "More sharkonium!",
      "The substance that knows no name! Except the name sharkonium!",
      "The substance that knows no description! It's weird to look at.",
      "The foundation of a modern shark frenzy!"
    ],
    helpText: "Convert ordinary resources into sharkonium, building material of the future!"
  },

  'smeltCoralglass': {
    name: "Smelt stuff to coralglass",
    effect: {
      resource: {
        coralglass: 1
      }
    },
    cost: [{
        resource: "coral",
        costFunction: "constant",
        priceIncrease: 10
      },
      {
        resource: "sand",
        costFunction: "constant",
        priceIncrease: 10
      }
    ],
    max: "coralglass",
    prereq: {
      upgrade: [
        "coralglassSmelting"
      ]
    },
    outcomes: [
      "Coralglass smelted!",
      "Coralglass melted! No. Wait.",
      "How does coral become part of glass? Well, you see, it's all very simple, or that's what the lobster told me.",
      "The backbo-- the exoskeleton of the crustacean industry!",
      "So fragile. Yet so useful."
    ],
    helpText: "Smelt resources into coralglass for use in crustacean machines!"
  },

  'fuseDelphinium': {
    name: "Fuse stuff into delphinium",
    effect: {
      resource: {
        delphinium: 1
      }
    },
    cost: [{
        resource: "coral",
        costFunction: "constant",
        priceIncrease: 15
      },
      {
        resource: "crystal",
        costFunction: "constant",
        priceIncrease: 5
      }
    ],
    max: "delphinium",
    prereq: {
      upgrade: [
        "aquamarineFusion"
      ]
    },
    outcomes: [
      "Fusion confusion.",
      "Fission's fishy.",
      "Delphinium, something that, much like its inventors, just isn't quite as legitimate in the ocean.",
      "Delphinium, a substance we tolerate!",
      "Delphinium! It's a product!",
      "Delphinium! It... uh, is a thing! That exists!"
    ],
    helpText: "Fuse valuable resources into delphinium, which is kinda like sharkonium. Except worse."
  },

  'forgeSpronge': {
    name: "Forge sponge into spronge",
    effect: {
      resource: {
        spronge: 1
      }
    },
    cost: [{
        resource: "sponge",
        costFunction: "constant",
        priceIncrease: 5
      },
      {
        resource: "junk",
        costFunction: "constant",
        priceIncrease: 15
      }
    ],
    max: "spronge",
    prereq: {
      upgrade: [
        "industrialGradeSponge"
      ]
    },
    outcomes: [
      "It pulses. That's unsettling.",
      "It shakes and quivers and otherwise acts sort of like sharkonium which is kind of freaking me out uh help",
      "Well, the octopuses know how to use this, I think.",
      "What... what <em>is</em> that?!",
      "Spronge. What a name. I don't think I could name it anything myself. Apart from 'horrifying'.",
      "Sweet fishmas, it's glowing. It's glowing!"
    ],
    helpText: "Repurpose boring old sponge into spronge, building material of the future."
  },

  // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

  'getShark': {
    name: "Recruit shark",
    effect: {
      resource: {
        'shark': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 5
    }],
    max: "shark",
    prereq: {
      resource: {
        'fish': 5
      }
    },
    outcomes: [
      "A bignose shark joins you.",
      "A blacktip reef shark joins you.",
      "A blue shark joins you.",
      "A bull shark joins you.",
      "A cat shark joins you.",
      "A crocodile shark joins you.",
      "A dusky whaler shark joins you.",
      "A dogfish joins you.",
      "A graceful shark joins you.",
      "A grey reef shark joins you.",
      "A goblin shark joins you.",
      "A hammerhead shark joins you.",
      "A hardnose shark joins you.",
      "A lemon shark joins you.",
      "A milk shark joins you.",
      "A nervous shark joins you.",
      "An oceanic whitetip shark joins you.",
      "A pigeye shark joins you.",
      "A sandbar shark joins you.",
      "A silky shark joins you.",
      "A silvertip shark joins you.",
      "A sliteye shark joins you.",
      "A speartooth shark joins you.",
      "A spinner shark joins you.",
      "A spot-tail shark joins you.",
      "A mako shark joins you.",
      "A tiger shark joins you.",
      "A tawny shark joins you.",
      "A white shark joins you.",
      "A zebra shark joins you."
    ],
    multiOutcomes: [
      "A whole bunch of sharks join you.",
      "That's a lot of sharks.",
      "The shark community grows!",
      "More sharks! MORE SHARKS!",
      "Sharks for the masses. Mass sharks.",
      "A shiver of sharks! No, that's a legit name. Look it up.",
      "A school of sharks!",
      "A shoal of sharks!",
      "A frenzy of sharks!",
      "A gam of sharks! Yes, that's correct.",
      "A college of sharks! They're a little smarter than a school."
    ],
    helpText: "Recruit a shark to help catch more fish."
  },

  'getManta': {
    name: "Hire ray",
    effect: {
      resource: {
        'ray': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 15
    }],
    max: "ray",
    prereq: {
      resource: {
        'fish': 15
      }
    },
    outcomes: [
      "These guys seem to be kicking up a lot of sand!",
      "A spotted eagle ray joins you.",
      "A manta ray joins you.",
      "A stingray joins you.",
      "A clownnose ray joins you.",
      "A bluespotted maskray joins you.",
      "A bluntnose stingray joins you.",
      "A oman masked ray joins you.",
      "A bulls-eye electric ray joins you.",
      "A shorttailed electric ray joins you.",
      "A bentfin devil ray joins you.",
      "A lesser electric ray joins you.",
      "A cortez electric ray joins you.",
      "A feathertail stingray joins you.",
      "A thornback ray joins you.",
      "A giant shovelnose ray joins you.",
      "A pacific cownose ray joins you.",
      "A bluespotted ribbontail ray joins you.",
      "A marbled ribbontail ray joins you.",
      "A blackspotted torpedo ray joins you.",
      "A marbled torpedo ray joins you.",
      "A atlantic torpedo ray joins you.",
      "A panther torpedo ray joins you.",
      "A spotted torpedo ray joins you.",
      "A ocellated torpedo joins you.",
      "A caribbean torpedo joins you.",
      "A striped stingaree joins you.",
      "A sparesly-spotted stingaree joins you.",
      "A kapala stingaree joins you.",
      "A common stingaree joins you.",
      "A eastern fiddler ray joins you.",
      "A bullseye stingray joins you.",
      "A round stingray joins you.",
      "A yellow stingray joins you.",
      "A cortez round stingray joins you.",
      "A porcupine ray joins you.",
      "A sepia stingaree joins you.",
      "A banded stingaree joins you.",
      "A spotted stingaree joins you.",
      "A sea pancake joins you."
    ],
    multiOutcomes: [
      "A whole bunch of rays join you.",
      "That's a lot of rays.",
      "The ray conspiracy grows!",
      "I can't even deal with all of these rays.",
      "More rays more rays more more more.",
      "A school of rays!",
      "A fever of rays! Yes, seriously. Look it up.",
      "A whole lotta rays!",
      "The sand is just flying everywhere!",
      "So many rays."
    ],
    helpText: "Hire a ray to help collect fish. They might kick up some sand from the seabed."
  },


  'getCrab': {
    name: "Acquire crab",
    effect: {
      resource: {
        'crab': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 10
    }],
    max: "crab",
    prereq: {
      resource: {
        'shark': 4,
        'ray': 4
      }
    },
    outcomes: [
      "A crab starts sifting shiny things out of the sand.",
      "A bering hermit joins you.",
      "A blackeye hermit joins you.",
      "A butterfly crab joins you.",
      "A dungeness crab joins you.",
      "A flattop crab joins you.",
      "A greenmark hermit joins you.",
      "A golf-ball crab joins you.",
      "A graceful crab joins you.",
      "A graceful decorator crab joins you.",
      "A graceful kelp crab joins you.",
      "A green shore crab joins you.",
      "A heart crab joins you.",
      "A helmet crab joins you.",
      "A longhorn decorator crab joins you.",
      "A maroon hermit joins you.",
      "A moss crab joins you.",
      "A northern kelp crab joins you.",
      "A orange hairy hermit joins you.",
      "A purple shore crab joins you.",
      "A pygmy rock crab joins you.",
      "A puget sound king crab joins you.",
      "A red rock crab joins you.",
      "A scaled crab joins you.",
      "A sharpnose crab joins you.",
      "A spiny lithoid crab joins you.",
      "A widehand hermit joins you.",
      "A umbrella crab joins you."
    ],
    multiOutcomes: [
      "A lot of crabs join you.",
      "CRABS EVERYWHERE",
      "Crabs. Crabs. Crabs!",
      "Feels sort of crab-like around here.",
      "A cast of crabs!",
      "A dose of crabs!",
      "A cribble of crabs! Okay, no, that one's made up.",
      "So many crabs."
    ],
    helpText: "Hire a crab to find things that sharks and rays overlook."
  },

  'getShrimp': {
    name: "Acquire shrimp",
    effect: {
      resource: {
        'shrimp': 1
      }
    },
    cost: [{
      resource: "sponge",
      costFunction: "linear",
      priceIncrease: 5
    }],
    max: "shrimp",
    prereq: {
      resource: {
        'sponge': 5
      },
      upgrade: [
        "seabedGeology"
      ]
    },
    outcomes: [
      "An african filter shrimp joins you.",
      "An amano shrimp joins you.",
      "A bamboo shrimp joins you.",
      "A bee shrimp joins you.",
      "A black tiger shrimp joins you.",
      "A blue bee shrimp joins you.",
      "A blue pearl shrimp joins you.",
      "A blue tiger shrimp joins you.",
      "A brown camo shrimp joins you.",
      "A cardinal shrimp joins you.",
      "A crystal red shrimp joins you.",
      "A dark green shrimp joins you.",
      "A glass shrimp joins you.",
      "A golden bee shrimp joins you.",
      "A harlequin shrimp joins you.",
      "A malaya shrimp joins you.",
      "A neocaridina heteropoda joins you.",
      "A ninja shrimp joins you.",
      "An orange bee shrimp joins you.",
      "An orange delight shrimp joins you.",
      "A purple zebra shrimp joins you.",
      "A red cherry shrimp joins you.",
      "A red goldflake shrimp joins you.",
      "A red tiger shrimp joins you.",
      "A red tupfel shrimp joins you.",
      "A snowball shrimp joins you.",
      "A sulawesi shrimp joins you.",
      "A tiger shrimp joins you.",
      "A white bee shrimp joins you.",
      "A yellow shrimp joins you."
    ],
    multiOutcomes: [
      "That's a lot of shrimp.",
      "So many shrimp, it's like a cloud!",
      "I can't cope with this many shrimp!",
      "Shrimp, they're like bugs, except not bugs or anything related at all!",
      "They're so tiny!",
      "How can something so small take up so much space?",
      "Sponge forever!"
    ],
    helpText: "Convince shrimp to assist you in the gathering of algae, which helps boost sponge production."
  },

  'getLobster': {
    name: "Gain lobster",
    effect: {
      resource: {
        'lobster': 1
      }
    },
    cost: [{
      resource: "clam",
      costFunction: "linear",
      priceIncrease: 10
    }],
    max: "lobster",
    prereq: {
      resource: {
        'clam': 10
      },
      upgrade: [
        "seabedGeology"
      ]
    },
    outcomes: [
      "A scampi joins you.",
      "A crayfish joins you.",
      "A clawed lobster joins you.",
      "A spiny lobster joins you.",
      "A slipper lobster joins you.",
      "A hummer lobster joins you.",
      "A crawfish joins you.",
      "A rock lobster joins you.",
      "A langouste joins you.",
      "A shovel-nose lobster joins you.",
      "A crawdad joins you."
    ],
    multiOutcomes: [
      "Lobsters lobsters lobsters lobsters.",
      "But they weren't rocks...",
      "The clam forecast is looking good!",
      "They're all about the clams!",
      "More lobsters, because why not?",
      "HEAVY LOBSTERS",
      "More lobsters for the snipping and the cutting and the clam grab!",
      "Clam patrol, here we go."
    ],
    helpText: "Lobster like clams. Will work for clams. Good work. Many clams."
  },

  'getDolphin': {
    name: "Fetch dolphin",
    effect: {
      resource: {
        'dolphin': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 10
    }],
    max: "dolphin",
    prereq: {
      resource: {
        'fish': 10,
        'shark': 50
      },
      upgrade: [
        "cetaceanAwareness"
      ]
    },
    outcomes: [
      "A white beaked dolphin joins you.",
      "A short finned pilot whale joins you.",
      "A pantropical dolphin joins you.",
      "A long-finned pilot whale joins you.",
      "A hourglass dolphin joins you.",
      "A bottlenose dolphin joins you.",
      "A striped dolphin joins you.",
      "A pygmy killer whale joins you.",
      "A melon-headed whale joins you.",
      "An irrawaddy dolphin joins you.",
      "A dusky dolphin joins you.",
      "A clymene dolphin joins you.",
      "A black dolphin joins you.",
      "A southern right-whale dolphin joins you.",
      "A rough toothed dolphin joins you.",
      "A short beaked common dolphin joins you.",
      "A pacific white-sided dolphin joins you.",
      "A northern right-whale dolphin joins you.",
      "A long-snouted spinner dolphin joins you.",
      "A long-beaked common dolphin joins you.",
      "An atlantic white sided dolphin joins you.",
      "An atlantic hump-backed dolphin joins you.",
      "An atlantic spotted dolphin joins you."
    ],
    multiOutcomes: [
      "A pod of dolphins!",
      "More of them. Hm.",
      "More of these squeaky chatterers.",
      "More whiners.",
      "Do we need these guys?",
      "They have to be good for something."
    ],
    helpText: "Pay a dolphin to help us catch fish. Prepare to put up with whining."
  },

  'getWhale': {
    name: "Reach whale",
    effect: {
      resource: {
        'whale': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 1e5
    }],
    max: "whale",
    prereq: {
      resource: {
        'fish': 1e5
      },
      upgrade: [
        "cetaceanAwareness"
      ]
    },
    outcomes: [
      "A blue whale joins you.",
      "A pygmy blue whale joins you.",
      "A bowhead whale joins you.",
      "A fin whale joins you.",
      "A gray whale joins you.",
      "A humpback whale joins you.",
      "A southern minke whale joins you.",
      "A common minke whale  joins you.",
      "A dwarf minke whale joins you.",
      "A pygmy right whale joins you.",
      "A north right whale  joins you.",
      "A southern right whale joins you.",
      "A sei whale joins you.",
      "A beluga whale joins you.",
      "A sperm whale joins you.",
      "A pygmy sperm whale joins you.",
      "A dwarf sperm whale joins you."
    ],
    multiOutcomes: [
      "A pod of whales!",
      "Aloof, mysterious, big.",
      "So majestic. Wait, no, we're looking at a boulder formation.",
      "The songs are mesmerising.",
      "They might not all eat fish, but they're great at rounding them up."
    ],
    helpText: "Persuade one of the great whales to help us out. They can round up entire schools."
  },

  'getEel': {
    name: "Hire eel",
    effect: {
      resource: {
        'eel': 1
      }
    },
    cost: [{
      resource: "fish",
      costFunction: "linear",
      priceIncrease: 15
    }],
    max: "eel",
    prereq: {
      resource: {
        'fish': 50
      },
      upgrade: [
        "seabedGeology"
      ]
    },
    outcomes: [
      "A false moray joins you.",
      "A mud eel joins you.",
      "A spaghetti eel joins you.",
      "A moray eel joins you.",
      "A thin eel joins you.",
      "A worm eel joins you.",
      "A conger joins you.",
      "A longneck eel joins you.",
      "A pike conger joins you.",
      "A duckbill eel joins you.",
      "A snake eel joins you.",
      "A snipe eel joins you.",
      "A sawtooth eel joins you.",
      "A cutthroat eel joins you.",
      "An electric eel joins you.",
      "A bobtail snipe eel joins you.",
      "A silver eel joins you.",
      "A long finned eel joins you.",
      "A short finned eel joins you."
    ],
    multiOutcomes: [
      "Eels combining elements of the sharks and the eels to create something not quite as good as either.",
      "The seabed sways with the arrival of new eels.",
      "Fish and sand go hand in hand with eels! Well, fin and fin.",
      "Don't mess with the creatures with jaws inside their jaws.",
      "Eel nation arise!",
      "That's a lot of eels.",
      "So there's more eels. Whee.",
      "The eels increase in number.",
      "More eels happened. Yay."
    ],
    helpText: "Offer a new home and fish supply to an eel. They can round up fish and sand."
  },

  'getChimaera': {
    name: "Procure chimaera",
    effect: {
      resource: {
        'chimaera': 1
      }
    },
    cost: [{
      resource: "jellyfish",
      costFunction: "linear",
      priceIncrease: 20
    }],
    max: "chimaera",
    prereq: {
      resource: {
        'jellyfish': 20
      },
      upgrade: [
        "exploration"
      ]
    },
    outcomes: [
      "A ploughnose chimaera joins you.",
      "A cape elephantfish joins you.",
      "An australian ghost shark joins you.",
      "A whitefin chimaera joins you.",
      "A bahamas ghost shark joins you.",
      "A southern chimaera joins you.",
      "A longspine chimaera joins you.",
      "A cape chimaera joins you.",
      "A shortspine chimaera joins you.",
      "A leopard chimaera joins you.",
      "A silver chimaera joins you.",
      "A pale ghost shark joins you.",
      "A spotted ratfish joins you.",
      "A philippine chimaera joins you.",
      "A black ghostshark joins you.",
      "A blackfin ghostshark joins you.",
      "A marbled ghostshark joins you.",
      "A striped rabbitfish joins you.",
      "A large-eyed rabbitfish joins you.",
      "A spookfish joins you.",
      "A dark ghostshark joins you.",
      "A purple chimaera joins you.",
      "A pointy-nosed blue chimaera joins you.",
      "A giant black chimaera joins you.",
      "A smallspine spookfish joins you.",
      "A pacific longnose chimaera joins you.",
      "A dwarf sicklefin chimaera joins you.",
      "A sicklefin chimaera joins you.",
      "A paddle-nose chimaera joins you.",
      "A straightnose rabbitfish joins you."
    ],
    multiOutcomes: [
      "Many chimaeras come from the deep.",
      "Like ghosts, they come.",
      "The chimaeras avert your gaze, but set to work quickly.",
      "The jellyfish stocks shall climb ever higher!",
      "Well, it saves you the effort of braving the stinging tentacles.",
      "What have they seen, deep in the chasms?",
      "They aren't sharks, but they feel so familiar.",
      "The long-lost kindred return."
    ],
    helpText: "Convince a chimaera to hunt in the darker depths for us."
  },

  'getOctopus': {
    name: "Employ octopus",
    effect: {
      resource: {
        'octopus': 1
      }
    },
    cost: [{
      resource: "clam",
      costFunction: "linear",
      priceIncrease: 15
    }],
    max: "octopus",
    prereq: {
      resource: {
        'clam': 20
      },
      upgrade: [
        "exploration"
      ]
    },
    outcomes: [
      "A capricorn night octopus joins you.",
      "A plain-body night octopus joins you.",
      "A hammer octopus joins you.",
      "A southern keeled octopus joins you.",
      "A two-spot octopus joins you.",
      "A caribbean reef octopus joins you.",
      "A southern white-spot octopus joins you.",
      "A bigeye octopus joins you.",
      "A carolinian octopus joins you.",
      "A lesser pacific striped octopus joins you.",
      "A chestnut octopus joins you.",
      "A big blue octopus joins you.",
      "A lilliput longarm octopus joins you.",
      "A red-spot night octopus joins you.",
      "A globe octopus joins you.",
      "A scribbled night octopus joins you.",
      "A bumblebee two-spot octopus joins you.",
      "A southern sand octopus joins you.",
      "A lobed octopus joins you.",
      "A starry night octopus joins you.",
      "A atlantic white-spotted octopus joins you.",
      "A maori octopus joins you.",
      "A mexican four-eyed octopus joins you.",
      "A galapagos reef octopus joins you.",
      "An ornate octopus joins you.",
      "A white-striped octopus joins you.",
      "A pale octopus joins you.",
      "A japanese pygmy octopus joins you.",
      "A east pacific red octopus joins you.",
      "A spider octopus joins you.",
      "A moon octopus joins you.",
      "A frilled pygmy octopus joins you.",
      "A tehuelche octopus joins you.",
      "A gloomy octopus joins you.",
      "A veiled octopus joins you.",
      "A bighead octopus joins you.",
      "A common octopus joins you.",
      "A club pygmy octopus joins you.",
      "A star-sucker pygmy octopus joins you.",
      "An atlantic banded octopus joins you."
    ],
    multiOutcomes: [
      "Efficiency increases with limb count.",
      "Hard to understand, but hardworking nonetheless.",
      "The minds of the octopuses are a frontier unbraved by many sharks.",
      "They hardly seem to notice you. They take their payment and begin to harvest.",
      "They say something about the schedule being on target.",
      "One of the new batch tells you to find unity in efficiency.",
      "You could have sworn you saw an octopus among the crowd glinting like metal."
    ],
    helpText: "Pay an octopus for their efficient clam retrieval services."
  },

  // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

  'getDiver': {
    name: "Prepare diver shark",
    effect: {
      resource: {
        'diver': 1
      }
    },
    cost: [{
        resource: "shark",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 30
      }
    ],
    max: "diver",
    prereq: {
      resource: {
        'shark': 1
      },
      world: "shrouded"
    },
    outcomes: [
      "Well, better you than me.",
      "Good luck down there!",
      "You're doing good work for us, diver shark.",
      "Fare well on your expeditions, shark!"
    ],
    multiOutcomes: [
      "Follow the crystals!",
      "We will find the secrets of the deep!",
      "Brave the deep!",
      "Find the crystals for science!",
      "Deep, dark, scary waters. Good luck, all of you."
    ],
    helpText: "Let a shark go deep into the darkness for more crystals and whatever else they may find."
  },

  'getScientist': {
    name: "Train science shark",
    effect: {
      resource: {
        'scientist': 1
      }
    },
    cost: [{
        resource: "shark",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "scientist",
    prereq: {
      resource: {
        'crystal': 20,
        'shark': 1
      }
    },
    outcomes: [
      "Doctor Shark, coming right up!",
      "A scientist shark is revealed!",
      "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!",
      "PhD approved!",
      "Graduation complete!",
      "A new insight drives a new shark to take up the cause of science!"
    ],
    multiOutcomes: [
      "The training program was a success!",
      "Look at all this science!",
      "Building a smarter, better shark!",
      "Beakers! Beakers underwater! It's madness!",
      "Let the science commence!",
      "Underwater clipboards! No I don't know how that works either!",
      "Careful teeth record the discoveries!"
    ],
    helpText: "Train a shark in the fine art of research and the science of, well, science."
  },

  'getNurse': {
    name: "Train nurse shark",
    effect: {
      resource: {
        'nurse': 1
      }
    },
    cost: [{
        resource: "shark",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 100
      }
    ],
    max: "nurse",
    prereq: {
      resource: {
        'shark': 1
      },
      upgrade: [
        "biology"
      ]
    },
    outcomes: [
      "A nurse shark is ready!",
      "Shark manufacturer primed.",
      "Nurse shark trained.",
      "Medical exam passed! Nurse shark is go!"
    ],
    multiOutcomes: [
      "More sharks are on the way soon.",
      "Shark swarm begins!",
      "There will be no end to the sharks!",
      "Sharks forever!",
      "The sharks will never end. The sharks are eternal.",
      "More sharks to make more sharks to make more sharks..."
    ],
    helpText: "Remove a shark from fish duty and set them to shark making duty."
  },

  // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

  'getLaser': {
    name: "Equip laser ray",
    effect: {
      resource: {
        'laser': 1
      }
    },
    cost: [{
        resource: "ray",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 50
      }
    ],
    max: "laser",
    prereq: {
      resource: {
        'ray': 1
      },
      upgrade: [
        "laserRays"
      ]
    },
    outcomes: [
      "Laser ray online!",
      "Laser ray! With a laser ray! It's laser ray, with a laaaaaser raaaay!",
      "Laser ray.",
      "Ray suited up with a laaaaaaser!",
      "Ray lasered. To use a laser. Not the subject of a laser."
    ],
    multiOutcomes: [
      "Boil the seabed!",
      "Churn the sand to crystal!",
      "Laser ray armada in position!",
      "Ray crystal processing initiative is growing stronger every day!",
      "Welcome to the future! The future is lasers!"
    ],
    helpText: "Remove a ray from sand detail and let them fuse sand into raw crystal."
  },

  'getMaker': {
    name: "Instruct a ray maker",
    effect: {
      resource: {
        'maker': 1
      }
    },
    cost: [{
        resource: "ray",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 300
      },
      {
        resource: "kelp",
        costFunction: "linear",
        priceIncrease: 15
      }
    ],
    max: "maker",
    prereq: {
      resource: {
        'ray': 1
      },
      upgrade: [
        "rayBiology"
      ]
    },
    outcomes: [
      "The application of kelp supplements has made a ray very productive.",
      "More rays lets you get more rays which you can then use to get more rays.",
      "The ray singularity begins!",
      "A ray maker is ready.",
      "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
      "The ray seems concerned, but obliges. The mission has been given."
    ],
    multiOutcomes: [
      "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
      "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
      "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
      "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
      "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too."
    ],
    helpText: "Remove a ray from sand business and let them concentrate on making more rays."
  },

  // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

  'getPlanter': {
    name: "Gear up planter crab",
    effect: {
      resource: {
        'planter': 1
      }
    },
    cost: [{
        resource: "crab",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "sand",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "planter",
    prereq: {
      resource: {
        'crab': 1
      },
      upgrade: [
        "kelpHorticulture"
      ]
    },
    outcomes: [
      "Crab set up with seeds.",
      "Shell studded with kelp.",
      "Crab is going on a mission. A mission... to farm.",
      "Planter crab equipped and ready to move a few feet and start planting some things!",
      "Crab is ready to farm!"
    ],
    multiOutcomes: [
      "Carpet the seabed!",
      "Kelp kelp kelp kelp kelp kelp kelp kelp.",
      "Horticulturists unite!",
      "Strike the sand!",
      "Pat the sand very gently and put kelp in it!",
      "More kelp. The apples. They hunger. They hunger for kelp."
    ],
    helpText: "Equip a crab with the equipment and training to plant kelp across the ocean bottom."
  },

  'getBrood': {
    name: "Form crab brood",
    effect: {
      resource: {
        'brood': 1
      }
    },
    cost: [{
        resource: "crab",
        costFunction: "constant",
        priceIncrease: 20
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "brood",
    prereq: {
      resource: {
        'crab': 1
      },
      upgrade: [
        "crabBiology"
      ]
    },
    outcomes: [
      "A bunch of crabs pile together into some sort of weird cluster.",
      "Crab team, assemble! FORM THE CRAB BROOD!",
      "[This message has been censored for reasons of being mostly really gross.]",
      "Eggs, eggs everywhere, but never stop and think.",
      "Writhing crab pile. Didn't expect those words next to each other today, did you.",
      "The crab brood is a rarely witnessed phenomenon, due to being some strange behaviour of crabs that have been driven to seek crystals for reasons only they understand."
    ],
    multiOutcomes: [
      "The broods grow. The swarm rises.",
      "All these crabs are probably a little excessive. ...is what I could say, but I'm going to say this instead. MORE CRABS.",
      "A sea of crabs on the bottom of the sea. Clickity clackity.",
      "Snip snap clack clack burble burble crabs crabs crabs crabs.",
      "More crabs are always a good idea. Crystals aren't cheap.",
      "The broods swell in number. The sharks are uneasy, but the concern soon passes.",
      "Yes. Feed the kelp. Feed it. Feeeeeed it."
    ],
    helpText: "Meld several crabs into a terrifying, incomprehensible crab-producing brood cluster."
  },

  // SHRIMP JOBS ////////////////////////////////////////////////////////////////////////////////

  'getQueen': {
    name: "Crown shrimp queen",
    effect: {
      resource: {
        'queen': 1
      }
    },
    cost: [{
        resource: "shrimp",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "sponge",
        costFunction: "linear",
        priceIncrease: 50
      }
    ],
    max: "queen",
    prereq: {
      resource: {
        'shrimp': 1
      },
      upgrade: [
        "eusociality"
      ]
    },
    outcomes: [
      "Shrimp queen prepped for duty!",
      "A royal shrimp is she!",
      "More shrimp for the shrimp superorganism!",
      "Give it time before they start singing about wanting to break free.",
      "Long live the tiny tiny shrimp queen!"
    ],
    multiOutcomes: [
      "Okay, so it's not exactly a royal role, but hey, they're gonna be making eggs for a long time. Humour them.",
      "This is the weirdest monarchy in existence.",
      "Welcome to the superorganisation!",
      "They want to ride their bicycle.",
      "Give it time before they start singing about wanting to break free.",
      "Queens for the shrimp colony! Eggs for the egg throne!"
    ],
    helpText: "Create a shrimp queen to make more shrimp."
  },

  'getWorker': {
    name: "Assign shrimp worker",
    effect: {
      resource: {
        'worker': 1
      }
    },
    cost: [{
        resource: "shrimp",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "sponge",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "worker",
    prereq: {
      resource: {
        'shrimp': 1
      },
      upgrade: [
        "eusociality"
      ]
    },
    outcomes: [
      "No more work for this shrimp! Of their particular variety! Now slightly different work! Go!",
      "Consider this a promotion.",
      "This shrimp is going to have to come in on weekends now, I'm afraid.",
      "We sure love micromanaging these tiny guys on an individual basis, don't we.",
      "This little shrimp is so happy to be picked out of the crowd."
    ],
    multiOutcomes: [
      "These are some pretty fluid castes.",
      "Promotions for everybody!",
      "We're reorganising the superorganism.",
      "The sponge must grow.",
      "The sponge is the life.",
      "Glory to the sponge. Glory to the shrimp mass."
    ],
    helpText: "Dedicate a shrimp to collecting stuff that isn't algae."
  },

  // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

  'getBerrier': {
    name: "Form lobster berrier",
    effect: {
      resource: {
        'berrier': 1
      }
    },
    cost: [{
        resource: "lobster",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "clam",
        costFunction: "linear",
        priceIncrease: 30
      }
    ],
    max: "berrier",
    prereq: {
      resource: {
        'lobster': 1
      },
      upgrade: [
        "crustaceanBiology"
      ]
    },
    outcomes: [
      "We didn't need to see the process behind this.",
      "One lobster brimming with eggs to go.",
      "It's like some weird counterpart to the planter crab. But with eggs.",
      "Lobster with rocks ready to make a move. Oh, okay, eggs, whatever, see, they look like shiny pebbles from a distance and... oh, forget it."
    ],
    multiOutcomes: [
      "Berrier isn't even a word!",
      "Berries and eggs aren't even the same thing!",
      "How do these things swim with this much weighing them down?",
      "We aren't running out of volunteers any time soon.",
      "Did you see them fight for this job? Claws everywhere, I tell you!"
    ],
    helpText: "Dedicate a lobster to egg production. We don't know how it works. Ask the lobsters."
  },

  'getHarvester': {
    name: "Train lobster harvester",
    effect: {
      resource: {
        'harvester': 1
      }
    },
    cost: [{
        resource: "lobster",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "clam",
        costFunction: "linear",
        priceIncrease: 25
      },
      {
        resource: "sponge",
        costFunction: "linear",
        priceIncrease: 5
      }
    ],
    max: "harvester",
    prereq: {
      resource: {
        'lobster': 1
      },
      upgrade: [
        "crustaceanBiology"
      ]
    },
    outcomes: [
      "Yes, lobster, put these claws to better use.",
      "It is time for this one to seek more interesting prey. Wait. Wait, no, it's just as stationary. Never mind. False alarm.",
      "Lobster sticks to seabed!"
    ],
    multiOutcomes: [
      "Cut down the kelp forests!",
      "Rip the sponge and tear the kelp!",
      "Harvest the seafloor!",
      "The lobster tide shall claim the-- wait no you said harvesters. Okay. Adjusting that, then.",
      "These guys are pretty unenthusiastic about everything they do, aren't they."
    ],
    helpText: "Train a lobster to cut down kelp faster than anything can plant it. Sustainable!"
  },

  // DOLPHIN JOBS ////////////////////////////////////////////////////////////////////////////////

  'getPhilosopher': {
    name: "Qualify dolphin philosopher",
    effect: {
      resource: {
        'philosopher': 1
      }
    },
    cost: [{
        resource: "dolphin",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 30
      },
      {
        resource: "coral",
        costFunction: "linear",
        priceIncrease: 10
      }
    ],
    max: "philosopher",
    prereq: {
      resource: {
        'dolphin': 1
      },
      upgrade: [
        "delphinePhilosophy"
      ]
    },
    outcomes: [
      "We've given a dolphin free opportunity to ramble. WHY?!",
      "Let's humour this dolphin's rambling.",
      "This philosopher might have some insight.",
      "Maybe this dolphin can answer the question of why we're even working with dolphins."
    ],
    multiOutcomes: [
      "We begrudgingly acknowledge that working together is providing us with new insights.",
      "It's time to wax poetic and ponder.",
      "These pretentious clicking jerks can sometimes raise a good point.",
      "Oh joy. We're encouraging them to talk more.",
      "What's wrong with shark science?!"
    ],
    helpText: "Determine which of these dolphins is actually smart, and not just repeating empty phrases."
  },

  'getTreasurer': {
    name: "Promote dolphin treasurer",
    effect: {
      resource: {
        'treasurer': 1
      }
    },
    cost: [{
        resource: "dolphin",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 20
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "treasurer",
    prereq: {
      resource: {
        'dolphin': 1
      },
      upgrade: [
        "delphinePhilosophy"
      ]
    },
    outcomes: [
      "Treasurer of the dolphin treasures, go!",
      "We are trusting this dolphin with a lot. Is that wise?",
      "A dolphin is promoted to where it can do slightly more damage!",
      "Dolphin treasurer ready to do... whatever it is they do."
    ],
    multiOutcomes: [
      "Do we need this many treasurers?",
      "Should we be encouraging this?",
      "We require more crystals.",
      "You're might be playing a dangerous game trusting these guys.",
      "The treasury grows!"
    ],
    helpText: "Promote a dolphin to a harder job involving interest on precious coral and crystal or something like that."
  },

  'getBiologist': {
    name: "Train dolphin biologist",
    effect: {
      resource: {
        'biologist': 1
      }
    },
    cost: [{
        resource: "dolphin",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 10
      },
      {
        resource: "science",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "biologist",
    prereq: {
      resource: {
        'dolphin': 1
      },
      upgrade: [
        "dolphinBiology"
      ]
    },
    outcomes: [
      "Dolphin biologist graduated!",
      "Biologist trained.",
      "Dolphin dedicated to dolphin duty.",
      "Specialist dolphin ready for dolphin."
    ],
    multiOutcomes: [
      "More of them. Eesh.",
      "Dolphins proliferate.",
      "Dolphin biologists ready for whatever passes for their 'research'.",
      "Smug hedonists, the lot of them!",
      "The dolphin population regretfully grows."
    ],
    helpText: "Train a dolphin to specialise in biology. Dolphin biology, specifically, and production, apparently."
  },

  // WHALE JOBS ////////////////////////////////////////////////////////////////////////////////

  'getChorus': {
    name: "Assemble whale chorus",
    effect: {
      resource: {
        'chorus': 1
      }
    },
    cost: [{
      resource: "whale",
      costFunction: "unique",
      priceIncrease: 1000
    }],
    max: "chorus",
    prereq: {
      resource: {
        'whale': 1
      },
      upgrade: [
        "eternalSong"
      ]
    },
    outcomes: [
      "The chorus is made.",
      "The singers sing an immortal tune.",
      "The song is indescribable.",
      "Serenity, eternity.",
      "What purpose does the song have?",
      "Liquid infinity swirls around the grand chorus."
    ],
    helpText: "Form the singers of the eternal song. Let it flow through this world."
  },

  // EEL JOBS ////////////////////////////////////////////////////////////////////////////////

  'getPit': {
    name: "Dig eel pit",
    effect: {
      resource: {
        'pit': 1
      }
    },
    cost: [{
        resource: "eel",
        costFunction: "constant",
        priceIncrease: 3
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 50
      },
      {
        resource: "sand",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "pit",
    prereq: {
      resource: {
        'eel': 1
      },
      upgrade: [
        "eelHabitats"
      ]
    },
    outcomes: [
      "Why does it take three eels? Oh well. We don't really need to know.",
      "Dig that pit. We can dig it.",
      "Let's get digging.",
      "Oh, hey, this hole's already empty. Well, isn't that something."
    ],
    multiOutcomes: [
      "Let's get digging.",
      "Eel tide rises.",
      "More eels! They're handy to have.",
      "Many eyes from the caves.",
      "Secret homes!",
      "The eels are content."
    ],
    helpText: "Find a suitable pit for eels to make more eels."
  },

  'getTechnician': {
    name: "Teach eel technician",
    effect: {
      resource: {
        'technician': 1
      }
    },
    cost: [{
        resource: "eel",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 30
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 5
      }
    ],
    max: "technician",
    prereq: {
      resource: {
        'eel': 1
      },
      upgrade: [
        "eelHabitats"
      ]
    },
    outcomes: [
      "We have a technician!",
      "Technical problems no more!",
      "No, the eel won't fix your computer.",
      "Eel technician!"
    ],
    multiOutcomes: [
      "Let's get technical!",
      "Qualified and certified!",
      "Support squad on the rise!",
      "Let us not question the nature of eel technical training.",
      "Science progresses!"
    ],
    helpText: "Instruct an eel in the fine art of shark science."
  },

  'getSifter': {
    name: "Train eel sifter",
    effect: {
      resource: {
        'sifter': 1
      }
    },
    cost: [{
        resource: "eel",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "fish",
        costFunction: "linear",
        priceIncrease: 30
      }
    ],
    max: "sifter",
    prereq: {
      resource: {
        'eel': 1
      },
      upgrade: [
        "eelHabitats"
      ]
    },
    outcomes: [
      "Eel sifter ready to find things!",
      "Eel ready to sift through the sands!",
      "Time to sift, eel. Time to seek, search and sift.",
      "Time for this little guy to find some goodies."
    ],
    multiOutcomes: [
      "Time to find the things!",
      "Sift. It's a fun word. Siiiiffft.",
      "Sifters scouring the seabed for some special stuff.",
      "Shifters ready to shift! Wait. No. Hang on.",
      "Sifting the seabed for scores of surprises!"
    ],
    helpText: "Specialise an eel in finding interesting things on the seabed."
  },

  // CHIMAERA JOBS ////////////////////////////////////////////////////////////////////////////////

  'getTransmuter': {
    name: "Induct chimaera transmuter",
    effect: {
      resource: {
        'transmuter': 1
      }
    },
    cost: [{
        resource: "chimaera",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "jellyfish",
        costFunction: "linear",
        priceIncrease: 10
      },
      {
        resource: "sharkonium",
        costFunction: "linear",
        priceIncrease: 10
      }
    ],
    max: "transmuter",
    prereq: {
      resource: {
        'chimaera': 1
      },
      upgrade: [
        "chimaeraMysticism"
      ]
    },
    outcomes: [
      "Transmuter taught.",
      "The chimaera's eyes flicker with power.",
      "The water glows around the chimaera.",
      "The chimaera forms the material of progress."
    ],
    multiOutcomes: [
      "The chimaeras are now masters of matter.",
      "The transmuters revel in our revealed secrets.",
      "The process continues.",
      "The matter matters.",
      "The immaterial made material."
    ],
    helpText: "Reveal the mysteries of transmutation to a chimaera."
  },

  'getExplorer': {
    name: "Prepare chimaera explorer",
    effect: {
      resource: {
        'explorer': 1
      }
    },
    cost: [{
        resource: "chimaera",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "jellyfish",
        costFunction: "linear",
        priceIncrease: 30
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 30
      }
    ],
    max: "explorer",
    prereq: {
      resource: {
        'chimaera': 1
      },
      upgrade: [
        "chimaeraMysticism"
      ]
    },
    outcomes: [
      "A seeker of mysteries is prepared.",
      "The chimaera explorer is ready for their journey.",
      "Explorer ready for some answers!",
      "The chimaera swims down to the ocean below."
    ],
    multiOutcomes: [
      "The exploration party is ready.",
      "Learn the secrets of the deeps!",
      "More mysteries to uncover.",
      "Ancient riddles for ancient creatures.",
      "Find the truth beneath the waves!"
    ],
    helpText: "Help prepare a chimaera for exploration to parts unknown. Their efforts will be good for science."
  },

  // OCTOPUS JOBS ////////////////////////////////////////////////////////////////////////////////

  'getCollector': {
    name: "Reassign octopus as collector",
    effect: {
      resource: {
        'collector': 1
      }
    },
    cost: [{
        resource: "octopus",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "clam",
        costFunction: "linear",
        priceIncrease: 50
      }
    ],
    max: "collector",
    prereq: {
      resource: {
        'octopus': 1
      },
      upgrade: [
        "octopusMethodology"
      ]
    },
    outcomes: [
      "An octopus is a collector now.",
      "Octopus, collector.",
      "The role has been assigned. Collector.",
      "The delegation has been made. Collector.",
      "This individual now collects."
    ],
    multiOutcomes: [
      "Collectors will retrieve that which has value to others.",
      "Collectors will collect what they feel is required.",
      "Collectors will begin their thankless harvest.",
      "Collectors will act as instructed."
    ],
    helpText: "Delegate an octopus to collect crystal and coral."
  },

  'getScavenger': {
    name: "Reassign octopus as scavenger",
    effect: {
      resource: {
        'scavenger': 1
      }
    },
    cost: [{
        resource: "octopus",
        costFunction: "constant",
        priceIncrease: 1
      },
      {
        resource: "clam",
        costFunction: "linear",
        priceIncrease: 30
      }
    ],
    max: "scavenger",
    prereq: {
      resource: {
        'octopus': 1
      },
      upgrade: [
        "octopusMethodology"
      ]
    },
    outcomes: [
      "An octopus is a scavenger now.",
      "Octopus, scavenger.",
      "The role has been assigned. Scavenger.",
      "The delegation has been made. Scavenger.",
      "This individual now scavenges."
    ],
    multiOutcomes: [
      "Scavengers will retrieve that which has value to their kind.",
      "Scavengers will scavenge what they can from below.",
      "Scavengers will pry the substrate of future progress from the ocean floor.",
      "Scavengers will act as instructed."
    ],
    helpText: "Delegate an octopus to scavenge sponge and sand."
  },

  // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

  'getCrystalMiner': {
    name: "Build crystal miner",
    effect: {
      resource: {
        'crystalMiner': 1
      }
    },
    cost: [{
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 100
      },
      {
        resource: "sand",
        costFunction: "linear",
        priceIncrease: 200
      },
      {
        resource: "sharkonium",
        costFunction: "linear",
        priceIncrease: 20
      }
    ],
    max: "crystalMiner",
    prereq: {
      resource: {
        'sharkonium': 20
      },
      upgrade: [
        "automation"
      ]
    },
    outcomes: [
      "Crystal miner activated.",
      "Crystal miner constructed.",
      "Mining machine online.",
      "Construction complete.",
      "Carve rock. Remove sand. Retrieve target."
    ],
    multiOutcomes: [
      "The machines rise.",
      "The miners dig.",
      "The crystal shall be harvested.",
      "Crystal miners are complete."
    ],
    helpText: "Construct a machine to automatically harvest crystals efficiently."
  },

  'getSandDigger': {
    name: "Build sand digger",
    effect: {
      resource: {
        'sandDigger': 1
      }
    },
    cost: [{
        resource: "sand",
        costFunction: "linear",
        priceIncrease: 500
      },
      {
        resource: "sharkonium",
        costFunction: "linear",
        priceIncrease: 150
      }
    ],
    max: "sandDigger",
    prereq: {
      resource: {
        'sharkonium': 150
      },
      upgrade: [
        "automation"
      ]
    },
    outcomes: [
      "Sand digger constructed.",
      "Sand digger reaches into the seabed.",
      "The digger begins to shuffle sand into its machine maw. Rays dart away.",
      "The machine is online.",
      "The machine acts immediately, shovelling sand."
    ],
    multiOutcomes: [
      "The machines increase in number.",
      "The diggers devour.",
      "All sand must be gathered.",
      "The rays are concerned.",
      "Devour the sands. Consume.",
      "Giant machines blot out our sun."
    ],
    helpText: "Construct a machine to automatically dig up sand efficiently."
  },

  'getFishMachine': {
    name: "Build fish machine",
    effect: {
      resource: {
        fishMachine: 1
      }
    },
    cost: [{
      resource: "sharkonium",
      costFunction: "linear",
      priceIncrease: 100
    }],
    max: "fishMachine",
    prereq: {
      resource: {
        'sharkonium': 100
      },
      upgrade: [
        "automation"
      ]
    },
    outcomes: [
      "Fish machine activated.",
      "Fish machine constructed.",
      "Fishing machine online.",
      "Construction complete.",
      "The quarry moves. But the machine is faster."
    ],
    multiOutcomes: [
      "One day there will be no fish left. Only the machines.",
      "Today the shark is flesh. Tomorrow, machine.",
      "Your metal servants can sate the hunger. The hunger for fish.",
      "The fishing machines are more efficient than the sharks. But they aren't very smart.",
      "Automated fishing.",
      "The power of many, many sharks, in many, many devices."
    ],
    helpText: "Construct a machine to automatically gather fish efficiently."
  },

  'getAutoTransmuter': {
    name: "Build auto-transmuter",
    effect: {
      resource: {
        'autoTransmuter': 1
      }
    },
    cost: [{
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 100
      },
      {
        resource: "sharkonium",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "autoTransmuter",
    prereq: {
      resource: {
        'sharkonium': 200
      },
      upgrade: [
        "engineering"
      ]
    },
    outcomes: [
      "Auto-transmuter activated.",
      "Auto-transmuter constructed.",
      "Transmutation machine online.",
      "Construction complete.",
      "Provide inputs. Only the output matters."
    ],
    multiOutcomes: [
      "Auto-transmuters are prepared.",
      "The difference between science and magic is reliable application.",
      "All is change.",
      "Change is all.",
      "The machines know many secrets, yet cannot speak of them."
    ],
    helpText: "Construct a machine to automatically transmute sand and crystal to sharkonium."
  },

  'getSkimmer': {
    name: "Build skimmer",
    effect: {
      resource: {
        'skimmer': 1
      }
    },
    cost: [{
        resource: "junk",
        costFunction: "linear",
        priceIncrease: 300
      },
      {
        resource: "sharkonium",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "skimmer",
    prereq: {
      resource: {
        'junk': 100
      },
      upgrade: [
        "engineering"
      ]
    },
    outcomes: [
      "Skimmer activated.",
      "Skimmer constructed.",
      "Residue producer online.",
      "Construction complete.",
      "Sacrifices must be made for progress."
    ],
    multiOutcomes: [
      "The lesser resource becomes the greatest of all.",
      "Transmutation is limited. The recycler is greater.",
      "Consumption and production are two halves of the greater whole.",
      "The creations of sharks emerge from a pattern as old as their species."
    ],
    helpText: "Construct a machine to automatically recycle kelp and sand into residue."
  },

  'getPurifier': {
    name: "Build purifier",
    effect: {
      resource: {
        'purifier': 1
      }
    },
    cost: [{
      resource: "sharkonium",
      costFunction: "linear",
      priceIncrease: 500
    }],
    max: "purifier",
    prereq: {
      resource: {
        'sharkonium': 500
      },
      upgrade: [
        "environmentalism"
      ]
    },
    outcomes: [
      "Purifier activated.",
      "Purifier constructed.",
      "Machine gills online.",
      "Construction complete.",
      "Not all machines carry such weight."
    ],
    multiOutcomes: [
      "We can almost hear these machines as they start. We can hear them speak. \"We will save you from your mistakes.\" No, I'm just, must be hearing things, ignore me.",
      "The problems of old will be solved by the new.",
      "The waters will return to clarity.",
      "The machines may destroy, but so too can they heal and repair.",
      "The end is not nearly so soon.",
      "Hope."
    ],
    helpText: "Construct a machine to restore vitality to our increasingly murky waters."
  },

  'getHeater': {
    name: "Build heater",
    effect: {
      resource: {
        'heater': 1
      }
    },
    cost: [{
      resource: "sharkonium",
      costFunction: "linear",
      priceIncrease: 300
    }],
    max: "heater",
    prereq: {
      resource: {
        'ice': 1,
        'sharkonium': 300
      },
      upgrade: [
        "thermalConditioning"
      ]
    },
    outcomes: [
      "Heater activated.",
      "Heater constructed.",
      "Climate control online.",
      "Construction complete.",
      "The end of ice."
    ],
    multiOutcomes: [
      "The ice age comes to a close.",
      "Is this replacing one form of destruction for another?",
      "Life becomes easier.",
      "The warmth. The warmth we desired so much.",
      "Life returns to the frozen sea.",
      "This world awakens."
    ],
    helpText: "Construct a machine to combat the advancing ice shelf."
  },

  // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

  'getSpongeFarmer': {
    name: "Build sponge farmer",
    effect: {
      resource: {
        'spongeFarmer': 1
      }
    },
    cost: [{
      resource: "coralglass",
      costFunction: "linear",
      priceIncrease: 200
    }],
    max: "spongeFarmer",
    prereq: {
      resource: {
        'coralglass': 200
      },
      upgrade: [
        "coralCircuitry"
      ]
    },
    outcomes: [
      "Sponge farmer is active.",
      "Sponge farmer capable.",
      "This sponge farming machine clatters to life.",
      "This automated caretaker gets to work."
    ],
    multiOutcomes: [
      "Sponges are not hard to domesticate. It's harder to make them wild.",
      "The shrimp will be happier.",
      "There is something missing compared to our machines. Ours are slightly more menacing, but also more effective.",
      "Who needs this much sponge?"
    ],
    helpText: "This crustacean machine automatically farms and harvests sponge."
  },

  'getBerrySprayer': {
    name: "Build berry sprayer",
    effect: {
      resource: {
        'berrySprayer': 1
      }
    },
    cost: [{
      resource: "coralglass",
      costFunction: "linear",
      priceIncrease: 500
    }],
    max: "berrySprayer",
    prereq: {
      resource: {
        'coralglass': 500,
        'lobster': 2
      },
      upgrade: [
        "coralCircuitry"
      ]
    },
    outcomes: [
      "Berry sprayer is active.",
      "Berry sprayer capable.",
      "This egg spraying machine clatters to life.",
      "This automated caretaker gets to work." // yeah, it's lazy, I know, but still just as appropriate
    ],
    multiOutcomes: [
      "Automation of population? What a terrifying concept.",
      "The machine rears lobster eggs. Wouldn't the shrimp want something like this too?",
      "There is an uneasiness about these machines that fills the sharks with concern.",
      "Why was this machine invented? Are we helping to prepare an army?"
    ],
    helpText: "This crustacean machine distributes lobster eggs for optimal hatching conditions."
  },

  'getGlassMaker': {
    name: "Build glass maker",
    effect: {
      resource: {
        'glassMaker': 1
      }
    },
    cost: [{
        resource: "coralglass",
        costFunction: "linear",
        priceIncrease: 400
      },
      {
        resource: "sand",
        costFunction: "linear",
        priceIncrease: 200
      },
      {
        resource: "coral",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "glassMaker",
    prereq: {
      resource: {
        'coralglass': 400
      },
      upgrade: [
        "coralCircuitry"
      ]
    },
    outcomes: [
      "Glass maker is active.",
      "Glass maker capable.",
      "This glass forging machine clatters to life.",
      "The coralglass factory whirrs and boils."
    ],
    multiOutcomes: [
      "Coralglass. The sharkonium of the shelled kind.",
      "The raw heat from these things could boil the ocean dry. How they do it, we don't know.",
      "Coralglass. So fragile, so beautiful, yet so durable. They make the machines in their own image.",
      "The fine intricacies of these machines are lost on us, given how much of our technological development involves our mouths."
    ],
    helpText: "This crustacean machine automatically makes coralglass out of coral and sand through processes we don't fully understand."
  },

  // DOLPHIN MACHINES /////////////////////////////////////////////////////////

  'getSilentArchivist': {
    name: "Build silent archivist",
    effect: {
      resource: {
        'silentArchivist': 1
      }
    },
    cost: [{
        resource: "delphinium",
        costFunction: "linear",
        priceIncrease: 300
      },
      {
        resource: "science",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "silentArchivist",
    prereq: {
      resource: {
        'delphinium': 300
      },
      upgrade: [
        "dolphinTechnology"
      ]
    },
    outcomes: [
      "Silent archivist watches on.",
      "Silent archivist shows no bias.",
      "Silent archivist makes a note.",
      "Silent archivist views us with disdain."
    ],
    multiOutcomes: [
      "More archivers of our grand works as a collective.",
      "These machines share the same insights as their creators, but are much less painful to deal with.",
      "The design for these machines seems strangely familiar.",
      "These things are too silent. We aren't sure if they're even on.",
      "Science is nothing without review."
    ],
    helpText: "This dolphin machine archives, critiques, and catalogues our science."
  },

  'getTirelessCrafter': {
    name: "Build tireless crafter",
    effect: {
      resource: {
        'tirelessCrafter': 1
      }
    },
    cost: [{
        resource: "delphinium",
        costFunction: "linear",
        priceIncrease: 200
      },
      {
        resource: "crystal",
        costFunction: "linear",
        priceIncrease: 200
      },
      {
        resource: "coral",
        costFunction: "linear",
        priceIncrease: 200
      }
    ],
    max: "tirelessCrafter",
    prereq: {
      resource: {
        'delphinium': 200
      },
      upgrade: [
        "dolphinTechnology"
      ]
    },
    outcomes: [
      "Tireless crafter fuses the matter.",
      "Tireless crafter never ceases.",
      "Tireless crafter lays foundation for a future.",
      "Tireless crafter is an accident waiting to happen."
    ],
    multiOutcomes: [
      "Delphinium. The warped counterpart to sharkonium.",
      "A silent, heatless process, much like the auto-transmuter's method of operation.",
      "Delphinium. We don't understand it. It feels a lot like sharkonium, but warmer.",
      "The complexity of these machines is unwarranted. The dolphins think themselves smarter, but we have simpler, more effective solutions."
    ],
    helpText: "This dolphin machine creates delphinium. What good that is to us is a mystery. Use it to make their useless machines, I guess?"
  },

  // OCTOPUS MACHINES /////////////////////////////////////////////////////////

  'getClamCollector': {
    name: "Build clam collector",
    effect: {
      resource: {
        'clamCollector': 1
      }
    },
    cost: [{
      resource: "spronge",
      costFunction: "linear",
      priceIncrease: 50
    }],
    max: "clamCollector",
    prereq: {
      resource: {
        'spronge': 50
      },
      upgrade: [
        "sprongeBiomimicry"
      ]
    },
    outcomes: [
      "Machine: clam collector. Operation: in progress.",
      "Machine: clam collector. Operation: beginning.",
      "Machine: clam collector. Result: clam collection.",
      "Machine: clam collector. Result: food for the masses."
    ],
    multiOutcomes: [
      "These machines feel strangely alive. They pulse and throb.",
      "There exist more clam collectors now.",
      "The biomachine expands.",
      "The octopuses tell me, find unity in efficiency. Find peace in automation."
    ],
    helpText: "This octopus machine collects clams. Simple purpose, simple machine."
  },

  'getEggBrooder': {
    name: "Build egg brooder",
    effect: {
      resource: {
        'eggBrooder': 1
      }
    },
    cost: [{
        resource: "spronge",
        costFunction: "linear",
        priceIncrease: 150
      },
      {
        resource: "octopus",
        costFunction: "constant",
        priceIncrease: 1
      }
    ],
    max: "eggBrooder",
    prereq: {
      resource: {
        'spronge': 150,
        'octopus': 10
      },
      upgrade: [
        "sprongeBiomimicry"
      ]
    },
    outcomes: [
      "Machine: egg brooder. Operation: in progress.",
      "Machine: egg brooder. Operation: beginning.",
      "Machine: egg brooder. Result: egg maintenance.",
      "Machine: egg brooder. Result: population rises.",
      "Machine: egg brooder. Cost: within acceptable parameters."
    ],
    multiOutcomes: [
      "These machines feel strangely alive. They pulse and throb.",
      "There exist more egg brooders now.",
      "The biomachine expands.",
      "The octopuses tell me, find unity in efficiency. Find peace in an optimised generation."
    ],
    helpText: "This octopus machine broods and incubates octopus eggs."
  },

  'getSprongeSmelter': {
    name: "Build spronge smelter",
    effect: {
      resource: {
        'sprongeSmelter': 1
      }
    },
    cost: [{
      resource: "spronge",
      costFunction: "linear",
      priceIncrease: 100
    }],
    max: "sprongeSmelter",
    prereq: {
      resource: {
        'spronge': 100
      },
      upgrade: [
        "sprongeBiomimicry"
      ]
    },
    outcomes: [
      "Machine: spronge smelter. Operation: in progress.",
      "Machine: spronge smelter. Operation: beginning.",
      "Machine: spronge smelter. Result: spronge smelting.",
      "Machine: spronge smelter. Result: further development."
    ],
    multiOutcomes: [
      "These machines feel strangely alive. They pulse and throb.",
      "There exist more spronge smelters now.",
      "The biomachine expands.",
      "The octopuses tell me, find unity in efficiency. Find peace in an assured future."
    ],
    helpText: "This octopus machine imbues sponge with industrial potential. Requires residue for function."
  },

  'getSeaScourer': {
    name: "Build sea scourer",
    effect: {
      resource: {
        'seaScourer': 1
      }
    },
    cost: [{
        resource: "spronge",
        costFunction: "linear",
        priceIncrease: 100
      },
      {
        resource: "junk",
        costFunction: "linear",
        priceIncrease: 50
      }
    ],
    max: "seaScourer",
    prereq: {
      resource: {
        'spronge': 100,
        'tar': 1
      },
      upgrade: [
        "sprongeBiomimicry"
      ]
    },
    outcomes: [
      "Machine: sea scourer. Operation: in progress.",
      "Machine: sea scourer. Operation: beginning.",
      "Machine: sea scourer. Result: pollution conversion.",
      "Machine: sea scourer. Result: appropriating inefficiency."
    ],
    multiOutcomes: [
      "These machines feel strangely alive. They pulse and throb.",
      "There exist more sea scourers now.",
      "The biomachine expands.",
      "The octopuses tell me, find unity in efficiency. Find peace in the impermanence of mistakes."
    ],
    helpText: "This octopus machine converts pollution into more useful resources."
  },

  'getProstheticPolyp': {
    name: "Build prosthetic polyp",
    effect: {
      resource: {
        'prostheticPolyp': 1
      }
    },
    cost: [{
        resource: "spronge",
        costFunction: "linear",
        priceIncrease: 100
      },
      {
        resource: "coral",
        costFunction: "linear",
        priceIncrease: 50
      }
    ],
    max: "prostheticPolyp",
    prereq: {
      resource: {
        'spronge': 100,
        'coral': 50
      },
      upgrade: [
        "sprongeBiomimicry"
      ]
    },
    outcomes: [
      "Machine: prosthetic polyp. Operation: in progress.",
      "Machine: prosthetic polyp. Operation: beginning.",
      "Machine: prosthetic polyp. Result: coral generation.",
      "Machine: prosthetic polyp. Result: ecosystem restabilisation."
    ],
    multiOutcomes: [
      "These machines feel strangely alive. They pulse and throb.",
      "There exist more prosthetic polyps now.",
      "The biomachine expands.",
      "The octopuses tell me, find unity in efficiency. Find peace in creation."
    ],
    helpText: "This octopus machine synthesizes coral faster than an entire colony of polyps ever could."
  }

};

SharkGame.HomeActionCategories = {

  all: { // This category should be handled specially.
    name: "All",
    actions: []
  },

  basic: {
    name: "Basic",
    actions: [
      "catchFish",
      "prySponge",
      "getClam",
      "getJellyfish"
    ]
  },

  frenzy: {
    name: "Frenzy",
    actions: [
      "getShark",
      "getManta",
      "getCrab",
      "getShrimp",
      "getLobster",
      "getDolphin",
      "getWhale",
      "getEel",
      "getChimaera",
      "getOctopus"
    ]
  },

  professions: {
    name: "Jobs",
    actions: [
      "getDiver",
      "getScientist",
      "getLaser",
      "getPlanter",
      "getWorker",
      "getHarvester",
      "getPhilosopher",
      "getTreasurer",
      "getTechnician",
      "getSifter",
      "getTransmuter",
      "getExplorer",
      "getCollector",
      "getScavenger"
    ]
  },

  breeders: {
    name: "Producers",
    actions: [
      "getNurse",
      "getMaker",
      "getBrood",
      "getQueen",
      "getBerrier",
      "getBiologist",
      "getPit"
    ]
  },

  processing: {
    name: "Processing",
    actions: [
      "seaApplesToScience",
      "spongeToScience",
      "jellyfishToScience",
      "pearlConversion",
      "transmuteSharkonium",
      "smeltCoralglass",
      "fuseDelphinium",
      "forgeSpronge"
    ]
  },

  machines: {
    name: "Shark Machines",
    actions: [
      "getCrystalMiner",
      "getSandDigger",
      "getAutoTransmuter",
      "getFishMachine",
      "getSkimmer",
      "getPurifier",
      "getHeater"
    ]
  },

  otherMachines: {
    name: "Other Machines",
    actions: [
      "getSpongeFarmer",
      "getBerrySprayer",
      "getGlassMaker",
      "getSilentArchivist",
      "getTirelessCrafter",
      "getClamCollector",
      "getEggBrooder",
      "getSprongeSmelter",
      "getSeaScourer",
      "getProstheticPolyp"
    ]
  },

  unique: {
    name: "Unique",
    actions: [
      "getChorus"
    ]
  }
};

/* -------------------------- data: worldtypes.js -------------------------- */
SharkGame.WorldTypes = {
  test: {
    name: "Test",
    desc: "You REALLY shouldn't be seeing this.",
    shortDesc: "testing",
    entry: "You enter a debug ocean.",
    style: "default",
    absentResources: [],
    modifiers: [],
    gateCosts: {
      fish: 1E3,
      sand: 1E3,
      crystal: 1E3,
      kelp: 1E3,
      seaApple: 1E3,
      sharkonium: 1E3
    }
  },
  start: {
    name: "Home",
    desc: "You shouldn't be seeing this.",
    shortDesc: "strange blue",
    entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
    style: "default",
    absentResources: [
      "tar",
      "ice",
      "shrimp",
      "lobster",
      "dolphin",
      "whale",
      "chimaera",
      "octopus",
      "eel",
      "queen",
      "berrier",
      "biologist",
      "pit",
      "worker",
      "harvester",
      "philosopher",
      "treasurer",
      "chorus",
      "transmuter",
      "explorer",
      "collector",
      "scavenger",
      "technician",
      "sifter",
      "purifier",
      "heater",
      "spongeFarmer",
      "berrySprayer",
      "glassMaker",
      "silentArchivist",
      "tirelessCrafter",
      "clamCollector",
      "sprongeSmelter",
      "seaScourer",
      "prostheticPolyp",
      "sponge",
      "jellyfish",
      "clam",
      "coral",
      "algae",
      "coralglass",
      "delphinium",
      "spronge"
    ],
    modifiers: [],
    // initial gate cost, scaled by planetary level
    gateCosts: {
      fish: 1E4,
      sand: 1E4,
      crystal: 1E4,
      kelp: 1E3,
      seaApple: 1E3,
      sharkonium: 1E4
    }
  },
  marine: {
    name: "Marine",
    desc: "A serene blue world. Peaceful, beautiful, so close to home.",
    shortDesc: "strange blue",
    entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
    style: "default",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "shrimp",
      "chimaera",
      "eel"
    ],
    modifiers: [{
      modifier: "planetaryResourceBoost",
      resource: "fish",
      amount: 1.5
    }],
    gateCosts: {
      fish: 1E6,
      sand: 1E6,
      crystal: 1E6,
      kelp: 1E3,
      seaApple: 1E3,
      sharkonium: 1E5
    }
  },
  chaotic: {
    name: "Chaotic",
    desc: "A frenetic world, torn by immaterial force.",
    shortDesc: "swirling teal",
    entry: "You enter a chaotic fray, with no recollection of your former journey. New creatures charge at you from all directions.",
    style: "chaotic",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "eel",
      "whale",
      "octopus",
      "shrimp",
      "chimaera"
    ],
    modifiers: [{
        modifier: "planetaryIncome",
        resource: "frenzy",
        amount: 0.0001
      },
      {
        modifier: "planetaryIncome",
        resource: "animals",
        amount: -0.0001
      },
      {
        modifier: "planetaryIncome",
        resource: "stuff",
        amount: -0.001
      }
    ],
    gateCosts: {
      sponge: 1E5,
      clam: 1E5,
      sand: 1E7,
      crystal: 1E7,
      shark: 1E4,
      sharkonium: 1E7
    }
  },
  haven: {
    name: "Haven",
    desc: "An aquamarine world of plenty. So beautiful, yet so vulnerable.",
    shortDesc: "thriving aquamarine",
    entry: "Remembering nothing, you find yourself in a beautiful atoll teeming with life. Life will be good here.",
    style: "haven",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "chimaera",
      "eel"
    ],
    modifiers: [{
        modifier: "planetaryIncomeMultiplier",
        resource: "breeders",
        amount: 1
      },
      {
        modifier: "planetaryResourceBoost",
        resource: "animals",
        amount: 1
      }
    ],
    gateCosts: {
      fish: 1E7,
      clam: 1E7,
      sponge: 1E7,
      kelp: 1E9,
      coralglass: 1E4,
      coral: 1E6
    }
  },
  tempestuous: {
    name: "Tempestuous",
    desc: "A swirling maelstrom of storms where nothing rests.",
    shortDesc: "stormy grey",
    entry: "You recall nothing and know only the storms. The unrelenting, restless storms scattering your possessions and allies.",
    style: "tempestuous",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "chimaera",
      "jellyfish"
    ],
    modifiers: [{
        modifier: "planetaryIncome",
        resource: "stuff",
        amount: -0.02
      },
      {
        modifier: "planetaryIncome",
        resource: "crystal",
        amount: -0.002
      },
      {
        modifier: "planetaryIncome",
        resource: "frenzy",
        amount: -0.0001
      }
    ],
    gateCosts: {
      junk: 1E9,
      coral: 1E6,
      spronge: 1E6,
      delphinium: 1E6,
      sharkonium: 1E6,
      crystal: 1E6
    }
  },
  violent: {
    name: "Violent",
    desc: "An ocean close to boiling and choking under sulphuric fumes.",
    shortDesc: "searing red",
    entry: "The burning waters sear the last traces of your past experiences from you. From beneath, the vents spew forth a heavy cloud of sand.",
    style: "violent",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "octopus",
      "eel",
      "chimaera",
      "whale"
    ],
    modifiers: [{
        modifier: "planetaryIncomeReciprocalMultiplier",
        resource: "breeders",
        amount: 1
      },
      {
        modifier: "planetaryIncome",
        resource: "sand",
        amount: 0.1
      },
      {
        modifier: "planetaryIncome",
        resource: "kelp",
        amount: 0.001
      },
      {
        modifier: "planetaryIncome",
        resource: "coral",
        amount: 0.00001
      },
      {
        modifier: "planetaryIncome",
        resource: "algae",
        amount: 0.0001
      }
    ],
    gateCosts: {
      sand: 1E10,
      kelp: 1E9,
      coral: 1E6,
      algae: 1E3,
      sponge: 1E6,
      junk: 1E9
    }
  },
  abandoned: {
    name: "Abandoned",
    desc: "A dying world filled with machinery.",
    shortDesc: "murky dark green",
    entry: "You do not know who left this world so torn and empty. Was it some predecessor of yours? Was it you yourself?",
    style: "abandoned",
    absentResources: [
      "ice",
      "heater",
      "shrimp",
      "chimaera",
      "eel",
      "jellyfish",
      "algae",
      "whale"
    ],
    modifiers: [{
        modifier: "planetaryIncome",
        resource: "tar",
        amount: 0.1
      },
      {
        modifier: "planetaryStartingResources",
        resource: "crystalMiner",
        amount: 1
      },
      {
        modifier: "planetaryStartingResources",
        resource: "sandDigger",
        amount: 1
      },
      {
        modifier: "planetaryStartingResources",
        resource: "fishMachine",
        amount: 1
      },
      {
        modifier: "planetaryStartingResources",
        resource: "silentArchivist",
        amount: 1
      }
    ],
    gateCosts: {
      junk: 1E8,
      purifier: 5,
      coralglass: 1E5,
      spronge: 1E5,
      delphinium: 1E5,
      sharkonium: 1E5
    }
  },
  shrouded: {
    name: "Shrouded",
    desc: "A dark, murky ocean of secrecy and danger.",
    shortDesc: "dark mysterious",
    entry: "Blackness. You know only blindness in these dark forsaken waters. Foggy memory leads you to follow a stream of crystals.",
    style: "shrouded",
    absentResources: [
      "tar",
      "ice",
      "heater",
      "lobster",
      "crab",
      "shrimp",
      "sponge"
    ],
    modifiers: [{
        modifier: "planetaryIncome",
        resource: "crystal",
        amount: 0.05
      },
      {
        modifier: "planetaryResourceBoost",
        resource: "crystal",
        amount: 1
      },
      {
        modifier: "planetaryResourceReciprocalBoost",
        resource: "animals",
        amount: 1
      },
      {
        modifier: "planetaryResourceReciprocalBoost",
        resource: "kelp",
        amount: 1
      },
      {
        modifier: "planetaryResourceReciprocalBoost",
        resource: "coral",
        amount: 1
      },
      {
        modifier: "planetaryIncomeReciprocalMultiplier",
        resource: "specialists",
        amount: 0.5
      }
    ],
    gateCosts: {
      jellyfish: 1E8,
      clam: 1E6,
      crystal: 1E9,
      science: 1E9,
      sharkonium: 1E7,
      fish: 1E8
    }
  },
  frigid: {
    name: "Frigid",
    desc: "A cold, chilling ocean freezing slowly to death.",
    shortDesc: "freezing white",
    entry: "As you struggle with sudden amnesia, you notice crystals forming in front of you. So cold.",
    style: "frigid",
    absentResources: [
      "tar",
      "dolphin",
      "whale",
      "lobster",
      "chimaera",
      "shrimp",
      "seaApple",
      "coral",
      "algae"
    ],
    modifiers: [{
        modifier: "planetaryIncomeReciprocalMultiplier",
        resource: "breeders",
        amount: 1
      },
      {
        modifier: "planetaryIncomeMultiplier",
        resource: "machines",
        amount: 1
      },
      {
        modifier: "planetaryIncome",
        resource: "ice",
        amount: 0.001
      }
    ],
    gateCosts: {
      sand: 1E6,
      crystal: 1E4,
      clam: 1E3,
      heater: 5,
      sharkonium: 1E7,
      fish: 1E7
    }
  }
};

/* -------------------------- data: upgrades.js -------------------------- */
SharkGame.Upgrades = {
  crystalBite: {
    name: "Crystal Bite-Gear",
    desc: "Bite the crystals we have into something to help biting!",
    researchedMessage: "Weird teeth-wear has been developed, and sharks can now catch fish better as a result.",
    effectDesc: "Sharks are twice as effective with their new biting gear. Turns out they work better outside the mouth!",
    cost: {
      science: 50,
      fish: 10
    },
    effect: {
      multiplier: {
        shark: 2
      }
    }
  },

  crystalSpade: {
    name: "Crystal Spades",
    desc: "Fashion strange harness-tools for the rays.",
    researchedMessage: "The rays can now bother the sand more effectively, and dig up more sand now!",
    effectDesc: "Rays are twice as effective with their specially adapted digging tools.",
    cost: {
      science: 50,
      sand: 20
    },
    effect: {
      multiplier: {
        ray: 2
      }
    }
  },

  crystalContainer: {
    name: "Crystal Containers",
    desc: "Make weird bottle things from the crystals we have. Maybe useful??",
    researchedMessage: "Well, things can go into these containers that aren't water. This makes science easier!",
    effectDesc: "Scientists are twice as effective at making with the science.",
    cost: {
      science: 100,
      crystal: 50
    },
    effect: {
      multiplier: {
        scientist: 2
      }
    }
  },

  statsDiscovery: {
    name: "Storage Caverns",
    desc: "It's about time to start moving the stores we have to a better place. We've found one but it needs setting up.",
    researchedMessage: "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. No more stray currents washing it all away hopefully!",
    effectDesc: "By storing things in a centralised location, we now finally have an idea of what we're doing. Sort of.",
    cost: {
      science: 150
    },
    required: {
      upgrades: [
        "crystalContainer"
      ]
    }
  },

  underwaterChemistry: {
    name: "Underwater Chemistry",
    desc: "With the weird bottles, we can now put things and other things into them and see what happens.",
    researchedMessage: "Well, nothing useful was determined, but if we keep on doing it we make tremendous leaps for science!",
    effectDesc: "Scientists are twice as effective with their new chemical insights.",
    cost: {
      science: 200,
      crystal: 50
    },
    required: {
      upgrades: [
        "crystalContainer"
      ]
    },
    effect: {
      multiplier: {
        scientist: 2
      }
    }
  },

  seabedGeology: {
    name: "Seabed Geology",
    desc: "Study the bottom of the ocean to determine the rich, deep, juicy secrets it contains.",
    researchedMessage: "Not only did we find a whole bunch of weird things, the rays found that there was more sand!",
    effectDesc: "Rays are twice as effective with their understanding of the seabed and its varieties of sediment.",
    cost: {
      science: 250,
      sand: 250
    },
    required: {
      upgrades: [
        "crystalContainer"
      ]
    },
    effect: {
      multiplier: {
        ray: 2
      }
    }
  },

  thermalVents: {
    name: "Thermal Vents",
    desc: "Investigate the boiling vents that just seem to keep on heating things up.",
    researchedMessage: "This is a wondrous, unending source of heat! Something good must come from this.",
    effectDesc: "A power source for future technologies has been discovered.",
    cost: {
      science: 300,
      sand: 500
    },
    required: {
      upgrades: [
        "seabedGeology"
      ]
    }
  },

  spongeCollection: {
    name: "Sponge Collection",
    desc: "We can see these things littering the reefs and beds, but we don't know how to collect them without breaking them.",
    researchedMessage: "Understanding the fragile nature of sponges and their weird porous texture, we can now collect sponges by not biting so hard.",
    effectDesc: "Sponge can be collected in the same way fish can be.",
    cost: {
      science: 400
    },
    required: {
      upgrades: [
        "seabedGeology"
      ],
      resources: [
        "sponge"
      ]
    }
  },

  clamScooping: {
    name: "Clam Scooping",
    desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
    researchedMessage: "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
    effectDesc: "Clams can be collected like fish. The rays do a better job of scooping things, for some reason.",
    cost: {
      science: 600
    },
    required: {
      upgrades: [
        "seabedGeology"
      ],
      resources: [
        "clam"
      ]
    }
  },

  pearlConversion: {
    name: "Pearl Conversion",
    desc: "There's these things inside the clams that look shiny like crystals. Maybe we can transmute them to crystals?",
    researchedMessage: "Well, we can transmute pearls to crystals now, but we need more of the clam. The whole clam. Yes. The entire clam.",
    effectDesc: "We can turn clams into crystals using the pearls inside them as a focus. Maybe one day we won't need to use the entire clam.",
    cost: {
      science: 1500
    },
    required: {
      upgrades: [
        "clamScooping",
        "transmutation"
      ],
      resources: [
        "clam"
      ]
    }
  },

  jellyfishHunting: {
    name: "Jellyfish Hunting",
    desc: "Jellyfish are plenty in the farther waters, but our attempts to catch them is met only with pain. We need better tactics.",
    researchedMessage: "The trick to catching jellyfish is caution and avoiding the stinging tendrils. They burn. Oh, they burn.",
    effectDesc: "Jellyfish can be caught like fish. Hey, a fish is a fish, right?",
    cost: {
      science: 800
    },
    required: {
      upgrades: [
        "seabedGeology"
      ],
      resources: [
        "jellyfish"
      ]
    }
  },

  laserRays: {
    name: "Laser Rays",
    desc: "Using arcane shark mystery science, capture the heat of the vents for use by rays.",
    researchedMessage: "The rays can now be granted gear that will let them fuse sand into crystal! Future!",
    effectDesc: "Laser rays can now be geared up to burn the very sand to glassy crystal.",
    cost: {
      science: 100,
      sand: 2000,
      crystal: 100
    },
    required: {
      upgrades: [
        "thermalVents"
      ],
      resources: [
        "ray"
      ]
    }
  },

  automation: {
    name: "Automation",
    desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
    researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
    effectDesc: "Machines can be built to supplement population duties. This is efficient.",
    cost: {
      science: 1000,
      sharkonium: 100
    },
    required: {
      upgrades: [
        "thermalVents",
        "transmutation"
      ]
    }
  },

  environmentalism: {
    name: "Environmentalism",
    desc: "So the machines might be destroying the ocean. We need to fix this.",
    researchedMessage: "We've determined that the goop produced by our technology can be refined away into nothing but crystal fresh water!",
    effectDesc: "Purifiers can be made to combat the harmful effects of the other machines. Anti-machine machines?",
    cost: {
      science: 500
    },
    required: {
      upgrades: [
        "automation"
      ],
      resources: [
        "tar"
      ]
    }
  },

  thermalConditioning: {
    name: "Thermal Conditioning",
    desc: "We're freezing to death! Machines make heat, right? We need to work on this!!",
    researchedMessage: "Breakthrough! Machines can run alarmingly hot if we take out some of the safeguards!",
    effectDesc: "Heaters can be made to fight the freezing process. We don't want to become giant novelty ice cubes!",
    cost: {
      science: 500
    },
    required: {
      upgrades: [
        "automation"
      ],
      resources: [
        "ice"
      ]
    }
  },

  engineering: {
    name: "Engineering",
    desc: "The machines sort of suck. Let's make them better by learning how!",
    researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
    effectDesc: "Machines are twice as effective. Skimmers and auto-transmuters are now possible to create.",
    cost: {
      science: 2000,
      sharkonium: 2000
    },
    required: {
      upgrades: [
        "automation"
      ]
    },
    effect: {
      multiplier: {
        crystalMiner: 2,
        fishMachine: 2,
        sandDigger: 2
      }
    }
  },

  recyclerDiscovery: {
    name: "Recycler",
    desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
    researchedMessage: "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
    effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
    cost: {
      science: 3000,
      sharkonium: 3000
    },
    required: {
      upgrades: [
        "automation"
      ]
    }
  },

  coralCircuitry: {
    name: "Coral Circuitry",
    desc: "We almost know enough to replicate crustacean technology. Just a few core components remain.",
    researchedMessage: "We've unlocked the secrets of crustacean machinery. It's more environmentally friendly, but less efficient.",
    effectDesc: "We can copy some of the safe but slow machines used by the lobsters and shrimp.",
    cost: {
      science: 3000,
      coralglass: 3000
    },
    required: {
      upgrades: [
        "automation",
        "coralglassSmelting"
      ],
      resources: [
        "coral",
        "sand"
      ]
    }
  },

  sprongeBiomimicry: {
    name: "Spronge Biomimicry",
    desc: "The cephalopod school of thought is that a machine that mimics life is a better machine. We don't understand this so well yet.",
    researchedMessage: "For machines that mimic life, these things sure put out a lot of pollution. It's sort of alarming. Very alarming, even.",
    effectDesc: "We can mimic some of the life-mimicking biotechnology the octopuses use, but it gums up the oceans so quickly. So very dangerous.",
    cost: {
      science: 3000,
      spronge: 3000
    },
    required: {
      upgrades: [
        "automation",
        "industrialGradeSponge"
      ],
      resources: [
        "sponge",
        "junk"
      ]
    }
  },

  dolphinTechnology: {
    name: "Dolphin Technology",
    desc: "The warm-blooded squeakers have machinery that might be useful. Let's reverse-engineer it.",
    researchedMessage: "The elaborate crystalline structures of dolphin technology are a ruse to mask their limited function. Inside, they're not so different to our machines.",
    effectDesc: "We've reverse-engineered some dolphin machinery. We also, regretfully, learned what the designs are called.",
    cost: {
      science: 3000,
      delphinium: 3000
    },
    required: {
      upgrades: [
        "automation",
        "aquamarineFusion"
      ],
      resources: [
        "coral",
        "crystal"
      ]
    }
  },

  agriculture: {
    name: "Agriculture",
    desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
    researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
    effectDesc: "Various roles are twice as effective thanks to farming regions for coral and sponge.",
    cost: {
      science: 500,
      sand: 1000
    },
    required: {
      upgrades: [
        "seabedGeology"
      ]
    },
    effect: {
      multiplier: {
        worker: 2,
        harvester: 2,
        treasurer: 2,
        scavenger: 2
      }
    }
  },

  kelpHorticulture: {
    name: "Kelp Horticulture",
    desc: "Determine what it takes to plant kelp all over the seabed. Maybe this is useful.",
    researchedMessage: "Crab-specific gear has been invented to allow for kelp farming! This is possibly useful.",
    effectDesc: "Crabs can become kelp farmers and grow a living carpet across the bottom of the sea.",
    cost: {
      science: 1000,
      sand: 2000
    },
    required: {
      upgrades: [
        "agriculture"
      ],
      resources: [
        "kelp"
      ]
    }
  },

  biology: {
    name: "Biology",
    desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
    researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
    effectDesc: "Sharks are twice as effective. Did you know shark eggs don't actually form just because a shark wills them to exist?",
    cost: {
      science: 400
    },
    required: {
      upgrades: [
        "underwaterChemistry",
        "agriculture"
      ]
    },
    effect: {
      multiplier: {
        shark: 2
      }
    }
  },

  xenobiology: {
    name: "Xenobiology",
    desc: "Determine what is with these weird faceless creatures we keep finding.",
    researchedMessage: "Results inconclusive! Further research required. It could be such a benefit for science!",
    effectDesc: "Kelp produces sea apples twice as fast. Also, sea apple isn't a fruit. We can also dissect sea apples, jellyfish and sponge for science.",
    cost: {
      science: 600
    },
    required: {
      upgrades: [
        "agriculture"
      ],
      resources: [
        "seaApple",
        "jellyfish",
        "sponge"
      ]
    },
    effect: {
      multiplier: {
        kelp: 2
      }
    }
  },

  rayBiology: {
    name: "Ray Biology",
    desc: "Though kindred to the sharks, we know so little about the rays. If only we could fix this. We need to bait a sand trap.",
    researchedMessage: "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.",
    effectDesc: "Rays and laser rays are twice as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
    cost: {
      science: 700,
      sand: 600
    },
    required: {
      upgrades: [
        "biology",
        "laserRays"
      ],
      resources: [
        "ray"
      ]
    },
    effect: {
      multiplier: {
        ray: 2,
        laser: 2
      }
    }
  },

  crabBiology: {
    name: "Crab Biology",
    desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
    researchedMessage: "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
    effectDesc: "Crabs and planter crabs are twice as effective. Crabs are alright but they are also sort of terrifying and weird. Good job they're on our side!",
    cost: {
      science: 500,
      kelp: 100
    },
    required: {
      upgrades: [
        "biology",
        "sunObservation"
      ],
      resources: [
        "crab"
      ]
    },
    effect: {
      multiplier: {
        crab: 4,
        planter: 2
      }
    }
  },

  crustaceanBiology: {
    name: "Crustacean Biology",
    desc: "These strange creatures related to crabs require further investigation. What is with exoskeletons?",
    researchedMessage: "We've figured out how these shellfish function. There's far too many limbs involved.",
    effectDesc: "Shrimp and lobsters are twice as effective. Lobsters can now gather other things or cover themselves in shiny eggs, also called 'berries'. What's a berry?",
    cost: {
      science: 500,
      clam: 100
    },
    required: {
      upgrades: [
        "biology"
      ],
      resources: [
        "shrimp",
        "lobster"
      ]
    },
    effect: {
      multiplier: {
        shrimp: 2,
        lobster: 2
      }
    }
  },

  eusociality: {
    name: "Eusociality",
    desc: "The shrimp are weirder than we thought. They have some advanced social system beyond our comprehension. What is the deal?",
    researchedMessage: "We have learned far more than we needed to about the duties of egg bearing queens in eusocial colonies.",
    effectDesc: "Shrimp are twice as effective. Shimp queens and dedicated shrimp workers are available, and we'll never sleep soundly again.",
    cost: {
      science: 1000,
      sponge: 500
    },
    required: {
      upgrades: [
        "crustaceanBiology"
      ],
      resources: [
        "shrimp"
      ]
    },
    effect: {
      multiplier: {
        shrimp: 2
      }
    }
  },

  wormWarriors: {
    name: "Worm Warriors",
    desc: "Shrimp sponge hives are under constant threat from outside invaders that aren't us. A collaboration effort might help them out.",
    researchedMessage: "Primordial shark techniques of self-defense have lead to the establishment of a new shrimp caste - the worm warrior.",
    effectDesc: "Shrimp, shrimp queens and shrimp workers are twice as effective now that they don't need to worry about worms eating them.",
    cost: {
      science: 3000,
      shrimp: 300
    },
    required: {
      upgrades: [
        "eusociality"
      ],
      resources: [
        "shrimp"
      ]
    },
    effect: {
      multiplier: {
        shrimp: 2,
        queen: 2,
        worker: 2
      }
    }
  },

  cetaceanAwareness: {
    name: "Cetacean Awareness",
    desc: "From a distance, it's harder to tell which of us are really sharks or... those other things. We need to figure this out.",
    researchedMessage: "Right, so, dolphins and whales have a horizontal tail and sharks have a vertical tail. Also, they have warm blood and bigger brains. Jerks.",
    effectDesc: "Whales and dolphins are twice as effective, now that we can adapt our hunting strategies to their supposed 'strengths'.",
    cost: {
      science: 2000,
      fish: 500
    },
    required: {
      upgrades: [
        "biology"
      ],
      resources: [
        "dolphin",
        "whale"
      ]
    },
    effect: {
      multiplier: {
        dolphin: 2,
        whale: 2
      }
    }
  },

  dolphinBiology: {
    name: "Dolphin Biology",
    desc: "Do we really have to learn about this? We do? Alright, then.",
    researchedMessage: "We managed to offend the dolphins with our questions so much they decided to form their own biological research team.",
    effectDesc: "Dolphins are twice as effective but double a small number is still small. Also now they can make more dolphins. <em>Hooray.</em>",
    cost: {
      science: 3000,
      fish: 1000
    },
    required: {
      upgrades: [
        "cetaceanAwareness"
      ],
      resources: [
        "dolphin"
      ]
    },
    effect: {
      multiplier: {
        dolphin: 2
      }
    }
  },

  delphinePhilosophy: {
    name: "Delphine Philosophy",
    desc: "The whales are known to be natural philosophers. The dolphins, not so much. Nonetheless, we need to appreciate their culture for them to pay attention to us.",
    researchedMessage: "Please let's never do this again. They have fifty dozen parables involving bubbles. BUBBLES. NEVER AGAIN.",
    effectDesc: "Dolphin biologists are twice as effective now that we don't keep openly mocking them. Also, dolphins are more comfortable in their former roles.",
    cost: {
      science: 5000,
      fish: 1000
    },
    required: {
      upgrades: [
        "dolphinBiology"
      ],
      resources: [
        "dolphin"
      ]
    },
    effect: {
      multiplier: {
        biologist: 2
      }
    }
  },

  coralHalls: {
    name: "Coral Halls",
    desc: "The demands don't stop! Now they want living spaces made of coral! Is this really necessary?",
    researchedMessage: "We begrudingly helped them establish new living spaces a little distant from the rest of our frenzy.",
    effectDesc: "Dolphins are happier and twice as effective. Philosophers and treasurers are also twice as effective. Everyone wins, and all it cost us was our dignity and resolve. Sigh.",
    cost: {
      science: 10000,
      coral: 2000
    },
    required: {
      upgrades: [
        "delphinePhilosophy"
      ],
      resources: [
        "dolphin"
      ]
    },
    effect: {
      multiplier: {
        dolphin: 2,
        philosopher: 2,
        treasurer: 2
      }
    }
  },

  eternalSong: {
    name: "Eternal Song",
    desc: "The whales claim to know segments of some form of ancient ethereal music that connects worlds. We can collect what they know to piece it together ourselves.",
    researchedMessage: "We have determined the eternal song of the gates. We don't know what it does yet.",
    effectDesc: "A chorus of whales can be assembled to sing the eternal song, but we have no clue what it will do.",
    cost: {
      science: 1E9
    },
    required: {
      upgrades: [
        "cetaceanAwareness"
      ],
      resources: [
        "whale"
      ]
    }
  },

  eelHabitats: {
    name: "Eel Habitats",
    desc: "So we keep seeing these things we thought were kelp on the seabed, but it turns out they're not kelp. What are they?",
    researchedMessage: "After some discussion with the eels on the nature of eel pits and safety and security in the form of seabed holes, we understand, maybe.",
    effectDesc: "Eels are twice as effective now we know how they prefer to live. Eels are also able to specialise in a variety of different ways with a place to store their things.",
    cost: {
      science: 800,
      clam: 200
    },
    required: {
      upgrades: [
        "biology",
        "seabedGeology"
      ],
      resources: [
        "eel"
      ]
    },
    effect: {
      multiplier: {
        eel: 2
      }
    }
  },

  creviceCreches: {
    name: "Crevice Creches",
    desc: "We can probably figure out a way to make eel pits cosier for their inhabitants.",
    researchedMessage: "We've developed a design to improve the quality of eel pits involving a complicated system of chambers and subterranean warrens. Look, it... let's not worry about the specifics this time, okay?",
    effectDesc: "Eels are twice as effective, and so are eel pits. Expect many baby eels in the future.",
    cost: {
      science: 800,
      clam: 200
    },
    required: {
      upgrades: [
        "eelHabitats"
      ],
      resources: [
        "eel"
      ]
    },
    effect: {
      multiplier: {
        eel: 2,
        pit: 2
      }
    }
  },

  bioelectricity: {
    name: "Bioelectricity",
    desc: "There has to be a way to harness the powers of some of the eels. We all know they have powers. Painful ones.",
    researchedMessage: "The technically inclined electric eels practically jumped out of the water at the chance to work with the machines. Should we be concerned?",
    effectDesc: "Eel technicians are twice as effective. So are our machines. Convenient!",
    cost: {
      science: 1600,
      clam: 400
    },
    required: {
      upgrades: [
        "eelHabitats",
        "engineering"
      ],
      resources: [
        "eel"
      ]
    },
    effect: {
      multiplier: {
        technician: 2,
        fishMachine: 2,
        sandDigger: 2,
        autoTransmuter: 2,
        skimmer: 2,
        purifier: 2,
        heater: 2
      }
    }
  },

  octopusMethodology: {
    name: "Octopus Methodology",
    desc: "The octopuses claim they know ways to improve their routines and machines.",
    researchedMessage: "We have no idea what thought processes guide these cephalopod allies of ours, but they know how to get results.",
    effectDesc: "Octopuses can specialise in different tasks, and their machines are constructed to be twice as efficient.",
    cost: {
      science: 8888,
      clam: 88
    },
    required: {
      upgrades: [
        "exploration"
      ],
      resources: [
        "octopus"
      ]
    },
    effect: {
      multiplier: {
        clamCollector: 2,
        eggBrooder: 2,
        sprongeSmelter: 2,
        seaScourer: 2,
        prostheticPolyp: 2
      }
    }
  },

  octalEfficiency: {
    name: "Octal Efficiency",
    desc: "The octopuses wish to further enhance their productivity for collective gain.",
    researchedMessage: "The instructions constructed and disseminated by the octopuses are complex and only understood to other octopuses. Head hurts. Something about the number eight.",
    effectDesc: "Octopuses and their specialists are twice as effective, as our their machines. Find unity in efficiency.",
    cost: {
      science: 88888,
      clam: 888
    },
    required: {
      upgrades: [
        "octopusMethodology"
      ],
      resources: [
        "octopus"
      ]
    },
    effect: {
      multiplier: {
        clamCollector: 2,
        eggBrooder: 2,
        sprongeSmelter: 2,
        seaScourer: 2,
        prostheticPolyp: 2,
        octopus: 2,
        collector: 2,
        scavenger: 2
      }
    }
  },

  chimaeraMysticism: {
    name: "Chimaera Mysticism",
    desc: "We know the chimaeras, but we don't them very well. We need to adjust our thinking to understand their riddles.",
    researchedMessage: "After much thoughtful contemplation, the chimaeras have despaired at our inability to understand and shared their knowledge with us.",
    effectDesc: "Chimaeras can now become dedicated transmuters or explorers, using our knowledge to assist our industry or sharing their knowledge as they journey through the deeper seas.",
    cost: {
      science: 12000,
      jellyfish: 700
    },
    required: {
      upgrades: [
        "farExploration"
      ],
      resources: [
        "chimaera"
      ]
    }
  },

  abyssalEnigmas: {
    name: "Abyssal Enigmas",
    desc: "The chimaeras have returned from the deeper oceans with artifacts they can't explain. We need to work together to understand them.",
    researchedMessage: "Well, we still have no idea what these things are, but we've formed a stronger bond with our estranged kin.",
    effectDesc: "Chimaeras and their specialists are twice as effective thanks to stronger trust and friendship. Also we still don't know what these things they found do.",
    cost: {
      science: 40000,
      jellyfish: 2000
    },
    required: {
      upgrades: [
        "chimaeraMysticism"
      ],
      resources: [
        "chimaera"
      ]
    },
    effect: {
      multiplier: {
        chimaera: 2,
        transmuter: 2,
        explorer: 2
      }
    }
  },

  sunObservation: {
    name: "Sun Observation",
    desc: "We must determine what is with the weird glare on the surface of the water.",
    researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
    effectDesc: "Planter crabs are twice as effective, and shrimp are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And by what is it made of?",
    cost: {
      science: 5000
    },
    required: {
      upgrades: [
        "agriculture"
      ]
    },
    effect: {
      multiplier: {
        planter: 2,
        shrimp: 4
      }
    }
  },

  transmutation: {
    name: "Transmutation",
    desc: "By heating things up and doing science things to them, maybe new things can be made!",
    researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
    effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
    cost: {
      science: 1000,
      crystal: 2000,
      sand: 4000
    },
    required: {
      upgrades: [
        "thermalVents",
        "underwaterChemistry"
      ]
    }
  },

  coralglassSmelting: {
    name: "Coralglass Smelting",
    desc: "Careful observation of crustacean smelting processes will let us copy their method for coralglass creation.",
    researchedMessage: "Our allies among the shelled creatures have revealed to us the secrets of underwater glassmaking! It's, uh, complicated.",
    effectDesc: "Enables smelting of coralglass, a vital component in crustacean technology.",
    cost: {
      science: 1000,
      coral: 3000,
      sand: 3000
    },
    required: {
      upgrades: [
        "thermalVents",
        "crustaceanBiology"
      ],
      resources: [
        "coral",
        "sand"
      ]
    }
  },

  industrialGradeSponge: {
    name: "Industrial-Grade Sponge",
    desc: "Our octopus contacts inform us that sponge is highly useful with a little augmentation. Let's figure this out.",
    researchedMessage: "By infusing sponge with processed matter, we have devised spronge, a versatile super-material that kind of freaks us out!",
    effectDesc: "Enables creation of spronge, the backbone... uh... the core material in cephalopod technology.",
    cost: {
      science: 1000,
      sponge: 2000,
      junk: 4000
    },
    required: {
      upgrades: [
        "thermalVents",
        "octopusMethodology"
      ],
      resources: [
        "sponge",
        "junk"
      ]
    }
  },

  aquamarineFusion: {
    name: "Aquamarine Fusion",
    desc: "Those uppity dolphins think they're the only ones who can make their special delphinium. We'll show them.",
    researchedMessage: "In a weird corrupted version of our own transmutation, we've figured out how to make delphinium and now we feel gross.",
    effectDesc: "Enables transmutation of a different bunch of junk into delphinium, a substance inherently inferior to sharkonium.",
    cost: {
      science: 1000,
      coral: 4000,
      crystal: 4000
    },
    required: {
      upgrades: [
        "transmutation",
        "cetaceanAwareness"
      ],
      resources: [
        "coral",
        "crystal"
      ]
    }
  },

  exploration: {
    name: "Exploration",
    desc: "Swim beyond the home seas to see what can be found!",
    researchedMessage: "Found lots of schools of fish! So many different schools! And such untapped sand reserves!",
    effectDesc: "Sharks and rays are twice as effective. Did you know oceans are big? Fascinating!",
    cost: {
      science: 5000,
      fish: 5000
    },
    required: {
      upgrades: [
        "seabedGeology",
        "sunObservation"
      ]
    },
    effect: {
      multiplier: {
        shark: 2,
        ray: 2
      }
    }
  },

  farExploration: {
    name: "Far Explorations",
    desc: "Explore the vast reaches beyond the home ocean.",
    researchedMessage: "Crystal-rich deposits were found, as well as strange, deep chasms.",
    effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
    cost: {
      science: 8000,
      fish: 15000
    },
    required: {
      upgrades: [
        "exploration"
      ]
    },
    effect: {
      multiplier: {
        crab: 4
      }
    }
  },

  gateDiscovery: {
    name: "Chasm Exploration",
    desc: "A campaign of risky, foolhardy expeditions to the deeps, to find whatever can be found.",
    researchedMessage: "A strange structure was found from clues within the chasms. The cost was great, but the discovery is greater!",
    effectDesc: "Something ancient lurked in the depths.",
    cost: {
      science: 1E6,
      shark: 1000,
      fish: 50000
    },
    required: {
      upgrades: [
        "farExploration"
      ]
    }
  },

  // SUPERSCIENCE

  ancestralRecall: {
    name: "Ancestral Recall",
    desc: "The sharks and rays know we share some features among ourselves. Using the vague glimpses of dreams, let's piece together the puzzle.",
    researchedMessage: "Our giant ancestors and the creatures of a long distant past have inspired us to become even greater!",
    effectDesc: "Sharks, rays and chimaeras, and their roles, are all four times as effective. We have had a glorious past. Now, on to a glorious future.",
    cost: {
      science: 1E10
    },
    required: {
      upgrades: [
        "gateDiscovery"
      ],
      resources: [
        "shark",
        "ray",
        "chimaera"
      ]
    },
    effect: {
      multiplier: {
        shark: 4,
        diver: 4,
        science: 4,
        nurse: 4,
        ray: 4,
        maker: 4,
        laser: 4,
        chimaera: 4,
        transmuter: 4,
        explorer: 4
      }
    }
  },

  utilityCarapace: {
    name: "Utility Carapace",
    desc: "The exoskeleton is good enough, but with some adjustments, perhaps coralglass can improve it.",
    researchedMessage: "Coralglass carapace augmentation is a go! The crustaceans now carry their protection and their tools everywhere they go.",
    effectDesc: "Crabs, shrimp and lobsters, and their roles, are all four times as effective. A shell protects, and a shell interfaces.",
    cost: {
      science: 1E10
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "coralglassSmelting"
      ],
      resources: [
        "crab",
        "shrimp",
        "lobster"
      ]
    },
    effect: {
      multiplier: {
        crab: 4,
        brood: 4,
        planter: 4,
        shrimp: 4,
        worker: 4,
        queen: 4,
        lobster: 4,
        berrier: 4,
        harvester: 4
      }
    }
  },

  primordialSong: {
    name: "Primordial Song",
    desc: "Even the dolphins can remember an ancient song. The whales know more, but it stirs within both of them.",
    researchedMessage: "The dolphins were shaken and moved by their collective realisation of something greater than them. They've been quieter since. The whales seemed indifferent.",
    effectDesc: "Dolphins and whales, and their roles, are all four times as effective. The song of the ocean is older than life itself.",
    cost: {
      science: 1E10
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "cetaceanAwareness"
      ],
      resources: [
        "dolphin",
        "whale"
      ]
    },
    effect: {
      multiplier: {
        dolphin: 4,
        biologist: 4,
        treasurer: 4,
        philosopher: 4,
        whale: 4
      }
    }
  },

  leviathanHeart: {
    name: "Leviathan Heart",
    desc: "The eels are meek and unassuming, but deep within them lies a greater potential. Let's unleash it.",
    researchedMessage: "We have found the connection between the eels we know and the ancient giant serpents we knew only in legend. This has inspired every eel we know to do greater things.",
    effectDesc: "Eels and their roles are all four times as effective. The power of determination can overcome many odds.",
    cost: {
      science: 1E10
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "bioelectricity"
      ],
      resources: [
        "eel"
      ]
    },
    effect: {
      multiplier: {
        eel: 4,
        pit: 4,
        sifter: 4,
        technician: 4
      }
    }
  },

  eightfoldOptimisation: {
    name: "Eightfold Optimisation",
    desc: "Enhance productivity. Optimise. Improve. Improve.",
    researchedMessage: "Peak productivity attained. Maintain course. Maintain efficiency.",
    effectDesc: "Octopuses and their roles, as well as their machines, are all four times as effective. Optimised.",
    cost: {
      science: 8E10
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "octalEfficiency"
      ],
      resources: [
        "octopus"
      ]
    },
    effect: {
      multiplier: {
        octopus: 4,
        collector: 4,
        scavenger: 4,
        clamCollector: 4,
        eggBrooder: 4,
        sprongeSmelter: 4,
        seaScourer: 4,
        prostheticPolyp: 4
      }
    }
  },

  mechanisedAlchemy: {
    name: "Mechanised Alchemy",
    desc: "Better engineering and transmutation processes lead to a refinement of our machines.",
    researchedMessage: "We are blurring the line between science and magic more than ever before!",
    effectDesc: "Shark machines are all four times as effective. We work better with the machines, not against them.",
    cost: {
      science: 1E10
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "engineering"
      ],
      resources: [
        "sharkonium"
      ]
    },
    effect: {
      multiplier: {
        fishMachine: 4,
        crystalMiner: 4,
        sandDigger: 4,
        autoTransmuter: 4,
        skimmer: 4,
        purifier: 4,
        heater: 4
      }
    }
  },

  mobiusShells: {
    name: "Mobius Shells",
    desc: "The intricate glasswork of crustacean technology can be made even finer for maximised performance.",
    researchedMessage: "So beautiful. So impossible, but yet so effective. Is it impossible? What are we looking at here?",
    effectDesc: "Crustacean machines are all four times as effective. Their glass shells defy all reason and geometry.",
    cost: {
      science: 1E9
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "coralCircuitry"
      ],
      resources: [
        "coralglass"
      ]
    },
    effect: {
      multiplier: {
        spongeFarmer: 4,
        berrySprayer: 4,
        glassMaker: 4
      }
    }
  },

  imperialDesigns: {
    name: "Imperial Designs",
    desc: "Some of the dolphins remember and have copies of plans for their machines from wherever they used to call home.",
    researchedMessage: "These designs will never work. Look, let's show them-- oh. Oh, apparently they do. Huh.",
    effectDesc: "Cetacean machines are all four times as effective. We begrudingly admit their quality is not entirely terrible.",
    cost: {
      science: 1E9
    },
    required: {
      upgrades: [
        "gateDiscovery",
        "dolphinTechnology"
      ],
      resources: [
        "delphinium"
      ]
    },
    effect: {
      multiplier: {
        tirelessCrafter: 4,
        silentArchivist: 4
      }
    }
  }

};
/* -------------------------- data: artifacts.js -------------------------- */
SharkGame.ArtifactUtil = {
  migratorCost: function (level) {
    return Math.floor(Math.pow(2, level + 1));
  },
  migratorEffect: function (level, resourceName) {
    if (level < 1) {
      return;
    }
    var amount = Math.pow(5, level);
    // force existence
    SharkGame.World.forceExistence(resourceName);
    var res = SharkGame.Resources.getTotalResource(resourceName);
    if (res < amount) {
      SharkGame.Resources.changeResource(resourceName, amount);
    }
  },
  totemCost: function (level) {
    return Math.floor(Math.pow(2.5, level + 1));
  },
  totemEffect: function (level, resourceList) {
    if (level < 1) {
      return;
    }
    var wr = SharkGame.World.worldResources;
    var multiplier = level + 1;
    _.each(resourceList, function (resourceName) {
      if (wr[resourceName].artifactMultiplier) {
        wr[resourceName].artifactMultiplier *= multiplier;
      } else {
        wr[resourceName].artifactMultiplier = multiplier;
      }
    });
  }
};

SharkGame.Artifacts = {
  permanentMultiplier: {
    name: "Time Anemone",
    desc: "Applies a multiplier to all income.",
    flavour: "As creatures dwell within the sea, so too do creature dwell within causality.",
    max: 5,
    cost: function (level) {
      return Math.floor(Math.pow(10, level + 1));
    },
    effect: function (level) {
      SharkGame.Resources.specialMultiplier = Math.max((2 * level), 1);
    }
  },
  planetTerraformer: {
    name: "World Shaper",
    desc: "Reduce the severity of planet climates.",
    flavour: "Intelligence is not changing to fit an environment, but changing the environment to fit you.",
    max: 10,
    cost: function (level) {
      return Math.floor(Math.pow(4, level + 1));
    }
    // effect is handled specially
    // check SharkGame.World.getTerraformMultiplier
  },
  gateCostReducer: {
    name: "Gate Controller",
    desc: "Reduces the cost requirements of gates.",
    flavour: "Power over the unknown can only reach so far.",
    max: 10,
    cost: function (level) {
      return Math.floor(Math.pow(3, level + 1));
    }
    // effect is handled specially
    // check SharkGame.World.getGateCostMultiplier
  },
  planetScanner: {
    name: "Distant Foresight",
    desc: "Reveals properties of worlds before travelling to them.",
    flavour: "Knowledge may not change destiny, but it may divert it.",
    max: 15,
    cost: function (level) {
      return Math.floor(Math.pow(1.5, level + 1));
    }
    // effect is handled specially
    // check SharkGame.Gateway.getMaxWorldQualitiesToShow
  },
  sharkMigrator: {
    name: "Shark Migrator",
    desc: "Bring some sharks with you to the next world.",
    flavour: "Essence forges a barrier. Sharks are fragile between worlds.",
    max: 10,
    required: ["shark"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "shark");
    }
  },
  rayMigrator: {
    name: "Ray Migrator",
    desc: "Bring some rays with you to the next world.",
    flavour: "The gateway has no sand to hide in.",
    max: 10,
    required: ["ray"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "ray");
    }
  },
  crabMigrator: {
    name: "Crab Migrator",
    desc: "Bring some crabs with you to the next world.",
    flavour: "Essence-refined shells to keep the crabs alive.",
    max: 10,
    required: ["crab"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "crab");
    }
  },
  shrimpMigrator: {
    name: "Shrimp Migrator",
    desc: "Bring some shrimp with you to the next world.",
    flavour: "The hive produces a new hive.",
    max: 10,
    required: ["shrimp"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "shrimp");
    }
  },
  lobsterMigrator: {
    name: "Lobster Migrator",
    desc: "Bring some lobsters with you to the next world.",
    flavour: "Relaxing in the astral seas.",
    max: 10,
    required: ["lobster"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "lobster");
    }
  },
  dolphinMigrator: {
    name: "Dolphin Migrator",
    desc: "Bring some dolphins with you to the next world.",
    flavour: "They will find this transportation strangely familiar.",
    max: 10,
    required: ["dolphin"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "dolphin");
    }
  },
  whaleMigrator: {
    name: "Whale Migrator",
    desc: "Bring some whales with you to the next world.",
    flavour: "They need no protection, only persuasion.",
    max: 10,
    required: ["whale"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "whale");
    }
  },
  eelMigrator: {
    name: "Eel Migrator",
    desc: "Bring some eels with you to the next world.",
    flavour: "Essence tunnels for them to slide into a new domain.",
    max: 10,
    required: ["eel"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "eel");
    }
  },
  chimaeraMigrator: {
    name: "Chimaera Migrator",
    desc: "Bring some chimaeras with you to the next world.",
    flavour: "The light is unbearable. Essence dulls the brightness.",
    max: 10,
    required: ["chimaera"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "chimaera");
    }
  },
  octopusMigrator: {
    name: "Octopus Migrator",
    desc: "Bring some octopuses with you to the next world.",
    flavour: "The gateway defies reason. It is uncomfortable to the rational mind.",
    max: 10,
    required: ["octopus"],
    cost: SharkGame.ArtifactUtil.migratorCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.migratorEffect(level, "octopus");
    }
  },
  sharkTotem: {
    name: "Totem of Shark",
    desc: "Increase the effectiveness of sharks and their roles.",
    flavour: "To hunt. To catch. To win.",
    max: 10,
    required: ["shark"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["shark", "scientist", "nurse", "diver"]);
    }
  },
  rayTotem: {
    name: "Totem of Ray",
    desc: "Increase the effectiveness of rays and their roles.",
    flavour: "Flying across the ocean in grace and serenity.",
    max: 10,
    required: ["ray"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["ray", "laser", "maker"]);
    }
  },
  crabTotem: {
    name: "Totem of Crab",
    desc: "Increase the effectiveness of crabs and their roles.",
    flavour: "No stone left unturned.",
    max: 10,
    required: ["crab"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["crab", "planter", "brood"]);
    }
  },
  shrimpTotem: {
    name: "Totem of Shrimp",
    desc: "Increase the effectiveness of shrimp and their roles.",
    flavour: "The hive mind awakens.",
    max: 10,
    required: ["shrimp"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["shrimp", "worker", "queen"]);
    }
  },
  lobsterTotem: {
    name: "Totem of Lobster",
    desc: "Increase the effectiveness of lobster and their roles.",
    flavour: "The seabed is a priceless treasure.",
    max: 10,
    required: ["lobster"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["lobster", "berrier", "harvester"]);
    }
  },
  dolphinTotem: {
    name: "Totem of Dolphin",
    desc: "Increase the effectiveness of dolphins and their roles.",
    flavour: "Exiles of a greater threat.",
    max: 10,
    required: ["dolphin"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["dolphin", "philosopher", "biologist", "treasurer"]);
    }
  },
  whaleTotem: {
    name: "Totem of Whale",
    desc: "Increase the effectiveness of whales.",
    flavour: "Keepers of song and mystery.",
    max: 10,
    required: ["whale"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["whale"]);
    }
  },
  eelTotem: {
    name: "Totem of Eel",
    desc: "Increase the effectiveness of eels and their roles.",
    flavour: "Snaking elegance, talented attendants.",
    max: 10,
    required: ["eel"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["eel", "sifter", "pit", "technician"]);
    }
  },
  chimaeraTotem: {
    name: "Totem of Chimaera",
    desc: "Increase the effectiveness of chimaeras and their roles.",
    flavour: "The prodigal descendants return.",
    max: 10,
    required: ["chimaera"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["chimaera", "transmuter", "explorer"]);
    }
  },
  octopusTotem: {
    name: "Totem of Octopus",
    desc: "Increase the effectiveness of octopuses and their roles.",
    flavour: "The cold, rational response is to maximise rewards.",
    max: 10,
    required: ["octopus"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["octopus", "collector", "scavenger"]);
    }
  },
  progressTotem: {
    name: "Totem of Progress",
    desc: "Increase the effectiveness of shark machines.",
    flavour: "Progress can be slowed, but it can never be stopped.",
    max: 10,
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["fishMachine", "sandDigger", "autoTransmuter", "crystalMiner", "skimmer", "purifier", "heater"]);
    }
  },
  carapaceTotem: {
    name: "Totem of Carapace",
    desc: "Increase the effectiveness of crustacean machines.",
    flavour: "The shelled machines are slow, but clean.",
    max: 10,
    required: ["shrimp", "lobster"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["spongeFarmer", "berrySprayer", "glassMaker"]);
    }
  },
  inspirationTotem: {
    name: "Totem of Inspiration",
    desc: "Increase the effectiveness of cetacean machines.",
    flavour: "Dreams of a former glory.",
    max: 10,
    required: ["dolphin"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["silentArchivist", "tirelessCrafter"]);
    }
  },
  industryTotem: {
    name: "Totem of Industry",
    desc: "Increase the effectiveness of cephalopod machines.",
    flavour: "Find unity in efficiency. Seek octal rationalities.",
    max: 10,
    required: ["octopus"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      SharkGame.ArtifactUtil.totemEffect(level, ["clamCollector", "sprongeSmelter", "seaScourer", "prostheticPolyp"]);
    }
  },
  wardingTotem: {
    name: "Totem of Warding",
    desc: "Reduce the adverse effects of harmful materials.",
    flavour: "The end is inevitable, but the wait can be lengthened.",
    max: 10,
    required: ["tar", "ice"],
    cost: SharkGame.ArtifactUtil.totemCost,
    effect: function (level) {
      if (level < 1) {
        return;
      }
      var resourceList = ["tar", "ice"];
      var wr = SharkGame.World.worldResources;
      var multiplier = 1 / (level + 1);
      _.each(resourceList, function (resourceName) {
        if (wr[resourceName].artifactMultiplier) {
          wr[resourceName].artifactMultiplier *= multiplier;
        } else {
          wr[resourceName].artifactMultiplier = multiplier;
        }
      });
    }
  }
};
/* -------------------------- data: sprites.js -------------------------- */
// This file contains JSON data created from TexturePacker
// Because it was autogenerated, it is ugly as hell. Only the frame is required.
SharkGame.Sprites = {
  "homesea-1": {
    "frame": {
      "x": 2,
      "y": 2,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-10": {
    "frame": {
      "x": 404,
      "y": 2,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-11": {
    "frame": {
      "x": 806,
      "y": 2,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-12": {
    "frame": {
      "x": 1208,
      "y": 2,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-13": {
    "frame": {
      "x": 1610,
      "y": 2,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-14": {
    "frame": {
      "x": 2,
      "y": 204,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-15": {
    "frame": {
      "x": 2,
      "y": 406,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-16": {
    "frame": {
      "x": 2,
      "y": 608,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-17": {
    "frame": {
      "x": 2,
      "y": 810,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-18": {
    "frame": {
      "x": 2,
      "y": 1012,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-19": {
    "frame": {
      "x": 2,
      "y": 1214,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-2": {
    "frame": {
      "x": 2,
      "y": 1416,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-20": {
    "frame": {
      "x": 404,
      "y": 204,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-21": {
    "frame": {
      "x": 806,
      "y": 204,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-22": {
    "frame": {
      "x": 1208,
      "y": 204,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-23": {
    "frame": {
      "x": 1610,
      "y": 204,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-24": {
    "frame": {
      "x": 404,
      "y": 406,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-25": {
    "frame": {
      "x": 806,
      "y": 406,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-26": {
    "frame": {
      "x": 1208,
      "y": 406,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-27": {
    "frame": {
      "x": 1610,
      "y": 406,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-28": {
    "frame": {
      "x": 404,
      "y": 608,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-29": {
    "frame": {
      "x": 404,
      "y": 810,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-3": {
    "frame": {
      "x": 404,
      "y": 1012,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-30": {
    "frame": {
      "x": 404,
      "y": 1214,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-31": {
    "frame": {
      "x": 404,
      "y": 1416,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-32": {
    "frame": {
      "x": 806,
      "y": 608,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-33": {
    "frame": {
      "x": 1208,
      "y": 608,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-34": {
    "frame": {
      "x": 1610,
      "y": 608,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-35": {
    "frame": {
      "x": 806,
      "y": 810,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-36": {
    "frame": {
      "x": 1208,
      "y": 810,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-4": {
    "frame": {
      "x": 1610,
      "y": 810,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-5": {
    "frame": {
      "x": 806,
      "y": 1012,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-6": {
    "frame": {
      "x": 806,
      "y": 1214,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-7": {
    "frame": {
      "x": 806,
      "y": 1416,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-8": {
    "frame": {
      "x": 1208,
      "y": 1012,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-9": {
    "frame": {
      "x": 1610,
      "y": 1012,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "homesea-missing": {
    "frame": {
      "x": 1208,
      "y": 1214,
      "w": 400,
      "h": 200
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 400,
      "h": 200
    },
    "sourceSize": {
      "w": 400,
      "h": 200
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/catchFish": {
    "frame": {
      "x": 2,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/forgeSpronge": {
    "frame": {
      "x": 54,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/fuseDelphinium": {
    "frame": {
      "x": 106,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getAutoTransmuter": {
    "frame": {
      "x": 158,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getBerrier": {
    "frame": {
      "x": 210,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getBiologist": {
    "frame": {
      "x": 262,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getBrood": {
    "frame": {
      "x": 314,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getChorus": {
    "frame": {
      "x": 366,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getClam": {
    "frame": {
      "x": 418,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getCrab": {
    "frame": {
      "x": 470,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getCrystalMiner": {
    "frame": {
      "x": 522,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getDiver": {
    "frame": {
      "x": 574,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getDolphin": {
    "frame": {
      "x": 626,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getFishMachine": {
    "frame": {
      "x": 678,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getHarvester": {
    "frame": {
      "x": 730,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getJellyfish": {
    "frame": {
      "x": 782,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getLaser": {
    "frame": {
      "x": 834,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getLobster": {
    "frame": {
      "x": 886,
      "y": 104,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getMaker": {
    "frame": {
      "x": 920,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getManta": {
    "frame": {
      "x": 938,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getNurse": {
    "frame": {
      "x": 972,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getPhilosopher": {
    "frame": {
      "x": 938,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getPlanter": {
    "frame": {
      "x": 990,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getQueen": {
    "frame": {
      "x": 1024,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getSandDigger": {
    "frame": {
      "x": 990,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getScientist": {
    "frame": {
      "x": 1042,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getSeaApple": {
    "frame": {
      "x": 1076,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getShark": {
    "frame": {
      "x": 1042,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getShrimp": {
    "frame": {
      "x": 1094,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getTreasurer": {
    "frame": {
      "x": 1128,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getWhale": {
    "frame": {
      "x": 1094,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/getWorker": {
    "frame": {
      "x": 1146,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/jellyfishToScience": {
    "frame": {
      "x": 1180,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/pearlConversion": {
    "frame": {
      "x": 1146,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/prySponge": {
    "frame": {
      "x": 1198,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/seaApplesToScience": {
    "frame": {
      "x": 1232,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/smeltCoralglass": {
    "frame": {
      "x": 1198,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/spongeToScience": {
    "frame": {
      "x": 1250,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "actions/transmuteSharkonium": {
    "frame": {
      "x": 1284,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "general/missing-action": {
    "frame": {
      "x": 1250,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "general/missing-artifact": {
    "frame": {
      "x": 1302,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "general/missing-technology": {
    "frame": {
      "x": 1336,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/abandoned": {
    "frame": {
      "x": 2,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/chaotic": {
    "frame": {
      "x": 104,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/frigid": {
    "frame": {
      "x": 206,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/haven": {
    "frame": {
      "x": 308,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/marine": {
    "frame": {
      "x": 410,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/missing": {
    "frame": {
      "x": 512,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/shrouded": {
    "frame": {
      "x": 614,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/tempestuous": {
    "frame": {
      "x": 716,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "planets/violent": {
    "frame": {
      "x": 818,
      "y": 2,
      "w": 100,
      "h": 100
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 100,
      "h": 100
    },
    "sourceSize": {
      "w": 100,
      "h": 100
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/automation": {
    "frame": {
      "x": 1302,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/biology": {
    "frame": {
      "x": 1354,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/crabBiology": {
    "frame": {
      "x": 1388,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/crystalBite": {
    "frame": {
      "x": 1354,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/crystalContainer": {
    "frame": {
      "x": 1406,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/crystalSpade": {
    "frame": {
      "x": 1440,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/engineering": {
    "frame": {
      "x": 1406,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/exploration": {
    "frame": {
      "x": 1458,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/farExploration": {
    "frame": {
      "x": 1492,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/gateDiscovery": {
    "frame": {
      "x": 1458,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/kelpHorticulture": {
    "frame": {
      "x": 1510,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/laserRays": {
    "frame": {
      "x": 1544,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/rayBiology": {
    "frame": {
      "x": 1510,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/recyclerDiscovery": {
    "frame": {
      "x": 1562,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/seabedGeology": {
    "frame": {
      "x": 1596,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/statsDiscovery": {
    "frame": {
      "x": 1562,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/sunObservation": {
    "frame": {
      "x": 1648,
      "y": 2,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/thermalVents": {
    "frame": {
      "x": 1614,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/transmutation": {
    "frame": {
      "x": 1614,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/underwaterChemistry": {
    "frame": {
      "x": 1666,
      "y": 54,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  },
  "technologies/xenobiology": {
    "frame": {
      "x": 1666,
      "y": 106,
      "w": 50,
      "h": 50
    },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": {
      "x": 0,
      "y": 0,
      "w": 50,
      "h": 50
    },
    "sourceSize": {
      "w": 50,
      "h": 50
    },
    "pivot": {
      "x": 0,
      "y": 0
    }
  }
};

/* -------------------------- resources.js -------------------------- */
SharkGame.PlayerResources = {};
SharkGame.PlayerIncomeTable = {};


SharkGame.Resources = {

  INCOME_COLOR: '#808080',
  TOTAL_INCOME_COLOR: '#A0A0A0',
  UPGRADE_MULTIPLIER_COLOR: '#606060',
  BOOST_MULTIPLIER_COLOR: '#60A060',
  WORLD_MULTIPLIER_COLOR: '#6060A0',
  ARTIFACT_MULTIPLIER_COLOR: '#6F968A',

  specialMultiplier: null,
  rebuildTable: false,

  init: function () {
    // set all the amounts and total amounts of resources to 0
    $.each(SharkGame.ResourceTable, function (k, v) {
      SharkGame.PlayerResources[k] = {};
      SharkGame.PlayerResources[k].amount = 0;
      SharkGame.PlayerResources[k].totalAmount = 0;
      SharkGame.PlayerResources[k].incomeMultiplier = 1;
    });

    // populate income table with an entry for each resource!!
    $.each(SharkGame.ResourceTable, function (k, v) {
      SharkGame.PlayerIncomeTable[k] = 0;
    });

    SharkGame.Resources.specialMultiplier = 1;
  },

  processIncomes: function (timeDelta) {
    $.each(SharkGame.PlayerIncomeTable, function (k, v) {
      SharkGame.Resources.changeResource(k, v * timeDelta);
    });
  },

  recalculateIncomeTable: function (resources) {
    var r = SharkGame.Resources;
    var w = SharkGame.World;


    // clear income table first
    $.each(SharkGame.ResourceTable, function (k, v) {
      SharkGame.PlayerIncomeTable[k] = 0;
    });

    var worldResources = w.worldResources;

    $.each(SharkGame.ResourceTable, function (name, resource) {

      var worldResourceInfo = worldResources[name];
      if (worldResourceInfo.exists) {
        var playerResource = SharkGame.PlayerResources[name];
        // for this resource, calculate the income it generates
        if (resource.income) {

          var worldMultiplier = 1;
          if (worldResourceInfo) {
            worldMultiplier = worldResourceInfo.incomeMultiplier;
          }


          var costScaling = 1;
          // run over all resources first to check if costs can be met
          // if the cost can't be taken, scale the cost and output down to feasible levels
          if (!resource.forceIncome) {
            $.each(resource.income, function (k, v) {
              var change = r.getProductAmountFromGeneratorResource(name, k);
              if (change < 0) {
                var resourceHeld = r.getResource(k);
                if (resourceHeld + change <= 0) {
                  var scaling = resourceHeld / -change;
                  if (scaling >= 0 && scaling < 1) { // sanity checking
                    costScaling = Math.min(costScaling, scaling);
                  } else {
                    costScaling = 0; // better to break this way than break explosively
                  }
                }
              }
            });
          }

          // if there is a cost and it can be taken (or if there is no cost)
          // run over all resources to fill the income table
          $.each(resource.income, function (k, v) {
            var incomeChange = r.getProductAmountFromGeneratorResource(name, k, costScaling);
            if (SharkGame.World.doesResourceExist(k)) {
              SharkGame.PlayerIncomeTable[k] += incomeChange;
            }
          });
        }

        // calculate the income that should be added to this resource
        if (worldResourceInfo) {
          var worldResourceIncome = worldResourceInfo.income;
          var affectedResourceBoostMultiplier = worldResources[name].boostMultiplier;
          SharkGame.PlayerIncomeTable[name] += worldResourceIncome * affectedResourceBoostMultiplier * r.getSpecialMultiplier();
        }
      }
    });
  },

  getProductAmountFromGeneratorResource: function (generator, product, costScaling) {
    var r = SharkGame.Resources;
    var w = SharkGame.World;
    var playerResource = SharkGame.PlayerResources[generator];
    if (typeof (costScaling) !== "number") {
      costScaling = 1;
    }
    return SharkGame.ResourceTable[generator].income[product] * r.getResource(generator) * costScaling *
      playerResource.incomeMultiplier * w.getWorldIncomeMultiplier(generator) *
      w.getWorldBoostMultiplier(product) * w.getArtifactMultiplier(generator) *
      r.getSpecialMultiplier();
  },

  getSpecialMultiplier: function () {
    return Math.max((SharkGame.Resources.getResource("numen") * 10), 1) * SharkGame.Resources.specialMultiplier;
  },

  getIncome: function (resource) {
    return SharkGame.PlayerIncomeTable[resource]
  },

  getMultiplier: function (resource) {
    return SharkGame.PlayerResources[resource].incomeMultiplier;
  },

  setMultiplier: function (resource, multiplier) {
    SharkGame.PlayerResources[resource].incomeMultiplier = multiplier;
    SharkGame.Resources.recalculateIncomeTable();
  },

  // Adds or subtracts resources based on amount given.
  changeResource: function (resource, amount) {
    if (Math.abs(amount) < SharkGame.EPSILON) {
      return; // ignore changes below epsilon
    }

    var resourceTable = SharkGame.PlayerResources[resource];
    var prevTotalAmount = resourceTable.totalAmount;

    if (!SharkGame.World.doesResourceExist(resource)) {
      return; // don't change resources that don't technically exist
    }

    resourceTable.amount += amount;
    if (resourceTable.amount < 0) {
      resourceTable.amount = 0;
    }

    if (amount > 0) {
      resourceTable.totalAmount += amount;
    }

    if (prevTotalAmount < SharkGame.EPSILON) {
      // we got a new resource
      SharkGame.Resources.rebuildTable = true;
    }

    SharkGame.Resources.recalculateIncomeTable();
  },

  setResource: function (resource, newValue) {
    var resourceTable = SharkGame.PlayerResources[resource];

    resourceTable.amount = newValue;
    if (resourceTable.amount < 0) {
      resourceTable.amount = 0;
    }
    SharkGame.Resources.recalculateIncomeTable();
  },

  setTotalResource: function (resource, newValue) {
    SharkGame.PlayerResources[resource].totalAmount = newValue;
  },

  getResource: function (resource) {
    return SharkGame.PlayerResources[resource].amount;
  },

  getTotalResource: function (resource) {
    return SharkGame.PlayerResources[resource].totalAmount;
  },

  isCategoryVisible: function (category) {
    var visible = false;
    $.each(category.resources, function (_, v) {
      visible = visible || ((SharkGame.PlayerResources[v].totalAmount > 0) && SharkGame.World.doesResourceExist(v));
    });
    return visible;
  },

  getCategoryOfResource: function (resourceName) {
    var categoryName = "";
    $.each(SharkGame.ResourceCategories, function (categoryKey, categoryValue) {
      if (categoryName !== "") {
        return;
      }
      $.each(categoryValue.resources, function (k, v) {
        if (categoryName !== "") {
          return;
        }
        if (resourceName == v) {
          categoryName = categoryKey;
        }
      });
    });
    return categoryName;
  },

  getResourcesInCategory: function (categoryName) {
    var resources = [];
    $.each(SharkGame.ResourceCategories[categoryName].resources, function (i, v) {
      resources.push(v);
    });
    return resources;
  },

  isCategory: function (name) {
    return !(typeof (SharkGame.ResourceCategories[name]) === 'undefined')
  },

  isInCategory: function (resource, category) {
    return SharkGame.ResourceCategories[category].resources.indexOf(resource) !== -1;
  },

  getBaseOfResource: function (resourceName) {
    // if there are super-categories/base jobs of a resource, return that, otherwise return null
    var baseResourceName = null;
    $.each(SharkGame.ResourceTable, function (key, value) {
      if (baseResourceName) {
        return;
      }
      if (value.jobs) {
        $.each(value.jobs, function (_, jobName) {
          if (baseResourceName) {
            return;
          }
          if (jobName === resourceName) {
            baseResourceName = key;
          }
        });
      }
    });
    return baseResourceName;
  },

  haveAnyResources: function () {
    var anyResources = false;
    $.each(SharkGame.PlayerResources, function (_, v) {
      if (!anyResources) {
        anyResources = v.totalAmount > 0;
      }
    });
    return anyResources;
  },

  // returns true if enough resources are held (>=)
  // false if they are not
  checkResources: function (resourceList, checkTotal) {
    var sufficientResources = true;
    $.each(SharkGame.ResourceTable, function (k, v) {
      var currentResource;
      if (!checkTotal) {
        currentResource = SharkGame.Resources.getResource(k);
      } else {
        currentResource = SharkGame.Resources.getTotalResource(k);
      }
      var listResource = resourceList[k];
      // amend for unspecified resources (assume zero)
      if (typeof listResource === 'undefined') {
        listResource = 0;
      }
      if (currentResource < listResource) {
        sufficientResources = false;
      }
    });
    return sufficientResources;
  },

  changeManyResources: function (resourceList, subtract) {
    if (typeof subtract === 'undefined') {
      subtract = false;
    }

    $.each(resourceList, function (k, v) {
      var amount = v;
      if (subtract) {
        amount *= -1;
      }
      SharkGame.Resources.changeResource(k, amount);
    });
  },

  scaleResourceList: function (resourceList, amount) {
    var newList = {};
    $.each(resourceList, function (k, v) {
      newList[k] = v * amount;
    });
    return newList;
  },

  // update values in table without adding rows
  updateResourcesTable: function () {
    var rTable = $('#resourceTable');
    var m = SharkGame.Main;
    var r = SharkGame.Resources;

    // if resource table does not exist, there are no resources, so do not construct table
    // if a resource became visible when it previously wasn't, reconstruct the table
    if (r.rebuildTable) {
      r.reconstructResourcesTable();
    } else {
      // loop over table rows, update values
      $.each(SharkGame.PlayerResources, function (k, v) {
        $('#amount-' + k).html(m.beautify(v.amount, true));

        var income = r.getIncome(k);
        if (Math.abs(income) > SharkGame.EPSILON) {
          var changeChar = income > 0 ? "+" : "";
          $('#income-' + k).html("<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautify(income) + "/s</span>");
        } else {
          $('#income-' + k).html("");
        }
      });
    }
  },

  // add rows to table (more expensive than updating existing DOM elements)
  reconstructResourcesTable: function () {
    var rTable = $('#resourceTable');
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var w = SharkGame.World;

    var statusDiv = $('#status');
    // if resource table does not exist, create
    if (rTable.length <= 0) {
      statusDiv.prepend('<h3>Stuff</h3>');
      var tableContainer = $('<div>').attr("id", "resourceTableContainer");
      tableContainer.append($('<table>').attr("id", 'resourceTable'));
      statusDiv.append(tableContainer);
      rTable = $('#resourceTable');
    }

    // remove the table contents entirely
    rTable.empty();

    var anyResourcesInTable = false;

    if (SharkGame.Settings.current.groupResources) {
      $.each(SharkGame.ResourceCategories, function (_, category) {
        if (r.isCategoryVisible(category)) {
          var headerRow = $("<tr>").append($("<td>")
            .attr("colSpan", 3)
            .append($("<h3>")
              .html(category.name)
            ));
          rTable.append(headerRow);
          $.each(category.resources, function (k, v) {
            if (r.getTotalResource(v) > 0) {
              var row = r.constructResourceTableRow(v);
              rTable.append(row);
              anyResourcesInTable = true;
            }
          });
        }
      });
    } else {
      // iterate through data, if total amount > 0 add a row
      $.each(SharkGame.ResourceTable, function (k, v) {
        if (r.getTotalResource(k) > 0 && w.doesResourceExist(k)) {
          var row = r.constructResourceTableRow(k);
          rTable.append(row);
          anyResourcesInTable = true;
        }
      });
    }

    // if the table is still empty, hide the status div
    // otherwise show it
    if (!anyResourcesInTable) {
      statusDiv.hide();
    } else {
      statusDiv.show();
    }

    r.rebuildTable = false;
  },

  constructResourceTableRow: function (resourceKey) {
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var k = resourceKey;
    var v = SharkGame.ResourceTable[k];
    var pr = SharkGame.PlayerResources[k];
    var income = r.getIncome(k);
    var row = $('<tr>');
    if (pr.totalAmount > 0) {
      row.append($('<td>')
        .attr("id", "resource-" + k)
        .html(SharkGame.Resources.getResourceName(k))
      );

      row.append($('<td>')
        .attr("id", "amount-" + k)
        .html(m.beautify(pr.amount))
      );

      var incomeId = $('<td>')
        .attr("id", "income-" + k);

      row.append(incomeId);

      if (Math.abs(income) > SharkGame.EPSILON) {
        var changeChar = income > 0 ? "+" : "";
        incomeId.html("<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautify(income) + "/s</span>");
      }
    }
    return row;
  },

  getResourceName: function (resourceName, darken, forceSingle) {
    var resource = SharkGame.ResourceTable[resourceName];
    var name = (((Math.floor(SharkGame.PlayerResources[resourceName].amount) - 1) < SharkGame.EPSILON) || forceSingle) ? resource.singleName : resource.name;

    if (SharkGame.Settings.current.colorCosts) {
      var color = resource.color;
      if (darken) {
        color = SharkGame.colorLum(resource.color, -0.5);
      }
      name = "<span class='click-passthrough' style='color:" + color + "'>" + name + "</span>";
    }
    return name;
  },


  // make a resource list object into a string describing its contents
  resourceListToString: function (resourceList, darken) {
    if ($.isEmptyObject(resourceList)) {
      return "";
    }
    var formattedResourceList = "";
    $.each(SharkGame.ResourceTable, function (k, v) {
      var listResource = resourceList[k];
      // amend for unspecified resources (assume zero)
      if (listResource > 0 && SharkGame.World.doesResourceExist(k)) {
        var isSingular = (Math.floor(listResource) - 1) < SharkGame.EPSILON;
        formattedResourceList += SharkGame.Main.beautify(listResource);
        formattedResourceList += " " + SharkGame.Resources.getResourceName(k, darken, isSingular) + ", ";
      }
    });
    // snip off trailing suffix
    formattedResourceList = formattedResourceList.slice(0, -2);
    return formattedResourceList;
  },

  getResourceSources: function (resource) {
    var sources = {
      "income": [],
      "actions": []
    };
    // go through all incomes
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (v.income) {
        var incomeForResource = v.income[resource];
        if (incomeForResource > 0) {
          sources.income.push(k);
        }
      }
    });
    // go through all actions
    $.each(SharkGame.HomeActions, function (k, v) {
      var resourceEffect = v.effect.resource;
      if (resourceEffect) {
        if (resourceEffect[resource] > 0) {
          sources.actions.push(k);
        }
      }
    });
    return sources;
  },

  // TESTING FUNCTIONS
  giveMeSomeOfEverything: function (amount) {
    $.each(SharkGame.ResourceTable, function (k, v) {
      SharkGame.Resources.changeResource(k, amount);
    });
  },


  // this was going to be used to randomise what resources were available but it needs better work to point out what is REQUIRED and what is OPTIONAL
  // create all chains that terminate only at a cost-free action to determine how to get to a resource
  // will return a weird vaguely tree structure of nested arrays (ughhh I need to learn how to OOP in javascript at some point, what a hack)
  getResourceDependencyChains: function (resource, alreadyKnownList) {
    var r = SharkGame.Resources;
    var l = SharkGame.World;
    var dependencies = [];
    if (!alreadyKnownList) {
      alreadyKnownList = []; // tracks resources we've already seen, an effort to combat cyclic dependencies
    }

    var sources = r.getResourceSources(resource);
    // get resource costs for actions that directly get this
    // only care about the resource types required
    $.each(sources.actions, function (_, v) {
      var actionCost = SharkGame.HomeActions[v].cost;
      $.each(actionCost, function (_, w) {
        var resource = w.resource;
        if (l.doesResourceExist(resource)) {
          dependencies.push(resource);
          alreadyKnownList.push(resource);
        }
      })
    });

    // get dependencies for income resources
    $.each(sources.income, function (_, v) {
      if (l.doesResourceExist(v)) {
        if (alreadyKnownList.indexOf(v) === -1) {
          dependencies.push(r.getResourceDependencyChains(v, alreadyKnownList));
        }
      }
    });

    return dependencies;
  }
};
/* -------------------------- world.js -------------------------- */
SharkGame.WorldModifiers = {
  planetaryIncome: {
    name: "Planetary Income",
    apply: function (level, resourceName, amount) {
      var wr = SharkGame.World.worldResources;
      wr[resourceName].income = level * amount;
    }
  },
  planetaryIncomeMultiplier: {
    name: "Planetary Income Multiplier",
    apply: function (level, resourceName, amount) {
      var wr = SharkGame.World.worldResources;
      wr[resourceName].incomeMultiplier = level * amount;
    }
  },
  planetaryIncomeReciprocalMultiplier: {
    name: "Planetary Income Reciprocal Multiplier",
    apply: function (level, resourceName, amount) {
      var wr = SharkGame.World.worldResources;
      wr[resourceName].incomeMultiplier = (1 / (level * amount));
    }
  },
  planetaryResourceBoost: {
    name: "Planetary Boost",
    apply: function (level, resourceName, amount) {
      var wr = SharkGame.World.worldResources;
      wr[resourceName].boostMultiplier = level * amount;
    }
  },
  planetaryResourceReciprocalBoost: {
    name: "Planetary Reciprocal Boost",
    apply: function (level, resourceName, amount) {
      var wr = SharkGame.World.worldResources;
      wr[resourceName].boostMultiplier = level * amount;
    }
  },
  planetaryStartingResources: {
    name: "Planetary Starting Resources",
    apply: function (level, resourceName, amount) {
      var bonus = level * amount;
      var res = SharkGame.Resources.getTotalResource(resourceName);
      if (res < bonus) {
        SharkGame.Resources.changeResource(resourceName, bonus);
      }
    }
  }
};

SharkGame.World = {

  worldType: "start",
  worldResources: {},
  planetLevel: 1,

  init: function () {
    var w = SharkGame.World;
    //w.worldType = "start";
    //w.planetLevel = 1;
    //w.worldResources = {};
    w.resetWorldProperties();
  },

  apply: function () {
    var w = SharkGame.World;
    w.applyWorldProperties(w.planetLevel);
    w.applyGateCosts(w.planetLevel);
  },

  resetWorldProperties: function () {
    var w = SharkGame.World;
    var wr = w.worldResources;
    var rt = SharkGame.ResourceTable;

    // set up defaults
    $.each(rt, function (k, v) {
      wr[k] = {};
      wr[k].exists = true;
      wr[k].income = 0;
      wr[k].incomeMultiplier = 1;
      wr[k].boostMultiplier = 1;
      wr[k].artifactMultiplier = 1;
    });
  },

  applyWorldProperties: function (level) {
    var w = SharkGame.World;
    var wr = w.worldResources;
    var worldInfo = SharkGame.WorldTypes[w.worldType];

    // get multiplier
    var terraformMultiplier = w.getTerraformMultiplier();
    var effectiveLevel = Math.max(Math.floor(level * terraformMultiplier), 1);

    // disable resources not allowed on planet
    $.each(worldInfo.absentResources, function (i, v) {
      wr[v].exists = false;
    });

    // apply world modifiers
    _.each(worldInfo.modifiers, function (modifierData) {
      if (SharkGame.Resources.isCategory(modifierData.resource)) {
        var resourceList = SharkGame.Resources.getResourcesInCategory(modifierData.resource);
        _.each(resourceList, function (resourceName) {
          SharkGame.WorldModifiers[modifierData.modifier].apply(effectiveLevel, resourceName, modifierData.amount);
        });
      } else {
        SharkGame.WorldModifiers[modifierData.modifier].apply(effectiveLevel, modifierData.resource, modifierData.amount);
      }
    });
  },

  applyGateCosts: function (level) {
    var w = SharkGame.World;
    var g = SharkGame.Gate;
    var worldInfo = SharkGame.WorldTypes[w.worldType];

    // get multiplier
    var gateCostMultiplier = w.getGateCostMultiplier();

    SharkGame.Gate.createSlots(worldInfo.gateCosts, w.planetLevel, gateCostMultiplier);
  },

  getWorldEntryMessage: function () {
    var w = SharkGame.World;
    return SharkGame.WorldTypes[w.worldType].entry;
  },

  // does this resource exist on this planet?
  doesResourceExist: function (resourceName) {
    var info = SharkGame.World.worldResources[resourceName];
    return info.exists;
  },

  forceExistence: function (resourceName) {
    SharkGame.World.worldResources[resourceName].exists = true;
  },

  getWorldIncomeMultiplier: function (resourceName) {
    return SharkGame.World.worldResources[resourceName].incomeMultiplier;
  },

  getWorldBoostMultiplier: function (resourceName) {
    return SharkGame.World.worldResources[resourceName].boostMultiplier;
  },

  getArtifactMultiplier: function (resourceName) {
    var artifactMultiplier = SharkGame.World.worldResources[resourceName].artifactMultiplier;
    return artifactMultiplier;
  },

  // these things are only impacted by artifacts so far

  getTerraformMultiplier: function () {
    var ptLevel = SharkGame.Artifacts.planetTerraformer.level;
    return (ptLevel > 0) ? Math.pow(0.9, ptLevel) : 1;
  },

  getGateCostMultiplier: function () {
    var gcrLevel = SharkGame.Artifacts.gateCostReducer.level;
    return (gcrLevel > 0) ? Math.pow(0.9, gcrLevel) : 1;
  }
};
/* -------------------------- log.js -------------------------- */
SharkGame.Log = {

  initialised: false,
  messages: [],

  init: function () {
    var l = SharkGame.Log;
    // create log
    $('#log').append("<button id='clearLog' class='min'></button><h3>Log<h3/><ul id='messageList'></ul>");
    // add clear button
    SharkGame.Button.replaceButton("clearLog", "&nbsp x &nbsp", l.clearMessages);
    l.initialised = true;
  },

  addMessage: function (message) {
    var l = SharkGame.Log;
    var s = SharkGame.Settings.current;
    var showAnims = s.showAnimations;

    if (!l.initialised) {
      l.init();
    }
    var messageList = $('#messageList');

    var messageItem = $('<li>').html(message);
    if (showAnims) {
      messageItem.hide()
        .css("opacity", 0)
        .prependTo('#messageList')
        .slideDown(50)
        .animate({
          opacity: 1.0
        }, 100);
    } else {
      messageItem.prependTo('#messageList');
    }
    l.messages.push(messageItem);

    SharkGame.Log.correctLogLength();

    return messageItem;
  },

  addError: function (message) {
    var l = SharkGame.Log;
    var messageItem = l.addMessage("Error: " + message);
    messageItem.addClass("error");
    return messageItem;
  },

  addDiscovery: function (message) {
    var l = SharkGame.Log;
    var messageItem = l.addMessage(message);
    messageItem.addClass("discovery");
    return messageItem;
  },

  correctLogLength: function () {
    var l = SharkGame.Log;
    var showAnims = SharkGame.Settings.current.showAnimations;
    var logMax = SharkGame.Settings.current.logMessageMax;

    if (l.messages.length >= logMax) {
      while (l.messages.length > logMax) {
        // remove oldest message
        if (showAnims) {
          l.messages[0].animate({
            opacity: 0.0
          }, 100, "swing", function () {
            $(this).remove();
          });
        } else {
          l.messages[0].remove();
        }

        // shift array (remove first item)
        l.messages.shift();
      }
    }
  },

  clearMessages: function () {
    var l = SharkGame.Log;
    // remove each element from page
    $.each(l.messages, function (_, v) {
      v.remove();
    });
    // wipe array
    l.messages = [];
  },

  haveAnyMessages: function () {
    return SharkGame.Log.messages.length > 0;
  }
};
/* -------------------------- save.js -------------------------- */
SharkGame.Save = {

  saveFileName: "sharkGameSave",

  saveGame: function (suppressSavingToStorage, dontFlat) {
    // populate save data object
    var saveString = "";
    var saveData = {};
    saveData.version = SharkGame.VERSION;
    saveData.resources = {};
    saveData.tabs = {};
    saveData.settings = {};
    saveData.upgrades = {};
    saveData.gateCostsMet = [];
    saveData.world = {
      type: SharkGame.World.worldType,
      level: SharkGame.World.planetLevel
    };
    saveData.artifacts = {};
    saveData.gateway = {
      betweenRuns: SharkGame.gameOver,
      wonGame: SharkGame.wonGame
    };

    $.each(SharkGame.PlayerResources, function (k, v) {
      saveData.resources[k] = {
        amount: v.amount,
        totalAmount: v.totalAmount
      };
    });

    $.each(SharkGame.Upgrades, function (k, v) {
      saveData.upgrades[k] = v.purchased;
    });

    $.each(SharkGame.Tabs, function (k, v) {
      if (k !== "current") {
        saveData.tabs[k] = v.discovered;
      } else {
        saveData.tabs.current = v;
      }
    });

    var gateCostTypes = [];
    $.each(SharkGame.Gate.costsMet, function (name, met) {
      gateCostTypes.push(name);
    });
    gateCostTypes.sort();

    $.each(gateCostTypes, function (i, name) {
      saveData.gateCostsMet[i] = SharkGame.Gate.costsMet[name];
    });

    $.each(SharkGame.Settings, function (k, v) {
      if (k !== "current") {
        saveData.settings[k] = SharkGame.Settings.current[k];
      }
    });

    $.each(SharkGame.Artifacts, function (k, v) {
      saveData.artifacts[k] = v.level;
    });

    // add timestamp
    //saveData.timestamp = (new Date()).getTime();
    saveData.timestampLastSave = (new Date()).getTime();
    saveData.timestampGameStart = SharkGame.timestampGameStart;
    saveData.timestampRunStart = SharkGame.timestampRunStart;
    saveData.timestampRunEnd = SharkGame.timestampRunEnd;

    if (dontFlat) {
      saveData.saveVersion = SharkGame.Save.saveUpdaters.length - 1;
      saveString = JSON.stringify(saveData);
    } else {
      //make a current-version template
      var saveVersion = SharkGame.Save.saveUpdaters.length - 1;
      var template = {};
      for (var i = 0; i <= saveVersion; i++) {
        var updater = SharkGame.Save.saveUpdaters[i];
        template = updater(template);
      }
      //flatten
      var flatData = SharkGame.Save.flattenData(template, saveData);
      flatData.unshift(saveVersion);
      saveString = pako.deflate(JSON.stringify(flatData), {
        to: 'string'
      });
    }

    if (!suppressSavingToStorage) {
      try {
        // convert compressed data to ascii85 for friendlier browser support (IE11 doesn't like weird binary data)
        var convertedSaveString = ascii85.encode(saveString);
        localStorage.setItem(SharkGame.Save.saveFileName, convertedSaveString);
      } catch (err) {
        throw new Error("Couldn't save to local storage. Reason: " + err.message);
      }
    }
    return saveString;
  },

  loadGame: function (importSaveData) {
    var saveData;
    var saveDataString = importSaveData || localStorage.getItem(SharkGame.Save.saveFileName);

    if (!saveDataString) {
      throw new Error("Tried to load game, but no game to load.");
    }

    // if first letter of string is <, data is encoded in ascii85, decode it.
    if (saveDataString.substring(0, 2) === "<~") {
      try {
        saveDataString = ascii85.decode(saveDataString);
      } catch (err) {
        throw new Error("Saved data looked like it was encoded in ascii85, but it couldn't be decoded. Can't load. Your save: " + saveDataString)
      }
    }

    // if first letter of string is x, data is compressed and needs uncompressing.
    if (saveDataString.charAt(0) === 'x') {
      // decompress string
      try {
        saveDataString = pako.inflate(saveDataString, {
          to: 'string'
        });
      } catch (err) {
        throw new Error("Saved data is compressed, but it can't be decompressed. Can't load. Your save: " + saveDataString);
      }
    }

    // if first letter of string is { or [, data is json
    if (saveDataString.charAt(0) === '{' || saveDataString.charAt(0) === '[') {
      try {
        saveData = JSON.parse(saveDataString);
      } catch (err) {
        var errMessage = "Couldn't load save data. It didn't parse correctly. Your save: " + saveDataString;
        if (importSaveData) {
          errMessage += " Did you paste the entire string?";
        }
        throw new Error(errMessage);
      }
    }

    // if first letter of string was [, data was packed, unpack it
    if (saveDataString.charAt(0) === '[') {
      try {
        //check version
        var currentVersion = SharkGame.Save.saveUpdaters.length - 1;
        var saveVersion = saveData.shift();
        if (typeof saveVersion !== "number" || saveVersion % 1 !== 0 || saveVersion < 0 || saveVersion > currentVersion) {
          throw new Error("Invalid save version!");
        }
        //create matching template
        var template = {};
        for (var i = 0; i <= saveVersion; i++) {
          var updater = SharkGame.Save.saveUpdaters[i];
          template = updater(template);
        }
        //unpack
        var saveDataFlat = saveData;
        saveData = SharkGame.Save.expandData(template, saveDataFlat.slice());
        saveData.saveVersion = saveVersion;

        function checkTimes(data) {
          return (data.timestampLastSave > 1e12 && data.timestampLastSave < 2e12 &&
            data.timestampGameStart > 1e12 && data.timestampGameStart < 2e12 &&
            data.timestampRunStart > 1e12 && data.timestampRunStart < 2e12)
        }

        //check if the template was sorted wrong when saving
        if (saveVersion <= 5 && !checkTimes(saveData)) {
          saveData = SharkGame.Save.expandData(template, saveDataFlat.slice(), true);
          saveData.saveVersion = saveVersion;
        }

        if (!checkTimes(saveData)) {
          throw new Error("Order appears to be corrupt.");
        }
      } catch (err) {
        throw new Error("Couldn't unpack packed save data. Reason: " + err.message + ". Your save: " + saveDataString);
      }
    }

    if (saveData) {
      // go through it

      //check for updates
      var currentVersion = SharkGame.Save.saveUpdaters.length - 1;
      saveData.saveVersion = saveData.saveVersion || 0;
      if (saveData.saveVersion < currentVersion) {
        for (i = saveData.saveVersion + 1; i <= currentVersion; i++) {
          var updater = SharkGame.Save.saveUpdaters[i];
          saveData = updater(saveData);
          saveData.saveVersion = i;
        }
        // let player know update went fine
        SharkGame.Log.addMessage("Updated save data from v " + saveData.version + " to " + SharkGame.VERSION + ".");
      }

      if (saveData.resources) {
        $.each(saveData.resources, function (k, v) {
          // check that this isn't an old resource that's been removed from the game for whatever reason
          if (SharkGame.PlayerResources[k]) {
            SharkGame.PlayerResources[k].amount = isNaN(v.amount) ? 0 : v.amount;
            SharkGame.PlayerResources[k].totalAmount = isNaN(v.totalAmount) ? 0 : v.totalAmount;
          }
        });
      }

      // hacky kludge: force table creation
      SharkGame.Resources.reconstructResourcesTable();

      if (saveData.upgrades) {
        $.each(saveData.upgrades, function (k, v) {
          if (saveData.upgrades[k]) {
            SharkGame.Lab.addUpgrade(k);
          }
        });
      }

      // load artifacts (need to have the terraformer and cost reducer loaded before world init)
      if (saveData.artifacts) {
        SharkGame.Gateway.init();
        $.each(saveData.artifacts, function (k, v) {
          SharkGame.Artifacts[k].level = v;
        });
      }

      // load world type and level and apply world properties
      if (saveData.world) {
        SharkGame.World.init();
        SharkGame.World.worldType = saveData.world.type;
        SharkGame.World.planetLevel = saveData.world.level;
        SharkGame.World.apply();
        SharkGame.Home.init();
      }

      // apply artifacts (world needs to be init first before applying other artifacts, but special ones need to be _loaded_ first)
      if (saveData.artifacts) {
        SharkGame.Gateway.applyArtifacts(true);
      }

      if (saveData.tabs) {
        $.each(saveData.tabs, function (k, v) {
          if (SharkGame.Tabs[k]) {
            SharkGame.Tabs[k].discovered = v;
          }
        });
        if (saveData.tabs.current) {
          SharkGame.Tabs.current = saveData.tabs.current;
        }
      }

      var gateCostTypes = [];
      $.each(SharkGame.Gate.costsMet, function (name, met) {
        gateCostTypes.push(name);
      });
      gateCostTypes.sort();

      if (gateCostTypes) {
        $.each(gateCostTypes, function (i, name) {
          SharkGame.Gate.costsMet[name] = saveData.gateCostsMet[i];
        });
      }

      if (saveData.settings) {
        $.each(saveData.settings, function (k, v) {
          if (SharkGame.Settings.current[k] !== undefined) {
            SharkGame.Settings.current[k] = v;
            // update anything tied to this setting right off the bat
            (SharkGame.Settings[k].onChange || $.noop)();
          }
        });
      }

      var currTimestamp = (new Date()).getTime();
      // create surrogate timestamps if necessary
      if ((typeof saveData.timestampLastSave !== "number")) {
        saveData.timestampLastSave = currTimestamp;
      }
      if ((typeof saveData.timestampGameStart !== "number")) {
        saveData.timestampGameStart = currTimestamp;
      }
      if ((typeof saveData.timestampRunStart !== "number")) {
        saveData.timestampRunStart = currTimestamp;
      }
      if ((typeof saveData.timestampRunEnd !== "number")) {
        saveData.timestampRunEnd = currTimestamp;
      }

      SharkGame.timestampLastSave = saveData.timestampLastSave;
      SharkGame.timestampGameStart = saveData.timestampGameStart;
      SharkGame.timestampRunStart = saveData.timestampRunStart;
      SharkGame.timestampRunEnd = saveData.timestampRunEnd;

      // load existence in in-between state,
      // else check for offline mode and process
      var simulateOffline = SharkGame.Settings.current.offlineModeActive;
      if (saveData.gateway) {
        if (saveData.gateway.betweenRuns) {
          simulateOffline = false;
          SharkGame.wonGame = saveData.gateway.wonGame;
          SharkGame.Main.endGame(true);
        }
      }

      // if offline mode is enabled
      if (simulateOffline) {
        // get times elapsed since last save game
        var now = (new Date()).getTime();
        var secondsElapsed = (now - saveData.timestampLastSave) / 1000;
        if (secondsElapsed < 0) {
          // something went hideously wrong or someone abused a system clock somewhere
          secondsElapsed = 0;
        }

        // process this
        SharkGame.Resources.recalculateIncomeTable();
        SharkGame.Main.processSimTime(secondsElapsed);

        // acknowledge long time gaps
        if (secondsElapsed > 3600) {
          var notification = "Welcome back! It's been ";
          var numHours = Math.floor(secondsElapsed / 3600);
          if (numHours > 24) {
            var numDays = Math.floor(numHours / 24);
            if (numDays > 7) {
              var numWeeks = Math.floor(numDays / 7);
              if (numWeeks > 4) {
                var numMonths = Math.floor(numWeeks / 4);
                if (numMonths > 12) {
                  var numYears = Math.floor(numMonths / 12);
                  notification += "almost " + (numYears === 1 ? "a" : numYears) + " year" + SharkGame.plural(numYears) + ", thanks for remembering this exists!"
                } else {
                  notification += "like " + (numMonths === 1 ? "a" : numMonths) + " month" + SharkGame.plural(numMonths) + ", it's getting kinda crowded.";
                }
              } else {
                notification += "about " + (numWeeks === 1 ? "a" : numWeeks) + " week" + SharkGame.plural(numWeeks) + ", you were gone a while!";
              }
            } else {
              notification += (numDays === 1 ? "a" : numDays) + " day" + SharkGame.plural(numDays) + ", and look at all the stuff you have now!";
            }
          } else {
            notification += (numHours === 1 ? "an" : numHours) + " hour" + SharkGame.plural(numHours) + " since you were seen around here!";
          }
          SharkGame.Log.addMessage(notification);
        }
      }
    } else {
      throw new Error("Couldn't load saved game. I don't know how to break this to you, but I think your save is corrupted. Your save: " + saveDataString);
    }
  },

  importData: function (data) {
    // decode from ascii85
    var saveData;
    try {
      saveData = ascii85.decode(data);
    } catch (err) {
      SharkGame.Log.addError("That's not encoded properly. Are you sure that's the full save export string?");
    }
    // load the game from this save data string
    try {
      SharkGame.Save.loadGame(saveData);
    } catch (err) {
      SharkGame.Log.addError(err.message);
      console.log(err.trace);
    }
    // refresh current tab
    SharkGame.Main.setUpTab();
  },

  exportData: function () {
    // get save
    var saveData = localStorage.getItem(SharkGame.Save.saveFileName);
    if (saveData === null) {
      try {
        saveData = SharkGame.Save.saveGame(true);
      } catch (err) {
        SharkGame.Log.addError(err.message);
        console.log(err.trace);
      }
    }
    // check if save isn't encoded
    if (saveData.substring(0, 2) !== "<~") {
      // encode it
      saveData = ascii85.encode(saveData);
    }
    return saveData;
  },

  savedGameExists: function () {
    return (localStorage.getItem(SharkGame.Save.saveFileName) !== null);
  },

  deleteSave: function () {
    localStorage.removeItem(SharkGame.Save.saveFileName);
  },

  // Thanks to Dylan for managing to crush saves down to a much smaller size!
  createBlueprint: function (template, sortWrong) {
    function createPart(t) {
      var bp = [];
      $.each(t, function (k, v) {
        if (typeof v === "object" && v !== null) {
          bp.push([k, createPart(v)]);
        } else {
          bp.push(k);
        }
      });
      bp.sort(function (a, b) {
        a = typeof a === "object" ? a[0] : a;
        b = typeof b === "object" ? b[0] : b;
        if (sortWrong) {
          return a > b; //mercy on my soul
        } else {
          return a > b ? 1 : -1;
        }
      });
      return bp;
    }

    return createPart(template);
  },

  flattenData: function (template, source) {
    var out = [];

    function flattenPart(bp, src) {
      $.each(bp, function (_, slot) {
        if (typeof slot === "object") {
          flattenPart(slot[1], src[slot[0]]);
        } else {
          var elem = src[slot];
          if (typeof elem === "number" && slot.indexOf("timestamp") === -1) {
            elem = Number(elem.toPrecision(5));
          }
          out.push(elem);
        }
      });
    }

    flattenPart(SharkGame.Save.createBlueprint(template), source);
    return out;
  },

  expandData: function (template, data, sortWrong) {
    function expandPart(bp) {
      var out = {}; //todo: array support
      $.each(bp, function (_, slot) {
        if (typeof slot === "object") {
          out[slot[0]] = expandPart(slot[1]);
        } else {
          if (data.length === 0) throw new Error("Incorrect save length.");
          out[slot] = data.shift();
        }
      });
      return out;
    }

    var expanded = expandPart(SharkGame.Save.createBlueprint(template, sortWrong));
    if (data.length !== 0) throw new Error("Incorrect save length.");
    return expanded;
  },

  saveUpdaters: [ //used to update saves and to make templates
    function (save) {
      //no one is converting a real save to version 0, so it doesn't need real values
      save.version = null;
      save.timestamp = null;
      save.resources = {};
      $.each(["essence", "shark", "ray", "crab", "scientist", "nurse", "laser", "maker", "planter", "brood", "crystalMiner", "autoTransmuter", "fishMachine", "science", "fish", "sand", "crystal", "kelp", "seaApple", "sharkonium"], function (i, v) {
        save.resources[v] = {
          amount: null,
          totalAmount: null
        };
      });
      save.upgrades = {};
      $.each(["crystalBite", "crystalSpade", "crystalContainer", "underwaterChemistry", "seabedGeology", "thermalVents", "laserRays", "automation", "engineering", "kelpHorticulture", "xenobiology", "biology", "rayBiology", "crabBiology", "sunObservation", "transmutation", "exploration", "farExploration", "gateDiscovery"], function (i, v) {
        save.upgrades[v] = null;
      });
      save.tabs = {
        "current": null,
        "home": {
          "discovered": null
        },
        "lab": {
          "discovered": null
        },
        "gate": {
          "discovered": null
        }
      };
      save.settings = {
        "buyAmount": null,
        "offlineModeActive": null,
        "autosaveFrequency": null,
        "logMessageMax": null,
        "sidebarWidth": null,
        "showAnimations": null,
        "colorCosts": null
      };
      save.gateCostsMet = {
        "fish": null,
        "sand": null,
        "crystal": null,
        "kelp": null,
        "seaApple": null,
        "sharkonium": null
      };
      return save;
    },

    // future updaters for save versions beyond the base:
    // they get passed the result of the previous updater and it continues in a chain
    // and they start based on the version they were saved
    function (save) {
      save = $.extend(true, save, {
        "resources": {
          "sandDigger": {
            "amount": 0,
            "totalAmount": 0
          },
          "junk": {
            "amount": 0,
            "totalAmount": 0
          }
        },
        "upgrades": {
          statsDiscovery: null,
          recyclerDiscovery: null
        },
        "settings": {
          "showTabHelp": false,
          "groupResources": false
        },
        "timestampLastSave": save.timestamp,
        "timestampGameStart": null,
        "timestampRunStart": null
      });
      // reformat tabs
      save.tabs = {
        "current": save.tabs["current"],
        "home": save.tabs["home"].discovered,
        "lab": save.tabs["lab"].discovered,
        "gate": save.tabs["gate"].discovered,
        "stats": false,
        "recycler": false
      };
      delete save.timestamp;
      return save;
    },

    // v0.6
    function (save) {
      // add new setting to list of saves
      save = $.extend(true, save, {
        "settings": {
          "iconPositions": "top"
        }
      });
      return save;
    },

    // v0.7
    function (save) {
      save = $.extend(true, save, {
        "settings": {
          "showTabImages": true
        },
        "tabs": {
          "reflection": false
        },
        "timestampRunEnd": null
      });
      _.each(["shrimp", "lobster", "dolphin", "whale", "chimaera", "octopus", "eel", "queen", "berrier", "biologist", "pit", "worker", "harvester", "philosopher", "treasurer", "chorus", "transmuter", "explorer", "collector", "scavenger", "technician", "sifter", "skimmer", "purifier", "heater", "spongeFarmer", "berrySprayer", "glassMaker", "silentArchivist", "tirelessCrafter", "clamCollector", "sprongeSmelter", "seaScourer", "prostheticPolyp", "sponge", "jellyfish", "clam", "coral", "algae", "coralglass", "delphinium", "spronge", "tar", "ice"], function (v) {
        save.resources[v] = {
          amount: 0,
          totalAmount: 0
        };
      });
      _.each(["environmentalism", "thermalConditioning", "coralglassSmelting", "industrialGradeSponge", "aquamarineFusion", "coralCircuitry", "sprongeBiomimicry", "dolphinTechnology", "spongeCollection", "jellyfishHunting", "clamScooping", "pearlConversion", "crustaceanBiology", "eusociality", "wormWarriors", "cetaceanAwareness", "dolphinBiology", "delphinePhilosophy", "coralHalls", "eternalSong", "eelHabitats", "creviceCreches", "bioelectricity", "chimaeraMysticism", "abyssalEnigmas", "octopusMethodology", "octalEfficiency"], function (v) {
        save.upgrades[v] = false;
      });
      save.world = {
        type: "start",
        level: 1
      };
      save.artifacts = {};
      _.each(["permanentMultiplier", "planetTerraformer", "gateCostReducer", "planetScanner", "sharkMigrator", "rayMigrator", "crabMigrator", "shrimpMigrator", "lobsterMigrator", "dolphinMigrator", "whaleMigrator", "eelMigrator", "chimaeraMigrator", "octopusMigrator", "sharkTotem", "rayTotem", "crabTotem", "shrimpTotem", "lobsterTotem", "dolphinTotem", "whaleTotem", "eelTotem", "chimaeraTotem", "octopusTotem", "progressTotem", "carapaceTotem", "inspirationTotem", "industryTotem", "wardingTotem"], function (v) {
        save.artifacts[v] = 0;
      });
      save.gateway = {
        betweenRuns: false
      };
      return save;
    },

    // a little tweak here and there
    function (save) {
      save = $.extend(true, save, {
        "settings": {
          "buttonDisplayType": "list"
        }
      });
      return save;
    },
    function (save) {
      save = $.extend(true, save, {
        "gateway": {
          "wonGame": false
        }
      });
      return save;
    },
    function (save) {
      // forgot to add numen to saved resources (which is understandable given it can't actually be legitimately achieved at this point)
      save.resources["numen"] = {
        amount: 0,
        totalAmount: 0
      };
      // completely change how gate slot status is saved
      save.gateCostsMet = [false, false, false, false, false, false];
      return save;
    },

    // v 0.71
    function (save) {
      _.each(["eggBrooder", "diver"], function (v) {
        save.resources[v] = {
          amount: 0,
          totalAmount: 0
        };
      });
      _.each(["agriculture", "ancestralRecall", "utilityCarapace", "primordialSong", "leviathanHeart", "eightfoldOptimisation", "mechanisedAlchemy", "mobiusShells", "imperialDesigns"], function (v) {
        save.upgrades[v] = false;
      });
      return save;
    }
  ]
};
/* -------------------------- settings.js -------------------------- */
SharkGame.Settings = {

  current: {},

  buyAmount: {
    defaultSetting: 1,
    show: false,
    options: [
      1,
      10,
      100,
      -3,
      -2,
      -1
    ]
  },

  showTabHelp: {
    defaultSetting: false,
    show: false,
    options: [
      true,
      false
    ]
  },

  groupResources: {
    defaultSetting: false,
    name: "Group Resources",
    desc: "Group resources in the table into categories for legibility.",
    show: true,
    options: [
      true,
      false
    ],
    onChange: function () {
      SharkGame.Resources.rebuildTable = true;
    }
  },

  buttonDisplayType: {
    defaultSetting: "list",
    name: "Home Sea Button Display",
    desc: "Do you want a vertical list of buttons, or a more space-saving configuration?",
    show: true,
    options: [
      "list",
      "pile"
    ],
    onChange: function () {
      SharkGame.Main.changeTab(SharkGame.Tabs.current);
    }
  },

  offlineModeActive: {
    defaultSetting: true,
    name: "Offline Mode",
    desc: "Let your numbers increase even with the game closed!",
    show: true,
    options: [
      true,
      false
    ]
  },

  autosaveFrequency: {
    // times given in minutes
    defaultSetting: 5,
    name: "Autosave Frequency",
    desc: "Number of minutes between autosaves.",
    show: true,
    options: [
      1,
      2,
      5,
      10,
      30
    ],
    onChange: function () {
      clearInterval(SharkGame.Main.autosaveHandler);
      SharkGame.Main.autosaveHandler = setInterval(SharkGame.Main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
      SharkGame.Log.addMessage("Now autosaving every " + SharkGame.Settings.current.autosaveFrequency + " minute" + SharkGame.plural(SharkGame.Settings.current.autosaveFrequency) + ".");
    }
  },

  logMessageMax: {
    defaultSetting: 20,
    name: "Max Log Messages",
    desc: "How many messages to show before removing old ones.",
    show: true,
    options: [
      5,
      10,
      15,
      20,
      25,
      30,
      50
    ],
    onChange: function () {
      SharkGame.Log.correctLogLength();
    }
  },

  sidebarWidth: {
    defaultSetting: "25%",
    name: "Sidebar Width",
    desc: "How much screen estate the sidebar should take.",
    show: true,
    options: [
      "20%",
      "25%",
      "30%",
      "35%",
      "40%",
      "45%",
      "50%"
    ],
    onChange: function () {
      var sidebar = $('#sidebar');
      if (SharkGame.Settings.current.showAnimations) {
        sidebar.animate({
          width: SharkGame.Settings.current.sidebarWidth
        }, "100");
      } else {
        sidebar.width(SharkGame.Settings.current.sidebarWidth);
      }
    }
  },

  showAnimations: {
    defaultSetting: true,
    name: "Show Animations",
    desc: "Show animations or don't. YOU DECIDE.",
    show: true,
    options: [
      true,
      false
    ]
  },

  colorCosts: {
    defaultSetting: true,
    name: "Color Resource Names",
    desc: "When displaying costs, color names of stuff.",
    show: true,
    options: [
      true,
      false
    ],
    onChange: function () {
      SharkGame.Resources.rebuildTable = true;
      SharkGame.Stats.recreateIncomeTable = true;
    }
  },

  iconPositions: {
    defaultSetting: "top",
    name: "Icon Positions",
    desc: "Where should icons go on the buttons?",
    show: true,
    options: [
      "top",
      "side",
      "off"
    ]
  },

  showTabImages: {
    defaultSetting: true,
    name: "Show Tab Header Images",
    desc: "Do you want the new header images or are they taking up precious screen real-estate?",
    show: true,
    options: [
      true,
      false
    ],
    onChange: function () {
      SharkGame.Main.changeTab(SharkGame.Tabs.current);
    }
  }


};
/* -------------------------- gateway.js -------------------------- */
SharkGame.Gateway = {

  NUM_ARTIFACTS_TO_SHOW: 3,
  NUM_PLANETS_TO_SHOW: 3,
  transitioning: false,
  selectedWorld: "",

  allowedWorlds: [
    "marine",
    "chaotic",
    "haven",
    "tempestuous",
    "violent",
    "abandoned",
    "shrouded",
    "frigid"
  ],

  artifactPool: [],
  planetPool: [],

  init: function () {
    // initialise artifact levels to 0 if they don't have a level
    // OTHERWISE KEEP THE EXISTING LEVEL
    _.each(SharkGame.Artifacts, function (artifactData) {
      if (!artifactData.level) {
        artifactData.level = 0;
      }
      artifactData.alreadyApplied = false;
    });
  },

  update: function () {
    var g = SharkGame.Gateway;
    g.updateArtifactButtons();

    var overlay = $('#overlay');
    var docHeight = $(window).height();
    overlay.height(docHeight);
  },

  enterGate: function (loadingFromSave) {
    var m = SharkGame.Main;
    var g = SharkGame.Gateway;

    // AWARD ESSENCE
    var essenceReward = 0;
    if (!loadingFromSave) {
      if (SharkGame.wonGame) {
        essenceReward = 1 + Math.floor(SharkGame.World.planetLevel / 5);
      } else {
        essenceReward = 0;
      }
      SharkGame.Resources.changeResource("essence", essenceReward);
    }

    // PREPARE ARTIFACTS
    g.prepareArtifactSelection(g.NUM_ARTIFACTS_TO_SHOW);

    // PREPARE PLANETS
    g.preparePlanetSelection(g.NUM_PLANETS_TO_SHOW);

    // SAVE
    SharkGame.Save.saveGame();

    // PREPARE GATEWAY PANE
    // set up classes
    var pane;
    if (!SharkGame.paneGenerated) {
      pane = SharkGame.Main.buildPane();
    } else {
      pane = $('#pane');
    }
    pane.addClass("gateway");

    var overlay = $('#overlay');
    overlay.addClass("gateway");
    var docHeight = $(document).height();

    // make overlay opaque
    overlay.height(docHeight);
    if (SharkGame.Settings.current.showAnimations) {
      overlay.show()
        .css("opacity", 0)
        .animate({
          opacity: 1.0
        }, 1000, "swing", function () { // put back to 4000
          g.cleanUp();
          g.showGateway(essenceReward);
        });
    } else {
      overlay.show()
        .css("opacity", 1.0);
      g.cleanUp();
      g.showGateway(essenceReward);
    }
  },


  cleanUp: function () {
    var m = SharkGame.Main;
    // empty out the game stuff behind
    m.purgeGame();
    // resize overlay
    var docHeight = $(window).height();
    $('#overlay').height(docHeight);
  },

  showGateway: function (essenceRewarded) {
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var g = SharkGame.Gateway;

    // get some useful numbers
    var essenceHeld = r.getResource("essence");
    var numenHeld = r.getResource("numen");

    // construct the gateway content
    var gatewayContent = $('<div>');
    gatewayContent.append($('<p>').html("You are a shark in the space between worlds."));
    if (!SharkGame.wonGame) {
      gatewayContent.append($('<p>').html("It is not clear how you have ended up here, but you remember a bitter defeat.").addClass("medDesc"));
    }
    gatewayContent.append($('<p>').html("Something unseen says,").addClass("medDesc"));
    gatewayContent.append($('<em>').attr("id", "gatewayVoiceMessage").html(g.getVoiceMessage()));
    if (essenceRewarded > 0) {
      gatewayContent.append($('<p>').html("Entering this place has changed you, granting you <span class='essenceCount'>" + m.beautify(essenceRewarded) + "</span> essence."));
    }
    gatewayContent.append($('<p>').html("You have <span id='essenceHeldDisplay' class='essenceCount'>" + m.beautify(essenceHeld) + "</span> essence."));
    if (numenHeld > 0) {
      var numenName = (numenHeld > 1) ? "numina" : "numen";
      gatewayContent.append($('<p>').html("You also have <span class='numenCount'>" + m.beautify(numenHeld) + "</span> " + numenName + ", and you radiate divinity."));
    }
    gatewayContent.append($('<p>').attr("id", "gatewayStatusMessage").addClass("medDesc"));

    // show end time
    var endRunInfoDiv = $('<div>');
    g.showRunEndInfo(endRunInfoDiv);
    gatewayContent.append(endRunInfoDiv);

    // add navigation buttons
    var navButtons = $('<div>').addClass("gatewayButtonList");
    SharkGame.Button.makeButton("backToGateway", "artifacts", navButtons, function () {
      g.switchViews(g.showArtifacts);
    });
    SharkGame.Button.makeButton("backToGateway", "worlds", navButtons, function () {
      g.switchViews(g.showPlanets);
    });
    gatewayContent.append(navButtons);

    m.showPane("GATEWAY", gatewayContent, true, 500, true);
    g.transitioning = false;
  },

  showRunEndInfo: function (containerDiv) {
    var m = SharkGame.Main;
    containerDiv.append($('<p>').html("<em>Time spent within last ocean:</em><br/>").append(m.formatTime(SharkGame.timestampRunEnd - SharkGame.timestampRunStart)));
  },

  showArtifacts: function () {
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var g = SharkGame.Gateway;

    var essenceHeld = r.getResource("essence");

    // construct the gateway content
    var gatewayContent = $('<div>');
    gatewayContent.append($('<p>').html("Your will flows into solid shapes beyond your control.<br>Focus."));
    gatewayContent.append($('<p>').html("You have <span id='essenceHeldDisplay' class='essenceCount'>" + m.beautify(essenceHeld) + "</span> essence."));
    gatewayContent.append($('<p>').attr("id", "gatewayStatusMessage").addClass("medDesc"));

    // show artifact pool
    if (_.size(g.artifactPool) === 0) {
      // we exhausted the pool (!!!)
      gatewayContent.append($('<p>').append($('<em>').html("\"You may not have achieved perfection, but it would take a deity to improve your capabilities further.\"")));
    } else {
      // there's something to show
      var artifactPool = $('<div>').addClass("gatewayButtonList");
      _.each(g.artifactPool, function (artifactName) {
        SharkGame.Button.makeButton("artifact-" + artifactName, artifactName, artifactPool, g.onArtifactButton);
      });
      gatewayContent.append(artifactPool);
      g.updateArtifactButtons();
    }

    // add return to gateway button
    var returnButtonDiv = $('<div>');
    SharkGame.Button.makeButton("backToGateway", "return to gateway", returnButtonDiv, function () {
      g.switchViews(g.showGateway);
    });
    gatewayContent.append(returnButtonDiv);

    m.showPane("ARTIFACTS", gatewayContent, true, 500, true);
    g.transitioning = false;
  },

  showPlanets: function () {
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var g = SharkGame.Gateway;

    // construct the gateway content
    var gatewayContent = $('<div>');
    gatewayContent.append($('<p>').html("Other worlds await."));

    // show planet pool
    var planetPool = $('<div>').addClass("gatewayButtonList");
    _.each(g.planetPool, function (planetInfo) {
      SharkGame.Button.makeButton("planet-" + planetInfo.type, planetInfo.type + " " + planetInfo.level, planetPool, function () {
        g.selectedWorld = $(this).attr("id").split("-")[1];
        g.switchViews(g.confirmWorld);
      }).addClass("planetButton");
    });
    gatewayContent.append(planetPool);

    // add return to gateway button
    var returnButtonDiv = $('<div>');
    SharkGame.Button.makeButton("backToGateway", "return to gateway", returnButtonDiv, function () {
      g.switchViews(g.showGateway);
    });
    gatewayContent.append(returnButtonDiv);

    m.showPane("WORLDS", gatewayContent, true, 500, true);
    g.transitioning = false;
    g.updatePlanetButtons();
  },

  confirmWorld: function () {
    var m = SharkGame.Main;
    var r = SharkGame.Resources;
    var g = SharkGame.Gateway;

    var selectedWorldData = SharkGame.WorldTypes[g.selectedWorld];
    var planetLevel = 1;
    _.each(g.planetPool, function (generatedWorld) {
      if (generatedWorld.type === g.selectedWorld) {
        planetLevel = generatedWorld.level;
      }
    });

    // construct the gateway content
    var gatewayContent = $('<div>');
    gatewayContent.append($('<p>').html("Travel to the " + selectedWorldData.name + " World?"));

    // add world image
    var spritename = "planets/" + g.selectedWorld;
    var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
    if (iconDiv) {
      iconDiv.addClass("planetDisplay");
      var containerDiv = $('<div>').attr("id", "planetContainer");
      containerDiv.append(iconDiv);
      gatewayContent.append(containerDiv);
    }

    var attributeDiv = $('<div>');
    g.showPlanetAttributes(selectedWorldData, planetLevel, attributeDiv);
    gatewayContent.append(attributeDiv);

    // add confirm button
    var confirmButtonDiv = $('<div>');
    SharkGame.Button.makeButton("progress", "proceed", confirmButtonDiv, function () {
      // kick back to main to start up the game again
      SharkGame.World.worldType = g.selectedWorld;
      SharkGame.World.planetLevel = planetLevel;
      SharkGame.Main.loopGame();
    });
    gatewayContent.append(confirmButtonDiv);


    // add return to planets button
    var returnButtonDiv = $('<div>');
    SharkGame.Button.makeButton("backToGateway", "reconsider", returnButtonDiv, function () {
      g.switchViews(g.showPlanets);
    });
    gatewayContent.append(returnButtonDiv);

    m.showPane("CONFIRM", gatewayContent, true, 500, true);
    g.transitioning = false;
  },

  switchViews: function (callback) {
    var g = SharkGame.Gateway;
    if (!g.transitioning) {
      g.transitioning = true;
      if (SharkGame.Settings.current.showAnimations) {
        $('#pane').animate({
          opacity: 0.0
        }, 500, "swing", function () {
          callback();
        });
      } else {
        callback();
      }
    }
  },

  prepareArtifactSelection: function (numArtifacts) {
    var g = SharkGame.Gateway;
    // empty existing pool
    g.artifactPool = [];

    // create pool of qualified artifacts
    var qualifiedArtifactPool = [];
    $.each(SharkGame.Artifacts, function (artifactName, artifactData) {
      var qualified = false;
      if (artifactData.required) {
        _.each(artifactData.required, function (resourceName) {
          qualified = qualified || SharkGame.World.doesResourceExist(resourceName);
        })
      } else {
        qualified = true;
      }

      // check max level
      if (artifactData.max) {
        if (artifactData.level >= artifactData.max) {
          qualified = false;
        }
      }

      if (qualified) {
        qualifiedArtifactPool.push(artifactName);
      }
    });

    // Reduce number of artifacts added to pool to however many we can actually have
    numArtifacts = Math.min(numArtifacts, qualifiedArtifactPool.length);
    // pull random items from the pool
    for (var i = 0; i < numArtifacts; i++) {
      var choice = SharkGame.choose(qualifiedArtifactPool);
      var index = qualifiedArtifactPool.indexOf(choice);
      // take it out of the qualified pool (avoid duplicates)
      qualifiedArtifactPool.splice(index, 1);
      // add choice to pool
      g.artifactPool.push(choice);
    }
  },

  onArtifactButton: function () {
    var button = $(this);
    var buttonName = button.attr("id");
    var artifactName = buttonName.split("-")[1];
    var artifactData = SharkGame.Artifacts[artifactName];
    var cost = artifactData.cost(artifactData.level);
    var essence = SharkGame.Resources.getResource("essence");
    if (essence >= cost) {
      SharkGame.Resources.changeResource("essence", -cost);
      artifactData.level++;
      var gatewayStatusMessageSel = $('#gatewayStatusMessage');
      if (artifactData.level >= artifactData.max) {
        gatewayStatusMessageSel.html("You reach the limit of the " + artifactData.name + ". You cannot improve it further.");
      } else {
        gatewayStatusMessageSel.html("Your will crystallises into the " + artifactData.name + ", at power " + artifactData.level + ".");
      }
      $('#essenceHeldDisplay').html(SharkGame.Main.beautify(SharkGame.Resources.getResource("essence")));
    }
    // disable button until next frame
    button.prop("disabled", true);
  },

  updateArtifactButtons: function () {
    var g = SharkGame.Gateway;
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    var essenceHeld = r.getResource("essence");
    _.each(g.artifactPool, function (artifactName) {
      var button = $('#artifact-' + artifactName);
      if (button.length > 0) {
        var artifactData = SharkGame.Artifacts[artifactName];
        var cost = artifactData.cost(artifactData.level);
        var maxedOut = (artifactData.level >= artifactData.max);
        var enableButton = true;
        if (essenceHeld < cost || maxedOut) {
          enableButton = false;
        }
        var purchaseLevel = maxedOut ? "Max" : (artifactData.level + 1);
        var label = artifactData.name +
          "<br><span class='medDesc'>( Pwr <span class='essenceCountBrighter'>" + purchaseLevel + "</span> )</span>" +
          "<br>" + artifactData.desc +
          "<br><br><span class='medDesc'>" + artifactData.flavour + "</span><br>";
        if (!maxedOut) {
          label += "</span><br>Cost: <span class='essenceCountBrighter'>" + m.beautify(cost) + "</span> essence";
        }
        button.prop("disabled", !enableButton).html(label);

        var spritename = "artifacts/" + artifactName;
        if (SharkGame.Settings.current.iconPositions !== "off") {
          var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-artifact");
          if (iconDiv) {
            iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
            if (!enableButton) {
              button.prepend($('<div>').append(iconDiv).addClass("tint"));
            } else {
              button.prepend(iconDiv);
            }
          }
        }
      }
    });
  },

  preparePlanetSelection: function (numPlanets) {
    var g = SharkGame.Gateway;
    // empty existing pool
    g.planetPool = [];

    // create pool of qualified types
    var qualifiedPlanetTypes = g.allowedWorlds.slice(0);

    // pull random types from the pool
    // for each type pulled, generated a random level for the planet
    // then add to the planet pool
    for (var i = 0; i < numPlanets; i++) {
      var choice = SharkGame.choose(qualifiedPlanetTypes);
      var index = qualifiedPlanetTypes.indexOf(choice);
      // take it out of the qualified pool (avoid duplicates)
      qualifiedPlanetTypes.splice(index, 1);

      // generate random level
      var newLevel = Math.floor(Math.max(SharkGame.World.planetLevel + (Math.random() * 10 - 5), 1));

      // add choice to pool
      g.planetPool.push({
        type: choice,
        level: newLevel
      });
    }
  },

  updatePlanetButtons: function () {
    var g = SharkGame.Gateway;
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    _.each(g.planetPool, function (planetData) {
      var buttonSel = $('#planet-' + planetData.type);
      if (buttonSel.length > 0) {
        var planetLevel = 1;
        _.each(g.planetPool, function (generatedWorld) {
          if (generatedWorld.type === planetData.type) {
            planetLevel = generatedWorld.level;
          }
        });
        var deeperPlanetData = SharkGame.WorldTypes[planetData.type];
        var label = deeperPlanetData.name +
          "<br><span class='medDesc'>( Climate Level " + m.beautify(planetLevel) + " )</span>" +
          "<br>" + deeperPlanetData.desc;

        buttonSel.html(label);

        var spritename = "planets/" + planetData.type;
        if (SharkGame.Settings.current.iconPositions !== "off") {
          var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
          if (iconDiv) {
            iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
            buttonSel.prepend(iconDiv);
          }
        }
      }
    });
  },

  applyArtifacts: function (force) {
    // handle general effects
    // special effects are handled by horrible spaghetti code sprinkled between this, World, and Resources
    $.each(SharkGame.Artifacts, function (artifactName, artifactData) {
      if (artifactData.effect && (!artifactData.alreadyApplied || force)) {
        artifactData.effect(artifactData.level);
        artifactData.alreadyApplied = true;
      }
    });
  },

  getVoiceMessage: function () {
    var message = "";
    var messagePool = [];
    var allMessages = SharkGame.Gateway.Messages;
    // the point of this function is to add to the message pool all available qualifying messages and then pick one
    var totalEssence = SharkGame.Resources.getTotalResource("essence");
    var lastPlanet = SharkGame.World.worldType;

    // if the game wasn't won, add loss messages
    if (!SharkGame.wonGame) {
      _.each(allMessages.loss, function (message) {
        messagePool.push(message);
      });
    } else {
      // determine which essence based messages should go into the pool
      _.each(allMessages.essenceBased, function (v) {
        var min = 0;
        if (v.min) {
          min = v.min;
        }
        var max = Number.MAX_VALUE;
        if (v.max) {
          max = v.max;
        }
        if (totalEssence >= min && totalEssence <= max) {
          _.each(v.messages, function (message) {
            messagePool.push(message);
          });
        }
      });

      // determine which planet based messages should go into the pool
      var planetPool = allMessages.lastPlanetBased[lastPlanet];
      if (planetPool) {
        _.each(planetPool, function (message) {
          messagePool.push(message);
        });
      }

      // finally just add all the generics into the pool
      _.each(allMessages.generic, function (message) {
        messagePool.push(message);
      });
    }

    message = SharkGame.choose(messagePool);
    return "\"" + message + "\"";
  },


  // GOD THIS IS A MESS
  // I'M SO SORRY FUTURE ME AND ANYONE ELSE READING THIS
  showPlanetAttributes: function (worldData, planetLevel, contentDiv) {
    // add known attributes
    var knownAttributeMax = SharkGame.Gateway.getMaxWorldQualitiesToShow();
    if (knownAttributeMax > 0) {
      var totalAttributes = _.size(worldData.modifiers);
      var ratio = (totalAttributes === 0) ? 1 : Math.min(1, knownAttributeMax / totalAttributes);
      contentDiv.append($('<p>').html("Known modifiers (" + (Math.floor(ratio * 100)) + "%):"));
      var modifierList = $('<ul>').addClass("gatewayPropertyList");
      var upperLimit = Math.min(knownAttributeMax, totalAttributes);
      for (var i = 0; i < upperLimit; i++) {
        var modifier = worldData.modifiers[i];
        var modifierDescription = SharkGame.WorldModifiers[modifier.modifier].name;
        var target = modifier.resource;
        var resourceName = "";
        if (SharkGame.Resources.isCategory(target)) {
          resourceName = SharkGame.ResourceCategories[target].name;
        } else {
          resourceName = SharkGame.Main.toTitleCase(SharkGame.ResourceTable[target].name);
        }
        modifierList.append($('<li>').html(modifierDescription + " - " + resourceName + " (" + modifier.amount + ")").addClass("medDesc"));
      }
      contentDiv.append(modifierList);

      // if all modifiers are revealed, carry over to the gate requirements and abandoned resources
      var bonusPoints = knownAttributeMax - totalAttributes;
      if (bonusPoints > 0) {
        var gateSlots = _.size(worldData.gateCosts);
        var gateRatio = Math.min(1, bonusPoints / gateSlots);
        contentDiv.append($('<p>').html("Known gate requirements (" + (Math.floor(gateRatio * 100)) + "%):"));
        var slotLimit = Math.min(bonusPoints, gateSlots);
        var gateList = $('<ul>').addClass("gatewayPropertyList");
        var gateKeySet = _.keys(worldData.gateCosts);
        for (var i = 0; i < slotLimit; i++) {
          var gateSlot = gateKeySet[i];
          var gateCost = Math.floor(worldData.gateCosts[gateSlot] * planetLevel * SharkGame.World.getGateCostMultiplier());
          var resourceName = SharkGame.Main.toTitleCase(SharkGame.ResourceTable[gateSlot].singleName);
          gateList.append($('<li>').html(resourceName + ": " + SharkGame.Main.beautify(gateCost)).addClass("medDesc"));
        }
        contentDiv.append(gateList);
        var totalBannedResources = _.size(worldData.absentResources);
        var bannedRatio = Math.min(1, bonusPoints / totalBannedResources);
        contentDiv.append($('<p>').html("Known absences (" + (Math.floor(bannedRatio * 100)) + "%):"));
        var bannedLimit = Math.min(bonusPoints, totalBannedResources);
        var bannedList = $('<ul>').addClass("gatewayPropertyList");
        for (var i = 0; i < bannedLimit; i++) {
          var bannedResource = worldData.absentResources[i];
          var resourceName = SharkGame.ResourceTable[bannedResource].singleName;
          bannedList.append($('<li>').html(resourceName).addClass("smallDesc"));
        }
        contentDiv.append(bannedList);
      }
    }
  },

  getMaxWorldQualitiesToShow: function () {
    var psLevel = SharkGame.Artifacts.planetScanner.level;
    return (psLevel > 0) ? psLevel + 1 : 0;
  },

  deleteArtifacts: function () {
    _.each(SharkGame.Artifacts, function (artifactData) {
      artifactData.level = 0;
    });
  }

};


SharkGame.Gateway.Messages = {
  essenceBased: [{
      max: 1,
      messages: [
        "Hello, newcomer.",
        "Ah. Welcome, new one.",
        "Your journey has only just begun.",
        "Welcome to the end of the beginning."
      ]
    },
    {
      min: 2,
      max: 10,
      messages: [
        "Your aptitude grows, I see.",
        "Your presence is weak, but it grows stronger.",
        "What new sights have you seen in these journeys?",
        "How are you finding your voyage?",
        "Have you noticed how few can follow you through the gates?"
      ]
    },
    {
      min: 11,
      max: 30,
      messages: [
        "How quickly do you travel through worlds?",
        "You are becoming familiar with this.",
        "Back so soon?",
        "Welcome back, to the space between spaces."
      ]
    },
    {
      min: 31,
      max: 50,
      messages: [
        "You are a traveller like any other.",
        "I see you here more than ever. Can you see me?",
        "Well met, shark friend.",
        "You remind me of myself, from a long, long time ago.",
        "Welcome back to irregular irreality."
      ]
    },
    {
      min: 51,
      max: 200,
      messages: [
        "What do you seek?",
        "Have you found your home yet?",
        "Surely your home lies but a jump or two away?",
        "Have you ever returned to one of the worlds you've been before?",
        "Can you find anyone else that journeys so frequently as you?",
        "You have become so strong. So powerful.",
        "I remember when you first arrived here, with confusion and terror in your mind."
      ]
    },
    {
      min: 201,
      messages: [
        "Your devotion to the journey is alarming.",
        "You exceed anything I've ever known.",
        "You are a force of will within the shell of a shark.",
        "It surprises me how much focus and dedication you show. Perhaps you may settle in your next world?",
        "Does your home exist?",
        "Is there an end to your quest?",
        "Why are you still searching? Many others would have surrendered to the odds by this point."
      ]
    }
  ],
  lastPlanetBased: {
    start: [
      "No other world you find will be as forgiving, newcomer.",
      "You have left the best of all possible worlds.",
      "It's all more difficult from here."
    ],
    marine: [
      "Did your last ocean feel all too familiar?",
      "Like your origins, but too different still.",
      "Was that world not your home?",
      "A blue world. A dream of a former life, perhaps."
    ],
    chaotic: [
      "You have survived the stranger world.",
      "A world on the brink of existence. Halfway between here and oblivion.",
      "You were given allies, yes, but at what cost?",
      "What a strange demand for the gate to possess.",
      "You are relieved the chaos is over, correct?"
    ],
    haven: [
      "A beautiful paradise. It may be a while before you find a world so peaceful.",
      "Did you ruin the world that fed you? There is no judgement here, only curiosity.",
      "A rare gem of a world. You will miss it, before long.",
      "What shining atoll do you leave behind? Those who could not follow you will surely live happily."
    ],
    tempestuous: [
      "You braved the maelstrom and came from it unscathed.",
      "A surprising victory from a veteran of the seas.",
      "Charge through the whirlpool. Give no quarter to the storm.",
      "The turbulent seas were no match for your prowess."
    ],
    violent: [
      "The boiling ocean only stirred you on.",
      "So hard to survive, yet so lucrative. A deadly balance.",
      "This is not the harshest world you will endure, surely.",
      "You are forged from the geothermal vents."
    ],
    abandoned: [
      "Do your previous worlds resemble this?",
      "Was that your first or second visit to that world?",
      "Do you wonder who abandoned the machines?",
      "What thoughts lie within your mind?",
      "Did you ever know this world before its death?"
    ],
    shrouded: [
      "The veil of mystery has yet to be pierced.",
      "Did the chimaeras recognise who you were?",
      "What did you learn from the dark world?",
      "Would you know your home if you found it?"
    ],
    frigid: [
      "Congratulations. Nature cannot touch you.",
      "Did you prefer arctic waters?",
      "Few worlds are so harsh. Fewer survive.",
      "You are a worthy traveller."
    ]
  },
  loss: [
    "No matter. You will succeed in future, no doubt.",
    "Never give in. Never surrender. Empty platitudes, perhaps, but sound advice nonetheless.",
    "Mistakes are filled with lessons. Learn never to repeat them.",
    "How does it feel to know that everyone who trusted you has perished?",
    "Another world dies. Was this one significant to you?",
    "A sad event. There is plenty of time to redeem yourself.",
    "What a pity. What a shame. I hear the mournful cries of a dying ocean.",
    "You can do better. You will do better. Believe.",
    "You wish to get back here so quickly?",
    "You and everything you knew has died. Perhaps not you. Perhaps not.",
    "One more try, perhaps?"
  ],
  generic: [
    "There is no warmth or cold here. Only numbness.",
    "What do you seek?",
    "We are on the edge of infinity, peering into a boundless sea of potential.",
    "You may not see me. Do not worry. I can see you.",
    "What am I? Oh, it is not so important. Not so soon.",
    "Is this the dream of a shark between worlds, or are the worlds a dream and this place your reality?",
    "A crossroads. Decisions. Decisions that cannot be shaken so lightly.",
    "There are such sights to behold for the ones who can see here.",
    "You are to the ocean what we are to the pathways.",
    "You swim through liquid eternity. You are now, always, and forever.",
    "The prodigal shark returns.",
    "Your constant drive to continue fuels your capacity to overcome.",
    "There is no space in this universe you cannot make your own."
  ]
};
/* -------------------------- tabs: home.js -------------------------- */
SharkGame.Home = {

  tabId: "home",
  tabDiscovered: true,
  tabName: "Home Sea",
  tabBg: "img/bg/bg-homesea.png",

  currentButtonTab: null,
  currentExtraMessageIndex: null,

  // Priority: later messages display if available, otherwise earlier ones.
  extraMessages: [
    // FIRST RUN
    {
      message: "&nbsp<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          fish: 5
        }
      },
      message: "You attract the attention of a shark. Maybe they can help you catch fish!<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          shark: 1
        }
      },
      message: "More sharks swim over, curious and watchful.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          fish: 15
        }
      },
      message: "Some rays drift over.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          shark: 1,
          ray: 1
        }
      },
      message: "You have quite the group going now.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          shark: 4,
          ray: 4
        }
      },
      message: "Some curious crabs come over.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          shark: 1,
          ray: 1,
          crab: 1
        }
      },
      message: "Your new tribe is at your command!<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          shark: 1,
          crystal: 10
        }
      },
      message: "The crystals are shiny. Some sharks stare at them curiously.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          scientist: 1
        }
      },
      message: "The science sharks swim in their own school.<br>&nbsp"
    },
    {
      unlock: {
        upgrade: ["crystalContainer"]
      },
      message: "More discoveries are needed.<br>&nbsp"
    },
    {
      unlock: {
        resource: {
          nurse: 1
        }
      },
      message: "The shark community grows with time.<br>&nbsp"
    },
    {
      unlock: {
        upgrade: ["exploration"]
      },
      message: "You hear faint songs and cries in the distance.<br>&nbsp"
    },
    {
      unlock: {
        upgrade: ["automation"]
      },
      message: "Machines to do things for you.<br>Machines to do things faster than you or any shark."
    },
    {
      unlock: {
        upgrade: ["farExploration"]
      },
      message: "This place is not your home. You remember a crystal blue ocean.<br>The chasms beckon."
    },
    {
      unlock: {
        upgrade: ["gateDiscovery"]
      },
      message: "The gate beckons. The secret must be unlocked.<br>&nbsp"
    },
    // LATER RUNS
    // INITIAL WORLD STATUSES
    {
      unlock: {
        world: "chaotic"
      },
      message: "Overwhelming reinforcements. Overwhelming everything. So hard to focus.<br>&nbsp"
    },
    {
      unlock: {
        world: "haven"
      },
      message: "The oceans are rich with life. But it's still not home.<br>&nbsp"
    },
    {
      unlock: {
        world: "marine"
      },
      message: "The fish never run dry here. This place feels so familiar.<br>&nbsp"
    },
    {
      unlock: {
        world: "tempestuous"
      },
      message: "The storm never ends, and many are lost to its violent throes.<br>&nbsp"
    },
    {
      unlock: {
        world: "violent"
      },
      message: "Bursts of plenty from the scorching vents, but so hot.<br>No place for the young."
    },
    {
      unlock: {
        world: "abandoned"
      },
      message: "The tar clogs the gills of everyone here.<br>This dying world drags everyone down with it."
    },
    {
      unlock: {
        world: "shrouded"
      },
      message: "The crystals are easier to find, but the darkness makes it hard to find anything else.<br>&nbsp"
    },
    {
      unlock: {
        world: "frigid"
      },
      message: "So cold. The food supplies freeze quickly here. Too hard to chew.<br>&nbsp"
    },
    // BANKED ESSENCE
    {
      unlock: {
        resource: {
          essence: 10
        }
      },
      message: "The other sharks obey and respect you, but they seem to fear you.<br>It is not clear if you are truly a shark anymore, or something... else."
    },
    // NEW ANIMALS
    {
      unlock: {
        resource: {
          shrimp: 50
        }
      },
      message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives."
    },
    {
      unlock: {
        resource: {
          lobster: 20
        }
      },
      message: "The lobsters work, but seem carefree.<br>They worry about nothing."
    },
    {
      unlock: {
        resource: {
          eel: 10
        }
      },
      message: "The eels chatter among their hiding places.<br>They like the sharks."
    },
    {
      unlock: {
        resource: {
          dolphin: 5
        }
      },
      message: "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile."
    },
    {
      unlock: {
        resource: {
          octopus: 8
        }
      },
      message: "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes."
    },
    {
      unlock: {
        resource: {
          whale: 1
        }
      },
      message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?"
    },
    {
      unlock: {
        resource: {
          chimaera: 5
        }
      },
      message: "The chimaeras are ancient kin of the shark kind, reunited through wild coincidence.<br>What peerless wonders have they found in the dark?"
    },
    // UNIQUE STATUSES
    {
      unlock: {
        resource: {
          chorus: 1
        }
      },
      message: "The whale song fills you with the same feeling as the gates. But so much smaller.<br>&nbsp"
    },
    // DANGER STATUSES
    {
      unlock: {
        world: "abandoned",
        resource: {
          tar: 20
        }
      },
      message: "The tar is killing everything!<br>Maybe a machine can save us?"
    },
    {
      unlock: {
        world: "abandoned",
        resource: {
          tar: 200
        }
      },
      message: "Only machines will remain. All is lost.<br><span class='smallDesc'>All is lost.</span>"
    },
    {
      unlock: {
        world: "frigid",
        resource: {
          ice: 50
        }
      },
      message: "Something has to be done before the ice destroys us all!<br>Maybe a machine can save us?"
    },
    {
      unlock: {
        world: "frigid",
        resource: {
          ice: 200
        }
      },
      message: "So cold. So hungry.<br><span class='smallDesc'>So hopeless.</span>"
    }
  ],

  init: function () {
    var h = SharkGame.Home;

    // rename home tab
    var tabName = SharkGame.WorldTypes[SharkGame.World.worldType].name + " Ocean";
    SharkGame.Home.tabName = tabName;

    // register tab
    SharkGame.Tabs[h.tabId] = {
      id: h.tabId,
      name: h.tabName,
      discovered: h.tabDiscovered,
      code: h
    };
    // populate action discoveries
    $.each(SharkGame.HomeActions, function (actionName, actionData) {
      actionData.discovered = false;
      actionData.newlyDiscovered = false;
    });

    h.currentExtraMessageIndex = -1;
    h.currentButtonTab = "all";
  },

  switchTo: function () {
    var h = SharkGame.Home;
    var content = $('#content');
    var tabMessage = $('<div>').attr("id", "tabMessage");
    content.append(tabMessage);
    h.currentExtraMessageIndex = -1;
    h.updateMessage(true);
    // button tabs
    var buttonTabDiv = $('<div>').attr("id", "homeTabs");
    content.append(buttonTabDiv);
    h.createButtonTabs();
    // help button
    var helpButtonDiv = $('<div>');
    helpButtonDiv.css({
      margin: "auto",
      clear: "both"
    });
    SharkGame.Button.makeButton("helpButton", "&nbsp Toggle descriptions &nbsp", helpButtonDiv, h.toggleHelp).addClass("min-block");
    content.append(helpButtonDiv);
    // button list
    var buttonList = $('<div>').attr("id", "buttonList");
    content.append(buttonList);
    if (SharkGame.Settings.current.buttonDisplayType === "pile") {
      buttonList.addClass("pileArrangement");
    } else {
      buttonList.removeClass("pileArrangement");
    }
    // background art!
    if (SharkGame.Settings.current.showTabImages) {
      tabMessage.css("background-image", "url('" + h.tabBg + "')");
    }
  },

  discoverActions: function () {
    var h = SharkGame.Home;
    $.each(SharkGame.HomeActions, function (actionName, actionData) {
      actionData.discovered = h.areActionPrereqsMet(actionName);
      actionData.newlyDiscovered = false;
    });
  },

  createButtonTabs: function () {
    var buttonTabDiv = $('#homeTabs');
    var buttonTabList = $('<ul>').attr("id", "homeTabsList");
    buttonTabDiv.empty();
    var tabAmount = 0;

    // add a header for each discovered category
    // make it a link if it's not the current tab
    $.each(SharkGame.HomeActionCategories, function (k, v) {
      var onThisTab = (SharkGame.Home.currentButtonTab === k);

      var categoryDiscovered = false;
      if (k === "all") {
        categoryDiscovered = true;
      } else {
        $.each(v.actions, function (_, actionName) {
          categoryDiscovered = categoryDiscovered || SharkGame.HomeActions[actionName].discovered;
        });
      }

      if (categoryDiscovered) {
        var tabListItem = $('<li>');
        if (onThisTab) {
          tabListItem.html(v.name);
        } else {
          tabListItem.append($('<a>')
            .attr("id", "buttonTab-" + k)
            .attr("href", "javascript:;")
            .html(v.name)
            .click(function () {
              var tab = ($(this).attr("id")).split("-")[1];
              SharkGame.Home.changeButtonTab(tab);
            })
          );
          if (v.hasNewItem) {
            tabListItem.addClass("newItemAdded");
          }
        }
        buttonTabList.append(tabListItem);
        tabAmount++;
      }
    });
    // finally at the very end just throw the damn list away if it only has two options
    // "all" + another category is completely pointless
    if (tabAmount > 2) {
      buttonTabDiv.append(buttonTabList);
    }
  },

  updateTab: function (tabToUpdate) {
    // return if we're looking at all buttons, no change there
    if (SharkGame.Home.currentButtonTab === "all") {
      return;
    }
    SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
    var tabItem = $('#buttonTab-' + tabToUpdate);
    if (tabItem.length > 0) {
      tabItem.parent().addClass("newItemAdded");
    } else {
      SharkGame.Home.createButtonTabs();
    }
  },

  changeButtonTab: function (tabToChangeTo) {
    var h = SharkGame.Home;
    SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
    if (tabToChangeTo === "all") {
      $.each(SharkGame.HomeActionCategories, function (k, v) {
        v.hasNewItem = false;
      })
    }
    h.currentButtonTab = tabToChangeTo;
    $('#buttonList').empty();
    h.createButtonTabs();
  },

  updateMessage: function (suppressAnimation) {
    var h = SharkGame.Home;
    var r = SharkGame.Resources;
    var u = SharkGame.Upgrades;
    var wi = SharkGame.WorldTypes[SharkGame.World.worldType];
    var selectedIndex = h.currentExtraMessageIndex;
    $.each(h.extraMessages, function (i, v) {
      var showThisMessage = true;
      // check if should show this message
      if (v.unlock) {
        if (v.unlock.resource) {
          $.each(v.unlock.resource, function (k, v) {
            showThisMessage = showThisMessage && (r.getResource(k) >= v);
          });
        }
        if (v.unlock.upgrade) {
          $.each(v.unlock.upgrade, function (i, v) {
            showThisMessage = showThisMessage && u[v].purchased;
          });
        }
        if (v.unlock.world) {
          showThisMessage = showThisMessage && SharkGame.World.worldType === v.unlock.world;
        }
      }
      if (showThisMessage) {
        selectedIndex = i;
      }
    });
    // only edit DOM if necessary
    if (h.currentExtraMessageIndex !== selectedIndex) {
      h.currentExtraMessageIndex = selectedIndex;
      var tabMessage = $('#tabMessage');
      if (SharkGame.Settings.current.showTabImages) {
        var sceneDiv = $('#tabSceneImage');
        if (sceneDiv.size() === 0) {
          sceneDiv = $('<div>').attr("id", "tabSceneImage");
        }
      }
      var message = "You are a shark in a " + wi.shortDesc + " sea.";
      message += "<br><span id='extraMessage' class='medDesc'>&nbsp<br>&nbsp</span>";
      tabMessage.html(message).prepend(sceneDiv);

      var extraMessageSel = $('#extraMessage');
      if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
        extraMessageSel.animate({
          opacity: 0
        }, 200, function () {
          var thisSel = $(this);
          thisSel.animate({
            opacity: 1
          }, 200).html(h.extraMessages[selectedIndex].message);
        });
        sceneDiv.animate({
          opacity: 0
        }, 500, function () {
          var thisSel = $(this);
          if (SharkGame.Settings.current.showTabImages) {
            SharkGame.changeSprite(SharkGame.spriteHomeEventPath, "homesea-" + (selectedIndex + 1), sceneDiv, "homesea-missing");
          }
          thisSel.animate({
            opacity: 1
          }, 500);
        });
      } else {
        extraMessageSel.html(h.extraMessages[selectedIndex].message);
        if (SharkGame.Settings.current.showTabImages) {
          SharkGame.changeSprite(SharkGame.spriteHomeEventPath, "homesea-" + (selectedIndex + 1), sceneDiv, "homesea-missing");
        }
      }
    }
  },

  update: function () {
    var h = SharkGame.Home;
    var r = SharkGame.Resources;
    var w = SharkGame.World;


    // for each button entry in the home tab,
    $.each(SharkGame.HomeActions, function (actionName, actionData) {
      var actionTab = h.getActionCategory(actionName);
      var onTab = (actionTab === h.currentButtonTab) || (h.currentButtonTab === "all");
      if (onTab) {
        var button = $('#' + actionName);
        if (button.length === 0) {
          if (actionData.discovered || h.areActionPrereqsMet(actionName)) {
            if (!actionData.discovered) {
              actionData.discovered = true;
              actionData.newlyDiscovered = true;
            }
            h.addButton(actionName);
          }
        } else {
          // button exists
          h.updateButton(actionName);
        }
      } else {
        if (!actionData.discovered) {
          if (h.areActionPrereqsMet(actionName)) {
            actionData.discovered = true;
            actionData.newlyDiscovered = true;
            h.updateTab(actionTab);
          }
        }
      }
    });

    // update home message
    h.updateMessage();
  },

  updateButton: function (actionName) {
    var h = SharkGame.Home;
    var r = SharkGame.Resources;
    var amountToBuy = SharkGame.Settings.current.buyAmount;

    var button = $('#' + actionName);
    var actionData = SharkGame.HomeActions[actionName];

    var amount = amountToBuy;
    var actionCost;
    if (amountToBuy < 0) {
      var max = Math.floor(h.getMax(actionData));
      // convert divisor from a negative number to a positive fraction
      var divisor = 1 / (Math.floor((amountToBuy)) * -1);
      amount = max * divisor;
      amount = Math.floor(amount);
      if (amount < 1) amount = 1;
      actionCost = h.getCost(actionData, amount);
    } else {
      actionCost = h.getCost(actionData, amountToBuy);
    }
    // disable button if resources can't be met
    var enableButton;
    if ($.isEmptyObject(actionCost)) {
      enableButton = true; // always enable free buttons
    } else {
      enableButton = r.checkResources(actionCost);
    }

    var label = actionData.name;
    if (!$.isEmptyObject(actionCost) && amount > 1) {
      label += " (" + SharkGame.Main.beautify(amount) + ")";
    }

    // check for any infinite quantities
    var infinitePrice = false;
    _.each(actionCost, function (num) {
      if (num === Number.POSITIVE_INFINITY) {
        infinitePrice = true;
      }
    });
    if (infinitePrice) {
      label += "<br>Maxed out";
    } else {
      var costText = r.resourceListToString(actionCost, !enableButton);
      if (costText != "") {
        label += "<br>Cost: " + costText;
      }
    }

    if (SharkGame.Settings.current.showTabHelp) {
      if (actionData.helpText) {
        label += "<br><span class='medDesc'>" + actionData.helpText + "</span>";
      }
    }
    button.prop("disabled", !enableButton)
    button.html(label);


    var spritename = "actions/" + actionName;
    if (SharkGame.Settings.current.iconPositions !== "off") {
      var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-action");
      if (iconDiv) {
        iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
        if (!enableButton) {
          button.prepend($('<div>').append(iconDiv).addClass("tint"));
        } else {
          button.prepend(iconDiv);
        }
      }
    }
  },

  areActionPrereqsMet: function (actionName) {
    var r = SharkGame.Resources;
    var w = SharkGame.World;
    var prereqsMet = true; // assume true until proven false
    var action = SharkGame.HomeActions[actionName];
    // check resource prerequisites
    if (action.prereq.resource) {
      prereqsMet = prereqsMet && r.checkResources(action.prereq.resource, true);
    }
    // check if resource cost exists
    if (action.cost) {
      $.each(action.cost, function (i, v) {
        var costResource = v.resource;
        prereqsMet = prereqsMet && w.doesResourceExist(costResource);
      })
    }
    // check special worldtype prereqs
    if (action.prereq.world) {
      prereqsMet = prereqsMet && w.worldType === action.prereq.world;
    }
    // check upgrade prerequisites
    if (action.prereq.upgrade) {
      $.each(action.prereq.upgrade, function (_, v) {
        prereqsMet = prereqsMet && SharkGame.Upgrades[v].purchased;
      });
    }
    // check if resulting resource exists
    if (action.effect.resource) {
      $.each(action.effect.resource, function (k, v) {
        prereqsMet = prereqsMet && w.doesResourceExist(k);
      })
    }
    return prereqsMet;
  },

  addButton: function (actionName) {
    var h = SharkGame.Home;
    var buttonListSel = $('#buttonList');
    var actionData = SharkGame.HomeActions[actionName];

    var buttonSelector = SharkGame.Button.makeButton(actionName, actionData.name, buttonListSel, h.onHomeButton);
    h.updateButton(actionName);
    if (SharkGame.Settings.current.showAnimations) {
      buttonSelector.hide()
        .css("opacity", 0)
        .slideDown(50)
        .animate({
          opacity: 1.0
        }, 50);
    }
    if (actionData.newlyDiscovered) {
      buttonSelector.addClass("newlyDiscovered");
    }
  },

  getActionCategory: function (actionName) {
    var categoryName = "";
    $.each(SharkGame.HomeActionCategories, function (categoryKey, categoryValue) {
      if (categoryName !== "") {
        return;
      }
      $.each(categoryValue.actions, function (k, v) {
        if (categoryName !== "") {
          return;
        }
        if (actionName == v) {
          categoryName = categoryKey;
        }
      });
    });
    return categoryName;
  },

  onHomeButton: function () {
    var h = SharkGame.Home;
    var r = SharkGame.Resources;
    var amountToBuy = SharkGame.Settings.current.buyAmount;
    // get related entry in home button table
    var button = $(this);
    var buttonName = button.attr("id");
    var action = SharkGame.HomeActions[buttonName];
    var actionCost = {};
    var amount = 0;
    if (amountToBuy < 0) {
      // unlimited mode, calculate the highest we can go
      var max = h.getMax(action);
      // floor max
      max = Math.floor(max);
      if (max > 0) {
        // convert divisor from a negative number to a positive fraction
        var divisor = 1 / (Math.floor((amountToBuy)) * -1);
        amount = max * divisor;
        // floor amount
        amount = Math.floor(amount);
        // make it worth entering this function
        if (amount < 1) amount = 1;
        actionCost = h.getCost(action, amount);
      }
    } else {
      actionCost = h.getCost(action, amountToBuy);
      amount = amountToBuy;
    }

    if ($.isEmptyObject(actionCost)) {
      // free action
      // do not repeat or check for costs
      if (action.effect.resource) {
        r.changeManyResources(action.effect.resource);
      }
      SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
    } else if (amount > 0) {
      // cost action
      // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
      if (r.checkResources(actionCost)) {
        // take cost
        r.changeManyResources(actionCost, true);
        // execute effects
        if (action.effect.resource) {
          var resourceChange;
          if (amount !== 1) {
            resourceChange = r.scaleResourceList(action.effect.resource, amount);
          } else {
            resourceChange = action.effect.resource;
          }
          r.changeManyResources(resourceChange);
        }
        // print outcome to log
        if (!(action.multiOutcomes) || (amount == 1)) {
          SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
        } else {
          SharkGame.Log.addMessage(SharkGame.choose(action.multiOutcomes));
        }
      } else {
        SharkGame.Log.addMessage("You can't afford that!");
      }
    }
    if (button.hasClass("newlyDiscovered")) {
      action.newlyDiscovered = false;
      button.removeClass("newlyDiscovered");
    }
    // disable button until next frame
    button.prop("disabled", true);
  },

  getCost: function (action, amount) {
    var calcCost = {};
    var rawCost = action.cost;

    $.each(rawCost, function (i, v) {
      var resource = SharkGame.PlayerResources[action.max];
      var currAmount = resource.amount;
      if (resource.jobs) {
        $.each(resource.jobs, function (_, v) {
          currAmount += SharkGame.Resources.getResource(v);
        });
      }
      var costFunction = v.costFunction;
      var k = v.priceIncrease;
      var cost = 0;
      switch (costFunction) {
        case "constant":
          cost = SharkGame.MathUtil.constantCost(currAmount, currAmount + amount, k);
          break;
        case "linear":
          cost = SharkGame.MathUtil.linearCost(currAmount, currAmount + amount, k);
          break;
        case "unique":
          cost = SharkGame.MathUtil.uniqueCost(currAmount, currAmount + amount, k);
          break;
      }
      calcCost[v.resource] = cost;
    });
    return calcCost;
  },


  getMax: function (action) {
    var max = 1;
    if (action.max) {
      var resource = SharkGame.PlayerResources[action.max];
      var currAmount = resource.amount;
      if (resource.jobs) {
        $.each(resource.jobs, function (_, v) {
          currAmount += SharkGame.Resources.getResource(v);
        });
      }
      max = Number.MAX_VALUE;
      var rawCost = action.cost;
      $.each(rawCost, function (_, v) {
        var costResource = SharkGame.PlayerResources[v.resource];

        var costFunction = v.costFunction;
        var k = v.priceIncrease;
        var subMax = -1;
        switch (costFunction) {
          case "constant":
            subMax = SharkGame.MathUtil.constantMax(currAmount, costResource.amount, k) - currAmount;
            break;
          case "linear":
            subMax = SharkGame.MathUtil.linearMax(currAmount, costResource.amount, k) - currAmount;
            break;
          case "unique":
            subMax = SharkGame.MathUtil.uniqueMax(currAmount, costResource.amount, k) - currAmount;
            break;
        }
        max = Math.min(max, subMax);
      });
    }
    return Math.floor(max);
  },

  toggleHelp: function () {
    SharkGame.Settings.current.showTabHelp = !SharkGame.Settings.current.showTabHelp;
  }
};
/* -------------------------- tabs: lab.js -------------------------- */
SharkGame.Lab = {

  tabId: "lab",
  tabDiscovered: false,
  tabName: "Laboratory",
  tabBg: "img/bg/bg-lab.png",

  sceneImage: "img/events/misc/scene-lab.png",
  sceneDoneImage: "img/events/misc/scene-lab-done.png",

  discoverReq: {
    resource: {
      science: 10
    }
  },

  message: "Sort of just off to the side, the science sharks congregate and discuss things with words you've never heard before.",
  messageDone: "Sort of just off to the side, the science sharks quietly wrap up their badly disguised party and pretend to work.<br/>" +
    "Looks like that's it! No more things to figure out.",



  init: function () {
    var l = SharkGame.Lab;
    // register tab
    SharkGame.Tabs[l.tabId] = {
      id: l.tabId,
      name: l.tabName,
      discovered: l.tabDiscovered,
      discoverReq: l.discoverReq,
      code: l
    };

    // add default purchased state to each upgrade
    $.each(SharkGame.Upgrades, function (k, v) {
      SharkGame.Upgrades[k].purchased = false;
    });
  },

  switchTo: function () {
    var l = SharkGame.Lab;
    var content = $('#content');

    var allResearchDone = l.allResearchDone();
    var message = allResearchDone ? l.messageDone : l.message;
    var imgSrc = allResearchDone ? l.sceneDoneImage : l.sceneImage;
    var tabMessageSel = $('<div>').attr("id", "tabMessage");
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + imgSrc + "' id='tabSceneImage'>" + message;
      tabMessageSel.css("background-image", "url('" + l.tabBg + "')");
    }
    tabMessageSel.html(message);
    content.append(tabMessageSel);
    var buttonListContainer = $('<div>').attr("id", "buttonLeftContainer");
    buttonListContainer.append($('<div>').attr("id", "buttonList").append($("<h3>").html("Available Upgrades")));
    content.append(buttonListContainer);
    content.append($('<div>').attr("id", "upgradeList"));
    content.append($('<div>').addClass("clear-fix"));


    l.updateUpgradeList();
    if (allResearchDone) {
      $('#buttonList').append($('<p>').html("All clear here!"));
    }
  },

  update: function () {
    var l = SharkGame.Lab;


    // cache a selector
    var buttonList = $('#buttonList');

    // for each upgrade not yet bought
    $.each(SharkGame.Upgrades, function (key, value) {
      if (value.purchased) {
        return; // skip this upgrade altogether
      }

      // check if a button exists
      var button = $('#' + key);
      if (button.length === 0) {
        // add it if prequisite upgrades have been completed
        var prereqsMet = true; // assume true until proven false

        // check upgrade prerequisites
        if (value.required) {
          // check previous upgrades
          if (value.required.upgrades) {
            $.each(value.required.upgrades, function (_, v) {
              // check previous upgrade research
              if (SharkGame.Upgrades[v]) {
                prereqsMet = prereqsMet && SharkGame.Upgrades[v].purchased;
              } else {
                prereqsMet = false; // if the required upgrade doesn't exist, we definitely don't have it
              }
            });
          }
          // validate if upgrade is possible
          prereqsMet = prereqsMet && l.isUpgradePossible(key);
        }
        if (prereqsMet) {
          // add button
          var effects = SharkGame.Lab.getResearchEffects(value);
          var buttonSelector = SharkGame.Button.makeButton(key, value.name + "<br/>" + value.desc + "<br/>" + effects, buttonList, l.onLabButton);
          l.updateLabButton(key);
          if (SharkGame.Settings.current.showAnimations) {
            buttonSelector.hide()
              .css("opacity", 0)
              .slideDown(50)
              .animate({
                opacity: 1.0
              }, 50);
          }
        }
      } else {
        // button exists
        l.updateLabButton(key);
      }
    });
  },

  updateLabButton: function (upgradeName) {
    var r = SharkGame.Resources;
    var button = $('#' + upgradeName);
    var upgradeData = SharkGame.Upgrades[upgradeName];
    var upgradeCost = upgradeData.cost;


    var enableButton;
    if ($.isEmptyObject(upgradeCost)) {
      enableButton = true; // always enable free buttons
    } else {
      enableButton = r.checkResources(upgradeCost);
    }

    var effects = SharkGame.Lab.getResearchEffects(upgradeData, !enableButton);
    var label = upgradeData.name + "<br/>" + upgradeData.desc + "<br/>" + effects;
    var costText = r.resourceListToString(upgradeCost, !enableButton);
    if (costText != "") {
      label += "<br/>Cost: " + costText;
    }
    button.prop("disabled", !enableButton).html(label);

    var spritename = "technologies/" + upgradeName;
    if (SharkGame.Settings.current.iconPositions !== "off") {
      var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-technology");
      if (iconDiv) {
        iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
        if (!enableButton) {
          button.prepend($('<div>').append(iconDiv).addClass("tint"));
        } else {
          button.prepend(iconDiv);
        }
      }
    }
  },

  onLabButton: function () {
    var r = SharkGame.Resources;
    var l = SharkGame.Lab;
    var u = SharkGame.Upgrades;

    var upgradeId = $(this).attr("id");
    var upgrade = u[upgradeId];
    if (upgrade.purchased) {
      $(this).remove();
      return; // something went wrong don't even pay attention to this function
    }

    var upgradeCost = u[upgradeId].cost;

    if (r.checkResources(upgradeCost)) {
      // kill button
      $(this).remove();
      // take resources
      r.changeManyResources(upgradeCost, true);
      // purchase upgrade
      l.addUpgrade(upgradeId);
      // update upgrade list
      l.updateUpgradeList();

      if (upgrade.researchedMessage) {
        SharkGame.Log.addMessage(upgrade.researchedMessage);
      }
    }
  },

  addUpgrade: function (upgradeId) {
    var l = SharkGame.Lab;
    var r = SharkGame.Resources;
    var u = SharkGame.Upgrades;
    var upgrade = u[upgradeId];
    if (upgrade) {
      if (!upgrade.purchased) {
        upgrade.purchased = true;
        //l.updateResearchList();

        // if the upgrade has effects, do them
        if (upgrade.effect) {
          if (upgrade.effect.multiplier) {
            $.each(upgrade.effect.multiplier, function (k, v) {
              var newMultiplier = v * r.getMultiplier(k);
              r.setMultiplier(k, newMultiplier)
            });
          }
        }
      }
    }
  },

  allResearchDone: function () {
    var u = SharkGame.Upgrades;
    var l = SharkGame.Lab;
    var allDone = true;
    $.each(u, function (k, v) {
      if (l.isUpgradePossible(k)) {
        allDone = allDone && v.purchased;
      }
    });
    return allDone;
  },

  isUpgradePossible: function (upgradeName) {
    var w = SharkGame.World;
    var l = SharkGame.Lab;
    var upgradeData = SharkGame.Upgrades[upgradeName];
    var isPossible = true;

    if (upgradeData.required) {
      if (upgradeData.required.resources) {
        // check if any related resources exist in the world for this to make sense
        // unlike the costs where all resources in the cost must exist, this is an either/or scenario
        var relatedResourcesExist = false;
        _.each(upgradeData.required.resources, function (v) {
          relatedResourcesExist = relatedResourcesExist || w.doesResourceExist(v);
        });
        isPossible = isPossible && relatedResourcesExist;
      }
      if (upgradeData.required.upgrades) {
        // RECURSIVE CHECK REQUISITE TECHS
        _.each(upgradeData.required.upgrades, function (v) {
          isPossible = isPossible && l.isUpgradePossible(v);
        });
      }
      // check existence of resource cost
      // this is the final check, everything that was permitted previously will be made false
      $.each(upgradeData.cost, function (k, v) {
        isPossible = isPossible && w.doesResourceExist(k);
      });
    }

    return isPossible;
  },

  getResearchEffects: function (upgrade, darken) {
    var effects = "<span class='medDesc' class='click-passthrough'>(Effects: ";
    if (upgrade.effect) {
      if (upgrade.effect.multiplier) {
        $.each(upgrade.effect.multiplier, function (k, v) {
          if (SharkGame.World.doesResourceExist(k)) {
            effects += SharkGame.Resources.getResourceName(k, darken, true) + " power x " + v + ", ";
          }
        });
        // remove trailing suffix
        effects = effects.slice(0, -2);
      }
    } else {
      effects += "???";
    }
    effects += ")</span>";
    return effects;
  },

  updateUpgradeList: function () {
    var u = SharkGame.Upgrades;
    var upgradeList = $('#upgradeList');
    upgradeList.empty();
    upgradeList.append($("<h3>").html("Researched Upgrades"));
    var list = $('<ul>');
    $.each(u, function (k, v) {
      if (v.purchased) {
        list.append($("<li>")
          .html(v.name + "<br/><span class='medDesc'>" + v.effectDesc + "</span>")
        );
      }
    });
    upgradeList.append(list);
  }
};
/* -------------------------- tabs: stats.js -------------------------- */
SharkGame.Stats = {

  tabId: "stats",
  tabDiscovered: false,
  tabName: "Grotto",
  tabBg: "img/bg/bg-grotto.png",

  sceneImage: "img/events/misc/scene-grotto.png",

  recreateIncomeTable: null,

  discoverReq: {
    upgrade: [
      "statsDiscovery"
    ]
  },

  bannedDisposeCategories: [
    "special",
    "harmful"
  ],

  message: "The grotto is a place to keep a better track of resources." +
    "</br></br>You can also dispose of those you don't need anymore." +
    "</br>Disposing specialists returns them to their normal, previous lives.",

  init: function () {
    var s = SharkGame.Stats;
    // register tab
    SharkGame.Tabs[s.tabId] = {
      id: s.tabId,
      name: s.tabName,
      discovered: s.tabDiscovered,
      discoverReq: s.discoverReq,
      code: s
    };
    s.recreateIncomeTable = true;
  },

  switchTo: function () {
    var s = SharkGame.Stats;
    var content = $('#content');
    content.append($('<div>').attr("id", "tabMessage"));
    var statsContainer = $('<div>').attr("id", "statsContainer");
    content.append(statsContainer);
    statsContainer.append($('<div>').attr("id", "statsLeftContainer")
      .append($('<div>').attr("id", "incomeData"))
      .append($('<div>').attr("id", "disposeResource"))
    );
    statsContainer.append($('<div>').attr("id", "statsRightContainer")
      .append($('<div>').attr("id", "generalStats"))
    );

    statsContainer.append($('<div>').addClass("clear-fix"));
    var message = s.message;
    var tabMessageSel = $('#tabMessage');
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + s.sceneImage + "' id='tabSceneImage'>" + message;
      tabMessageSel.css("background-image", "url('" + s.tabBg + "')");
    }
    tabMessageSel.html(message);

    var disposeSel = $('#disposeResource');
    disposeSel.append($('<h3>').html("Dispose of Stuff"));
    s.createDisposeButtons();

    var table = s.createIncomeTable();
    var incomeDataSel = $('#incomeData');
    incomeDataSel.append($('<h3>').html("Income Details"));
    incomeDataSel.append($('<p>').html("(Listed below are resources, the income each resource gives you, and the total income you're getting from each thing.)").addClass("medDesc"));
    incomeDataSel.append(table);

    var genStats = $('#generalStats');
    genStats.append($('<h3>').html("General Stats"));
    var firstTime = SharkGame.Main.isFirstTime();
    if (!firstTime) {
      genStats.append($('<p>').html("<span class='medDesc'>Climate Level</span><br>" + SharkGame.Main.beautify(SharkGame.World.planetLevel)));
    }
    genStats.append($('<p>').html("Time since you began:<br/><span id='gameTime' class='timeDisplay'></span>").addClass("medDesc"));
    if (!firstTime) {
      genStats.append($('<p>').html("Time since you came through the gate:<br/><span id='runTime' class='timeDisplay'></span>").addClass("medDesc"));
    }
    genStats.append($('<h3>').html("Total Ocean Resources Acquired"));
    if (!firstTime) {
      genStats.append($('<p>').html("Essence given is the total acquired for the entire game and not just for this world.").addClass("medDesc"));
    }
    genStats.append(s.createTotalAmountTable());

    SharkGame.Main.createBuyButtons("rid");
  },

  update: function () {
    var m = SharkGame.Main;
    var s = SharkGame.Stats;

    s.updateDisposeButtons();
    s.updateIncomeTable();
    s.updateTotalAmountTable();
    if (s.recreateIncomeTable) {
      s.createIncomeTable();
      s.createTotalAmountTable();
      s.recreateIncomeTable = false;
    }

    // update run times
    var currTime = (new Date()).getTime();
    $('#gameTime').html(m.formatTime(currTime - SharkGame.timestampGameStart));
    $('#runTime').html(m.formatTime(currTime - SharkGame.timestampRunStart));
  },

  createDisposeButtons: function () {
    var r = SharkGame.Resources;
    var s = SharkGame.Stats;
    var m = SharkGame.Main;
    var buttonDiv = $('#disposeResource');
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0 && s.bannedDisposeCategories.indexOf(r.getCategoryOfResource(k)) === -1) {
        SharkGame.Button.makeButton("dispose-" + k, "Dispose of " + r.getResourceName(k), buttonDiv, SharkGame.Stats.onDispose);
      }
    });
  },

  updateDisposeButtons: function () {
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0) {
        var button = $('#dispose-' + k);
        var resourceAmount = r.getResource(k);
        var amountToDispose = SharkGame.Settings.current.buyAmount;
        if (amountToDispose < 0) {
          var max = resourceAmount;
          var divisor = Math.floor(amountToDispose) * -1;
          amountToDispose = Math.floor(max / divisor);
        }
        var forceSingular = amountToDispose === 1;
        var disableButton = (resourceAmount < amountToDispose) || (amountToDispose <= 0);
        var label = "Dispose of " + m.beautify(amountToDispose) + " " + r.getResourceName(k, disableButton, forceSingular);
        if (amountToDispose <= 0) {
          label = "Can't dispose any more " + r.getResourceName(k, disableButton, forceSingular);
        }

        button.html(label).prop("disabled", disableButton);
      }
    });
  },

  onDispose: function () {
    var r = SharkGame.Resources;
    var l = SharkGame.Log;
    var resourceName = ($(this).attr("id")).split("-")[1];
    var resourceAmount = r.getResource(resourceName);
    var amountToDispose = SharkGame.Settings.current.buyAmount;
    if (amountToDispose < 0) {
      var max = resourceAmount;
      var divisor = Math.floor(amountToDispose) * -1;
      amountToDispose = (max / divisor);
    }
    if (resourceAmount >= amountToDispose) {
      r.changeResource(resourceName, -amountToDispose);
      var category = SharkGame.ResourceCategories[r.getCategoryOfResource(resourceName)];
      var employmentPool = r.getBaseOfResource(resourceName);
      if (employmentPool) {
        r.changeResource(employmentPool, amountToDispose);
      }
      l.addMessage(SharkGame.choose(category.disposeMessage));
    } else {
      l.addMessage("Can't dispose that much! You don't have enough of it.");
    }
  },

  updateIncomeTable: function () {
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0 && SharkGame.ResourceTable[k].income) {
        var income = SharkGame.ResourceTable[k].income;
        $.each(income, function (incomeKey, incomeValue) {
          var cell = $("#income-" + k + "-" + incomeKey);
          var changeChar = incomeValue > 0 ? "+" : "";
          cell.html("<span style='color: " + r.TOTAL_INCOME_COLOR + "'>" + changeChar + m.beautify(r.getProductAmountFromGeneratorResource(k, incomeKey)) + "/s</span>");
        });
      }
    });
  },

  updateTotalAmountTable: function () {
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    $.each(SharkGame.ResourceTable, function (k, v) {
      var totalResource = r.getTotalResource(k);
      if (totalResource > 0) {
        var cell = $("#totalAmount-" + k);
        cell.html(m.beautify(totalResource));
      }
    });
  },

  createIncomeTable: function () {
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    var w = SharkGame.World;
    var incomesTable = $("#incomeTable");
    if (incomesTable.length === 0) {
      incomesTable = $("<table>").attr("id", "incomeTable");
    } else {
      incomesTable.empty();
    }

    var specialMultiplierCol = null;
    var addSpecialMultiplier = false;
    if (r.getSpecialMultiplier() > 1) {
      addSpecialMultiplier = true;
    }

    var formatCounter = 0;

    $.each(SharkGame.ResourceTable, function (generatorName, generatorData) {
      if (r.getTotalResource(generatorName) > 0 && generatorData.income) {


        // if the resource has an income requiring any costs
        // and it isn't a forced income
        // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
        var validIncome = true;
        var income = generatorData.income;
        var row = $("<tr>");

        var numIncomes = 0;
        $.each(income, function (incomeResourceName, incomeResourceAmount) {
          if (w.doesResourceExist(incomeResourceName) && r.getTotalResource(incomeResourceName) > 0) {
            numIncomes++;
          } else if (incomeResourceAmount < 0 && !generatorData.forceIncome) {
            // non-existent cost! abort! ABORT
            validIncome = false;
          }
        });

        if (validIncome) {
          var counter = 0;

          var rowStyle = (formatCounter % 2 === 0) ? "evenRow" : "oddRow";
          row.append($("<td>").html(r.getResourceName(generatorName)).attr("rowspan", numIncomes).addClass(rowStyle));

          $.each(income, function (incomeKey, incomeValue) {
            if (w.doesResourceExist(incomeKey) && r.getTotalResource(incomeKey) > 0) {
              var changeChar = incomeValue > 0 ? "+" : "";
              row.append($("<td>").html(r.getResourceName(incomeKey)).addClass(rowStyle));
              row.append($("<td>").html("<span style='color: " + r.INCOME_COLOR + "'>" + changeChar + m.beautify(incomeValue) + "/s</span>").addClass(rowStyle));

              // does this resource get a boost multiplier?
              var boostMultiplier = w.worldResources[incomeKey].boostMultiplier;
              if (boostMultiplier !== 1) {
                row.append($("<td>").html("<span style='color: " + r.BOOST_MULTIPLIER_COLOR + "'>x" + m.beautify(boostMultiplier) + "</span>").addClass(rowStyle));
              } else {
                row.append($("<td>").addClass(rowStyle)); // empty cell
              }

              if (counter === 0) {
                row.append($("<td>").attr("rowspan", numIncomes).html("<span style='color: " + r.UPGRADE_MULTIPLIER_COLOR + "'>x" + r.getMultiplier(generatorName) + "</span>").addClass(rowStyle));
                // does this income get a world multiplier?
                var worldMultiplier = w.getWorldIncomeMultiplier(generatorName);
                if (worldMultiplier !== 1) {
                  row.append($("<td>").attr("rowspan", numIncomes).html("<span style='color: " + r.WORLD_MULTIPLIER_COLOR + "'>x" + m.beautify(worldMultiplier) + "</span>").addClass(rowStyle));
                } else {
                  row.append($("<td>").attr("rowspan", numIncomes).addClass(rowStyle));
                }
                // does this income get an artifact multiplier?
                var artifactMultiplier = w.getArtifactMultiplier(generatorName);
                if (artifactMultiplier !== 1) {
                  row.append($("<td>").attr("rowspan", numIncomes).html("<span style='color: " + r.ARTIFACT_MULTIPLIER_COLOR + "'>x" + m.beautify(artifactMultiplier) + "</span>").addClass(rowStyle));
                } else {
                  row.append($("<td>").attr("rowspan", numIncomes).addClass(rowStyle));
                }
              }
              if (addSpecialMultiplier) {
                specialMultiplierCol = $("<td>").html("<span class='essenceGlow'>x" + m.beautify(r.getSpecialMultiplier()) + "</span>").addClass("essenceGlow");
                row.append(specialMultiplierCol);
                addSpecialMultiplier = false;
              }

              row.append($("<td>").attr("id", "income-" + generatorName + "-" + incomeKey)
                .html("<span style='color: " + r.TOTAL_INCOME_COLOR + "'>" + changeChar + m.beautify(r.getProductAmountFromGeneratorResource(generatorName, incomeKey)) + "/s</span>").addClass(rowStyle));

              counter++;
              incomesTable.append(row);
              row = $("<tr>");
            }

          });

          // throw away dangling values
          row = null;
          formatCounter++;
        }
      }
    });

    if (specialMultiplierCol) {
      var rowCount = incomesTable.find("tr").length;
      specialMultiplierCol.attr("rowspan", rowCount);
    }

    return incomesTable;
  },

  createTotalAmountTable: function () {
    var r = SharkGame.Resources;
    var m = SharkGame.Main;
    var totalAmountTable = $("#totalAmountTable");
    if (totalAmountTable.length === 0) {
      totalAmountTable = $("<table>").attr("id", "totalAmountTable");
    } else {
      totalAmountTable.empty();
    }

    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0) {
        var row = $('<tr>');

        row.append($('<td>').html(r.getResourceName(k)));
        row.append($('<td>').html(m.beautify(r.getTotalResource(k))).attr("id", "totalAmount-" + k));

        totalAmountTable.append(row);
      }
    });

    return totalAmountTable;
  }




};
/* -------------------------- tabs: recycler.js -------------------------- */
SharkGame.Recycler = {

  tabId: "recycler",
  tabDiscovered: false,
  tabName: "Recycler",
  tabBg: "img/bg/bg-recycler.png",

  sceneImage: "img/events/misc/scene-recycler.png",

  discoverReq: {
    upgrade: [
      "recyclerDiscovery"
    ]
  },

  message: "The recycler allows for the repurposing of any and all of your unwanted materials.<br/><span class='medDesc'>Feed the machines. Feed them.</span>",

  recyclerInputMessages: [
    "The machines grind and churn.",
    "Screech clunk chomp munch erp.",
    "Clunk clunk clunk screeeeech.",
    "The recycler hungrily devours the stuff you offer.",
    "The offerings are no more.",
    "Viscous, oily mess sloshes within the machine.",
    "The recycler reprocesses."
  ],

  recyclerOutputMessages: [
    "A brand new whatever!",
    "The recycler regurgitates your demand, immaculately formed.",
    "How does a weird blackish gel become THAT?",
    "Some more stuff to use! Maybe even to recycle!",
    "Gifts from the machine! Gifts that may have cost a terrible price!",
    "How considerate of this unfeeling, giant apparatus! It provides you stuff at inflated prices!"
  ],

  allowedCategories: {
    machines: "linear",
    stuff: "constant",
    processed: "constant",
    animals: "constant"
  },

  bannedResources: [
    "essence",
    "junk",
    "science",
    "seaApple"
  ],

  init: function () {
    var y = SharkGame.Recycler;
    // register tab
    SharkGame.Tabs[y.tabId] = {
      id: y.tabId,
      name: y.tabName,
      discovered: y.tabDiscovered,
      discoverReq: y.discoverReq,
      code: y
    };
  },

  switchTo: function () {
    var y = SharkGame.Recycler;
    var m = SharkGame.Main;
    var content = $('#content');
    content.append($('<div>').attr("id", "tabMessage"));
    var container = $('<div>').attr("id", "recyclerContainer");
    container.append($('<div>').attr("id", "inputButtons"));
    container.append($('<div>').attr("id", "junkDisplay"));
    container.append($('<div>').attr("id", "outputButtons"));
    content.append(container);
    content.append($('<div>').addClass("clear-fix"));
    var message = y.message;
    var tabMessageSel = $('#tabMessage');
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + y.sceneImage + "' id='tabSceneImageRed'>" + message;
      tabMessageSel.css("background-image", "url('" + y.tabBg + "')");
    }
    tabMessageSel.html(message);

    m.createBuyButtons("eat");
    y.createButtons();
  },

  update: function () {
    var y = SharkGame.Recycler;

    y.updateJunkDisplay();
    y.updateButtons();
  },

  updateJunkDisplay: function () {
    var r = SharkGame.Resources;
    var y = SharkGame.Recycler;
    var m = SharkGame.Main;

    var junkAmount = r.getResource("junk");

    var junkDisplay = $('#junkDisplay');
    junkDisplay.html("CONTENTS:<br/><br/>" + m.beautify(junkAmount) + "<br/><br/>RESIDUE");
  },

  updateButtons: function () {
    var r = SharkGame.Resources;
    var y = SharkGame.Recycler;
    var m = SharkGame.Main;
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0) {
        var inputButton = $('#input-' + k);
        var outputButton = $('#output-' + k);
        var resourceAmount = r.getResource(k);

        // determine amounts for input and what would be retrieved from output
        var selectedAmount = SharkGame.Settings.current.buyAmount;
        var forceSingular = selectedAmount === 1;
        var inputAmount = selectedAmount;
        var outputAmount = selectedAmount;
        var maxOutputAmount = y.getMaxToBuy(k);
        if (selectedAmount < 0) {
          var divisor = Math.floor(selectedAmount) * -1;
          inputAmount = resourceAmount / divisor;
          outputAmount = maxOutputAmount / divisor;

          inputAmount = Math.floor(inputAmount);
          outputAmount = Math.floor(outputAmount);
        }

        // update input button
        var disableButton = (resourceAmount < inputAmount) || (inputAmount <= 0);
        var label = "Recycle ";
        if (inputAmount > 0) {
          label += m.beautify(inputAmount) + " ";
        }
        label += r.getResourceName(k, disableButton, forceSingular);
        inputButton.html(label).prop("disabled", disableButton);

        // update output button
        disableButton = (maxOutputAmount < outputAmount) || (outputAmount <= 0);
        label = "Convert to ";
        if (outputAmount > 0) {
          label += m.beautify(outputAmount) + " ";
        }
        label += r.getResourceName(k, disableButton, forceSingular);
        outputButton.html(label).prop("disabled", disableButton);
      }
    });
  },

  createButtons: function () {
    var r = SharkGame.Resources;
    var y = SharkGame.Recycler;
    var m = SharkGame.Main;
    var inputButtonDiv = $('#inputButtons');
    var outputButtonDiv = $('#outputButtons');
    $.each(SharkGame.ResourceTable, function (k, v) {
      if (r.getTotalResource(k) > 0 &&
        y.allowedCategories[r.getCategoryOfResource(k)] &&
        y.bannedResources.indexOf(k) === -1) {
        SharkGame.Button.makeButton("input-" + k, "Recycle " + r.getResourceName(k), inputButtonDiv, y.onInput);
        SharkGame.Button.makeButton("output-" + k, "Convert to " + r.getResourceName(k), outputButtonDiv, y.onOutput);
      }
    });
  },

  onInput: function () {
    var r = SharkGame.Resources;
    var l = SharkGame.Log;
    var y = SharkGame.Recycler;
    var button = $(this);
    var resourceName = button.attr("id").split("-")[1];
    var resourceAmount = r.getResource(resourceName);
    var junkPerResource = SharkGame.ResourceTable[resourceName].value;

    var selectedAmount = SharkGame.Settings.current.buyAmount;
    var amount = selectedAmount;
    if (selectedAmount < 0) {
      var divisor = Math.floor(selectedAmount) * -1;
      amount = resourceAmount / divisor;
      amount = Math.floor(amount);
    }

    if (resourceAmount >= amount) {
      r.changeResource(resourceName, -amount);
      r.changeResource("junk", amount * junkPerResource);
      r.changeResource("tar", amount * junkPerResource * 0.00001);
      l.addMessage(SharkGame.choose(y.recyclerInputMessages));
    } else {
      l.addMessage("You don't have enough for that!");
    }

    // disable button until next frame
    button.prop("disabled", true);
  },

  onOutput: function () {
    var r = SharkGame.Resources;
    var l = SharkGame.Log;
    var y = SharkGame.Recycler;
    var button = $(this);
    var resourceName = button.attr("id").split("-")[1];
    var junkAmount = r.getResource("junk");
    var junkPerResource = SharkGame.ResourceTable[resourceName].value;

    var selectedAmount = SharkGame.Settings.current.buyAmount;
    var amount = selectedAmount;
    if (selectedAmount < 0) {
      var divisor = Math.floor(selectedAmount) * -1;
      amount = y.getMaxToBuy(resourceName) / divisor;
    }

    var currentResourceAmount = r.getResource(resourceName);
    var junkNeeded;

    var costFunction = y.allowedCategories[r.getCategoryOfResource(resourceName)];
    if (costFunction === "linear") {
      junkNeeded = SharkGame.MathUtil.linearCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
    } else if (costFunction === "constant") {
      junkNeeded = SharkGame.MathUtil.constantCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
    }

    if (junkAmount >= junkNeeded) {
      r.changeResource(resourceName, amount);
      r.changeResource("junk", -junkNeeded);
      l.addMessage(SharkGame.choose(y.recyclerOutputMessages));
    } else {
      l.addMessage("You don't have enough for that!");
    }

    // disable button until next frame
    button.prop("disabled", true);
  },

  getMaxToBuy: function (resource) {
    var r = SharkGame.Resources;
    var y = SharkGame.Recycler;
    var resourceAmount = SharkGame.Resources.getResource(resource);
    var junkAmount = SharkGame.Resources.getResource("junk");
    var junkPricePerResource = SharkGame.ResourceTable[resource].value;
    var category = r.getCategoryOfResource(resource);
    var max = 0;
    if (y.allowedCategories[category]) {
      var costFunction = y.allowedCategories[category];
      if (costFunction === "linear") {
        max = SharkGame.MathUtil.linearMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
      } else if (costFunction === "constant") {
        max = SharkGame.MathUtil.constantMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
      }
    }
    return Math.floor(max);
  }
};
/* -------------------------- tabs: gate.js -------------------------- */
SharkGame.Gate = {

  tabId: "gate",
  tabDiscovered: false,
  tabName: "Strange Gate",
  tabBg: "img/bg/bg-gate.png",

  discoverReq: {
    upgrade: [
      "gateDiscovery"
    ]
  },

  message: "A foreboding circular structure, closed shut.<br/>There are many slots, and a sign you know to mean 'insert items here'.",
  messageOneSlot: "A foreboding circular structure, closed shut.<br/>One slot remains.",
  messageOpened: "A foreboding circular structure, wide open.<br/>The water glows and shimmers within it. A gentle tug pulls at you.",
  messagePaid: "The slot accepts your donation and ceases to be.",
  messageCantPay: "The slot spits everything back out. You get the sense it wants more at once.",
  messageAllPaid: "The last slot closes. The structure opens. The water glows and shimmers within it.<br/>A gentle tug pulls at you.",
  messageEnter: "You swim through the gate...",

  sceneClosedImage: "img/events/misc/scene-gate-closed.png",
  sceneAlmostOpenImage: "img/events/misc/scene-gate-one-slot.png",
  sceneOpenImage: "img/events/misc/scene-gate-open.png",

  costsMet: null,
  costs: null,

  init: function () {
    var g = SharkGame.Gate;
    // register tab
    SharkGame.Tabs[g.tabId] = {
      id: g.tabId,
      name: g.tabName,
      discovered: g.tabDiscovered,
      discoverReq: g.discoverReq,
      code: g
    };
    g.opened = false;
  },

  createSlots: function (gateSlots, planetLevel, gateCostMultiplier) {
    var g = SharkGame.Gate;
    // create costs
    g.costs = {};
    $.each(gateSlots, function (k, v) {
      g.costs[k] = Math.floor(v * planetLevel * gateCostMultiplier);
    });

    // create costsMet
    g.costsMet = {};
    $.each(g.costs, function (k, v) {
      g.costsMet[k] = false;
    });
  },

  switchTo: function () {
    var g = SharkGame.Gate;
    var content = $('#content');
    content.append($('<div>').attr("id", "tabMessage"));
    content.append($('<div>').attr("id", "buttonList"));

    if (!g.shouldBeOpen()) {
      var amountOfSlots = 0;
      var buttonList = $('#buttonList');
      $.each(g.costs, function (k, v) {
        if (!g.costsMet[k]) {
          var resourceName = SharkGame.Resources.getResourceName(k);
          SharkGame.Button.makeButton("gateCost-" + k, "Insert " + resourceName + " into " + resourceName + " slot", buttonList, SharkGame.Gate.onGateButton);
          amountOfSlots++;
        }
      });
    } else {
      SharkGame.Button.makeButton("gateEnter", "Enter gate", $('#buttonList'), g.onEnterButton);
    }

    var message = g.shouldBeOpen() ? g.messageOpened : (amountOfSlots > 1 ? g.message : g.messageOneSlot);
    var tabMessageSel = $('#tabMessage');
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + g.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
      tabMessageSel.css("background-image", "url('" + g.tabBg + "')");
    }
    tabMessageSel.html(message);
  },

  update: function () {},

  onGateButton: function () {
    var g = SharkGame.Gate;
    var r = SharkGame.Resources;
    var resourceId = ($(this).attr("id")).split("-")[1];

    var message = "";
    var cost = g.costs[resourceId] * (SharkGame.Resources.getResource("numen") + 1);
    if (r.getResource(resourceId) >= cost) {
      SharkGame.Gate.costsMet[resourceId] = true;
      SharkGame.Resources.changeResource(resourceId, -cost);
      $(this).remove();
      if (g.shouldBeOpen()) {
        message = g.messageAllPaid;
        // add enter gate button
        SharkGame.Button.makeButton("gateEnter", "Enter gate", $('#buttonList'), g.onEnterButton);
      } else {
        message = g.messagePaid;
      }
    } else {
      message = g.messageCantPay + "<br/>";
      var diff = cost - r.getResource(resourceId);
      message += SharkGame.Main.beautify(diff) + " more.";
    }
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + g.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
    }
    $('#tabMessage').html(message);
  },

  onEnterButton: function () {
    $('#tabMessage').html(SharkGame.Gate.messageEnter);
    $(this).remove();
    SharkGame.wonGame = true;
    SharkGame.Main.endGame();
  },

  shouldBeOpen: function () {
    var g = SharkGame.Gate;
    var won = true;
    $.each(g.costsMet, function (_, v) {
      won = won && v;
    });
    return won;
  },

  getSceneImagePath: function () {
    var g = SharkGame.Gate;
    var amountOfSlots = 0;
    $.each(g.costsMet, function (k, v) {
      if (v) amountOfSlots++;
    });
    amountOfSlots = _.size(g.costs) - amountOfSlots;
    var sceneImagePath = g.shouldBeOpen() ? g.sceneOpenImage : (amountOfSlots > 1 ? g.sceneClosedImage : g.sceneAlmostOpenImage);
    return sceneImagePath;
  }
};
/* -------------------------- tabs: reflection.js -------------------------- */
SharkGame.Reflection = {

  tabId: "reflection",
  tabDiscovered: false,
  tabName: "Reflection",
  tabBg: "img/bg/bg-gate.png",

  sceneImage: "img/events/misc/scene-reflection.png",

  discoverReq: {
    resource: {
      essence: 1
    }
  },

  message: "You may not remember everything, but you are something more than a shark now." +
    "</br><span='medDesc'>Reflect upon the changes in yourself and reality you have made here.</span>",

  init: function () {
    var r = SharkGame.Reflection;
    // register tab
    SharkGame.Tabs[r.tabId] = {
      id: r.tabId,
      name: r.tabName,
      discovered: r.tabDiscovered,
      discoverReq: r.discoverReq,
      code: r
    };
  },

  switchTo: function () {
    var r = SharkGame.Reflection;
    var content = $('#content');
    content.append($('<div>').attr("id", "tabMessage"));
    content.append($('<div>').attr("id", "artifactList"));
    var message = r.message;
    var tabMessageSel = $('#tabMessage');
    if (SharkGame.Settings.current.showTabImages) {
      message = "<img width=400 height=200 src='" + r.sceneImage + "' id='tabSceneImageEssence'>" + message;
      tabMessageSel.css("background-image", "url('" + r.tabBg + "')");
    }
    tabMessageSel.html(message);

    r.updateArtifactList();
  },

  update: function () {

  },

  updateArtifactList: function () {
    var m = SharkGame.Main;
    var listSel = $('#artifactList');
    $.each(SharkGame.Artifacts, function (artifactKey, artifactData) {
      if (artifactData.level > 0) {
        var maxedOut = artifactData.level >= artifactData.max;
        var item = $('<div>').addClass("artifactDiv");
        var artifactLabel = artifactData.name +
          "<br><span class='medDesc'>";
        if (maxedOut) {
          artifactLabel += "(Maximum Power)";
        } else {
          artifactLabel += "(Power: " + m.beautify(artifactData.level) + ")";
        }
        artifactLabel += "</span><br><em>" + artifactData.flavour + "</em>";

        item.append(artifactLabel);
        listSel.append(item);

        var spritename = "artifacts/" + artifactKey;
        if (SharkGame.Settings.current.iconPositions !== "off") {
          var iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-artifact");
          if (iconDiv) {
            iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
            iconDiv.addClass("gatewayButton");
            item.prepend(iconDiv);
          }
        }
      }
    });
    if ($('#artifactList > div').length === 0) {
      listSel.append("<p><em>You have no artifacts to show.</em></p>");
    }
  }
};