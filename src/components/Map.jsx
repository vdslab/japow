import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker, useMapEvent } from "react-leaflet";
import { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import data from "../assets/ski_resorts_japan.json";
import geojson from "../assets/Japan.json"
function Map({ mapData, skiTargetID, setSkiTargetID }) {

    const DEFAULT_ZOOM = 5;
    const MAX_ZOOM = 10;
    const MIN_Z00M = 5;
    const JAPAN = [35.6895, 139.6917];
    const JAPAN_BOUNDS = [
        [30.0, 120.0], // 南端の座標
        [50.0, 155.0], // 北端の座標
    ];
    // GeoJSONスタイルオブジェクト
    const geoJSONStyle = {
        // 塗りつぶしの色（半透明の青色）
        fillColor: "rgba(0, 123, 255, 0.5)",
        // 塗りつぶしの不透明度（0は完全に透明、1は不透明）
        fillOpacity: 0.5,
        // 境界線の色（黒色）
        color: "black",
        // 境界線の太さ
        weight: 1,
        // 境界線の不透明度
        opacity: 1,
    };


    const PopupEventHandler = () => {
        useMapEvent('popupclose', () => {
            setSkiTargetID(null)
        });

        return null;
    };
    const markerRef = useRef();

    useEffect(() => {
        if (markerRef.current) {
            setTimeout(() => {
                markerRef.current.openPopup();
            }, 0); // 0ms の遅延を使って次のレンダリングサイクルを待つ
        }
    }, [skiTargetID]);

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
            <PopupEventHandler />
            {mapData.map((item) => (
                item.skiID === skiTargetID ? (
                    <Marker
                        position={[item.latitude, item.longitude]}
                        key={item.skiID}
                        ref={markerRef}
                    >
                        <Popup key={item.id}>
                            {item.name}<br />
                            {item.region}
                        </Popup>
                    </Marker>
                ) : (
                    <Circle
                        center={[item.latitude, item.longitude]}
                        key={item.id}
                        radius={200}
                        fillColor="blue"
                        color="blue"
                        eventHandlers={{
                            click: () => {
                                setSkiTargetID(item.skiID);
                            },
                        }}
                    >
                        <Popup key={item.id}>
                            {item.name}<br />
                            {item.region}
                        </Popup>
                    </Circle>
                )
            ))}
        </MapContainer>
    );
}

export default Map;