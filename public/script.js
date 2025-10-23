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




// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       console.log("Your location:", latitude, longitude);

//       // Initialize the map at the actual location immediately
//       const map = L.map("map").setView([latitude, longitude], 16);
//       L.tileLayer(
//         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {}
//       ).addTo(map);

//       const markers = {};

//       // Show your own marker
//       markers[socket.id] = L.marker([latitude, longitude])
//         .bindPopup("You are here")
//         .addTo(map)
//         .openPopup();

//       // Send your first location to server
//       socket.emit("send-location", { latitude, longitude });

//       // Watch for updates
//       navigator.geolocation.watchPosition(
//         (pos) => {
//           const lat = pos.coords.latitude;
//           const lon = pos.coords.longitude;
//           console.log("Updating location:", lat, lon);

//           markers[socket.id].setLatLng([lat, lon]);
//           map.setView([lat, lon], 16); // recenter map
//           socket.emit("send-location", { latitude: lat, longitude: lon });
//         },
//         (err) => console.error(err),
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//       );

//       // Receive other users
//       socket.on("receive-location", (data) => {
//         const { id, latitude, longitude } = data;
//         if (id === socket.id) return; // skip self
//         if (markers[id]) {
//           markers[id].setLatLng([latitude, longitude]);
//         } else {
//           markers[id] = L.marker([latitude, longitude])
//             .bindPopup(`User ${id}`)
//             .addTo(map);
//         }
//       });

//       socket.on("user-disconnected", (id) => {
//         if (markers[id]) {
//           map.removeLayer(markers[id]);
//           delete markers[id];
//         }
//       });
//     },
//     (err) => {
//       console.error("Geolocation error:", err);
//       alert("Cannot get your location. Map will show default location.");
//     },
//     { enableHighAccuracy: true }
//   );
// } else {
//   alert("Geolocation is not supported by this browser.");
// }



// const socket = io();

// let user = localStorage.getItem("user");

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const lat = position.coords.latitude;
//       const lon = position.coords.longitude;

//       // Initialize map at your location
//       const map = L.map("map").setView([lat, lon], 16);
//       L.tileLayer(
//         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {}
//       ).addTo(map);

//       const markers = {};

//       // Add your own marker immediately
//       markers[socket.id] = L.marker([lat, lon])
//         .bindPopup(`${user} is here`)
//         .addTo(map)
//         .openPopup();

//       // Send your first location + name
//       socket.emit("send-location", {
//         latitude: lat,
//         longitude: lon,
//         name: user,
//       });

//       // Watch position and update
//       navigator.geolocation.watchPosition(
//         (pos) => {
//           const lat = pos.coords.latitude;
//           const lon = pos.coords.longitude;

//           markers[socket.id].setLatLng([lat, lon]);
//           markers[socket.id].bindPopup(`${user} is here`);
//           map.setView([lat, lon], 16);

//           socket.emit("send-location", {
//             latitude: lat,
//             longitude: lon,
//             name: user,
//           });
//         },
//         (err) => console.error(err),
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//       );

//       // Receive locations of other users
//       socket.on("receive-location", (data) => {
//         const { id, latitude, longitude, name } = data;
//         if (id === socket.id) return; // skip self

//         if (markers[id]) {
//           markers[id].setLatLng([latitude, longitude]);
//           markers[id].bindPopup(`${name} is here`);
//         } else {
//           markers[id] = L.marker([latitude, longitude])
//             .bindPopup(`${name} is here`)
//             .addTo(map);
//         }
//       });

//       socket.on("user-disconnected", (id) => {
//         if (markers[id]) {
//           map.removeLayer(markers[id]);
//           delete markers[id];
//         }
//       });
//     },
//     (err) => {
//       console.error(err);
//       alert("Cannot get your location.");
//     },
//     { enableHighAccuracy: true }
//   );
// } else {
//   alert("Geolocation is not supported by this browser.");
// }


const socket = io();

// Global user
user = localStorage.getItem("username");

if (!navigator.geolocation) {
  alert("Geolocation not supported");
}

// Markers + polyline
const markers = {};
let polyline;

// Get current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Initialize map
    const map = L.map("map").setView([lat, lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      map
    );

    polyline = L.polyline([], { color: "blue" }).addTo(map);

    // Add self marker
    markers[socket.id] = L.marker([lat, lon])
      .bindPopup(`${user} is here`)
      .addTo(map)
      .openPopup();

    socket.emit("send-location", {
      latitude: lat,
      longitude: lon,
      name: user,
    });

    // Watch position
    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        markers[socket.id].setLatLng([lat, lon]);
        markers[socket.id].bindPopup(`${user} is here`).openPopup();
        map.setView([lat, lon], 16);

        socket.emit("send-location", {
          latitude: lat,
          longitude: lon,
          name: user,
        });
        updatePolyline();
      },
      console.error,
      { enableHighAccuracy: true }
    );

    // Receive others
    socket.on("receive-location", (data) => {
      const { id, latitude, longitude, name } = data;
      if (id === socket.id) return;

      let [lat2, lon2] = [latitude, longitude];

      // Jitter if another user exists at same spot
      if (
        Object.values(markers).some(
          (m) => m.getLatLng().lat === lat2 && m.getLatLng().lng === lon2
        )
      ) {
        [lat2, lon2] = jitter(lat2, lon2);
      }

      if (markers[id]) {
        markers[id].setLatLng([lat2, lon2]);
        markers[id].bindPopup(`${name} is here`);
      } else {
        markers[id] = L.marker([lat2, lon2])
          .bindPopup(`${name} is here`)
          .addTo(map);
      }
      updatePolyline();
    });

    socket.on("user-disconnected", (id) => {
      if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
        updatePolyline();
      }
    });

    function updatePolyline() {
      const latlngs = Object.values(markers).map((m) => m.getLatLng());
      polyline.setLatLngs(latlngs);
    }
  },
  (err) => {
    console.error(err);
    alert("Cannot get your location");
  },
  { enableHighAccuracy: true }
);

// Jitter function to separate overlapping markers
function jitter(lat, lon) {
  const offset = 0.00005;
  return [
    lat + (Math.random() - 0.5) * offset,
    lon + (Math.random() - 0.5) * offset,
  ];
}
