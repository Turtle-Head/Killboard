var UKCR_ID = "98270563";
var FM_ID = "98398761";
var LONE_ID = "652229108";
function loadData(id, data) {
    // Define the vars for easy use
    var $body = $('body');
    var $vicElem = $('#results-header');
    var $resElem = $('#results-articles');
    var $greeting = $('#greeting');
    var lost = 0;
    var won = 0;
    var corpFound = false;
    var cpID;
    // Clear out old data before new request
    $resElem.text("");
    $vicElem.text("");
    var output = "";
    // Get the date
    var d = new Date();
    var y = d.getFullYear();
    var m  = d.getMonth()+1;
    // zkillboard JSON Data pull and parse
    var search = "https://zkillboard.com/api/";
    // Set search to corporation or character API
    if (data){
      search += "corporationID/" + id + "/year/" + y + "/month/" + m + "/";
    } else if (!data){
      search += "characterID/" + id + "/year/" + y + "/month/" + m + "/";
    }
    // Error checking with a timeout
    var killRequestTimeout = setTimeout(function(){
      $resElem.text("Failed to get kill data");
    }, 8000);
    // Import the data
    $.ajax({
      url: search,
      dataType: "jsonp",
      //jsonp: "callback",
      success: function( response ){
        // Writes kill articles out to page
        console.log(id);
        $('#month').text( m + '/' + y);
        var articleList = response;
        console.log(articleList);
        for (var i=0; i <articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'http://zkillboard.com/kill/' + articleStr.killID + '/';
          var shipPic = 'http://imageserver.eveonline.com/Render/' + articleStr.victim.shipTypeID + '_128.png';
          // Sets up the killers data for easy use
          var atkCorp = [];
          for(var atk=0; atk < articleStr.attackers.length; atk++) {
            atkCorp[atk] = {
              "pilotkb" : 'https://zkillboard.com/character/' + articleStr.attackers[atk].characterID + '/',
              "corpPic" :  'http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_32.png',
              "corp" : articleStr.attackers[atk].corporationName,
              "pilot": articleStr.attackers[atk].characterName,
              "pilotP": 'http://imageserver.eveonline.com/Character/'+ articleStr.attackers[atk].characterID +'_32.jpg',
              "shipPic": 'http://imageserver.eveonline.com/Type/' + articleStr.attackers[atk].shipTypeID + '_32.png',
              "wepPic": 'http://imageserver.eveonline.com/Type/' + articleStr.attackers[atk].weaponTypeID + '_32.png',
              "corpKB": 'http://zkillboard.com/corporation/' + articleStr.attackers[atk].corporationID + '/',
              "id": articleStr.attackers[atk].characterID,
              "cid": articleStr.attackers[atk].corporationID
            };
            // Finding out who the killboard is about
            if(!corpFound) {
              if (Number(id) === Number(articleStr.attackers[atk].characterID)) {
                $('#greeting').text(articleStr.attackers[atk].characterName);
                $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_128.png');
                cpID = articleStr.attackers[atk].corporationID;
                corpFound = true;
                stats(id, cpID, response);
              } else if (Number(id) === Number(articleStr.attackers[atk].corporationID)) {
                $('#greeting').text(articleStr.attackers[atk].corporationName);
                $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_128.png');
                cpID = articleStr.attackers[atk].corporationID;
                corpFound = true;
                stats(id, cpID, response);
              }
            }
          }
          // Finding out who the killboard is about
          if(!corpFound) {
            if (Number(id) === Number(articleStr.victim.characterID)) {
              $('#greeting').text(articleStr.victim.characterName);
              $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png');
              cpID = articleStr.victim.corporationID;
              corpFound = true;
              stats(id, cpID, response);
            } else if (Number(id) === Number(articleStr.victim.corporationID)) {
              $('#greeting').text(articleStr.victim.corporationName);
              $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png');
              cpID = articleStr.victim.corporationID;
              corpFound = true;
              stats(id, cpID, response);
            }
          }

          // Sets up the display values
          var dok = '<div class="num">' + articleStr.killTime + '</div>';
          var formAtk = '<div class="dat" id="inv">Involved: '+ (articleStr.attackers.length) + '<div id="atta">';
          for(var fin=0; fin < atkCorp.length; fin++){
            formAtk+='<img src="'+ atkCorp[fin].shipPic + '"><img src="'+ atkCorp[fin].wepPic + '"><img class="cload" id=' + atkCorp[fin].cid + ' src="' + atkCorp[fin].corpPic + '" alt="' + atkCorp[fin].corp + '">  <a href="#" class="pload" id=' + atkCorp[fin].id + '><img src="' + atkCorp[fin].pilotP + '">  ' + atkCorp[fin].pilot + '</a><br>';
          }
          formAtk+='</div></div>';
          var vicCorpKB = 'http://zkillboard.com/corporation/' + articleStr.victim.corporationID + '/';
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en', { minimumFractionDigits: 2 });
          var formISKP ='<div class="dat"><div class="dat2">ISK Value: <div class="num">'+ value + '</div></div><div class="dat2"> Points: ' + articleStr.zkb.points + '</div>' + dok + '</div>';
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png';
          var vicPic = 'http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_128.jpg';
          var killOutput = '<td class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></td>';
          var attkOut = '<td class="ids"><a href="#" class="pload" id=' + articleStr.victim.characterID + '>' + articleStr.victim.characterName + '</a><br> Corp: <a href="#" class="cload" id=' + articleStr.victim.corporationID + '>' + articleStr.victim.corporationName + '</a>' + formISKP + '</td><td class="attackers">' + formAtk + '</td></tr>';
          // Shows the kill as a kill or loss
          if((Number(articleStr.victim.corporationID) !== Number(id)) && (Number(articleStr.victim.characterID) !== Number(id))) {
            $resElem.append('<tr class="kill">' + killOutput + attkOut);
            won += articleStr.zkb.totalValue;
          } else {
            $resElem.append('<tr class="loss">' + killOutput + attkOut);
            lost += articleStr.zkb.totalValue;
          }
        }
        // Show the totals for won lost and difference
        $('#diff').text('');
        if((won-lost) > 0){
          $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="kill">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        } else if ((won-lost) < 0){
          $('#diff').append('<div class="loss">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        }
        // Clear import timeout
        clearTimeout(killRequestTimeout);
      }
    });
    // END OF zkillboard Data Pull
    return false;
}
// Find index of an array item
// { SRC: http://stackoverflow.com/questions/13964155/get-javascript-object-from-array-of-objects-by-value-or-property }
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}
// Work with the data to calculate pilot totals
// Send stats out to displayStats
var stats = function(id, cid, data) {
  var corpkb = false;
  var pilots = [];
  if(id === cid){
    corpkb = true;
  }
  if(corpkb) {
    for(var i = 0; i < data.length; i++){
      if(data[i].victim.corporationID == id) {
        var z = findWithAttr(pilots, id, data[i].victim.characterID) || null;
        if(!z) {
          pilots.push({
            'name': data[i].victim.characterName,
            'id': data[i].victim.characterID,
            'corp': data[i].victim.corporationName,
            'cid': data[i].victim.corporationID,
            'won': 0,
            'lost': data[i].zkb.totalValue,
            'points': - data[i].zkb.points,
            'kills': 0,
            'losses': 1
          });
        }
        if(z) {
          pilots[z].lost += data[i].zkb.totalValue;
          pilots[z].points -= data[i].zkb.points;
          pilots[z].losses += 1;
        }
      }
      for(var x = 0; x < data[i].attackers.length; x++){
        if (data[i].attackers[x].corporationID === id){
          var y = findWithAttr(pilots, id, data[i].attackers[x].characterID) || null;
          if(!y) {
            pilots.push({
              'name': data[i].attackers[x].characterName,
              'id': data[i].attackers[x].characterID,
              'corp': data[i].attackers[x].corporationName,
              'cid': data[i].attackers[x].corporationID,
              'won': data[i].zkb.totalValue,
              'lost': 0,
              'points': data[i].zkb.points,
              'kills': 1,
              'losses': 0
            });
          }
          if(y) {
            pilots[y].won += data[i].zkb.totalValue;
            pilots[y].points += data[i].zkb.points;
            pilots[y].kills += 1;
          }
        }
      }
    }
  }
  if(!corpkb) {
    for(var e = 0; e < data.length; e++){
      if(data[e].victim.characterID == id) {
        var f = findWithAttr(pilots, id, data[e].victim.characterID) || null;
        if(!f) {
          pilots.push({
            'name': data[e].victim.characterName,
            'id': data[e].victim.characterID,
            'corp': data[e].victim.corporationName,
            'cid': data[e].victim.corporationID,
            'won': 0,
            'lost': data[e].zkb.totalValue,
            'points': - data[e].zkb.points,
            'kills': 0,
            'losses': 1
          });
        }
        if(f) {
          pilots[f].lost += data[e].zkb.totalValue;
          pilots[f].points -= data[e].zkb.points;
          pilots[f].losses += 1;
        }
      }
      for(var g = 0; g < data[e].attackers.length; g++){
        if (data[e].attackers[g].characterID === id){
          var h = findWithAttr(pilots, id, data[e].attackers[g].characterID) || null;
          if(!h) {
            pilots.push({
              'name': data[e].attackers[g].characterName,
              'id': data[e].attackers[g].characterID,
              'corp': data[e].attackers[g].corporationName,
              'cid': data[e].attackers[g].corporationID,
              'won': data[e].zkb.totalValue,
              'lost': 0,
              'points': data[e].zkb.points,
              'kills': 1,
              'losses': 0
            });
          }
          if(h) {
            pilots[h].won += data[e].zkb.totalValue;
            pilots[h].points += data[e].zkb.points;
            pilots[h].kills += 1;
          }
        }
      }
    }
  }
  displayStats(pilots);
};
var displayStats = function(pilots) {
  
};
// Add click events to import on click the correct character and corporation from zKillboard
$(document).on('click','.pload', function(){
  var id = this.id;
  loadData(id, false);
});
$(document).on('click','.cload', function(){
  var id = this.id;
  loadData(id, true);
});
// Load the data when ready for the initial page view
$(document).ready(function() {
    loadData(UKCR_ID, true);
});
