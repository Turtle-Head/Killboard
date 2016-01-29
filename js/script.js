var UKCR_ID = "98270563";
function loadData(id, data) {

    var $body = $('body');
    var $vicElem = $('#results-header');
    var $resElem = $('#results-articles');
    var $greeting = $('#greeting');
    var lost = 0;
    var won = 0;


    // clear out old data before new request
    $resElem.text("");
    $vicElem.text("");


    var output = "";
    // End of
    var d = new Date();
    var y = d.getFullYear();
    var m  = d.getMonth()+1;
    // zkillboard JSON Data pull and parse
    var search = "https://zkillboard.com/api/";
    if (data){
      search += "corporationID/" + id + "/year/" + y + "/month/" + m + "/";
    } else if (!data){
      search += "characterID/" + id + "/year/" + y + "/month/" + m + "/";
    }
    var killRequestTimeout = setTimeout(function(){
      $resElem.text("Failed to get kill data");
    }, 8000);
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
              "id": articleStr.attackers[atk].characterID
            };
            if (Number(id) === Number(articleStr.attackers[atk].characterID)) {
              $('#killBoard').text(articleStr.attackers[atk].characterName);
            } else if (Number(id) === Number(articleStr.attackers[atk].corporationID)) {
              $('#killBoard').text(articleStr.attackers[atk].corporationName);
            }
          }
          if (Number(id) === Number(articleStr.victim.characterID)) {
            $('#killBoard').text(articleStr.victim.characterName);
          } else if (Number(id) === Number(articleStr.victim.corporationID)) {
            $('#killBoard').text(articleStr.victim.corporationName);
          }
          var dok = '<div class="num">' + articleStr.killTime + '</div>';
          var formAtk = '<div class="dat" id="inv">Involved: '+ (articleStr.attackers.length) + '<div id="atta">';
          for(var fin=0; fin < atkCorp.length; fin++){
            formAtk+='<button class="loader" id=' + atkCorp[fin].id + '>Load Kills</button><img src="'+ atkCorp[fin].shipPic + '"><img src="'+ atkCorp[fin].wepPic + '"><a href="' + atkCorp[fin].corpKB + '"><img src="' + atkCorp[fin].corpPic + '" alt="' + atkCorp[fin].corp + '"></a>  ' /*+ atkCorp[fin].corp*/ + '<a href="' + atkCorp[fin].pilotkb + '"><img src="'+ atkCorp[fin].pilotP +'">  ' + atkCorp[fin].pilot + '</a><br>';

          }
          formAtk+='</div></div>';
          var vicCorpKB = 'http://zkillboard.com/corporation/' + articleStr.victim.corporationID + '/';
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en', { minimumFractionDigits: 2 });
          var formISKP ='<div class="dat"><div class="dat2">ISK Value: <div class="num">'+ value + '</div></div><div class="dat2"> Points: ' + articleStr.zkb.points + '</div>' + dok + '</div>';
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png';
          var vicPic = 'http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_128.jpg';
          // <td><button class="loader" id=' + articleStr.victim.characterID + '">Load Kills</button></td>
          var killOutput = '<td class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></td><td class="ids"><a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corp: <a href="' + vicCorpKB + '">' + articleStr.victim.corporationName + '</a>' + formISKP + '</td><td class="attackers">' + formAtk +'</li></td></tr>';
          if((Number(articleStr.victim.corporationID) !== Number(id)) && (Number(articleStr.victim.characterID) !== Number(id))) {
            $resElem.append('<tr class="kill">' + killOutput);
            won += articleStr.zkb.totalValue;
          } else {
            $resElem.append('<tr class="loss">' + killOutput);
            lost += articleStr.zkb.totalValue;
          }
        }
        $('#diff').text('');
        if((won-lost) > 0){
          $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="kill">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        } else if ((won-lost) < 0){
          $('#diff').append('<div class="loss">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        }


        clearTimeout(killRequestTimeout);
      }
    });

    // END OF zkillboard Data Pull
    return false;
}

$(document).on('click','.loader', function(){
  var id = this.id;
  loadData(id, false);
});
$('#form-container').click(function(){loadData(UKCR_ID, true);});
$( document ).ready(function() {
    loadData(UKCR_ID, true);
});
