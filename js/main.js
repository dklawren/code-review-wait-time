require.config({
  baseDir: '/js',
  paths: {
      'jquery': 'vendor/jquery',
      'd3': 'vendor/d3.min',
      'es-glue': 'es-glue'
  }
});

require(['jquery', 'es-glue', 'd3'], function ($, ES, d3) {
  'use strict';

	ES.query(function(data, status, xhr) {
		console.log(data, status, xhr);
	});

});
