'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('sighting view', function() {

  beforeEach(function() {
    browser.get('app/index.html');
  });

var sightingList = element.all(by.repeater('species in sighting.species'));

it('should list the species list with 20 images', function() {
     expect(sightingList.count()).toBe(20);
});

});
