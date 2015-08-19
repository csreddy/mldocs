'use strict';

describe('Service: offline', function () {

  // load the service's module
  beforeEach(module('mldocsApp'));

  // instantiate service
  var offline;
  beforeEach(inject(function (_offline_) {
    offline = _offline_;
  }));

  it('should do something', function () {
    expect(!!offline).toBe(true);
  });

});
