
var Bookshelf = require('../db.js');
var Organization = require('./organization.js');
require('./project.js');

var User = Bookshelf.Model.extend({
  tableName: 'users',
	org: function() {
		return this.belongsTo('Organization', 'orgs_id');
	},
	projects: function() {
		return this.belongsToMany('Project', 'projs_users', 'users_id', 'projs_id');
	}
});

module.exports = User;
