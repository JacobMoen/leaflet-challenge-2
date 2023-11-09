let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [streetmap]
}); 

let basemaps = {
    "Streets": streetmap
}

let earthquakes = new L.LayerGroup();
let overlays = {
    "Earthquakes": earthquakes
}

L.control.layers(basemaps,overlays).addTo(map)

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data){
    function getStyle(feature){
        return{
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            fillOpacity:1, 
            color: "#000000",
            weight: 0.5
        }
    }
    function getColor(depth){
        if(depth>90){
            return "#ea2c2c"
        }
        if(depth>70){
            return "#fdbb84"
        }
        if(depth>50){
            return "#fee8c8"
        }
        if(depth>30){
            return "#fff7bc"
        }
        if(depth>10){
            return "#addd8e"
        }
        return "#ea2c2c"
    }
    function getRadius(mag){
        if (mag===0) return 1;
        return mag*4;
    }
    L.geoJson(data,{
        pointToLayer: function(feature,latlong){
            return L.circleMarker(latlong);
        },
        style: getStyle,
        onEachFeature: function(feature,layer){
            layer.bindPopup(
                "Magnitude: "+feature.properties.mag+
                "<br>Depth: "+feature.geometry.coordinates[2]+
                "<br>Location: "+feature.properties.place 
            )
        }
    }).addTo(map)
})

