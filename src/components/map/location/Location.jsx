import L from "leaflet";
import * as turf from "@turf/turf";

import { useMap } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import { GeoJson } from "../countries/GeoJson";
import { useEffect } from "react";
import { observer } from "mobx-react";

function LocationMarker() {
  const { code } = STORES;
  let geoJson = GeoJson[code];
  const map = useMap();

  const centroid = turf.centroid(geoJson);
  centroid.geometry.coordinates.reverse();

  if (code === "us") {
    centroid.geometry.coordinates[1] += 5;
  } else if (code === "vn") {
    centroid.geometry.coordinates[1] += 1;
  } else if (code === "gbr") {
    centroid.geometry.coordinates[1] += 1;
  } else if (code === "bel") {
    centroid.geometry.coordinates[1] += 1;
  } else if (code === "bol") {
    centroid.geometry.coordinates[1] += 1;
  }

  const location = L.marker(centroid.geometry.coordinates, {
    icon: L.icon({
      iconUrl: "../../../../location-2955.png",
    }),
    iconAnchor: [20, 30],
    options: "location",
  });

  useEffect(() => {
    location.addTo(map);

    return () => {
      location && map.removeLayer(location);
    };
  }, [code]);

  return null;
}
export default observer(LocationMarker);
