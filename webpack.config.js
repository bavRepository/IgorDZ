'use strict';

let path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
	mode,
	target,
	devtool,
	devServer: {
		port: 3010,
		open: true,
		hot: true,
	},
	entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'js/script.js')],
	output: {
		filename: 'index.[contenthash].js',
		path: path.resolve(__dirname, 'dist', 'src'),
		clean: true,
		assetModuleFilename: 'assets/img/[hash][ext]',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.mp3$/,
				loader: 'file-loader',
				generator: {
					filename: 'assets/audio/[name][ext]',
				},
			},
			{
				test: /\.(c|sa|sc)ss$/i,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.woff2?$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.(jpe?g|png|webp|gif|svg)$/i,
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
				type: 'asset/resource',
			},
			{
				test: /\.(?:js|mjs|cjs)$i/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: 'defaults' }]],
					},
				},
			},
		],
	},
};
