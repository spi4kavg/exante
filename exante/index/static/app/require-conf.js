requirejs.config({
	baseUrl: '/static/app/',
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery',
		'backbone': '../bower_components/backbone/backbone',
		'underscore': '../bower_components/underscore/underscore',
		'text': '../bower_components/text/text',
		'mdl': '../bower_components/material-design-lite/material',
		'select2': '../bower_components/select2/dist/js/select2.full',
		'pikaday': '../bower_components/pikaday/pikaday',
		'pikaday-jquery': '../bower_components/pikaday/plugins/pikaday.jquery',
		'validate': '../bower_components/jquery-validation/dist/jquery.validate',
		'moment': '../bower_components/moment/moment'
	},

	shim: {
		'jquery': {
			'exports': '$'
		},
		'underscore': {
			'exports': '_'
		},
		'backbone': {
			'deps': [
				'jquery',
				'underscore'
			],
			'exports': 'Backbone'
		},
		'mdl': {
			'exports': 'mdl'
		},
		'select2': {
			'exports': 'select2',
			'deps': ['jquery']
		},
		'pikaday-jquery': {
			'deps': ['pikaday', 'moment']
		},
		'validate': {
			'deps': ['jquery']
		}
	}
});