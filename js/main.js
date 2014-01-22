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
      var d1 = [];
      for (var i = 0; i < 14; i += 0.5) {
        d1.push([i, Math.sin(i)]);
      }
      var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
      var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
      $.plot("#chart", [ d1, d2, d3 ]);
    });

});
