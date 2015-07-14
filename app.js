var db = require('./db');
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken'); 


var url = require('url');
var querystring = require('querystring');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var requestSender;
//var session = require('express-session');

//app.use(cookieParser());


/*app.use(session({
  secret: 'eventappsecret',
  resave: false,
  saveUninitialized: true
}));

app.all('/', function(req, res, next) {
	console.log('app');
	
	db.User.findOne({ name: 'qwert' }, function(err, result) {
    if (err) return console.error(err);
		  if (result) {
		    console.log(result);
		  } else {
		    
		  }
			
			next();
    });
});*/
/*
//clear feed from all
db.User.find(null)
	.exec(function(err, friendsData) {
	  if (err) {
		return console.error(err);
	  } else {
		friendsData.forEach( function(friend) {
			console.log(friend.name);
		  friend.feed = [];
		  friend.save();
		});			  
	  };
	});*/
/*
db.UserFriends.findOne({ _userId: '5559eb52a557048418eaa4f9' }, function (err, doc){
  doc.firendsIds.push("555b28dba2ffa6b00d468315");
  doc.save();
});
/*
var userFriendsEnt = new db.UserFriends;
userFriendsEnt._userId = "5559eb52a557048418eaa4f9";
userFriendsEnt.firendsIds.push("5559ec73f78a3b5417ed08e7");
userFriendsEnt.save(function(err, thor) {
  if (err) return console.error(err);
  //console.dir(thor);
});
*/
//var mongo = require('mongodb');
//var monk = require('monk');
//5559eb52a557048418eaa4f9
/*db.User.find(
	{ _id: '5559eb52a557048418eaa4f9', entityType : 'expense'}, function (err, result) {
		console.log(result);
	}

);
db.User.aggregate(
      { $match : 
      	{
      	 _id : db.Mongoose.Types.ObjectId('5559eb52a557048418eaa4f9'),
      	 entityType : 'expense'
     		}
     	},
      { $project: {name : 1, feed : 1}},
      {
        $unwind: '$feed'
      },
      function (err, result) {
        console.log(err);
        console.log(result);
      }
    );*/

app.all('/', function (req, res, next) { 
  var urlParsed = url.parse(req.url);
  var queryString = querystring.parse(urlParsed.query);
  // console.log(req.session.uId);

  
  

  if (queryString.act != 'signin' && queryString.act != 'checkLogin'
  	&& queryString.act != 'regme' && queryString.act != 'logout' ) {
   	
		if (typeof(queryString.token) == 'undefined') {
			res.json({ status : "error", msg : "Ath us falied" });
		  	return;
		}

		var token = queryString.token;
		jwt.verify(token, 'secretkey', function(err, decoded) {

		  if (!decoded) {
		  	res.json({ status : "error", msg : "Ath us falied" });
		  	return;
		  } else {

		  	requestSender = decoded.userId;
		  	//console.log('sender : '+requestSender);
		  	//console.log('ACCEPT');
		  	next();
		  }
		});
		
  } else {
  	//console.log('usecure');
  	next();
  }
  
 });


app.get('/', function (req, res) { 
  var urlParsed = url.parse(req.url);
  var queryString = querystring.parse(urlParsed.query);
   
  /*
  if (queryString.act != 'signin' && queryString.act != 'checkLogin' && queryString.act != 'regme' && queryString.act != 'logout' ) {
    if (typeof(req.session.uId) == 'undefined' || req.session.uId != queryString.userId) {
		  res.json({ status : "error", msg : "Ath us falied" });
		  return;
		}
  }
*/
  
  
  
  //console.log(queryString);
  switch(queryString.act) {
    case 'signin' :
    //console.log('signin');
	  //res.setHeader('Access-Control-Allow-Origin', '*');
	  if (typeof(queryString.login) == 'undefined' || typeof(queryString.password) == 'undefined'
        || queryString.login == '' || queryString.password == '') {
	    res.json({ status : "error", msg : "Login and password fields is required" });
	  } else {
	    db.User.findOne({ name: queryString.login }, function(err, result) {
	    if (err) return console.error(err);
		  if (!result || queryString.password != result.password) {
		    res.json({ status : "error", msg : "Login or password are incorrect" });
		  } else {
		    //req.session.uId = result._id;
		    var token = jwt.sign({userId : result._id}, 'secretkey');

				//console.log(token);
		    res.json({status : "ok", uId : result._id, token : token});
		  }
		//console.log(result);
	    });
	  }
		break;
		case 'logout' :
		  //delete(req.session.uId);
		  res.json({status : "ok"});
		break;
		case 'checkLogin' :
		  res.setHeader('Access-Control-Allow-Origin', '*');
		  if (typeof(queryString.login) == 'undefined'|| queryString.login == '') {
		    res.json({ status : "error", msg : "Login field is empty" });
		  } else {
		    db.User.findOne({ name: queryString.login }, function(err, result) {
		    if (err) return console.error(err);
			  if (result) {
			    res.json({ status : "error" });
			  } else {
			    res.json({status : "ok" });
			  }
			//console.log(result);
		    });
		  }
		break;
		
		case 'regme' :
		//  res.setHeader('Access-Control-Allow-Origin', '*');
		  //console.log(queryString);
		  
		    if ( isUndef(queryString.login) || isUndef(queryString.password) 
			  || queryString.password == '' || queryString.login == '') {
			  res.json({ status : "error" });
			  return;
			}
			if (!(/^[a-zA-Z0-9!@#$%^&_]{8,}$/.test(queryString.password))) {
			  res.json({ status : "error" });
			  return;	
			}
			if (!(/^[a-zA-Z0-9]{5,}$/.test(queryString.login))) {
			  res.json({ status : "error" });
			  return;	
			}	  
		    db.User.findOne({ name: queryString.login }, function(err, result) {
		      if (err) {
			    return console.error(err);
			  }
			  if (result) {
			    res.json({ status : "error" });
			  } else {
			    var newUser = new db.User({
				  name : queryString.login, password : queryString.password
				});
				newUser.save(function(err, result) {
				  if (err) {
					return console.error(err);
				  } else {
				    console.log(result);
				    res.json({status : "Registration complete" });
				  }
				});
			    
			  }
		    });
		  
		break;
		case 'getfeedlength' :
		  db.User.findById(requestSender, function (err, user){
			
	      if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  if (user) {
			    //console.log(events);
				res.json({ status : "ok", feedlength : user.feed.length });
				
				
			  }
			  
			  });
			  
		break;
		case 'getfeeds' :
		//requestSender
				db.User.findById(requestSender, function (err, user){
				if (err) {
				  res.json({ status : "error" });
				  return console.error(err);	
				}
				if (user) {
				  res.json({ status : "ok", feed : user.feed });
				} 
		  });
			  
		break;
		/*case 'getfeedby' :
		if (isUndef(queryString.userId) || isUndef(queryString.entityType) || isUndef(queryString.entityId)) {
			res.json({ status : "error" });
		} else {
			db.User.findById(queryString.userId, function (err, user){
				if (err) {
				  res.json({ status : "error" });
				  return console.error(err);	
				}
				if (user) {
				  res.json({ status : "ok", feed : user.feed });
				} 
		  })

		}
		 
			  
		break;*/
		case 'addfriend' :
		  
		  if (isUndef(queryString.friendId)) {
		    db.User.findOne({ name: queryString.friendlogin }, function(err, result) {
		      if (err) {
			    return console.error(err);
			  }
			  if (result) {
			    res.json({friendId : result._id});
			  } else {
			    res.json({status : "error", msg : "Cant't find this user" });
			  }
			});
		  } else {
		    var userName = '';
		    db.User.findOne({ _id: requestSender }, function (err, user){
	          user.friendsIds.push(queryString.friendId);
			  user.save();
			  userName = user.name;
			  
			  res.json({status : 'adding to friendlist'});
			  
			  /*addToFeed(queryString.friendId, {
				entity : 'user',
				entityId : queryString.userId,
				text : 'User '+userName+' has added you to the contact list',
				isLinked : false
			  });*/
			});
		    
			/*db.User.findById(queryString.friendId, function (err, user){
			  user.feed.unshift({
			    entity : 'user',
				entityId : queryString.userId,
				text : 'User '+userName+' has added you to the contact list',
				date : {type: Date, default: Date.now},
				isLinked : false
			  });
			  user.save();
			});*/
			
		  }
		break;
		
		case 'delfriend' :
		  
		    db.User.findOne({ _id: requestSender }, function (err, usr){
			
	        if (err) {
				    return console.error(err);
				  }
			  if (usr) {
			    var deletingFriendIndex = usr.friendsIds.indexOf(queryString.friendId);
					if (deletingFriendIndex >= 0) {
					  usr.friendsIds.splice(deletingFriendIndex, 1);
					  usr.save();
					  res.json({ status : "removed" });
					} else {
					  res.json({ status : "error" });
					}
				
			  }
			});
		    //res.json({status : 'deleting from friendlist'});
		  
		break;

		
		case 'getmyfriends' :
		  //console.log(requestSender);
		  db.User.findOne({ _id: requestSender })
		  
		  .exec( function(err, result) {
		  //console.log(result);
		  //console.log('MWE');
		      if (err) {
			    return console.error(err);
			  }
			  if (!result) {
			    res.json({ status : "error" });
			  } else {
			    var friendsList = {};
				/*result.friendsIds.forEach( function(friend) {
					console.log(friend);
				  db.User.findById(friend, function(err, friendData) {
					if (err) {
			          return console.error(err);
					}
					if (friendData) {
					console.log(friendData.name);
						friendsList[friendData._id] = friendData.name;
					} 
				  });
				});*/
				db.User
				  .where('_id').in(result.friendsIds)
				  .exec(function(err, friendsData) {
				    if (err) {
					  return console.error(err);
					} else {
					  friendsData.forEach( function(friend) {
					    friendsList[friend._id] = {name : friend.name, id : friend._id};
					  });
					  
					}
					 res.json( {status : 'ok', friendsList : friendsList });
				  });
				/*({_id : {$in result.friendsIds}}, function(err, friendData) {
					if (err) {
			          return console.error(err);
					}
					if (friendData) {
					console.log(friendData);
						//friendsList[friendData._id] = friendData.name;
					} 
				  });*/
					
				
			   
			    
			  }
		    });
		break;
		case 'getevent' :
		  db.Event.findById(queryString.eventId, function (err, event){
			
	      if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  if (event) {


			    //TODO: check is user in eventmember
				var friendsInEventList = {};
				
				// TODO!!! Populate!
				db.User
				  .where('_id').in(event.friendsIds)
				  .exec(function(err, friendsData) {
				    if (err) {
					  return console.error(err);
					} else {
					  //console.log(friendsData);
					  
					  friendsData.forEach( function(friend) {
					    friendsInEventList[friend._id] = ({name : friend.name, id : friend._id});
					  });
					  
					}
					//console.log(friendsInEventList);
					var eventData = {event : event, friends : friendsInEventList};
					//console.log(eventData);
					 res.json( {status : 'ok', event : eventData});
				  });
				//res.json({ status : "ok", event : event });
				
				
			  }
			  
			  });
			  
		break;
		case 'geteventmembers' :
		  db.Event.findById(queryString.eventId, function (err, event){
			
	          if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  //TODO: check is user in eventmember
			  if (event) {
			    var allEventMembers = event.friendsIds;
				//console.log(allEventMembers);
				allEventMembers.push(event.ownerId);
				var friendsInEventList = {};
				//console.log(allEventMembers);
				db.User
				  .where('_id').in(allEventMembers)
				  .exec(function(err, friendsData) {
				    if (err) {
					  return console.error(err);
					} else {
					  //console.log(friendsData);
					  
					  friendsData.forEach( function(friend) {
					    friendsInEventList[friend._id] = ({name : friend.name, id : friend._id});
					  });
					  
					}
					//console.log(friendsInEventList);
					//var eventMembers = {event : event, friends : friendsInEventList};
					//console.log(eventData);
					 res.json( {status : 'ok', eventMembers : friendsInEventList});
				  });
				//res.json({ status : "ok", event : event });
				
				
			  }
			  
			  });
			  
		break;
		
		case 'getevents' :
		  db.Event.find({$or:[{friendsIds : requestSender}, {ownerId : requestSender}], active : queryString.active}, function (err, events){
					//console.log('requestSender');
	          if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  if (events) {
			    //console.log(events);
				res.json({ status : "ok", events : events });
				
				
			  }
			  
			  });
			  
		break;
		
		case 'getexpenses' :
		//res.json(queryString);
		
		  db.Expense.find({ eventId : queryString.eventId }, function (err, expenses){
			
	          if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }

			  //TODO : check user permissions
			  if (expenses) {
			    //console.log(events);
				res.json({ status : "ok", expenses : expenses });
				
				
			  }
			  
			  });
			  
		break;
		case 'getexpensesforbalanse' :
		//res.json(queryString);
		
		  db.Expense.find({ eventId : queryString.eventId })
		  .populate('ownerId', 'name')
		  .populate('details.memberId', 'name')
		  .exec(function (err, expenses){
			//TODO : check user permissions
	          if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  if (expenses) {
			    //console.log(events);
				res.json({ status : "ok", expenses : expenses });
				
				
			  }
			  
			  });
			  
		break;
		case 'getexpense' :
		//res.json(queryString);
		
		  db.Expense.findById({/*eventId : queryString.eventId,*/ _id : queryString.expenseId })
		  .populate('ownerId', 'name')
		  .populate('details.memberId', 'name')
		  .exec(function (err, expense){
			
	          if (err) {
			    res.json({ status : "error" });
			    return console.error(err);
				
			  }
			  if (expense) {
			    //console.log(events);
				res.json({ status : "ok", expense : expense });
				
				
			  } else {
			    res.json({ status : "ok", msg : 'nothing' });
			  }
			  
			  });
			  
		break;
  }
 // res.send('Hello Worlddmhjmhmhdd!');
});

app.use(bodyParser.json());

app.post('/', function (req, res) { 
  var urlParsed = url.parse(req.url);
  //console.log(urlParsed);
  var queryString = querystring.parse(urlParsed.query);
  //console.log(queryString);
  
  switch(queryString.act) {
    case 'addevent' :
	//console.log(req.body);
	  if (isUndef(req.body.eventData) || isUndef(req.body.eventData.name) 
	    || isUndef(req.body.eventData.description)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  if (isUndef(req.body.friendsInEvent)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  var eventData = req.body.eventData;
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.name))) {
	    res.json( {status : 'error'});
	    return;	
	  }
	  
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.description))) {
	    res.json( {status : 'error'});
	    return;	
	  }
	  var newEvent = new db.Event({
  		name : eventData.name,
		description : eventData.description,
		ownerId : requestSender,
		friendsIds : req.body.friendsInEvent,
		active : true
	  });
	    var newEventData = null;
		newEvent.save(function(err, result) {
		  if (err) {
			return console.error(err);
		  } else {
			//newEventData = result;
			//console.log('new creation');
				res.json({status : "ok" });
				addToFeed(req.body.friendsInEvent, {
				  entityType : 'event',
				  entityName : eventData.name,
				  entityId : result._id,
				  text : 'You has been added to the new event named ' + result.name,
				  entityAction : 'adding'
				});
		  }
		});
		/*db.User.where('_id').in(req.body.friendsInEvent).exec(function(err, friendsData) {
			if (err) {
			  return console.error(err);
			} else {
				console.log(newEventData);
				  friendsData.forEach( function(friend) {
				    friend.feed.unshift({
						entity : 'event',
						entityId : newEventData._id,
						text : 'You has been added to the new event named ' + newEventData.name,
						date : {type: Date, default: Date.now},
						isLinked : true
					});
					friend.save();
					//console.log(friend);
		
				  });//
				  
			};
		});*/
		
	break;
	
	case 'editevent' :
	//console.log(req.body);
	  if (isUndef(req.body.eventData) || isUndef(req.body.eventData.name) 
	    || isUndef(req.body.eventData.description)|| isUndef(req.body.eventData._id)) {
	    res.json( {status : 'error 1'});
	    return;
	  }
	  if (isUndef(req.body.friendsInEvent)) {
	    res.json( {status : 'error 2'});
	    return;
	  }
	  var eventData = req.body.eventData;
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.name))) {
	    res.json( {status : 'error 3'});
	    return;	
	  }
	  
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.description))) {
	    res.json( {status : 'error 4'});
	    return;	
	  }
		
		
		db.Event.findOne({ownerId : requestSender, _id : req.body.eventData._id }, function (err, event){

			//console.log('requestSender');

		  if (err) {
		    res.json({status : "error" });
		  } else {
		  //console.log(event);
		    event.name = eventData.name;
				event.description = eventData.description;
				event.active = eventData.active;
				event.friendsIds = req.body.friendsInEvent;
		    event.save();
				res.json({status : "ok" });
				
				addToFeed(req.body.friendsInEvent, {
				  entityType : 'event',
				  entityName : eventData.name,
				  entityId : req.body.eventData._id,
				  text : 'Event was updated ' + eventData.name,
				  entityAction : 'editing'
				});
		  }
		});
		
		/*db.User.where('_id').in(req.body.friendsInEvent).exec(function(err, friendsData) {
			if (err) {
			  return console.error(err);
			} else {
				//console.log(newEventData);
				  friendsData.forEach( function(friend) {
				    friend.feed.unshift({
						entity : 'event',
						entityId : req.body.eventData._id,
						text : 'Event was updated ' + eventData.name,
						date : {type: Date, default: Date.now},
						isLinked : true
					});
					friend.save();
					//console.log(friend);
		
				  });//
				  
			};
		});*/
	break;
	
	case 'addexpense' :
	//console.log(req.body);
	var inpData = req.body;
	  if (isUndef(inpData.expenseData) || isUndef(inpData.expenseData.name)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  if (isUndef(inpData.eventId) || isUndef(inpData.checkedMembers)) {
	    res.json( {status : 'error'});
	    return;
	  }	  
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(inpData.expenseData.name))) {
	    res.json( {status : 'error'});
	    return;	
	  }	  
	  var newExpense = new db.Expense({
  		name : inpData.expenseData.name,
		eventId : inpData.eventId,
		ownerId : requestSender,
		details : inpData.checkedMembers,
		comments : []
	  });
	  
		newExpense.save(function(err, result) {
		  if (err) {
		    res.json({status : "Error" });
			return console.error(err);
		  } else {
			res.json({status : "Expense create", newExpId : result._id });
			
			var usersIds = [];
			inpData.checkedMembers.forEach(function(member){
			  usersIds.push(member.memberId);
			});
			
			addToFeed(usersIds, {
			  entityType : 'expense',
			  entityName : inpData.expenseData.name,
			  entityId : result._id,
			  text : 'You has been added to new expense ' + inpData.expenseData.name,
			  entityAction : 'adding'
			});
		  }
		});

		
	  //res.json({status : "Event update" });
	break;
	
	case 'editexpense' :
	console.log(req.body);
	var inpData = req.body;
	  if (isUndef(inpData.expenseData) || isUndef(inpData.expenseData.name) || isUndef(inpData.expenseData.id)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  if (isUndef(inpData.eventId) || isUndef(inpData.checkedMembers)) {
	    res.json( {status : 'error'});
	    return;
	  }	  
	  if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(inpData.expenseData.name))) {
	    res.json( {status : 'error'});
	    return;	
	  }	  
	  db.Expense.findOne({ _id : inpData.expenseData.id, ownerId : requestSender })
	  .exec(function (err, expense) {
	  
	    expense.name = inpData.expenseData.name;
		expense.details = inpData.checkedMembers;
		
		expense.save(function(err, result) {
		  if (err) {
			res.json({status : "Error" });
			return console.error(err);
		  } else {
		  //expense
		  //res.json(expense);
			res.json({status : "saved" });
			
			var usersIds = [];
			inpData.checkedMembers.forEach(function(member){
			  usersIds.push(member.memberId);
			});
			
			addToFeed(usersIds, {
			  entityType : 'expense',
			  entityName : inpData.expenseData.name,
			  entityId : result._id,
			  text : 'Expense was been update ' + inpData.expenseData.name,
			  entityAction : 'editing'
			});
		  }
		});
	  });

	  //res.json({status : "Event update" });
	break;
	
	case 'approve' :

	  var inpData = req.body;
	  if (isUndef(inpData.detailId) || isUndef(inpData.expenseId)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  
	  db.Expense.findOne({ _id : inpData.expenseId })
	  .exec(function (err, expense) {
	    expense.details.forEach(function (subject) {
		  if (subject.memberId == requestSender && inpData.detailId == subject._id) {
		    /*var updExpense = new db.Expense({
			  approved : !subject.approved
		    });*/
			subject.isApproved = !subject.isApproved;
			
		  }
		});
		expense.save(function(err, result) {
		  if (err) {
			res.json({status : "Error" });
			return console.error(err);
		  } else {
		  //expense
		  //res.json(expense);
			res.json({status : "approved" });
			addToFeed(expense.ownerId, {
			  entityType : 'expense',
			  entityName : expense.name,
			  entityId : inpData.expenseId,
			  text : 'Approving in ' + expense.name + ' has been changed',
			  entityAction : 'approving'
		    });
		  }
		});
	  });

	  	  		
	  //res.json(inpData);
	break;

	case 'addexpensecomment' :

	  var inpData = req.body;
	  //console.log(inpData);
	  
	  
	  if (isUndef(inpData.commentText) || isUndef(inpData.expenseId) || isUndef(inpData.isImportant)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  encodedStr = inpData.commentText;
	  /*
	  var encodedStr = inpData.commentText.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
	    return '&#'+i.charCodeAt(0)+';';
	  });
	  */
	 
	  db.Expense.findOne({ _id : inpData.expenseId })
	  .exec(function (err, expense) {
	    
		expense.comments.unshift({
		  memberId : requestSender,
		  text : encodedStr,
		  date : new Date(),
		  isImportant : inpData.isImportant
		});
		
		expense.save(function(err, result) {
		  if (err) {
			res.json({status : "Error" });
			return console.error(err);
		  } else {
		  expense
		  //res.json(expense);
			res.json({status : "saved" });
			
			var usersIds = [];
			
			expense.details.forEach(function(member){
			  usersIds.push(member.memberId);
			});
			
			addToFeed(usersIds, {
			  entityType : 'expense',
			  entityName : expense.name,
			  entityId : inpData.expenseId,
			  text : 'Expense ' + expense.name + ' was been commented',
			  entityAction : 'commenting'
			});
		  }
		});
	  });
	
	  //res.json(inpData);
	break;

	case 'clearfeedby' :

	  var inpData = req.body;
	  if (isUndef(inpData.entityType) || isUndef(inpData.entityId)) {
	    res.json( {status : 'error'});
	    return;
	  }
	  
	  db.User.findOne({ _id : requestSender })
	  .exec(function (err, user) {
	   /* user.feed.forEach(function (feedItem) {
	    	console.log(feedItem);
		  /*if (subject.memberId == inpData.ownerId && inpData.detailId == subject._id) {
		    
			subject.isApproved = !subject.isApproved;
			
		  }
		});*/
		//console.log(user.feed);
		for (i = 0; i < user.feed.length; ++i) {
			//console.log(user.feed[i].entityId +' ' + inpData.entityId + ' ' + user.feed[i].entityType +' ' + inpData.entityType);
			if (user.feed[i].entityId == inpData.entityId && user.feed[i].entityType == inpData.entityType) {
				//console.log('removed');
				user.feed.splice(i--, 1);
			}
			
		}
		user.save();
				/*
		expense.save(function(err, result) {
		  if (err) {
			res.json({status : "Error" });
			return console.error(err);
		  } else {
		  //expense
		  //res.json(expense);
			res.json({status : "approved" });
			addToFeed(expense.ownerId, {
			  entityType : 'expense',
			  entityName : expense.name,
			  entityId : inpData.expenseId,
			  text : 'Approving in ' + expense.name + ' has been changed',
			  entityAction : 'approving'
		    });
		  }
		});*/
	  });

	  	  		
	  res.json({status : 'done'});
	break;
	
  }
});

var server = app.listen(3000, function () {
  
  var host = server.address().address;
  var port = server.address().port;
  //app.use(express.staticProvider(__dirname + '/public'));
  //console.log(pathToStatics);
  
});

function addToFeed(userId, data) {
  //console.log(data);
  //console.log(userId);
  var feedObject = { 	
	entityType : data.entityType,
	entityName : data.entityName,
	entityId : data.entityId,
	text : data.text,
	//date : {type: Date, default: Date.now},
	entityAction : data.entityAction		  
  }

  if (Array.isArray(userId)) {
    db.User.where('_id').in(userId).exec(function(err, friendsData) {
	  if (err) {
		return console.error(err);
	  } else {
		friendsData.forEach( function(friend) {
		//	console.log(friend);
		  /*friend.feed.unshift({
			entity : data.entity,
			entityId : data.entityId,
			text : data.text,
			date : {type: Date, default: Date.now},
			isLinked : data.isLinked
		  });*/
		  friend.feed.unshift(feedObject);
		  friend.save(function (err, friend) {
			  if (err) return console.error(err);
			  	//console.log(friend);
				}
			);
		});				  
	  };
	});
  } else {
	db.User.findById(userId, function (err, user){
	//	console.log(user);
	  /*user.feed.unshift({
		entity : data.entity,
		entityId : data.entityId,
		text : data.text,
		date : {type: Date, default: Date.now},
		isLinked : data.isLinked
	  });*/
	  user.feed.unshift(feedObject);
	  user.save(function (err, user) {
		  if (err) return console.error(err);
		  	//console.log(user);
			}
		);
	  
	});
  }
}

function isUndef(variable) {
 return typeof(variable) == "undefined";
}