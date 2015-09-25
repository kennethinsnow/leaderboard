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
      Meteor.call('updatePlayerData', selectedPlayer, 5);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('updatePlayerData', selectedPlayer, -5);
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

