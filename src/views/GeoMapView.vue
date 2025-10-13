<template>
  <div class="geo-map">
    <h1>City Map</h1>
    
    <!-- 搜索输入 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a place..."
      />
      <button @click="searchPlace">Search</button>
    </div>

    <!-- 地图容器 -->
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "GeoMapView",
  data() {
    return {
      map: null,
      searchQuery: "",
      markers: [],
      routeSourceId: "route"
    };
  },
  mounted() {
    // 1️⃣ Mapbox Token
    mapboxgl.accessToken = "pk.eyJ1Ijoia2FpZml0NTAzMiIsImEiOiJjbWdvazV2ZTkwcHZlMmtwa2FwNjB2eXp4In0.bx5OjDJ0V3zG8aCCwldPuw";

    // 2️⃣ 初始化地图
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [144.9631, -37.8136], // 墨尔本经纬度
      zoom: 12
    });
  },
  methods: {
    // 搜索地点（非 trivial 功能 1）
    async searchPlace() {
      if (!this.searchQuery) return;

      const query = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          this.searchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await query.json();
      if (!data.features.length) {
        alert("No results found");
        return;
      }

      // 清空已有标记
      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      const feature = data.features[0];
      const [lng, lat] = feature.center;

      // 添加标记
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(feature.place_name))
        .addTo(this.map);
      this.markers.push(marker);

      // 地图飞到标记
      this.map.flyTo({ center: [lng, lat], zoom: 14 });

      // 如果已有另一个标记，显示路线
      if (this.markers.length === 2) {
        const start = this.markers[0].getLngLat();
        const end = this.markers[1].getLngLat();
        this.addRoute([start.lng, start.lat], [end.lng, end.lat]);
      }
    },

    // 绘制路线（非 trivial 功能 2）
    async addRoute(start, end) {
      // 删除旧路线
      if (this.map.getSource(this.routeSourceId)) {
        this.map.removeLayer(this.routeSourceId);
        this.map.removeSource(this.routeSourceId);
      }

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await query.json();
      const route = data.routes[0].geometry.coordinates;

      this.map.addSource(this.routeSourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: route }
        }
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
