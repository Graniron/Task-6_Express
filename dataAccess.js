var fs = require('fs');
var uuid = require('uuid');
var HttpError = require('./error');

var dataAccess = {
	getUsers: function(cb) {
		fs.readFile('./users.json', {encoding: 'utf-8'}, function(err, data){
			if (err) return cb(err);

			try {
				var users = JSON.parse(data);
			} catch(e) {
				return cb(e);
			}

			if (users.length === 0) return cb({
					status: 404,
					message: 'Users not found!'
				}); 
			cb(null, users);
		});
	},

	getUser: function(id, cb) {
		fs.readFile('./users.json', {encoding: 'utf-8'}, function(err, data){
			if (err) return cb(err);

			try {
				var users = JSON.parse(data);
			} catch(e) {
				return cb(e);
			}

			var index = users.findIndex(function(item) {
				return item.id == id;
			});
			
			if (index === -1) return cb({
					status: 404,
					message: 'User was not found!'
				}); 
				
			cb(null, users[index]);
		});
	},

	addUser: function(newUser, cb) {
		fs.readFile('./users.json', {encoding: 'utf-8'}, function(err, data){
			if (err) return cb(err);

			try {
				var users = JSON.parse(data);
			} catch(e) {
				return cb(e);
			}			

			if (newUser.name.length < 3) return cb({
				status: 418,
				message: "I'm a teapot, and: Too short name!"
			});

			newUser.id = uuid.v4();
			users.push(newUser);
			fs.writeFile('./users.json', JSON.stringify(users), function(err) {
				if (err) return cb(err);
				console.log('User was saved!');
			});

			cb(null, users);
		});
	},

	deleteUser: function(id, cb) {
		fs.readFile('./users.json', {encoding: 'utf-8'}, function(err, data){
			if (err) return cb(err);

			try {
				var users = JSON.parse(data);
			} catch(e) {
				return cb(e);
			}

			var index = users.findIndex(function(item) {
				return item.id == id;
			});

			if (index === -1) return cb({
					status: 404,
					message: 'User was not found!'
				}); 

			users.splice(index, 1);
			fs.writeFile('./users.json', JSON.stringify(users), function(err) {
				if (err) return cb(err);
				console.log('User was removed!');
			});

			cb(null, users);
		});
	}
}

module.exports = dataAccess;