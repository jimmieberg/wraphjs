'use strict';

// Vendor
var Wraph = require('wraph');
// Components
var Todo = require('Components/Todo.jsx');

// Define store
var Store = {
	inputName: 'test',
	name: 'My Todo-list',
	todos: [
		{ id: 99, text: 'Take out trash', type: 1 },
		{ id: 100, text: 'Do dishes', type: 2 },
		{ id: 101, text: 'Vacuum', type: 1 }
	],
	done: {

	}
};

var store = Wraph.initStore(Store);

var events = {
	'set-name': function(name) {
		store.name = name;
	},
	'add-todo': function() {
		store.name = 'test';
	}
};

var root = Todo.root(store, events);

// Define app
root.contains(Store.todos)
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

// Start app
Wraph.render(document.getElementById('app'), root);

