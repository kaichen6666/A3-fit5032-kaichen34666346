<template>
  <div class="geo-map">
    <h1>City Map – Nutrition Education Points</h1>
    
    <!-- Single-place search -->
    <div class="search-box">
      <input
        v-model="singleSearchQuery"
        type="text"
        placeholder="Search for a place..."
      />
      <button @click="searchPlace">Search</button>
    </div>

    <!-- Route search -->
    <div class="search-box">
      <input
        v-model="routeStart"
        type="text"
        placeholder="Start location..."
      />
      <input
        v-model="routeEnd"
        type="text"
        placeholder="Destination..."
      />
      <button @click="searchRoute">Go</button>
    </div>

    <!-- Suggested Nutrition Locations Table -->
    <!-- This table provides users with example locations related to nutrition education -->
    <div class="suggested-table card mb-4 p-3 shadow-sm">
      <h4>Suggested Locations for Nutrition Education</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Place Type</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in suggestedLocations" :key="index">
            <td>{{ item.type }}</td>
            <td>{{ item.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Map container -->
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  data() {
    return {
      map: null,
      markers: [],
      routeSourceId: "route",

      // Inputs
      singleSearchQuery: "",
      routeStart: "",
      routeEnd: "",

      // Suggested nutrition-related locations
      suggestedLocations: [
  { type: "Health Food Store", location: "Melbourne CBD" },
  { type: "Community Kitchen", location: "Fitzroy" },
  { type: "Nutrition Workshop", location: "Melbourne" },
  { type: "Farmers Market", location: "Queen Victoria Market" },
  { type: "Dietitian Clinic", location: "Melbourne" },
  { type: "Cooking Class", location: "Carlton" },
  { type: "School Nutrition Program", location: "Local Primary Schools" },
  { type: "Urban Garden", location: "CERES, Brunswick" },
  { type: "Vitamin Shop", location: "South Yarra" },
  { type: "Juice Bar / Smoothie Cafe", location: "Melbourne CBD" }
]
    };
  },
  mounted() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [144.9631, -37.8136],
      zoom: 12
    });
  },
  methods: {
    // ------------------------------
    // Feature 1: Single-place search
    // ------------------------------
    async searchPlace() {
      if (!this.singleSearchQuery) return;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          this.singleSearchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      if (!data.features.length) {
        alert("No results found");
        return;
      }

      const [lng, lat] = data.features[0].center;

      // Add marker
      this.addMarker([lng, lat], data.features[0].place_name);

      // Fly to marker
      this.map.flyTo({ center: [lng, lat], zoom: 14 });
    },

    addMarker(lngLat, popupText) {
      const marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .setPopup(new mapboxgl.Popup().setText(popupText))
        .addTo(this.map);

      this.markers.push(marker);
    },

    // ------------------------------
    // Feature 2: Route search
    // ------------------------------
    async searchRoute() {
      if (!this.routeStart || !this.routeEnd) {
        alert("Please enter both start and destination");
        return;
      }

      const startCoord = await this.geocode(this.routeStart);
      const endCoord = await this.geocode(this.routeEnd);

      if (!startCoord || !endCoord) return;

      // Remove previous markers & route
      this.markers.forEach(m => m.remove());
      this.markers = [];
      if (this.map.getSource(this.routeSourceId)) {
        this.map.removeLayer(this.routeSourceId);
        this.map.removeSource(this.routeSourceId);
      }

      // Add start & end markers
      this.addMarker(startCoord, this.routeStart);
      this.addMarker(endCoord, this.routeEnd);

      // Draw route
      this.drawRoute(startCoord, endCoord);

      // Fit map bounds
      this.map.fitBounds([startCoord, endCoord], { padding: 50 });
    },

    async geocode(query) {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      if (!data.features.length) {
        alert(`No results found for "${query}"`);
        return null;
      }
      return data.features[0].center; // [lng, lat]
    },

    async drawRoute(start, end) {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const route = data.routes[0].geometry.coordinates;

      this.map.addSource(this.routeSourceId, {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: route } }
      });

      this.map.addLayer({
        id: this.routeSourceId,
        type: "line",
        source: this.routeSourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#3887be", "line-width": 5, "line-opacity": 0.75 }
      });
    }
  }
};
</script>

<style scoped>
.geo-map {
  max-width: 900px;
  margin: 20px auto;
}

.search-box {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.search-box input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
}

.search-box button {
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
