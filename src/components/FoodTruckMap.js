import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import axios from "axios"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

const FoodTruckMap = ({ initialLocation, foodTrucks, searchQuery }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]) // Default US center
  const [zoom, setZoom] = useState(4)
  const [truckCoords, setTruckCoords] = useState({})
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
    if (initialLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          setZoom(12)
        },
        (error) => {
          console.log("Geolocation error:", error)
        }
      )
    }

    const geocodeTrucks = async () => {
      const coords = {}
      for (const truck of foodTrucks) {
        const { city, state } = truck.frontmatter
        if (city && state) {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                `${city}, ${state}, USA`
              )}&limit=1`
            )
            const result = response.data[0]
            if (result) {
              coords[truck.id] = [parseFloat(result.lat), parseFloat(result.lon)]
            }
          } catch (error) {
            console.error(`Geocoding error for ${city}, ${state}:`, error)
          }
        }
      }
      setTruckCoords(coords)
    }
    geocodeTrucks()
  }, [initialLocation, foodTrucks])

  // Filter markers based on searchQuery
  const filteredTrucks = foodTrucks.filter((truck) =>
    truck.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${truck.frontmatter.city}, ${truck.frontmatter.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section style={{ padding: "2rem 0", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ height: "400px", width: "100%" }}>
          {isClient ? (
            <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredTrucks.map((truck) => {
                const coords = truckCoords[truck.id]
                return coords ? (
                  <Marker key={truck.id} position={coords}>
                    <Popup>
                      <strong>{truck.frontmatter.title}</strong>
                      <br />
                      {truck.frontmatter.city}, {truck.frontmatter.state}
                      <br />
                      Status: {truck.frontmatter.current_status}
                    </Popup>
                  </Marker>
                ) : null
              })}
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
