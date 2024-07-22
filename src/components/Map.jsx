import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker, useMapEvent, Tooltip } from "react-leaflet";
import { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import pinIcon from "../assets/images/pin-icon.svg"
import data from "../assets/ski_resorts_japan.json";
import geojson from "../assets/Japan.json"
import { icon } from "leaflet";
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

    const markerIcon = new icon({
        iconUrl: pinIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
        tooltipAnchor: [0, -24]
    })


    const PopupEventHandler = () => {
        useMapEvent('popupclose', (e) => {
            console.log(e)
            console.log(markerRef.current);
            markerRef.current && console.log(markerRef.current._popup === e.popup);

            // setSkiTargetID(null)
        });

        return null;
    };

    const handleCircleClick = (item) => {
        setSkiTargetID(item.skiID);
        setToolTips((prev) => ({
            ...prev,
            [item.skiID]: true
        }));
    };

    const handleTooltipClose = (skiID) => {
        setSkiTargetID(null);
    };

    const markerRef = useRef();
    const [toolTips, setToolTips] = useState({})
    const [hoverCircle, setHoverCircle] = useState(null);
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
            {/* <PopupEventHandler /> */}
            {mapData.map((item) => (
                item.skiID === skiTargetID ? (
                    <Marker
                        position={[item.latitude, item.longitude]}
                        icon={markerIcon}
                        key={item.skiID}
                        ref={markerRef}
                    >
                        <Tooltip
                        opacity={1}
                            permanent
                            direction="top"
                            key={item.id}
                            className="custom-tooltip leaflet-popup-content-wrapper"
                        >
                            <div>
                                {item.name}<br />
                                {item.region}
                                <button
                                    className="close-button"
                                    onClick={() => handleTooltipClose(item.skiID)}
                                >
                                    &times;
                                </button>
                            </div>
                        </Tooltip>
                    </Marker>
                ) : (
                    <Circle
                        center={[item.latitude, item.longitude]}
                        key={item.id}
                        radius={hoverCircle === item.skiID ? 5000 : 200}
                        fillColor="blue"
                        color="blue"
                        eventHandlers={{
                            click: (e) => {
                                setSkiTargetID(item.skiID);
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