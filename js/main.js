/*globals Zepto L */

(function($) {
  // Some sample Javascript functions:
  $(function(){
    var jQT = new $.jQTouch({
      addGlossToIcon: false, // turn off
      fixedViewport: false, // turn off
      fullScreen: false, // turn off
      fullScreenClass: 'fullscreen',
      icon: null,
      icon4: null, // available in iOS 4.2 and later.
      preloadImages: false,
      startupScreen: null,
      statusBar: 'default' // other options: black-translucent, black
    });

    var $mapPage = $('#startlocation'),
        $mapAlert = $('#map-alert'),
        defaultStyle = {
          opacity: 0.7,
          weight: 4,
          color: '#4575b4',
          clickable: false
        },
        selectStyle = {
          opacity: 0.9,
          weight: 4,
          color: '#ff0000',
          clickable: false
        },
        ends = {
          '100': [40.721273, -74.001453],
          '101': [40.721627, -74.002180],
          '102': [40.722536, -74.001400],
          '103': [40.722180, -74.000681],

          '104': [40.720865, -74.000665],
          '105': [40.721259, -74.001421],
          '106': [40.722160, -74.000649],
          '107': [40.721790, -73.999882]
        },
        layerData = [
          {
            ends: ['100', '101'],
            line: [[40.721273, -74.001453], [40.721627, -74.002180]]
          },
          {
            ends: ['101', '102'],
            line: [[40.721627, -74.002180], [40.722536, -74.001400]]
          },
          {
            ends: ['102', '103'],
            line: [[40.722536, -74.001400], [40.722180, -74.000681]]
          },
          {
            ends: ['103', '100'],
            line: [[40.722180, -74.000681], [40.721273, -74.001453]]
          },

          {
            ends: ['104', '105'],
            line: [[40.720865, -74.000665], [40.721259, -74.001421]]
          },
          {
            ends: ['105', '106'],
            line: [[40.721259, -74.001421], [40.722160, -74.000649]]
          },
          {
            ends: ['106', '107'],
            line: [[40.722160, -74.000649], [40.721790, -73.999882]]
          },
          {
            ends: ['107', '104'],
            line: [[40.721790, -73.999882], [40.720865, -74.000665]]
          },
        ],
        layerGroup = L.featureGroup([]),
        endLayers = L.featureGroup([]),
        $mapNextBtn = $('#map-next-btn'),
        i, len, map, featureSelect;

    for(i=0, len=layerData.length; i<len; i++) {
      layerGroup.addLayer(L.polyline(layerData[i].line, L.Util.extend({ends: layerData[i].ends}, defaultStyle)));
    }

    endLayers.on('click', function(evt) {
      console.log('You picked', evt.layer.options.id);
      endLayers.setStyle(defaultStyle);
      evt.layer.setStyle(selectStyle);

      $mapAlert.text('Click Next to continue...');
      $mapNextBtn.show();
    });


    function updateMapState(selectedLayers) {
      var i, endIds;

      $mapNextBtn.hide();
      endLayers.clearLayers();

      if (selectedLayers.length === 1) {
        $mapAlert.text('Tap your starting point...').show();
        endIds = selectedLayers[0].options.ends;

        console.log(endIds);
        endLayers.clearLayers();
        for (i=0; i<endIds.length; i++) {
          endLayers.addLayer(
            L.circleMarker(ends[endIds[i]], L.Util.extend(defaultStyle, {
              id: endIds[i],
              radius: 25,
              clickable: true
            }))
          );
        }
      } else {
        $mapAlert.text('Select a blockface by dragging it to the center...').show();
      }
    }

    function setStyle(layers, style) {
      var i;
      for (i=0; i<layers.length; i++) {
        layers[i].setStyle(style);
      }
    }

    function initMap() {
      map = new L.map('map', {
        center: [40.721879, -74.001432],
        zoom: 18
      });

      var layerUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',
          layerAttribution = 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
          layer = L.tileLayer(layerUrl, {
            maxZoom: 19,
            attribution: layerAttribution,
            subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
          }).addTo(map);

      featureSelect = window.featureSelect = L.featureSelect({
        layerGroup: layerGroup
      }).addTo(map);


      map.addLayer(layerGroup).addLayer(endLayers);

      featureSelect.on('select', function(evt) {
        console.log(evt);
        setStyle(evt.layers, selectStyle);

        updateMapState(featureSelect.layers);
      });

      featureSelect.on('unselect', function(evt) {
        console.log(evt);
        setStyle(evt.layers, defaultStyle);

        updateMapState(featureSelect.layers);
      });

      $mapAlert.text('Select a blockface by dragging it to the center...').show();
    }

    if ($('#startlocation').hasClass('current')) {
      // Init the map if we start on that page
      initMap();
    } else {
      // Init the map when we animate to that page
      $mapPage.on('pageAnimationEnd', function(evt, data) {
        if (!map && data.direction === 'in') {
          initMap();
        }
      });
    }

    $('.btn-group > button').click(function(evt){
      $(this)
        .addClass('btn-primary')
        .siblings().removeClass('btn-primary');
    });

    $('#anothertree').click(function() {
      window.alert('This will show you another form just like this one to map the next tree.');
    });
  });

}(Zepto));