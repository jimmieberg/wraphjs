/** @jsx dom */
function dom(type, props, ...children) {
  return { type, props, children };
}

var Wraph = require('wraph');

module.exports = {
	root: function() {
		return new Wraph.Component({
			template: function() {
				return (
					<div style="background-color: #eeeeee; padding: 15px;">
						To do list:
						<hr />
						<button w-click="post">+</button>
						<content />
					</div>
				);
			}.bind(this),
		});
	},
	listItem: function() {
		return new Wraph.Component({
			template: function() {
				var style='background-color: ' + (false ? 'black' : '#f9f9f9') + '; padding: 15px;';
				return (
					<div style={style}>
						<button w-click="delete" style="float: right;">-</button>
						&nbsp;&nbsp;<content />
					</div>
				);
			}
		});
	}
}