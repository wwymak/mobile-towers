(function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid3d5bWFrIiwiYSI6IkxEbENMZzgifQ.pxk3bdzd7n8h4pKzc9zozw';
    //set up datatable
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
    // map setup
    let mapDisplay = new mapboxgl.Map({
        container: 'towersMap',
        style: 'mapbox://styles/mapbox/dark-v9',
        zoom: 12,
        center: [-0.1424372, 51.501364]
    });



    let queryBtn = $("#queryCoordsBtn");
    // the map needs geojson input so turn the lnglat data into geojson
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
                network_name: mainCarriers.includes(d.network_name_mapped)? d.network_name_mapped: 'Other',
                description: `<p><strong>Network: </strong>${d.network_name_mapped}</p>
                    <p><strong>Confidence: </strong>${d.confidence}</p><p><strong>Type: </strong>${d.is_lte? '4G': (d.is_3g? '3G': (d.is_2g? '2G': 'not known'))}</p>`
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

        // hmm, might split the layers so that you can toggle different carrier's circles on and off
        map.addLayer({
            id: 'towerLocations',
            type: 'circle',
            source: 'locationData',
            paint: {
                'circle-radius': {
                    'base': 2,
                    'stops': [[12, 5], [18, 20], [22, 10]]
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

        mapDisplay.on('click', 'towerLocations', function (e) {
            new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.description)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        mapDisplay.on('mouseenter', 'towerLocations', function () {
            mapDisplay.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        mapDisplay.on('mouseleave', 'towerLocations', function () {
            mapDisplay.getCanvas().style.cursor = '';
        });

    };

    //handle the form submit event
    queryBtn.on('click', e => {
        e.preventDefault();
        queryBtn.text('Please wait');
        queryBtn.prop('disabled', false);
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
            //update the datatable
            towersTable.clear();
            towersTable.rows.add(data);
            towersTable.draw();

            //update the map
            let geojson = convertLngLatToGeojson(data);
            plotTowerMarkers(mapDisplay, geojson);
            //zoom to fit all the markers
            mapDisplay.fitBounds(geojsonExtent(geojson), {padding: 20});
            queryBtn.text('Show towers');
            queryBtn.prop('disabled', false);
        });
    });
})();