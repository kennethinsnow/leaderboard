PlayersList = new Mongo.Collection('players');
if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId});
  });
  Meteor.methods({
    'insertPlayerData': function(userName){
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: userName, 
        score: 0, 
        createdBy: currentUserId
      });
    },
    'removePlayerData': function(userId){
      PlayersList.remove(userId);
    }
  });
}

if(Meteor.isClient){
  Meteor.subscribe('thePlayers');
  Template.leaderboard.helpers({
    'player': function(){
      return PlayersList.find({}, {sort: {score: -1, name: 1}});
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer){
        return 'selected';
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    }
  });
  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5}});
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5}});
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      var player = PlayersList.findOne(selectedPlayer).name;
      var del = confirm("Are you sure you want to remove player " + player);
      if (del === true){
        Meteor.call('removePlayerData', selectedPlayer);
      }
    }
  });
  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      event.target.playerName.value = "";
      Meteor.call('insertPlayerData', playerNameVar);
    }
  });
}

