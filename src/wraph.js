'use strict';

var Store = function(args) {
	// Provide a callback to mutation of a given property
	function subscribe(store, property, callback) {
		var event = {
			publish: function(property, val) {
				args.updated(property, val);
				callback();
			}
		}
		Object.defineProperty(store.prototype, property, {
			get: function() {
				return this['_' + property];
			},
			set: function(val) {
				event.publish(property, val);
				this['_' + property] = val;
			}
		});
		return event;
	}
	// Store class
	var Instance = function() { }
	// Subscribe to mutations of certain properties
	args.properties.forEach(function(property) {
		subscribe(Instance, property.key, property.callback);
	});
	// Instantiate store instance
	var instance = new Instance();
	// Populate store with data
	args.properties.forEach(function(property) {
		instance[property.key] = property.value;
	});
	return instance;
};

module.exports = {
	initStore: function(store, events) {
		// Event bus for this store
		var eventBus = {
			subscribers: [],
			subscribe: function(subscriber) {
				eventBus.subscribers.push(subscriber);
			},
			updated: function() {
				eventBus.subscribers.forEach(function(subscriber) {
					subscriber();
				});
			}
		};
		// Listen to mutation of present properties
		var properties = Object.keys(store).map(function(key) {
			return { 
				key: key,
				value: store[key],
				callback: function() {
					console.log('Mutated', key);
				}
			}
		});
		// Init store
		var storeInstance = new Store({ properties, updated: eventBus.updated });
		// Keep reference to event bus in store
		storeInstance.__eventBus = eventBus;

		return storeInstance;
	},
	start: function(el, componentInstance) {
		return this.render(el, componentInstance);
	},
	render: function(el, componentInstance) {
		var rerender = function() {
			this.start(el, componentInstance);
		}.bind(this);
		var structure = this.compose(componentInstance, componentInstance.template(), rerender);
		el.innerHTML = '';
		el.appendChild(createDOM(structure));
		return structure;
	},
	Component: function(args) {
		var Wraph = this;

		var componentInstance = {
			contentArray: [],
			contains: function(content) {
				if(typeof(content) === 'object') {
					this.contentArray = content;
				} else {
					this.contentArray = content;
				}
				return this;
			},
			state: { },
			get: function(callback) {
				this._get = callback;
				return this;
			},
			post: function(callback) {
				this._post = callback;
				return this;
			},
			put: function(callback) {
				this._put = callback;
				return this;
			},
			delete: function(callback) {
				this._delete = callback;
				return this;
			},
			onPost: function() {
				this.state.loading = true;
				this.rerender();
				this._post().then(function(response) {
					this.contentArray.push(response);
					this.state.loading = false;
					this.rerender();
				}.bind(this));
			},
			onDelete: function(callback) {
				if(this.parent._delete) {
					this.parent._delete(this.index);
				}
				this.rerender();
			}
		};

		var store = args.store;
		if(store) {
			store.__eventBus.subscribe(function() {
				// Todo: trigger rerender
			});
		}
		return Object.assign(args, componentInstance);
	},
	compose: function(componentInstance, node, rerender) {
		console.log(node, rerender);
		if(typeof(node) === 'string') {
			return node;
		} else {
			node.componentInstance = componentInstance;
			componentInstance.rerender = rerender;
			if(node.type === 'content') {
				node.type = 'div';
				if(Array.isArray(componentInstance.contentArray)) {
					node.children = (componentInstance.contentArray || []).map(function(contentChild, index) {
						var childComponentInstance;
						if(typeof(contentChild) === 'string') {
							childComponentInstance = '';
							return this.compose(componentInstance, childComponentInstance, rerender);
						} else {
							childComponentInstance = componentInstance._get(contentChild);
							childComponentInstance.parent = componentInstance;
							childComponentInstance.index = index;
							return this.compose(childComponentInstance, childComponentInstance.template(), rerender);
						}
					}.bind(this));
				} else {
					return this.compose(componentInstance, componentInstance._get(componentInstance.contentArray), rerender);
				}
			} else {
				node.children = node.children.map(function(child) {
					return this.compose(componentInstance, child, rerender);
				}.bind(this));
			}
			return node;
		}
	}
};

/**
 *
 */
function createElement(componentInstance, node) {
	var element = document.createElement(node.type);
	if(node.props && node.props['w-click']) {
		element.addEventListener('click', function() {
			var method = node.props['w-click'];
			if(method === 'post') {
				componentInstance.onPost();
			} else if(method === 'delete') {
				componentInstance.onDelete();
			} else {
				console.log('event-triggered:', method);
				componentInstance.events[method]();
			}
		});
	}
	return element;
}

/**
 *
 */
function createDOM(node) {
	/** Text node **/
	if(typeof(node) === 'string') {
		return document.createTextNode(node);
	} else {
		/** Children **/
		var element = createElement(node.componentInstance, node);
		setAttributes(element, node.props || []);
		node.children.forEach(function(child) {
			var c = createDOM(child);
			if(c) {
				element.appendChild(c);
			}
		}.bind(this));
		return element;
	}
}

/**
 *
 */
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}