(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';

    let towersTable = $('#towersTable').DataTable( {
        data: [],
        columns: [
            { title: 'Longitude', data: 'est_lng' },
            { title: 'Latitude', data: 'est_lat' },
            { title: 'Confidence', data: 'confidence' },
            { title: 'Accuracy', data: 'est_acc' },

            {title: 'Network', data: 'network_name_mapped' },
        ]
    } );

    let mapDisplay = new mapboxgl.Map({
        container: 'towersMap',
        style: 'mapbox://styles/mapbox/dark-v9',
        zoom: 12,
        center: [-0.1424372, 51.501364]
    });

    let convertLngLatToGeojson = function (locationData) {
        let mainCarriers = ['EE', 'O2', '3', 'Vodafone'];
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        locationData.forEach(d => geojson.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [+d.est_lng, +d.est_lat]
            },
            "properties": {
                network_name: mainCarriers.includes(d.network_name_mapped)? d.network_name_mapped: 'Other'
            }
        }));
        return geojson;
    };

    let plotTowerMarkers = function (map, geojsonData) {
        if(map.getSource('locationData')){
            map.getSource('locationData').setData(geojsonData);
            return;
        }
        map.addSource("locationData", {
            type: "geojson",
            data: geojsonData,
        });

            //layers-- one for unclusterd points, one for lables and other for points
        map.addLayer({
            id: 'towerLocations',
            type: 'circle',
            source: 'locationData',
            paint: {
                'circle-radius': {
                    'base': 10,
                    'stops': [[12, 2], [22, 180]]
                },

                // color circles by mobile carrier
                'circle-color': {
                    property: 'network_name',
                    type: 'categorical',
                    stops: [
                        ['EE', '#fbb03b'],
                        ['3', '#223b53'],
                        ['O2', '#e55e5e'],
                        ['Vodafone', '#3bb2d0'],
                        ['Other', '#ccc']]
                }
            }
        });

    };

    $("#queryCoordsBtn").on('click', e => {
        e.preventDefault();
        $("#queryCoordsBtn").text('Please wait');
        let coords = $("#coordinatesEntry").val().replace(/\s+/g, '');
        $.ajax({
            method: 'GET',
            url: '/api/get-towers',
            headers: {
                'Content-Type': 'application/json',
            },
            // query parameters go under "data" as an Object
            data: {
                lngLatString: coords
            }
        }).then(data => {

            towersTable.clear();
            towersTable.rows.add(data);
            towersTable.draw();

            let geojson = convertLngLatToGeojson(data);
            plotTowerMarkers(mapDisplay, geojson);
            mapDisplay.fitBounds(geojsonExtent(geojson), {padding: 20});
            $("#queryCoordsBtn").text('Show towers');
        });
    });
})();