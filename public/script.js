const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Sending location:", latitude, longitude);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
  map
);

const markers = {};

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("connect_timeout", () => {
  console.error("Connection timeout");
});

// socket.on("receive-location", (data)=>{
//   const {id, latitude, longitude} = data;
//   map.setView([latitude, longitude]);
//   if(markers[id]){
//     markers[id].setLatLng([latitude, longitude]);
//   }
//   else{
//     markers[id] = L.marker([latitude, longitude]).addTo(map);
//   }
// })

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .bindPopup(`User ${id}`)
      .addTo(map);
  }
  markers[id].openPopup();
  // Only center the map on your own location
  if (id === socket.id) {
    map.setView([latitude, longitude], 16);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
