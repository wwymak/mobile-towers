const db = require('./../pgDB');

module.exports = function (req, res) {
    let lngLatString = req.query.lngLatString;
    let sort = req.query.sort;
    let limit = req.query.limit;
    let queryLngLatStr = "";
    let psqlQuery = `SELECT network_name_mapped, COUNT(*) FROM london_towers`;

    if(lngLatString){
        let lngLatArr = lngLatString.split(',');

        //assume that there is no error and that all lng lat comes in pairs
        for (let i = 0; i< lngLatArr.length /2; i++) {
            queryLngLatStr += `${lngLatArr[2 * i]} ${lngLatArr[2 * i + 1]},`;
        }
        //make sure polygon is closed
        queryLngLatStr += `${lngLatArr[0]} ${lngLatArr[1]}`;
        psqlQuery += `WHERE ST_Within(geom, ST_GeomFromText('POLYGON((${queryLngLatStr}))', 4326))`;
    }
    psqlQuery += 'GROUP BY network_name_mapped';
    if(sort && sort.toLowerCase() === 'asc') {
        psqlQuery += 'ORDER BY COUNT ASC';
    } else if(sort && sort.toLowerCase() === 'desc') {
        psqlQuery += 'ORDER BY COUNT DESC';
    }
    if(limit) {
        limit = parseInt(limit);
        psqlQuery += `LIMIT ${limit}`
    }

    db.any(psqlQuery, [true])
        .then(data => {
            console.log('okay');
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error, message: 'query error'});
        });
};
