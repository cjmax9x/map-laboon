import L from "leaflet";
import * as turf from "@turf/turf";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import styles from "../../../../styles/map/Map.module.scss";
import { STORES } from "../../store/GlobalStore";
import { GeoJson } from "../countries/GeoJson";
import { divHouse, divHouseName, divHouseWorld } from "../marker/Icon";
import { allLayer } from "../marker/Marker";

export const House = observer(({}) => {
  const map = useMap();

  const { country, countryName, houseView } = STORES;

  useEffect(() => {
    let worldLayer = {};
    const countriesLayer = [];
    if (country && houseView === "house-world") {
      map.eachLayer((layer) => {
        allLayer.push(layer);
        map.removeLayer(layer);
      });
      worldLayer = L.marker([44.96479793033104, -6.416015625000001], {
        icon: divHouseWorld("1", "WORLD"),
      }).addTo(map);
      map.zoomOut(2);
    } else if (country && houseView === "house-countries") {
      for (let i in GeoJson) {
        let geoJson = GeoJson[i].features[0].geometry.coordinates[0];
        if (i === "us") {
          geoJson = GeoJson[i].features[0].geometry.coordinates[5][0];
        } else if (i === "gbr") {
          geoJson = GeoJson[i].features[0].geometry.coordinates[1][0];
        }

        const center = turf.center(turf.points(geoJson)).geometry.coordinates;
        const countries = L.marker(center.reverse(), {
          icon: divHouseName("1", i.toUpperCase()),
        }).addTo(map);
        countriesLayer.push(countries);
      }
    } else {
      allLayer.forEach((layer) => {
        map.addLayer(layer);
      });
    }

    return () => {
      map.removeLayer(worldLayer);
      countriesLayer.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [country, houseView]);

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

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer.options?.infor) {
        if (houseView)
          layer.setIcon(
            divHouseName("1", layer.options?.infor.name.toUpperCase())
          );
        else layer.setIcon(divHouse());
      }
    });
  }, [houseView, country]);
  return null;
});
