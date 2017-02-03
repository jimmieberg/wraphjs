/** @jsx dom */
function dom(type, props, ...children) {
  return { type, props, children };
}

var Wraph = require('wraph');

module.exports = {
	root: function(store, events) {
		return new Wraph.Component({
			store,
			events,
			actions: {
				'set-name': function() {
					this.trigger('set-name', 'New name');
				}
			},
			template: function() {
				return (
					<div>
						Name of your list: <input type="text" />
						<button w-click="set-name">Set</button>
						<div style="background-color: #eeeeee; padding: 15px;">
							<h1>{ store.name }</h1>
							To do list:
							<hr />
							<button w-click="add-todo">+</button>
							<content />
						</div>
					</div>
				);
			}.bind(this),
		});
	},
	listItem: function() {
		return new Wraph.Component({
			template: function() {
				var style='background-color: ' + (false ? 'false' : '#f9f9f9') + '; padding: 15px;';
				if(!this.state.loading) {
					return (
						<div style={style}>
							<button w-click="delete" style="float: right;">-</button>
							&nbsp;&nbsp;<content />
						</div>
					);
				} else {
					return(
						<div>
							Loading...
						</div>
					);
				}
			}
		});
	}
}