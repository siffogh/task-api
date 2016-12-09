// Loading useful modules

var express = require('express');
var router = express.Router();
var Event = require('./models/event');

// Will be used for logs
var routes_log = "SERVER/Routes---- ";

router.get('/', function(req,res){
	res.json({message: 'Welcome to the API'});
})




// Gets records filtered by repository id and event type
// Notice : We assume that both input data are needed to filter the records !

.post('/records',function(req,res){
	var repo_id = req.body.repo_id;
	var event_type = req.body.event_type;
	if(repo_id && event_type)
	{

		// Get the int value of repo_id. We don't need to check for exception because if user passes string value will be NaN
		repo_id = parseInt(repo_id);

		console.log(routes_log+"Request for records for repo_id: "+repo_id+" and event_type: "+event_type);
		Event.find({'repo.id':repo_id, 'type':event_type},function(err,data){
			if(err)
				throw err;	
				
			res.status(200).json({records:data});
		})
	}

	else{
		res.status(500).json({error:'Parameters repo_id and event_type are both required.'});
	}
})

// Returns actor details and list of contributed repositories by actor login
// Notice: Actor's login is an optional parameter that allows to retrieve records only for the specified login

.post('/actor', function(req,res){
	var actor_login = req.body.actor_login;

	if(!actor_login)
		{
			Event.aggregate({ $group : { _id : "$actor", repository : {$addToSet : "$repo"} } }, function(err,data){
				if(err)
					throw err;

				res.status(200).json({records:data});
			});
		}

	else  
	{
		Event.aggregate( {$match: {'actor.login':actor_login}},{ $group : { _id : "$actor", repository : {$addToSet : "$repo"} }}, function(err,data){
			if(err)
				throw err;

			res.status(200).json({records:data});
		});
	}
})

//Finds the repository with the highest number of events from an actor (by login). If multiple repos have 
//  the same number of events, returns the one with the latest event.

//Notice: actor login is required

.post('/toprepo',function(req,res){
	var actor_login = req.body.actor_login;

	if(!actor_login)
		res.status(500).json({error: 'Paramater actor_login is required.'});

	else{
		Event.aggregate( {$match: {"actor.login":actor_login}}, {$group: {_id: "$repo", count: {$sum:1}}}, {$sort:{"count":-1,"created_at":-1}}
			, function(err,data){
				if(err)
					throw err;

				res.status(200).json({records:data});
			});

}

})


// Returns list of all repositories with their top contributor (actor with most events).

.get('/repos', function(req,res){

	Event.aggregate({$group: {_id: {repo: "$repo",actor:"$actor"},count:{$sum:1}}},{$sort:{'count':-1}},{$group:{_id:"$_id.repo",top_actor:{$first:"$_id.actor"}}}
		,function(err,data){
			if(err)
				throw err;

			res.status(200).json({records:data});

		});
})


//Deletes the history of actor's events by login and returns number of records deleted
//Notice: actor login is required

.post('/delete_history',function(req,res){
	var actor_login = req.body.actor_login;

	if(!actor_login)
		res.status(500).json({error: 'Paramater actor_login is required.'});

	else{
		Event.remove({"actor.login":actor_login},function(err,removed){
			if(err)
				throw err;

			res.status(200).json({deleted_records:removed.result.n});
		});
	}
})





module.exports = router;