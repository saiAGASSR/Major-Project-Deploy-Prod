	console.log(localAccesstoken);
    
    mapboxgl.accessToken = localAccesstoken;
    console.log("accessTaoken",mapboxgl.accessToken);
    
    let coOrdinatesArray = [];

    let convertedPoints = singleListingCoorinates.split(",").map(Number);

    coOrdinatesArray.push(singleListingCoorinates);
    console.log('array ?',convertedPoints);


    

    const map = new mapboxgl.Map({
        // container: 'map', // container ID
        // center: [72, 19], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        // zoom: 9 // starting zoom
        style: 'mapbox://styles/mapbox/streets-v12', // style URL

        container: 'map', // container ID
        // center: [72, 19], //Mumbai // starting position [lng, lat]. Note that lat must be set between -90 and 90
        // center: singleListingCoorinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        center: convertedPoints, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9// starting zoom

    });


    console.log("coordinates array for  dynamic ?" , singleListingCoorinates );
     

    // const marker  = new mapboxgl.Marker({ color: "red"} )
    //                         .setLngLat(convertedPoints)
    //                         .setPopup(
    //                             new   mapboxgl.Popup()
    //                                         .setHTML("<h3>Exact location will  be provided after the booking !</h3>")) // add popup
    //                         .addTo(map); // Replace this line with code from step 5-2


    
    map.on('load', () => {
        // Load an image from an external URL.
        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('cat', image);

                // Add a data source containing one point feature.
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates':convertedPoints
                                }
                            }
                        ]
                    }
                });

                // Add a layer to use the image to represent the data.
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                        'icon-image': 'cat', // reference the image
                        'icon-size': 0.125
                    }
                });
            }
        );
    });