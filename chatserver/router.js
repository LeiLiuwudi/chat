var express = require('express');
var path = require('path')
var handler = require('./handler.js');
var bodyParser = require("body-parser"); 
var router = express.Router();

router.use('/resource',express.static(path.join(__dirname,'resource')));
// router.use('/resource',function(req,res){
//     console.log('nihaoa');
//     res.end('hello');
// })
router.post('/login',handler.loginHandler)
router.post('/register',handler.registerHandler)
router.post('/changePassword',handler.changePasswordHandler)
router.post('/getFriends',handler.getFriendsHandler)
router.post('/addFriend',handler.addFriendHandler)
module.exports = router;
