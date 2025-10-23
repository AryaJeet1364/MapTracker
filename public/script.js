// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       console.log("Sending location:", latitude, longitude);
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.log(error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// } else {
//   console.log("Geolocation is not supported by this browser.");
// }

// const map = L.map("map").setView([0, 0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
//   map
// );

// const markers = {};

// socket.on("connect_error", (error) => {
//   console.error("Connection error:", error);
// });

// socket.on("connect_timeout", () => {
//   console.error("Connection timeout");
// });

// // socket.on("receive-location", (data)=>{
// //   const {id, latitude, longitude} = data;
// //   map.setView([latitude, longitude]);
// //   if(markers[id]){
// //     markers[id].setLatLng([latitude, longitude]);
// //   }
// //   else{
// //     markers[id] = L.marker([latitude, longitude]).addTo(map);
// //   }
// // })

// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;
//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//   } else {
//     markers[id] = L.marker([latitude, longitude])
//       .bindPopup(`User ${id}`)
//       .addTo(map);
//   }
//   markers[id].openPopup();
//   // Only center the map on your own location
//   if (id === socket.id) {
//     map.setView([latitude, longitude], 16);
//   }
// });

// socket.on("user-disconnected", (id) => {
//   if (markers[id]) {
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// });




const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Your location:", latitude, longitude);

      // Initialize the map at the actual location immediately
      const map = L.map("map").setView([latitude, longitude], 16);
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {}
      ).addTo(map);

      const markers = {};

      // Show your own marker
      markers[socket.id] = L.marker([latitude, longitude])
        .bindPopup("You are here")
        .addTo(map)
        .openPopup();

      // Send your first location to server
      socket.emit("send-location", { latitude, longitude });

      // Watch for updates
      navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          console.log("Updating location:", lat, lon);

          markers[socket.id].setLatLng([lat, lon]);
          map.setView([lat, lon], 16); // recenter map
          socket.emit("send-location", { latitude: lat, longitude: lon });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Receive other users
      socket.on("receive-location", (data) => {
        const { id, latitude, longitude } = data;
        if (id === socket.id) return; // skip self
        if (markers[id]) {
          markers[id].setLatLng([latitude, longitude]);
        } else {
          markers[id] = L.marker([latitude, longitude])
            .bindPopup(`User ${id}`)
            .addTo(map);
        }
      });

      socket.on("user-disconnected", (id) => {
        if (markers[id]) {
          map.removeLayer(markers[id]);
          delete markers[id];
        }
      });
    },
    (err) => {
      console.error("Geolocation error:", err);
      alert("Cannot get your location. Map will show default location.");
    },
    { enableHighAccuracy: true }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}

