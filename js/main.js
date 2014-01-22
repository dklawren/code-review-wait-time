require.config({
  baseUrl: '/js',
  paths: {
      'jquery': '/vendor/jquery',
      'es-glue': 'es-glue'
  }
});

require(['jquery'], function ($, ES) {
  'use strict';

	var options = {};

	ES.query(options, function(data, status, xhr) {
		console.log(data, status, xhr);
	});

});