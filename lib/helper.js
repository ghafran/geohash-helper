var Geohash = require('./geohash.js');

var _Base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
var _maxPrecision = 8;

function encode(latitude, longitude, precision){
	
	var geohash = Geohash.encodeGeoHash(latitude, longitude, precision);
	return geohash;
}

function decode(geohash){

    var latlon = Geohash.decodeGeoHash(geohash);
	return latlon;
}

function deg2rad(deg) {

    return deg * (Math.PI / 180);
}

function rad2deg(rad) {

    return rad * (180 / Math.PI);
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {

    if (!(lat1 && lon1 && lat2 && lon2)){
        return null;
    }
    var R = 6371000; // Radius of the earth in m
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in meter
    return Math.floor(d);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    if (!(lat1 && lon1 && lat2 && lon2)){
        return null;
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function getRangeBox(latitude, longitude, radiusInKM) {

    var output = {};
    var r = 6371;
    output.MaxLatitude = latitude + rad2deg(radiusInKM / r);
    output.MinLatitude = latitude - rad2deg(radiusInKM / r);
    output.MaxLongitude = longitude + rad2deg(radiusInKM / r / Math.cos(deg2rad(latitude)));
    output.MinLongitude = longitude - rad2deg(radiusInKM / r / Math.cos(deg2rad(latitude)));

    output.MaxLatitude = output.MaxLatitude > 90 ? 90 : output.MaxLatitude;
    output.MinLatitude = output.MinLatitude < -90 ? -90 : output.MinLatitude;
    output.MaxLongitude = output.MaxLongitude > 180 ? 180 : output.MaxLongitude;
    output.MinLongitude = output.MinLongitude < -180 ? -180 : output.MinLongitude;
    return output;
}

function getGeoHashBox(ghash) {

    var latlon = Geohash.decodeGeoBox(ghash);

    var box = [
        [latlon[0][1], latlon[1][0]],
        [latlon[0][1], latlon[1][1]],
        [latlon[0][0], latlon[1][1]],
        [latlon[0][0], latlon[1][0]]
    ];

    return box;
}

function isGeohashWithinRangeBox(geohash, rangeBox) {

    var geobox = getGeoHashBox(geohash);

    if (rangeBox.MinLongitude <= geobox[0][1] && rangeBox.MaxLongitude >= geobox[1][1] && rangeBox.MinLatitude <= geobox[3][0] && rangeBox.MaxLatitude >= geobox[0][0]) {
        return true;
    } else {
        return false;
    }
}

function isPointWithinBox(x, y, x1, y1, x2, y4) {

    if (x1 <= x && x2 >= x && y4 <= y && y1 >= y)
    {
        return true;
    }
    else {
        return false;
    }
}

function doesGeohashIntersectWithRangeBox(geohash, rangeBox) {

    var geobox = getGeoHashBox(geohash);

    var inbox1 = isPointWithinBox(geobox[0][1], geobox[0][0], rangeBox.MinLongitude, rangeBox.MaxLatitude, rangeBox.MaxLongitude, rangeBox.MinLatitude);
    var inbox2 = isPointWithinBox(geobox[1][1], geobox[1][0], rangeBox.MinLongitude, rangeBox.MaxLatitude, rangeBox.MaxLongitude, rangeBox.MinLatitude);
    var inbox3 = isPointWithinBox(geobox[2][1], geobox[2][0], rangeBox.MinLongitude, rangeBox.MaxLatitude, rangeBox.MaxLongitude, rangeBox.MinLatitude);
    var inbox4 = isPointWithinBox(geobox[3][1], geobox[3][0], rangeBox.MinLongitude, rangeBox.MaxLatitude, rangeBox.MaxLongitude, rangeBox.MinLatitude);

    var inbox5 = isPointWithinBox(rangeBox.MinLongitude, rangeBox.MaxLatitude, geobox[0][1], geobox[0][0], geobox[1][1], geobox[3][0]);
    var inbox6 = isPointWithinBox(rangeBox.MaxLongitude, rangeBox.MaxLatitude, geobox[0][1], geobox[0][0], geobox[1][1], geobox[3][0]);
    var inbox7 = isPointWithinBox(rangeBox.MaxLongitude, rangeBox.MinLatitude, geobox[0][1], geobox[0][0], geobox[1][1], geobox[3][0]);
    var inbox8 = isPointWithinBox(rangeBox.MinLongitude, rangeBox.MinLatitude, geobox[0][1], geobox[0][0], geobox[1][1], geobox[3][0]);

    if (inbox1 || inbox2 || inbox3 || inbox4 || inbox5 || inbox6 || inbox7 || inbox8) {
        return true;
    }
    else {
        return false;
    }
}

function getGeoHashesInRangeBoxRange(rangeBoxMin, rangeBoxMax, geohashes, buffer) {

    var childbuffer = [];

    for (var b = 0; b < buffer.length; b++) {
        var geohash = buffer[b];
        for (var i = 0; i < _Base32.length; i++) {
            var childgeohash = geohash + _Base32[i];

            if (isGeohashWithinRangeBox(childgeohash, rangeBoxMax)) {

                if (isGeohashWithinRangeBox(childgeohash, rangeBoxMin)) {

                    // ignore
                }
                else if (doesGeohashIntersectWithRangeBox(childgeohash, rangeBoxMin)) {
                    if (geohash.length <= _maxPrecision) {
                        childbuffer.push(childgeohash);
                    }
                }
                else {

                    geohashes.push(childgeohash);
                }

            }
            else if (doesGeohashIntersectWithRangeBox(childgeohash, rangeBoxMax)) {
                if (geohash.length <= _maxPrecision) {
                    childbuffer.push(childgeohash);
                }
            }
        }
    }

    if (childbuffer.length > 0 && geohashes.length < 100) {
        getGeoHashesInRangeBoxRange(rangeBoxMin, rangeBoxMax, geohashes, childbuffer);
    }
}

function getCenterPointBetweenTwoPoints(latitude1, longitude1, latitude2, longitude2){
    
    if (!(latitude1 && longitude1 && latitude2 && longitude2)){
        return null;
    }
    
    var center = {};
    
    var lon1 = longitude1 * Math.PI / 180;
    var lon2 = longitude2 * Math.PI / 180;
    
    var lat1 = latitude1 * Math.PI / 180;
    var lat2 = latitude2 * Math.PI / 180;
    
    var dLon = lon2 - lon1;
    
    var x = Math.cos(lat2) * Math.cos(dLon);
    var y = Math.cos(lat2) * Math.sin(dLon);
    
    var lat3 = Math.atan2( Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + x) * (Math.cos(lat1) + x) + y * y) );
    var lon3 = lon1 + Math.atan2(y, Math.cos(lat1) + x);
    
    center.latitude  = lat3 * 180 / Math.PI;
    center.longitude = lon3 * 180 / Math.PI;
    return center;
}

function getGeoHashesInRangeBox(rangeBox, geohashes, buffer) {

    var childbuffer = [];

    for (var b = 0; b < buffer.length; b++) {
        var geohash = buffer[b];
        for (var i = 0; i < _Base32.length; i++) {
            var childgeohash = geohash + _Base32[i];

            if (isGeohashWithinRangeBox(childgeohash, rangeBox)) {

                geohashes.push(childgeohash);
            }
            else if (doesGeohashIntersectWithRangeBox(childgeohash, rangeBox)) {

                if (geohash.length <= _maxPrecision) {
                    childbuffer.push(childgeohash);
                }
            }
        }
    }

    if (childbuffer.length > 0 && geohashes.length < 100) {
        getGeoHashesInRangeBox(rangeBox, geohashes, childbuffer);
    }
}

function getGeoHashesWithinRadius(latitude, longitude, radiusInKM) {

    var geohashes = [];
    var rangebox = getRangeBox(latitude, longitude, radiusInKM);

    getGeoHashesInRangeBox(rangebox, geohashes, ['']);
    return geohashes;
}



function getGeoHashesWithinRadiusRange(latitude, longitude, minRadiusInKM, maxRadiusInKM) {

    var geohashes = [];
    var rangeboxmin = getRangeBox(latitude, longitude, minRadiusInKM);
    var rangeboxmax = getRangeBox(latitude, longitude, maxRadiusInKM);

    getGeoHashesInRangeBoxRange(rangeboxmin, rangeboxmax, geohashes, ['']);
    return geohashes;
}


exports.encode = encode;
exports.decode = decode;
exports.getDistanceFromLatLonInM = getDistanceFromLatLonInM;
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
exports.deg2rad = deg2rad;
exports.rad2deg = rad2deg;
exports.getRangeBox = getRangeBox;
exports.getGeoHashesWithinRadius = getGeoHashesWithinRadius;
exports.getGeoHashesWithinRadiusRange = getGeoHashesWithinRadiusRange;
exports.getGeoHashesInRangeBox = getGeoHashesInRangeBox;
exports.getGeoHashesInRangeBoxRange = getGeoHashesInRangeBoxRange;
exports.isGeohashWithinRangeBox = isGeohashWithinRangeBox;
exports.doesGeohashIntersectWithRangeBox = doesGeohashIntersectWithRangeBox;
exports.isPointWithinBox = isPointWithinBox;
exports.getGeoHashBox = getGeoHashBox;
exports.getCenterPointBetweenTwoPoints = getCenterPointBetweenTwoPoints;

