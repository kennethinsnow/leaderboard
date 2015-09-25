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
      var currentUserId = Meteor.userId();
      PlayersList.remove({_id: userId, createdBy: currentUserId});
    },
    'updatePlayerData': function(userId, num){
      var currentUserId = Meteor.userId();
      PlayersList.update({_id: userId, createdBy: currentUserId}, 
                         {$inc: {score: num}});
    }
  });
