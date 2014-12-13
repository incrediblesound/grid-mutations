/* global grids, describe, it, expect, should */

describe('grids()', function () {
  'use strict';
  var grid;

  beforeEach(function(){
    grid = new Grid(10);
  })

  it('exists', function () {
    expect(Grid).to.be.a('function');
    expect(grid instanceof Grid).to.equal(true);
  });

  it('does something', function () {
    expect(true).to.equal(false);
  });

  it('does something else', function () {
    expect(true).to.equal(false);
  });

  // Add more assertions here
});
