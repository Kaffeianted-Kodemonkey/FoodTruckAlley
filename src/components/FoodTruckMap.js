import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import foodTrucksData from "../data/food-trucks.json"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

const FoodTruckMap = () => {
  const [foodTrucks, setFoodTrucks] = useState(foodTrucksData)
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795])
  const [zoom, setZoom] = useState(4)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined" && L) {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      })
    }
    console.log("Initial food trucks data:", foodTrucksData)
  }, [])

  useEffect(() => {
    console.log("Updated food trucks:", foodTrucks)
  }, [foodTrucks])

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          setZoom(12)
          const filteredTrucks = foodTrucksData.filter((truck) => {
            const distance = getDistance(latitude, longitude, truck.lat, truck.lng)
            return distance <= 50
          })
          setFoodTrucks(filteredTrucks)
        },
        (error) => {
          alert("Unable to get your location. Please allow location access.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <section style={{ padding: "2rem 0", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <button
          type="button"
          onClick={handleNearMe}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#457b9d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          Near Me
        </button>
        <div style={{ height: "300px", width: "100%" }}>
          {isClient ? (
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {foodTrucks.map((truck, idx) => (
                <Marker key={`${truck.name}-${truck.lat}-${truck.lng}-${idx}`} position={[truck.lat, truck.lng]}>
                  <Popup>
                    <strong>{truck.name}</strong>
                    <br />
                    {truck.address}
                  </Popup>
                </Marker>
              ))}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <div style={{ padding: "2rem", textAlign: "center" }}>Loading Map...</div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FoodTruckMap
