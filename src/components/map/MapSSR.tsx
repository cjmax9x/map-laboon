import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { observer } from "mobx-react";
import { STORES } from "../store/GlobalStore";
import GridLayer from "./grid/Grid";
import { Countries } from "./countries/CountriesJS";
import { Markers } from "./marker/Marker";
import { House } from "./house/House";
import LocationMarker from "./location/Location";
import { Modal } from "./modal/Modal";
import { PopulateModal } from "./modal/PopulateModal";
import { useState } from "react";

const bounds = new L.LatLngBounds(
  new L.LatLng(85, -180),
  new L.LatLng(-100, 180)
);

const Map = () => {
  const { grid, country } = STORES;
  const [modal, SetModal] = useState<string>("");
  return (
    <MapContainer
      attributionControl={false}
      style={{ backgroundColor: "#AAD3DF", width: "100%", height: "100%" }}
      center={[0, 0]}
      zoom={2}
      maxZoom={8}
      minZoom={2}
      maxBounds={bounds}
      maxBoundsViscosity={1}
    >
      <LocationMarker />
      {!country && <Countries SetModal={SetModal} />}
      {country && (
        <TileLayer
          zIndex={0}
          noWrap={true}
          attribution="Mile-2-23112022"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      <GridLayer grid={grid} />
      <Markers SetModal={SetModal} />
      {modal === "modal" && <Modal SetModal={SetModal} />}
      {typeof modal === 'object' && <PopulateModal modal={modal} SetModal={SetModal} />}


      <House />
    </MapContainer>
  );
};

export default observer(Map);
