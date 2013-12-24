// helper tests

process.env.NODE_ENV = 'test';

var Chance = require('chance'),
    chance = new Chance(),
    expect = require('chai').expect,
    should = require('chai').should;
    
var helper = require('../lib/helper');

describe('helper', function() {

    describe('encode', function() {
        it('encode', function(done){
            var output = helper.encode(38.895095, -77.036361);
            output = output.substring(0, 12);
            expect(output).to.be.equal('dqcjqbxu6ejz');
            done();
        });
    });
    
    describe('decode', function() {
        it('decode', function(done){
            var output = helper.decode('dqcjqbxu6ejz');
            var lat = output.latitude[2].toString().substring(0, 7);
            var lon = output.longitude[2].toString().substring(0, 8);
            expect(lat).to.be.equal('38.8950');
            expect(lon).to.be.equal('-77.0363');
            done();
        });
    });
    
    describe('getDistanceFromLatLonInM', function() {
        it('output > 2400 && output < 2500', function(done){
            var output = helper.getDistanceFromLatLonInM(38.895095, -77.036361, 38.890098, -77.008667);
            expect(output).to.be.above(2400);
            expect(output).to.be.below(2500);
            done();
        });
    });
 
    describe('getDistanceFromLatLonInKm', function() {
        it('output > 2.4 && output < 2.5', function(done) {
            var output = helper.getDistanceFromLatLonInKm(38.895095, -77.036361, 38.890098, -77.008667);
            expect(output).to.be.above(2.4);
            expect(output).to.be.below(2.5);
            done();
        });
    });
});
