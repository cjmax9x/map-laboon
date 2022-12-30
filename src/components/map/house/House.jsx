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
    } else {
      allLayer.forEach((layer) => {
        map.addLayer(layer);
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

  // useEffect(() => {
  //   map.eachLayer((layer) => {
  //     if (layer.options?.infor) {
  //       if (countryName === "location") {
  //         layer.setIcon(
  //           divHouseName("1", `Location${layer.options?.infor.index}`)
  //         );
  //       } else if (countryName === "l") {
  //         layer.setIcon(divHouseName("1", `L${layer.options?.infor.index}`));
  //       }
  //     }
  //   });
  // }, [countryName]);

  // useEffect(() => {
  //   map.eachLayer((layer) => {
  //     if (layer.options?.infor) {
  //       if (houseView)
  //         layer.setIcon(
  //           divHouseName("1", layer.options?.infor.name.toUpperCase())
  //         );
  //       else layer.setIcon(divHouse());
  //     }
  //   });
  // }, [houseView, country]);
  return null;
});
