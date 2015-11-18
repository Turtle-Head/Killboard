function loadData() {

    var $body = $('body');
    var $vicElem = $('#results-header');
    var $resElem = $('#results-articles');
    var $greeting = $('#greeting');


    // clear out old data before new request
    $resElem.text("");
    $vicElem.text("");

    var corporation = "98270563";
    var output = "";
    // End of
    var d = new Date();
    var y = d.getFullYear();
    var m  = d.getMonth()+1;

    // zkillboard JSON Data pull and parse
    var search = "https://zkillboard.com/api/corporationID/" + corporation + "/year/" + y + "/month/" + m + "/";
    var killRequestTimeout = setTimeout(function(){
      $resElem.text("Failed to get kill data");
    }, 8000);
    $.ajax({
      url: search,
      dataType: "jsonp",
      //jsonp: "callback",
      success: function( response ){
        // Writes kill articles out to page
        $resElem.append('<ul>');
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
              "corpKB": 'http://zkillboard.com/corporation/' + articleStr.attackers[atk].corporationID + '/'
            };
          }
          var formAtk = '<div class="dat">Involved: '+ (articleStr.attackers.length) + '<br>';
          for(var fin=0; fin < atkCorp.length; fin++){
            formAtk+='<img src="'+ atkCorp[fin].shipPic + '"><img src="'+ atkCorp[fin].wepPic + '"><a href="' + atkCorp[fin].corpKB + '"><img src="' + atkCorp[fin].corpPic + '" alt="' + atkCorp[fin].corp + '"></a>  ' /*+ atkCorp[fin].corp*/ + '<a href="' + atkCorp[fin].pilotkb + '"><img src="'+ atkCorp[fin].pilotP +'">  ' + atkCorp[fin].pilot + '</a><br>';
          }
          formAtk+='</div>';
          var vicCorpKB = 'http://zkillboard.com/corporation/' + articleStr.victim.corporationID + '/';
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en');
          var formISKP ='<div class="dat"><div class="dat2">ISK Value: <div class="num">'+ value + '</div></div><div class="dat2"> Points: ' + articleStr.zkb.points + '</div></div>';
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png';
          var vicPic = 'http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_128.jpg';
          var killOutput = '<div class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></div><div class="ids"><a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corp: <a href="' + vicCorpKB + '">' + articleStr.victim.corporationName + '</a>' + formISKP + '</div>' + '<div class="attackers">' + formAtk +'</li><hr>';
          if(articleStr.victim.corporationID == corporation){
            $resElem.append('<li class="loss">' + killOutput);
          } else {
            $resElem.append('<li class="kill">' + killOutput);
          }
        }
        $resElem.append('</ul>');
        clearTimeout(killRequestTimeout);
      }
    });

    // END OF zkillboard Data Pull
    return false;
}

$('#form-container').submit(loadData);
$( document ).ready(function() {
    loadData();
});
function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
