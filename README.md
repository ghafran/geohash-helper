geohash-helper
==============

Library that provides geohash based functions

[![Build Status](https://secure.travis-ci.org/socialradar/geohash-helper.png)](http://travis-ci.org/socialradar/geohash-helper)

## Installation

    $ npm install geohash-helper

## Geohash Encoding & Decoding

The code belows shows how to use geohash-helper to do simple encoding and decoding:

```js
var geohash_helper = require('geohash-helper');

var geohash = geohash_helper.encode(38.12345. -77.98765)
var lat_lon = geohash_helper.decode(geohash);

console.log('geohash of (' + lat_lon.latitude + ', ' + lat_lon.longitude + ') is ' + geohash);
```

## Finding Geohashes Within a Radius

The code belows shows how calculate all the geohashes that are within a radius from a center point:

```js
var tbd;
```

## Features

  * Geohash encoding and decoding
  * Find geohashes that are withing a radius
  * Find adjacent geohashes

## License

(The MIT License)

Copyright (c) 2013 SocialRadar

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.