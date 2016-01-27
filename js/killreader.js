

var Kill = function(data, id) {
  // console.log(data);
  var km = this;
  km.kill = ko.observable();
  km.corp = ko.observable(data.victim.corporationID);
  km.victim = ko.observable(data.victim.characterName);
  km.url = ko.observable('http://zkillboard.com/kill/' + data.killID + '/');
  km.shipPic = ko.observable('http://imageserver.eveonline.com/Render/' + data.victim.shipTypeID + '_128.png');
  km.atkCorp = ko.observableArray([]);
  for(var atk=0; atk < data.attackers.length; atk++) {
    km.atkCorp().push({
      "pilotkb" : 'https://zkillboard.com/character/' + data.attackers[atk].characterID + '/',
      "corpPic" :  'http://imageserver.eveonline.com/Corporation/' + data.attackers[atk].corporationID + '_32.png',
      "corp" : data.attackers[atk].corporationName,
      "pilot": data.attackers[atk].characterName,
      "pilotP": 'http://imageserver.eveonline.com/Character/'+ data.attackers[atk].characterID +'_32.jpg',
      "shipPic": 'http://imageserver.eveonline.com/Type/' + data.attackers[atk].shipTypeID + '_32.png',
      "wepPic": 'http://imageserver.eveonline.com/Type/' + data.attackers[atk].weaponTypeID + '_32.png',
      "corpKB": 'http://zkillboard.com/corporation/' + data.attackers[atk].corporationID + '/'
    });
  }
  km.involved = ko.observable(data.attackers.length);
  km.time = ko.observable(data.killTime);
  // TODO: Converted to binds
  // ------------------------
  // km.formAtk = ko.observable('<div class="dat" id="inv">Involved: '+ (articleStr.attackers.length) + '<div id="atta">');
  // for(var fin=0; fin < km.atkCorp().length; fin++){
  //  formAtk(formAtk() + '<img src="'+ km.atkCorp()[fin].shipPic + '"><img src="'+ km.atkCorp()[fin].wepPic + '"><a href="' + km.atkCorp()[fin].corpKB + '"><img src="' + km.atkCorp()[fin].corpPic + '" alt="' + km.atkCorp()[fin].corp + '"></a>  ');
  // }
  // formAtk(formAtk() + '</div></div>');
  km.vicCorpKB = ko.observable('http://zkillboard.com/corporation/' + data.victim.corporationID + '/');
  km.isk = ko.observable(Number(data.zkb.totalValue).toLocaleString('en', { minimumFractionDigits: 2 }));
  km.kval = ko.observable(data.zkb.totalValue);
  km.points = ko.observable(data.zkb.points);
  km.vicCorpUrl = ko.observable('http://imageserver.eveonline.com/Corporation/' + data.victim.corporationID + '_32.png');
  km.vicPic = ko.observable('http://imageserver.eveonline.com/Character/' + data.victim.characterID + '_128.jpg');
  // TODO: Convert to binds
  // ----------------------
  // var killOutput = '<div class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></div><div class="ids"><a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corp: <a href="' + vicCorpKB + '">' + articleStr.victim.corporationName + '</a>' + formISKP + '</div>' + '<div class="attackers">' + formAtk +'</li><hr>';
  if(data.victim.corporationID === id) {
    km.kill(false);
  } else {
    km.kill(true);
  }

  // TODO: Convert to binds
  // ----------------------
  // $resElem.append('</ul>');
  // $('#diff').text('');
  // if((won-lost) > 0){
  //   $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="kill">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
  // } else if ((won-lost) < 0){
  //   $('#diff').append('<div class="kill">Kills: ' + Number(won).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">Losses: ' + Number(lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div><div class="loss">[+/-]: ' + Number(won-lost).toLocaleString('en', { minimumFractionDigits: 2 }) + ' ISK</div>');
  // }
};
var UKCR_ID = {
  'id': '98270563',
  'porc': 'c'
  };

var ViewModel = function(id, porc) {
  var self = this;

  // TODO killArray should only be used to tool the displayKills array and should be removed when dev is complete
  self.killArray = ko.observableArray([]);
  // TODO
  // This array should contain all relevant links to the CREST server for data import on images
  // It should also contain all data relevant to the kill it represents per index
  self.displayKills = ko.observableArray([]);
  // Pull the data from zkillboard
  var d = new Date();
  var y = d.getFullYear();
  var m  = d.getMonth()+1;
  var search = "https://zkillboard.com/api/";
  // zkillboard JSON Data pull and parse
  // Checks inputs for id and porc
  if(id && (porc === 'p')){
    search += "characterID/" + id;
  } else if(id && (porc === 'c')){
    search += "corporationID/" + id + "/year/" + y + "/month/" + m + "/";
  } else {
    alert('Error parsing ID!');
  }
  var killRequestTimeout = setTimeout(function(){
    alert("Request Timeout: Failed to get kill data");
  }, 8000);
  $.ajax({
    url: search,
    dataType: "jsonp",
    //jsonp: "callback",
    success: function( response ) {
      // Send the results out
      // console.log(response);
      for(var x = 0; x < response.length; x++) {
        ViewModel.killArray().push(response[x]);
        ViewModel.displayKills().push(new Kill(response[x], id));
      }
      console.log(self.displayKills().length);
      // Clear the timeout
      // console.log(self.killArray());
      // console.log(self.displayKills());
      clearTimeout(killRequestTimeout);
    }
  });
  // END OF zkillboard Data Pull

  //$('submit-btn').onClick(zkill());
  console.log('After AJAX');
  console.log(self.displayKills());
  console.log(self.displayKills().length);
  self.won = ko.computed(function(){
    var isk;
    for(var z = 0; z < self.displayKills().length; z++) {
      if(self.displayKills()[z].kill()) {
        isk += self.displayKills()[z].kval();
        console.log('Kill!');
      }
    }
    return isk;
  }, this);
  self.lost = ko.computed(function() {
    var isk;
    for(var z = 0; z < self.displayKills().length; z++) {
      if(!self.displayKills()[z].kill()) {
        isk += self.displayKills()[z].kval();
        console.log('Loss!');
      }
    }
    return isk;
  }, this);
  self.balance = ko.computed(function(){
    return (self.won()-self.lost());
  }, this);
  console.log(self.balance());
};
ko.applyBindings(new ViewModel(UKCR_ID.id, UKCR_ID.porc));
