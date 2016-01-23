function loadData() {

    var $body = $('body');
    var $vicElem = $('#kills-header');
    var $kilElem = $('#kills-articles');
    var $losElem = $('#losses-articles');
    var $greeting = $('#greeting');
    var lost = 0;
    var won = 0;


    // clear out old data before new request
    $kilElem.text("");
    $losElem.text("");

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
      url: searchk,
      dataType: "jsonp",
      //jsonp: "callback",
      success: function( response ){
        // Writes kill articles out to page
        $resElem.append('<ul>');
        var articleList = response;
        console.log(articleList);
        for (var i=0; i < articleList.length; i++) {
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
          var dok = '<div class="num">' + articleStr.killTime + '</div>';
          var formAtk = '<div class="dat" id="inv">Involved: '+ (articleStr.attackers.length) + '<div id="atta">';
          for(var fin=0; fin < atkCorp.length; fin++){
            formAtk+='<img src="'+ atkCorp[fin].shipPic + '"><img src="'+ atkCorp[fin].wepPic + '"><a href="' + atkCorp[fin].corpKB + '"><img src="' + atkCorp[fin].corpPic + '" alt="' + atkCorp[fin].corp + '"></a>  ' /*+ atkCorp[fin].corp*/ + '<a href="' + atkCorp[fin].pilotkb + '"><img src="'+ atkCorp[fin].pilotP +'">  ' + atkCorp[fin].pilot + '</a><br>';
          }
          formAtk+='</div></div>';
          var vicCorpKB = 'http://zkillboard.com/corporation/' + articleStr.victim.corporationID + '/';
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en', { minimumFractionDigits: 2 });
          var formISKP ='<div class="dat"><div class="dat2">ISK Value: <div class="num">'+ value + '</div></div><div class="dat2"> Points: ' + articleStr.zkb.points + '</div>' + dok + '</div>';
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_128.png';
          var vicPic = 'http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_128.jpg';
          var killOutput = '<div class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></div><div class="ids"><a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corp: <a href="' + vicCorpKB + '">' + articleStr.victim.corporationName + '</a>' + formISKP + '</div>' + '<div class="attackers">' + formAtk +'</li><hr>';
          if(articleStr.victim.corporationID == corporation){
            $resElem.append('<li class="loss">' + killOutput);
            lost += articleStr.zkb.totalValue;
          } else {
            $resElem.append('<li class="kill">' + killOutput);
            won += articleStr.zkb.totalValue;
          }
        }
        $resElem.append('</ul>');
        $('#diff').text('');
        if((won-lost) > 0){
          $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="kill">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        } else if ((won-lost) < 0){
          $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
        }


        clearTimeout(killRequestTimeout);
      }
    });

    var searchl = "https://zkillboard.com/api/losses/corporationID/" + corporation + "/year/" + y + "/month/" + m + "/";
    var lossesRequestTimeout = setTimeout(function(){
      $losElem.text("Failed to get losses data");
    }, 8000);
    $.ajax({
      url: searchl,
      dataType: "jsonp",
      //jsonp: "callback",
      success: function( response ){
        // Writes Wiki articles out to page

        var articleList = response;
        console.log(articleList);
        for (var i=0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_32.png';
          var vicPic = 'http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_32.jpg';
          var atkCorp = [];
          for(var atk=0; atk < articleStr.attackers.length; atk++) {
            atkCorp[atk] = {
              "pilotkb" : 'https://zkillboard.com/character/' + articleStr.attackers[atk].characterID + '/',
              "corpPic" :  'http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_32.png',
              "corp" : articleStr.attackers[atk].corporationName,
              "pilot": articleStr.attackers[atk].characterName
            };
            /*if (articleStr.attakers[atk].finalBlow == "1"){
              atkCorp[atk].killer = true;
            } else {
              atkCorp[atk].killer = false;
            }*/
          }
          var url = 'http://zkillboard.com/kill/' + articleStr.killID + '/';
          $losElem.append('<li><h4 class="losses">Victim: <img src="'+ vicPic +'"><img src="' + vicCorpUrl + '">   <a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corporation: ' + articleStr.victim.corporationName + '</h3><br><div class="attacker">');
          for(var fin=0; fin < atkCorp.length; fin++){
            $losElem.append('<img src="' + atkCorp[fin].corpPic + '">  ' + atkCorp[fin].corp + '  <a href="' + atkCorp[fin].pilotkb + '">' + atkCorp[fin].pilot + '</a><br>');
          }
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en');
          $losElem.append('</div> ISK Value: <div class="numl">'+ value + '</div> Points: ' + articleStr.zkb.points + '</li>');
        }
        clearTimeout(lossesRequestTimeout);
      }
    });
    // END OF zkillboard Data Pull
    return false;
}

$('#form-container').submit(loadData);
$( document ).ready(function() {
    loadData();
});
