require.config({
  baseDir: '/js',
  paths: {
      'jquery': '/vendor/jquery',
      'es-glue': 'es-glue'
  }
});

require(['jquery', 'es-glue'], function ($, ES) {
  'use strict';


	var options = {};

	ES.query(options, function(data, status, xhr) {
		console.log(data, status, xhr);
	});

});