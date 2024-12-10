import {
  MapContainer,
  Circle,
  Popup,
  GeoJSON,
  Marker,
  Tooltip,
} from "react-leaflet";
import { useState, useEffect, useContext, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import geojson from "../assets/Japan.json";
import L from "leaflet";
const generateDivIcon = (color) =>
  L.divIcon({
    className: "custom-icon",
    html: `
      <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 512 512" style="opacity: 1;" xml:space="preserve">
<style type="text/css">

	.st0{fill:#4B4B4B;}

</style>
<g>
	<path class="st0" d="M256,0C159.969,0,82.109,77.859,82.109,173.906c0,100.719,80.016,163.688,123.297,238.719
		C246.813,484.406,246.781,512,256,512s9.188-27.594,50.594-99.375c43.297-75.031,123.297-138,123.297-238.719
		C429.891,77.859,352.031,0,256,0z M256,240.406c-36.734,0-66.516-29.781-66.516-66.5c0-36.75,29.781-66.531,66.516-66.531
		s66.516,29.781,66.516,66.531C322.516,210.625,292.734,240.406,256,240.406z" style="fill: ${color};"></path>
</g>
</svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
    tooltipAnchor: [0, -24],
  });

function Map({ mapData, skiTargetID, setSkiTargetID, skiColors }) {
  const mapRef = useRef();
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

  const handleTooltipClose = (skiID) => {
    setSkiTargetID((prev) => prev.filter((item) => item !== skiID));
  };

  const [hoverCircle, setHoverCircle] = useState(null);
  let prevSkiTarget = useRef([]);
  useEffect(() => {
    if (prevSkiTarget.current.length < skiTargetID.length) {
      for (const item of skiTargetID) {
        if (!prevSkiTarget.current.includes(item)) {
          let foucusSkiResort = mapData.find(({ skiID }) => skiID === item);
          mapRef.current.panTo(
            [foucusSkiResort.latitude, foucusSkiResort.longitude],
            { animate: true, duration: 1.5 }
          );
          break;
        }
      }
    }
    prevSkiTarget.current = [...skiTargetID];
  }, [skiTargetID]);
  return (
    <MapContainer
      center={JAPAN}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      maxBounds={JAPAN_BOUNDS}
      minZoom={MIN_Z00M}
      maxZoom={MAX_ZOOM}
      ref={mapRef}
    >
      {/* <TileLayer
                bounds={JAPAN_BOUNDS}
                minZoom={5}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
      <GeoJSON data={geojson} style={geoJSONStyle} />
      {/* <PopupEventHandler /> */}
      {mapData.map((item, index) =>
        skiTargetID.includes(item.skiID) ? (
          <Marker
            position={[item.latitude, item.longitude]}
            icon={generateDivIcon(skiColors[item.skiID])}
            key={item.skiID}
            fillColor={skiColors[item.skiID]}
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
            {/* <Circle
              position={[item.latitude, item.longitude]}
              center={[item.latitude, item.longitude]}
              key={`${item.skiID}-circle`}
              radius={200}
              fillColor="red"
              color="red"
            /> */}
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
              },
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
      )}
    </MapContainer>
  );
}

export default Map;
