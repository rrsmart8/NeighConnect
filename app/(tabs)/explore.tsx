import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TabTwoScreen() {
  return (
    <WebView
      style={styles.map}
      originWhitelist={['*']}
      source={{
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                html, body, #map {
                  height: 100%;
                  margin: 0;
                  padding: 0;
                }
              </style>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
            </head>
            <body>
              <div id="map"></div>
              <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
              <script>
                console.log("Initializing map...");
                try {
                  // Initialize the map centered on Bucharest
                  var map = L.map('map').setView([44.4268, 26.1025], 13);

                  // Add OpenStreetMap tile layer
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '©️ OpenStreetMap'
                  }).addTo(map);

                  // Add hardcoded markers
                  var marker1 = L.marker([44.4378, 26.0946]).addTo(map);
                  marker1.bindPopup("Problem posted in the West Bucharest").openPopup();

                  var marker2 = L.marker([44.4260, 26.1072]).addTo(map);
                  marker2.bindPopup("Problem posted in East Bucharest").openPopup();

                  console.log("Map initialized successfully!");
                } catch (error) {
                  window.ReactNativeWebView.postMessage('Leaflet error: ' + error.message);
                }
              </script>
            </body>
          </html>
        `,
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        console.log('WebView message: ', event.nativeEvent.data);
        if (event.nativeEvent.data.startsWith('Leaflet error: ')) {
          Alert.alert('Map Error', event.nativeEvent.data);
        }
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
