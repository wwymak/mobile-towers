const db = require('./../pgDB');

module.exports = function (req, res) {
    let lngLatString = req.query.lngLatString;
    if(!lngLatString) {
        res.status(500).json({error: error, message: 'no lnglat params'});
        return
    }

    let lngLatArr = lngLatString.split(',');
    let queryLngLatStr = "";
    //assume that there is no error and that all lng lat comes in pairs
    for (let i = 0; i< lngLatArr.length /2; i++) {
        queryLngLatStr += `${lngLatArr[2 * i]} ${lngLatArr[2 * i + 1]},`;
    }
    //make sure polygon is closed
    queryLngLatStr += `${lngLatArr[0]} ${lngLatArr[1]}`;
    //limit number of fields returned so as not to overwhelm the browser with MBs of data-- theses seems to
    //be the most relevant info
    let fieldsToReturn = ['confidence', 'est_acc', 'est_lat', 'est_lng', 'network_name_mapped', 'is_2g', 'is_3g', 'is_lte'];
    let fieldsQueryString = fieldsToReturn.join(',');
    let psqlQuery = `SELECT ${fieldsQueryString} FROM london_towers WHERE ST_Within(geom, ST_GeomFromText('POLYGON((${queryLngLatStr}))', 4326))`;


    db.any(psqlQuery, [true])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error, message: 'query error'});
        });
};
