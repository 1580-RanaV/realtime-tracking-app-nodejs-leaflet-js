const socket = io();

if (navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude,longitude });
    }, 
    (error)=>{
        console.error(error);
       },
       {
        enableHighAccuracy: true, //high accuracy
        timeout: 3000, //timeout to refresh
        maximumAge: 0 //caching part to store no information about the location
       }
    );
}
const map = L.map("map").setView([0,0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "V Ranadheer"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);

    if (markers[id]){
        markers[id].setLatlng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", () => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})