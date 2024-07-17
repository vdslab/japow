import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker, useMapEvent } from "react-leaflet";
import { useState, useEffect, useContext } from "react";
import "leaflet/dist/leaflet.css";
import "./styles/Map.css";
import data from "./assets/ski_resorts_japan.json";
function Map({ mapData, skiTargetID, setSkiTargetID }) {
    const PopupEventHandler = () => {
        useMapEvent('popupclose', () => {
            setSkiTargetID(null)
        });

        return null;
    };
    const DEFAULT_ZOOM = 5;
    const JAPAN = [35.6895, 139.6917];
    const JAPAN_BOUNDS = [
        [20.0, 120.0], // 南端の座標
        [50.0, 155.0], // 北端の座標
    ];
    console.log(skiTargetID);
    const circleHandle = (e) => {
        console.log("a");
    }
    return (
        <MapContainer
            center={JAPAN}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            maxBounds={JAPAN_BOUNDS}
        >
            <TileLayer
                bounds={JAPAN_BOUNDS}
                minZoom={5}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <PopupEventHandler />
            {mapData.map((item) => (
                item.skiID === skiTargetID ?
                    <Marker position={[item.latitude, item.longitude]} key={item.skiID}>
                        <Popup
                            key={item.id}
                            eventHandlers={{
                                popupclose: (e) => {
                                    console.log('Popup closed', item.name);  // ポップアップが閉じられたときにメッセージを表示
                                }
                            }}
                        >
                            {item.name}<br />
                            {item.region}
                        </Popup>
                    </Marker> :
                    <Circle
                        center={[item.latitude, item.longitude]}
                        key={item.id}
                        radius={200}
                        fillColor="blue"
                        color="blue"
                        eventHandlers={{
                            click: (e) => {
                                setSkiTargetID(item.skiID);  // サークルがクリックされたときにアイテムの名前をコンソールに表示
                            },
                        }}
                    >
                        <Popup key={item.id}>
                            {item.name}<br />
                            {item.region}
                        </Popup>
                    </Circle>
            ))}

        </MapContainer>
    );
}

export default Map;