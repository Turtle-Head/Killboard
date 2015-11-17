function loadData() {

    var $body = $('body');
    var $nytHeaderElem = $('#results-header');
    var $resElem = $('#results-articles');
    var $greeting = $('#greeting');


    // clear out old data before new request
    $resElem.text("");

    // load streetview
    //---------------------
    // YOUR CODE GOES HERE!
    //---------------------
    // Background Streetview of address loader

    var corporation = "98270563";
    var output = "";
    // End of
    // zkillboard JSON Data pull and parse
    var search = "https://zkillboard.com/api/corporationID/" + corporation + "/" ;
    var wikiRequestTimeout = setTimeout(function(){
      $resElem.text("Failed to get kill data");
    }, 8000);
    $.ajax({
      url: search,
      dataType: "jsonp",
      //jsonp: "callback",
      success: function( response ){
        // Writes Wiki articles out to page

        var articleList = response;
        console.log(articleList);
        for (var i=0; i <articleList.length; i++) {
          articleStr = articleList[i];
          var vicCorpUrl = 'http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_32.png';
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
          $resElem.append('<li><a href="' + url + '">Name: ' + articleStr.victim.characterName + ' Corporation: ' + '<img src="' + vicCorpUrl + '">' + articleStr.victim.corporationName + '</a>');
          for(var fin=0; fin < atkCorp.length; fin++){
            $resElem.append('  <img src="' + atkCorp[fin].corpPic + '">  ' + atkCorp[fin].corp + '  <a href="' + atkCorp[fin].pilotkb + '">' + atkCorp[fin].pilot + '</a>');
          }
          $resElem.append('  '+ articleStr.zkb.totalValue + '  Points: ' + articleStr.zkb.points + '</li>');
        }
        clearTimeout(wikiRequestTimeout);
      }
    });
    // END OF zkillboard Data Pull
    return false;
}

$('#form-container').submit(loadData);

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
