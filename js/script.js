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
            if (Number(id) === Number(articleStr.attackers[atk].characterID)) {
              $('#greeting').text(articleStr.attackers[atk].characterName);
              $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_128.png');
            } else if (Number(id) === Number(articleStr.attackers[atk].corporationID)) {
              $('#greeting').text(articleStr.attackers[atk].corporationName);
              $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_128.png');
            }
          }
          // Finding out who the killboard is about
          if (Number(id) === Number(articleStr.victim.characterID)) {
            $('#greeting').text(articleStr.victim.characterName);
            $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png');
          } else if (Number(id) === Number(articleStr.victim.corporationID)) {
            $('#greeting').text(articleStr.victim.corporationName);
            $('.bgimg').attr('src','http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png');
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
