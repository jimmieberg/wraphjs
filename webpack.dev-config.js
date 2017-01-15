var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'./dev-src/main.js',
	],
	output: {
		path: path.join(__dirname, 'static'),
    	filename: 'dev-bundle.js',
	    publicPath: '/static/'
	},
	resolve: {
        root: [path.join(__dirname, 'dev-src')],
        alias: {
        	wraph: path.join(__dirname, 'src/wraph.js')
        }
    },    
	module: {
		loaders: [
			{
				test: /\.html$/,
  				exclude: /node_modules/,
  				loader: "html-loader"
			},
			{
				test: /\.jsx$/,
  				exclude: /node_modules/,
  				loaders: ["babel-loader?presets[]=react,presets[]=es2015"]
			},
			{
				test: /\.js$/,
  				exclude: /node_modules/,
  				loaders: ["babel-loader?presets[]=es2015"]
			},
			{ 
				test: /\.css$/, 
				loader: "style-loader!css-loader" 
			},
			{ 
				test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
				loader: 'url-loader?limit=100000' 
			},
		],
	},
	node: {
		fs: 'empty'
	}
};

