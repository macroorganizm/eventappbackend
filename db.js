var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/eventapp');
mongoose.connect('mongodb://127.0.0.1/eventapp');
var db = mongoose.connection;
db.on('error',function(e){
   console.log("Error: " + hostNames[i] + "\n" + e.message); 
   console.log( e.stack );
});
db.once('open', function (callback) {
  console.log('Got It');
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name : { type: String, required: true },
  password : { type: String, required: true },
  friendsIds : [ {type: Schema.ObjectId, ref: 'User'} ],
  img : { type: String, required: false },
  feed : [{
    entityType : String,
    entityName : String,
  	entityId : {type: Schema.ObjectId},
  	text : String,
  	date : {type: Date, default: Date.now},
  	entityAction : String
  }]
});


/*
var userFriendsSchema = new Schema({
  _userId: { type: Schema.ObjectId, ref: 'User'},
  firendsIds: [ {type: Schema.ObjectId, ref: 'User'} ]
});
*/
var eventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: Schema.ObjectId, ref: 'usercollection'},
  friendsIds: [ {type: Schema.ObjectId, ref: 'usercollection'} ],
  img: { type: String, required: false },
  active:{ type: Boolean, default: true }
});

var expenseSchema = new Schema({
  name: { type: String, required: true },
  eventId : { type: Schema.ObjectId, ref: 'eventcollection'},
  ownerId : { type: Schema.ObjectId, ref: 'usercollection'},
  details : [{
    memberId : {type: Schema.ObjectId, ref: 'usercollection'},
	amount : Number,
	isApproved:{ type: Boolean, default: false }
  }],
  comments : [{
    memberId : {type: Schema.ObjectId, ref: 'usercollection'},
	text : String,
	date : {type: Date, default: Date.now},
	isImportant:{ type: Boolean, default: false }
  }]
});


module.exports.User = mongoose.model('usercollection', userSchema);;
module.exports.Expense = mongoose.model('expensecollection', expenseSchema);
module.exports.Event = mongoose.model('eventcollection', eventSchema);
module.exports.Mongoose =  mongoose;
