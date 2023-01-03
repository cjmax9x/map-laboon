import L from "leaflet";
import * as turf from "@turf/turf";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import styles from "../../../../styles/map/Map.module.scss";
import { STORES } from "../../store/GlobalStore";
import { divHouse, divHouseName, divHouseWorld } from "../marker/Icon";
import { allLayer } from "../marker/Marker";
import { GeoJson } from "../countries/GeoJson";

export const House = observer(({}) => {
  const map = useMap();
  const { country, houseView, countryName } = STORES;

  useEffect(() => {
    let index = 1;
    let name;
    if (countryName === "location") {
      name = "Location";
    } else if (countryName === "l") {
      name = "L";
    }
    let World = {};
    const countriesLayer = [];
    if (country && houseView === "house-world") {
      map.eachLayer((layer) => {
        layer._arrowheads && layer.remove();

        allLayer.push(layer);
      });
      map.eachLayer((layer) => {
        map.removeLayer(layer);
      });
      World = L.marker([44.96479793033104, -6.416015625000001], {
        icon: divHouseWorld("1", "WORLD"),
      }).addTo(map);
      map.zoomOut(2);
    } else if (country && houseView === "house-countries") {
      map.eachLayer((layer) => {
        layer._arrowheads && layer.remove();

        allLayer.push(layer);
      });
      map.eachLayer((layer) => {
        map.removeLayer(layer);
      });

      for (let i in GeoJson) {
        let geoJson = GeoJson[i].features[0].geometry.coordinates[0];
        if (i === "us") {
          geoJson = GeoJson[i].features[0].geometry.coordinates[5][0];
        } else if (i === "gbr") {
          geoJson = GeoJson[i].features[0].geometry.coordinates[1][0];
        }
        const center = turf.center(turf.points(geoJson)).geometry.coordinates;

        const country = L.marker(center.reverse(), {
          icon: divHouseName("1", name ? name + index : i.toUpperCase()),
        }).addTo(map);
        countriesLayer.push(country);
        name && index++;
      }
    } else if (country && houseView === "") {
      let direct;
      let point_1;
      let point_2;
      let name;
      allLayer.forEach((layer) => {
        layer._text && delete layer._text;
        map.addLayer(layer);
      });
      map.eachLayer((layer) => {
        if (
          layer.setText &&
          layer.options.color !== "transparent" &&
          (layer.options.type === "arc" || layer.options.type === "line")
        ) {
          if (layer.options.kind === "distance") {
            name = "Distance";
          } else {
            if (layer.options.type === "arc") {
              name = "Arc-route";
            } else {
              name = "Inter-route";
            }
          }

          if (layer.options.type === "line") {
            point_1 = layer.getLatLngs()[0].lng;
            point_2 = layer.getLatLngs()[1].lng;
          } else {
            point_1 = layer.getLatLngs()[1][1];
            point_2 = layer.getLatLngs()[4][1];
          }

          if (point_1 < point_2) {
            direct = true;
          } else {
            direct = false;
          }

          layer.setText(name, {
            center: true,
            offset: -3,
            orientation: !direct ? 180 : 0,
          });
        }
      });
      allLayer.splice(0, allLayer.length);
    }

    return () => {
      map.removeLayer(World);
      countriesLayer.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [country, houseView, countryName]);

  return null;
});
