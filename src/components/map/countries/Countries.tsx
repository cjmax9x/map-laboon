import L from "leaflet";
import "leaflet-boundary-canvas";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import { observer } from "mobx-react";

import { GeoJson } from "./GeoJson";

export const Countries = observer((): null => {
  const { code } = STORES;
  const map = useMap();

  useEffect(() => {
    const geoJson: any = GeoJson[code];
    const country = L.geoJSON(geoJson, {
      style: () => {
        return {
          fillColor: "#AAD3DF",
          fillOpacity: 1,
          color: "transparent",
        };
      },
    }).addTo(map);

    map.fitBounds(country.getBounds());

    return () => {
      country && map.removeLayer(country);
    };
  }, [code]);

  return null;
});
