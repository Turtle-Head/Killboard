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
    var search = "https://zkillboard.com/api/w-space/corporationID/" + corporation + "/" ;
    $.getJSON( search, function( data ) {
      var items = [];
      var records = data;
      console.log( data );
      console.log(records);
      //console.log( items );
      // Need to extract data from the objects returned
      // Needs lots of work Objects are being parsed rather than strings
      for(var x=0; x < records.length; x++){
        for(var y=0; y < records[x].length; y++){
          output = "<li class='victim'>" + records[x][y].victim.characterName +" "+ records[x][y].killTime + " " + records[x][y].solarSystemID + " " + records[x][y].zkb.totalValue + " " + records[x][y].zkb.points + "</li>";
          $("resElem").append(output);
          console.log(output);
        }
      }
      // end of needs lots of work
    });
    // END OF zkillboard Data Pull
    return false;
}

$('#form-container').submit(loadData);

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}
