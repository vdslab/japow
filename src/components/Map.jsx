import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker, useMapEvent, Tooltip } from "react-leaflet";
import { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import pinIcon from "../assets/images/pin-icon.svg"
import data from "../assets/ski_resorts_japan.json";
import geojson from "../assets/Japan.json"
import { icon } from "leaflet";
import { filter } from "d3";
function Map({ mapData, skiTargetID, setSkiTargetID }) {

    const DEFAULT_ZOOM = 5;
    const MAX_ZOOM = 10;
    const MIN_Z00M = 5;
    const JAPAN = [40.345119, 140.800075];
    const JAPAN_BOUNDS = [
        [30.0, 120.0], // 南端の座標
        [50.0, 155.0], // 北端の座標
    ];

    // GeoJSONスタイルオブジェクト
    const geoJSONStyle = {
        // 塗りつぶしの色（半透明の青色）
        fillColor: "rgb(123, 188, 151)",
        // 塗りつぶしの不透明度（0は完全に透明、1は不透明）
        fillOpacity: 0.5,
        // 境界線の色（黒色）
        color: "black",
        // 境界線の太さ
        weight: 1,
        // 境界線の不透明度
        opacity: 1,
    };

    const markerIcon = new icon({
        iconUrl: pinIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
        tooltipAnchor: [0, -24]
    })

    const handleTooltipClose = (skiID) => {
        setSkiTargetID((prev) => prev.filter((item) => item !== skiID));
    };

    const [hoverCircle, setHoverCircle] = useState(null);

    return (

        <MapContainer
            center={JAPAN}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            maxBounds={JAPAN_BOUNDS}
            minZoom={MIN_Z00M}
            maxZoom={MAX_ZOOM}
        >
            {/* <TileLayer
                bounds={JAPAN_BOUNDS}
                minZoom={5}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <GeoJSON
                data={geojson}
                style={geoJSONStyle}
            />
            {/* <PopupEventHandler /> */}
            {mapData.map((item, index) => (
                skiTargetID.includes(item.skiID) ? (
                    <Marker
                        position={[item.latitude, item.longitude]}
                        icon={markerIcon}
                        key={item.skiID}
                    >
                        <Tooltip
                            opacity={1}
                            permanent
                            direction="top"
                            key={index}
                            className="custom-tooltip leaflet-popup-content-wrapper"
                            style={{ padding: 0 }}
                        >
                            <div>
                                <table className="small-table">
                                    <tbody>
                                        <tr>
                                            <td>{item.name}</td>
                                        </tr>
                                        <tr>
                                            <td>{item.region}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button
                                    className="close-button"
                                    onClick={() => handleTooltipClose(item.skiID)}
                                >
                                    &times;
                                </button>
                            </div>
                        </Tooltip>
                        <Circle
                            position={[item.latitude, item.longitude]}
                            center={[item.latitude, item.longitude]}
                            key={index}
                            radius={200}
                            fillColor="red"
                            color="red"
                        />
                    </Marker>
                ) : (
                    <Circle
                        center={[item.latitude, item.longitude]}
                        key={index}
                        radius={hoverCircle === item.skiID ? 5000 : 200}
                        fillColor="blue"
                        color="blue"
                        eventHandlers={{
                            click: (e) => {
                                setSkiTargetID((prev) => [...prev, item.skiID]);
                            },
                            mouseover: (e) => {
                                setHoverCircle(item.skiID);
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                setHoverCircle(null);
                                e.target.closePopup();
                            }
                        }}
                    >
                        <Popup key={index} className="leaflet-circle-popup">
                            <table className="small-table">
                                <tbody>
                                    <tr>
                                        <td>{item.name}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.region}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Popup>
                    </Circle>
                )
            ))}
        </MapContainer>

    );
}

export default Map;