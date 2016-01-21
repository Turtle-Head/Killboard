var zkill = function (){
  var d = new Date();
  var y = d.getFullYear();
  var m  = d.getMonth()+1;
  // zkillboard JSON Data pull and parse
  var search = "https://zkillboard.com/api/corporationID/" + self.corporation() + "/year/" + y + "/month/" + m + "/";
  var killRequestTimeout = setTimeout(function(){
    alert("Request Timeout: Failed to get kill data");
  }, 8000);
  $.ajax({
    url: search,
    dataType: "jsonp",
    //jsonp: "callback",
    success: function( response ){
      // Moves the results to the killList
      if(self.killList() !== response){
        self.killList(response);
      }
      else {
        alert('No new kills');
      }
      console.log(self.killList());
      clearTimeout(killRequestTimeout);
    }
  });
  // END OF zkillboard Data Pull
};

var Kill = function(data) {
  var km = this;
  var articleStr = data;
  km.kill = ko.observable(false);
  km.corp = ko.observable(articleStr.victim.corporationID);
  km.url = ko.observable('http://zkillboard.com/kill/' + articleStr.killID + '/');
  km.shipPic = ko.observable('http://imageserver.eveonline.com/Render/' + articleStr.victim.shipTypeID + '_128.png');
  km.atkCorp = ko.observableArray([]);
  for(var atk=0; atk < articleStr.attackers.length; atk++) {
    km.atkCorp().push({
      "pilotkb" : 'https://zkillboard.com/character/' + articleStr.attackers[atk].characterID + '/',
      "corpPic" :  'http://imageserver.eveonline.com/Corporation/' + articleStr.attackers[atk].corporationID + '_32.png',
      "corp" : articleStr.attackers[atk].corporationName,
      "pilot": articleStr.attackers[atk].characterName,
      "pilotP": 'http://imageserver.eveonline.com/Character/'+ articleStr.attackers[atk].characterID +'_32.jpg',
      "shipPic": 'http://imageserver.eveonline.com/Type/' + articleStr.attackers[atk].shipTypeID + '_32.png',
      "wepPic": 'http://imageserver.eveonline.com/Type/' + articleStr.attackers[atk].weaponTypeID + '_32.png',
      "corpKB": 'http://zkillboard.com/corporation/' + articleStr.attackers[atk].corporationID + '/'
    });
  }
  km.involved = ko.observable(articleStr.attackers.length);
  km.time = ko.observable(articleStr.killTime);
  // TODO: Converted to binds
  // ------------------------
  // km.formAtk = ko.observable('<div class="dat" id="inv">Involved: '+ (articleStr.attackers.length) + '<div id="atta">');
  // for(var fin=0; fin < km.atkCorp().length; fin++){
  //  formAtk(formAtk() + '<img src="'+ km.atkCorp()[fin].shipPic + '"><img src="'+ km.atkCorp()[fin].wepPic + '"><a href="' + km.atkCorp()[fin].corpKB + '"><img src="' + km.atkCorp()[fin].corpPic + '" alt="' + km.atkCorp()[fin].corp + '"></a>  ');
  // }
  // formAtk(formAtk() + '</div></div>');
  km.vicCorpKB = ko.observable('http://zkillboard.com/corporation/' + articleStr.victim.corporationID + '/');
  km.isk = ko.observable(Number(articleStr.zkb.totalValue).toLocaleString('en', { minimumFractionDigits: 2 }));
  km.kval = ko.observable(articleStr.zkb.totalValue);
  km.points = ko.observable(articleStr.zkb.points);
  km.vicCorpUrl = ko.observable('http://imageserver.eveonline.com/Corporation/' + articleStr.victim.corporationID + '_32.png');
  km.vicPic = ko.observable('http://imageserver.eveonline.com/Character/' + articleStr.victim.characterID + '_128.jpg');
  // TODO: Convert to binds
  // ----------------------
  // var killOutput = '<div class="image"><a href="' + url + '"><img src="' + shipPic + '"><img src="'+ vicPic +'"></a><a href="' + vicCorpKB + '"><img src="' + vicCorpUrl + '"></div><div class="ids"><a href="' + url + '">' + articleStr.victim.characterName + '</a><br> Corp: <a href="' + vicCorpKB + '">' + articleStr.victim.corporationName + '</a>' + formISKP + '</div>' + '<div class="attackers">' + formAtk +'</li><hr>';
  if(articleStr.victim.corporationID === self.corporation()){
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

var ViewModel = function() {
  var self = this;
  self.killList = ko.observable();
  // static variables for getting the data
  self.corporation = ko.observable('98270563');
  zkill();
  self.killArray = ko.observable([]);
  for (var x = 0; x < self.killList().length; x++){
    self.killArray().push(new kill(killList()[x]));
  }
  self.won = ko.computed(function(){
    var isk;
    for(var z = 0; z < self.killArray().length; z++) {
      if(self.killArray()[z].kill()) {
        isk += self.killArray()[z].kval();
      }
    }
    return isk;
  }, this);
  self.lost = ko.computed(function() {
    var isk;
    for(var z = 0; z < self.killArray().length; z++) {
      if(!self.killArray()[z].kill()) {
        isk += self.killArray()[z].kval();
      }
    }
    return isk;
  }, this);
  self.balance = ko.computed(function(){
    return (self.won()-self.lost());
  }, this);
};
