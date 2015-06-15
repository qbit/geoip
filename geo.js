var http = require('http'),
geo = require('geoip'),
City = geo.City,
city = new City("/var/db/GeoIP/GeoIP.dat"),
server = http.createServer(function(req, res) {
    var from = req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    if (from === '127.0.0.1') {
	from = req.headers['x-forwarded-for'];
    }
    var cobj = city.lookup(from, function(err, data) {
	if (from === 'unknown' || err) {
	    console.log(err);
	    res.end(from);
	    return;
	}
	if (req.url.match('json')) {
	    res.end(JSON.stringify(data));
	} else {
	    if (req.url.match('redshift')) {
	        res.end(data.latitude +":"+data.longitude);
            } else {
	        res.end(data.latitude + ", " + data.longitude);
            }
	}
    });
}).listen(3099);
