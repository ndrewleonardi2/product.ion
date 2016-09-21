var Bookshelf = require('../db.js');
var Organization = require('./organization.js');
var Expense = require('./expense.js');
require('./project.js');
require('./budget.js');

var Project = Bookshelf.Model.extend({
	tableName: 'projects',
	expenses: function() {
		return this.hasMany(Expense)
	},
	budgets: function() {
		return this.hasMany('Budget', 'projs_id');
	},
	org: function() {
		return this.belongsTo('Organization', 'orgs_id');
	},
	users: function() {
		return this.belongsToMany('Project', 'projs_users', 'projs_id', 'users_id');
	}
});

module.exports = Project;
