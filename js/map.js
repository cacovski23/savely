      var map, infoWindow, fireLocMarker, currentPosCoordinates, heatmap;
      var people_markers = new Array();
      var sat_markers = new Array();

      //var fires_europe_people = CSVToArray(fires_europe_modis_csv);
      //var fires_europe = CSVToArray(fires_europe_viirs_csv);
      var fires_europe;

      // single marker start
      function setFireLocSingleMarker(map)
      {
          fireLocMarker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: currentPosCoordinates,
            zIndex: 50000
          });
          fireLocMarker.addListener('click', toggleBounce);
      }

      function toggleBounce() {
        if (fireLocMarker.getAnimation() !== null) {
          fireLocMarker.setAnimation(null);
        } else {
          fireLocMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }      

      function setCurrentLocation(map)
      {
        // Try HTML5 geolocation.
        infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            currentPosCoordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            function(error){
                alert(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout : 5000
            };

            infoWindow.setZIndex(10);
            infoWindow.setPosition(currentPosCoordinates);
            infoWindow.setContent('<div style="text-align: center;padding:20px; font-size: 18px; line-height:1.4em;">Your are here and these are the active fires<br> in your area in the last 24 hours.</div>');
            infoWindow.open(map);
            map.setCenter(currentPosCoordinates);
            //setFireLocSingleMarker(map);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      var skopje = { lat: 41.9973462, lng: 21.42799560000003 };
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentPosCoordinates, //skopje,
          zoom: 15
      });

      infowindow = new google.maps.InfoWindow();
    }    

    var skopje = { lat: 41.9973462, lng: 21.42799560000003 };
    function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: skopje,
                zoom: 10
            });

            infowindow = new google.maps.InfoWindow();
            //setSateliteMarkers_Fires(map);
            //setPeopleMarkers(map);
            //setPolygons(map);
            //setHeatmap(map);

            //setFireRadiuses(map);
            setCurrentLocation(map);
            //setNearGasStations(map);
            //setNearHospitals(map);
            //setNearFireStations(map);
        }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

        function setNearFireStations(map, location) {
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: (location ? location : currentPosCoordinates), //skopje,
                radius: 50000, //radius in meters
                type: ['fire_station']
            }, callback_firestation);
        }

        function setNearGasStations(map, location) {
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: (location ? location : currentPosCoordinates), //skopje,
                radius: 10000, //radius in meters
                type: ['gas_station']
            }, callback_gasstation);
        }

        function setNearHospitals(map, location) {
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: (location ? location : currentPosCoordinates), //skopje,
                radius: 10000, //radius in meters
                type: ['hospital']
            }, callback_hospital);
        }

      function setSateliteMarkers(map) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: '/savely/img/flame.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 32, 20, 32, 20, 1],
          type: 'poly'
        };
                
        fires_europe = sat_data;

        for (var i = 0; i < fires_europe.length; i++) {
          var fire = fires_europe[i];
          sat_markers[i] = new google.maps.Marker({
              position: { lat: parseFloat(fire.latitude), lng: parseFloat(fire.longitude) },
              //position: {lat: parseFloat(fire[0]), lng: parseFloat(fire[1])},
              map: map,
              icon: image,
              shape: shape,
              title: 'Brightness: ' + fire.bright_ti4 + 'K\nFire Radiative Power: ' + fire.frp + 'MW (megawatts)\nAcq date: ' + fire.acq_date + '\nAcq time: ' + new String(fire.acq_time).toString() + ' (UTC)\nSatelite: ' + (fire.satelite == 'T' ? 'Terra' : 'Aqua') + '\nConfidence: ' + fire.confidence + '\nDay/Night: ' + (fire.daynight == 'D' ? 'Daytime Fire' : 'Nighttime Fire'),
              frp: fire.frp
              //title: 'Brightness: '+fire.[2] + '\nAcq date: '+$.datepicker.formatDate('dd M yy', new Date(fire[5])) + '\nAcq time: ' + new String(fire[6]).toString().substr(0,2)+':'+ new String(fire[6]).toString().substr(2,4) + '\nSatelite: '+(fire[7] == 'T' ? 'Terra' : 'Aqua') + '\nConfidence: ' + fire[8] + '\nDay/Night: ' + fire[12]
              //zIndex: fire[3]
          }).addListener('click', function () {
              var fireCircle = new google.maps.Circle({
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  map: map,
                  center: this.getPosition(),
                  radius: parseFloat(this.frp) * 10
              });

              removeFireStationMarkers(map);
              setNearFireStations(map, this.getPosition());

              removeGasStationMarkers(map);
              setNearGasStations(map, this.getPosition());

              removeHospitalMarkers(map);
              setNearHospitals(map, this.getPosition());
          });
        }
      }

      function setPeopleMarkers(map) {
          // Adds markers to the map.

          // Marker sizes are expressed as a Size of X,Y where the origin of the image
          // (0,0) is located in the top left of the image.

          // Origins, anchor positions and coordinates of the marker increase in the X
          // direction to the right and in the Y direction down.
          var image = {
              url: '/savely/img/man.png',
              // This marker is 20 pixels wide by 32 pixels high.
              size: new google.maps.Size(20, 32),
              // The origin for this image is (0, 0).
              origin: new google.maps.Point(0, 0),
              // The anchor for this image is the base of the flagpole at (0, 32).
              anchor: new google.maps.Point(0, 32)
          };
          // Shapes define the clickable region of the icon. The type defines an HTML
          // <area> element 'poly' which traces out a polygon as a series of X,Y points.
          // The final coordinate closes the poly by connecting to the first coordinate.
          var shape = {
              coords: [1, 1, 1, 32, 20, 32, 20, 1],
              type: 'poly'
          };

          var gallery = '';
          for (var i = 0; i < people_data.length; i++) {
              people_markers[i] = new google.maps.Marker({
                  position: { lat: parseFloat(people_data[i].latitude), lng: parseFloat(people_data[i].longitude) },
                  map: map,
                  icon: image,
                  shape: shape,
                  title: 'Reported by civilian on: ' + people_data[i].date + ' ' + people_data[i].time + ' (UTC)',
                  description: people_data[i].description,
                  date: people_data[i].date,
                  time: people_data[i].time,
                  images: people_data[i].images
                  //zIndex: fire[3]
              }).addListener('click', function () {
                  if (this.images.length != 0)
                      gallery = JSON.parse(this.images);

                  var html_gallery = '<div class="gallery">';
                  for (var j = 0; j < gallery.length; j++)
                      html_gallery += '<a href="' + gallery[j].img + '" target="_blank"><img src="' + gallery[j].img + '" width = 100 /></a>';

                  html_gallery += '</div>';

                  infoWindow.setPosition(this.getPosition());
                  infoWindow.setContent('<div style="text-align: left; padding:20px; font-size: 18px; line-height:1.4em;">Reported at: ' + this.date + ' ' + this.time + ' (UTC)' + (this.description != '' ? '<br>Description: ' + this.description : '') + html_gallery + '</div>');
                  infoWindow.open(map);

                  removeFireStationMarkers(map);
                  setNearFireStations(map, this.getPosition());

                  removeGasStationMarkers(map);
                  setNearGasStations(map, this.getPosition());

                  removeHospitalMarkers(map);
                  setNearHospitals(map, this.getPosition());
              });
          }
      }

      function removePeopleMarkers(map) {
          for (var i = people_markers.length-1; i >= 0; i--) {
              people_markers[i].f.setMap(null);
              people_markers.pop();
          }
      }

      function removeSateliteMarkers(map) {
          for (var i = sat_markers.length-1; i >= 0; i--) {
              sat_markers[i].f.setMap(null);
              sat_markers.pop();
          }
      }

      function removeFireStationMarkers(map) {
          for (var i = fire_station_markers.length - 1; i >= 0; i--) {
              fire_station_markers[i].setMap(null);
              fire_station_markers.pop();
          }
      }

      function removeGasStationMarkers(map) {
          for (var i = gas_station_markers.length - 1; i >= 0; i--) {
              gas_station_markers[i].setMap(null);
              gas_station_markers.pop();
          }
      }

      function removeHospitalMarkers(map) {
          for (var i = hospital_markers.length - 1; i >= 0; i--) {
              hospital_markers[i].setMap(null);
              hospital_markers.pop();
          }
      }

      function setHeatmap(map) {
          heatmap = new google.maps.visualization.HeatmapLayer({
              data: getPoints(),
              map: map
          });
      }

      function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }

      function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

      function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
      }

      function changeOpacity() {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
      }

      //generate Fire Heatmap
      function getPoints() {
          var points = new Array();
          for (var i = 0; i < heatmap_data.length; i++)
              points[i] = new google.maps.LatLng(parseFloat(heatmap_data[i].latitude), parseFloat(heatmap_data[i].longitude));

      return points;
  }

      function callback_firestation(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                  createFireStationMarker(results[i], i);
              }
          }
      }

      function callback_gasstation(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                  createGasStationMarker(results[i], i);
              }
          }
      }

      function callback_hospital(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                  createHospitalMarker(results[i], i);
              }
          }
      }

      var fire_station_markers = new Array();
      function createFireStationMarker(place, i) {
          var placeLoc = place.geometry.location;
          fire_station_markers[i] = new google.maps.Marker({
              map: map,
              icon: {
                  url: '/savely/img/estinguisher.png',
                  size: new google.maps.Size(20, 32),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 32)
              },
              position: place.geometry.location
          });

          google.maps.event.addListener(fire_station_markers[i], 'click', function () {
              infowindow.setContent('Name: ' + place.name + '<br>Vicinity: ' + place.vicinity);
              infowindow.open(map, this);
          });
      }

        var gas_station_markers = new Array();
        function createGasStationMarker(place, i) {
            var placeLoc = place.geometry.location;
            gas_station_markers[i] = new google.maps.Marker({
                map: map,
                icon: {
                    url: '/savely/img/bomb.png',
                    size: new google.maps.Size(20, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32)
                },
                position: place.geometry.location
            });

            google.maps.event.addListener(gas_station_markers[i], 'click', function () {
                infowindow.setContent('Name: ' + place.name + '<br>Vicinity: ' + place.vicinity);
                infowindow.open(map, this);
            });
        }

        var hospital_markers = new Array();
        function createHospitalMarker(place, i) {
        var placeLoc = place.geometry.location;
          hospital_markers[i] = new google.maps.Marker({
              map: map,
              icon: {
                  url: '/savely/img/hospital.png',
                  size: new google.maps.Size(20, 32),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 32)
                },
              position: place.geometry.location
          });

          google.maps.event.addListener(hospital_markers[i], 'click', function () {
              infowindow.setContent('Name: ' + place.name + '<br>Vicinity: ' + place.vicinity);
              infowindow.open(map, this);
          });    
        }        