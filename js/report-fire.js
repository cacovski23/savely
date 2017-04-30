// Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow, fireLocMarker, currentPosCoordinates;

      // single marker start
      function setFireLocSingleMarker(map)
      {
          fireLocMarker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: currentPosCoordinates,
            zIndex: 10000
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
      // single marker end

      function setCurrentLocation(map)
      {
          // Try HTML5 geolocation.
        infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            currentPosCoordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setZIndex(10);
            infoWindow.setPosition(currentPosCoordinates);
            infoWindow.setContent('<div style="text-align: center;padding:20px; font-size: 18px; line-height:1.4em;">Your are here.<br><span style="font-weight: bold">Drag the marker where the fire is!</span><div style="color: #888; font-size: 12px;">(close this notification first)</div>');
            infoWindow.open(map);
            map.setCenter(currentPosCoordinates);
            setFireLocSingleMarker(map);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function initMap() 
      {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 41.9973462, lng: 21.42799560000003},
          zoom: 14
        });

        setCurrentLocation(map);
      }      

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }