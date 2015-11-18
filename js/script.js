function loadData() {

    var $body = $('body');
    var $vicElem = $('#kills-header');
    var $kilElem = $('#kills-articles');
    var $losElem = $('#losses-articles');
    var $greeting = $('#greeting');


    // clear out old data before new request
    $kilElem.text("");
    $losElem.text("");

    var corporation = "98270563";
    var output = "";
    // End of
    var d = new Date();
    var m = d.getMonth()+1;
    var y = d.getFullYear();
    console.log(m);
    console.log(d);
    // zkillboard JSON Data kill pull and parse

    var searchk = "https://zkillboard.com/api/kills/corporationID/" + corporation + "/year/" + y + "/month/" + m + "/";
    var killsRequestTimeout = setTimeout(function(){
      $kilElem.text("Failed to get kill data");
    }, 8000);
    $.ajax({
      url: searchk,
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
          $kilElem.append('<li><h4 class="kills">Victim: <img src="'+ vicPic +'"><img src="' + vicCorpUrl + '">   <a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corporation: ' + articleStr.victim.corporationName + '</h3><br><div class="attacker">');
          for(var fin=0; fin < atkCorp.length; fin++){
            $kilElem.append('<img src="' + atkCorp[fin].corpPic + '">  ' + atkCorp[fin].corp + '  <a href="' + atkCorp[fin].pilotkb + '">' + atkCorp[fin].pilot + '</a><br>');
          }
          var value = Number(articleStr.zkb.totalValue).toLocaleString('en');
          $kilElem.append('</div> ISK Value: <div class="numk">'+ value + '</div> Points: ' + articleStr.zkb.points + '</li>');
        }
        clearTimeout(killsRequestTimeout);
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

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
