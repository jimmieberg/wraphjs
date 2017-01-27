'use strict';

// Vendor
var Wraph = require('wraph');
// Components
var Todo = require('Components/Todo.jsx');

// Define store
var Store = {
	name: '',
	todos: [
		{ id: 99, text: 'Take out trash', type: 1 },
		{ id: 100, text: 'Do dishes', type: 2 },
		{ id: 101, text: 'Vacuum', type: 1 }
	],
	done: {

	}
};

var myStore = Wraph.initStore(Store);

myStore.name = 'hej';

var Events = {
	'add-todo': function() {
		name = 'Test';
		Store.todos.push(
			{ id: 112, text: 'Another item', type: 2 }
		);
	}
};

var root = Todo.root(Events, Store);

// Define app
/*root.contains(Store.todos)
	.get(function(todo) {
		return Todo.listItem()
			.contains(todo)
			.get(function(todo) {
				return todo.text;
			});
	})
	.put(function(i, todo) {
	})
	.delete(function(i, todo) {
		Store.todos.splice(i, 1);
	});
*/
// Start app
var app = document.getElementById('app');
Wraph.start(app, root);

