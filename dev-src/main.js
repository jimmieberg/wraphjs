'use strict';

// Vendor
var Wraph = require('wraph');
// Components
var Todo = require('Components/Todo.jsx');

// Define store
var Store = {
	todos: [
		{ id: 99, text: 'Take out trash', type: 1 },
		{ id: 100, text: 'Do dishes', type: 2 },
		{ id: 101, text: 'Vacuum', type: 1 }
	]
};

var root = Todo.root();

// Define app
root.contains(Store.todos)
	.get(function(todo) {
		return Todo.listItem()
			.contains(todo)
			.get(function(todo) {
				return todo.text;
			});
	})
	.post(function(todo) {
		Store.todos.push({ id: 112, text: 'Another item', type: 2 });
	})
	.put(function(i, todo) {
	})
	.delete(function(i, todo) {
		Store.todos.splice(i, 1);
	});

// Start app
var app = document.getElementById('app');
Wraph.start(app, root);

