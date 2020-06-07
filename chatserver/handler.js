var data = require('./data.js');

module.exports.loginHandler = function(req,res){
     data.login(req,res);
}
module.exports.registerHandler = function(req,res){
     data.register(req,res)
}
module.exports.changePasswordHandler = function(req,res){
     data.changePassword(req,res)
}
module.exports.getFriendsHandler = function(req,res){
     data.getFriends(req,res)
}
module.exports.addFriendHandler = function(req,res){
     data.addFriend(req,res)
}
