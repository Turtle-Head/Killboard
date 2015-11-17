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
          /*for(var atk=0; atk < articleStr.attackers.length; atk++) {
            atkCorp.push('http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[i].corporationID + '_32.png');
          }*/
          var url = 'http://zkillboard.com/kill/' + articleStr.killID + '/';
          $resElem.append('<li><a href="' + url + '">Name: ' + articleStr.victim.characterName + ' Corporation: ' + '<img src="' + vicCorpUrl + '">' + articleStr.victim.corporationName + '</a>  Value: ' + articleStr.zkb.totalValue + '  Points: ' + articleStr.zkb.points + '</li>');
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
