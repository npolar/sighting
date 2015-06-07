'use strict';

/* jasmine specs for controllers go here */
describe('Sighting controllers', function() {

  describe('SightingController', function(){

    beforeEach(module('sighting'));

    it('should create "species" model with 20 species', inject(function($controller) {
      var scope = {},
          ctrl = $controller('SightingController', {$scope:scope});

      expect(scope.length).toBe(20);
    }));

  });
});
