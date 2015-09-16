var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');

npdcGulp.loadAppTasks(gulp, {
  'deps': {
    'css': ['node_modules/purecss/build/pure.css'].concat(npdcGulp.baseConfig.deps.css),
    'assets': ['node_modules/purecss/build/grids-responsive-old-ie-min.css',
    		'node_modules/leaflet/dist/leaflet.css',
    		'node_modules/purecss/build/grids-responsive-min.css',
    		'node_modules/leaflet-draw/dist/**/*']
  }});
