'use strict';

module.exports = {
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
	Component: function(conf) {
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
				this._post();
				this.rerender();
			},
			onDelete: function(callback) {
				if(this.parent._delete) {
					this.parent._delete(this.index);
				}
				this.rerender();
			}
		};
		return Object.assign(conf, componentInstance);
	},
	compose: function(componentInstance, node, rerender) {
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