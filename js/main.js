require.config({
  baseDir: '/js',
  paths: {
      'jquery': '/vendor/jquery',
      'es-glue': 'es-glue'
  }
});

require(['jquery', 'es-glue'], function ($, ES) {
  'use strict';

	ES.query(function(data, status, xhr) {
		console.log(data, status, xhr);
	});

});