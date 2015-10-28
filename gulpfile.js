var gulp = require('gulp');
var npdcGulp = require('npdc-gulp');

npdcGulp.loadAppTasks(gulp, {
  'deps': {
    'css': [
        'node_modules/purecss/build/pure.css',
        'node_modules/purecss/build/grids-responsive-old-ie-min.css',
        'node_modules/purecss/build/grids-responsive-min.css',
        'node_modules/leaflet/dist/leaflet.css',
        'node_modules/formula/dist/formula.min.css',
        'node_modules/chronopic.js/dist/css/chronopic-ext-md.min.css',
        'node_modules/chronopic.js/dist/css/chronopic.min.css'].concat(npdcGulp.baseConfig.deps.css),
    'assets': [
    		'node_modules/leaflet-draw/dist/**/*',
    		'node_modules/formula/dist/**/*',
    		'node_modules/xlsx/dist/*',
    		'node_modules/leaflet/dist/*',
            'node_modules/angular-simple-logger/dist/*',
    		'node_modules/angular-leaflet-directive/dist/*',
    		'node_modules/leaflet-draw/dist/*']
  }});
