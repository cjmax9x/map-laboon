import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet-boundary-canvas";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import { observer } from "mobx-react";
import { GeoJson } from "./GeoJson";
import styles from "../../../../styles/map/Map.module.scss";
import {
  markerPersonIndex,
  markerFnIndex,
  groupFnIndex,
} from "../marker/Marker";
import { divFunction, divHouse, divHouseName, divPerson } from "../marker/Icon";
import { changeIcon, popupGroup, groupLayout } from "../popup/Popup";

let i = 1;

export const Countries = observer(({ SetModal }) => {
  const { houseView, lock, code, mainLand, addIconHandle } = STORES;
  const map = useMap();
  let geoJson = JSON.parse(JSON.stringify(GeoJson[code]));

  const geoBounds = L.geoJSON(geoJson).getBounds();

  const centroid = turf.centroid(geoJson);
  centroid.geometry.coordinates.reverse();

  if (mainLand && code === "us") {
    geoJson.features[0].geometry.coordinates =
      geoJson.features[0].geometry.coordinates[5];
    geoJson.features[0].geometry.type = "Polygon";
  } else if (mainLand && code === "gbr") {
    geoJson.features[0].geometry.coordinates =
      geoJson.features[0].geometry.coordinates[1];
    geoJson.features[0].geometry.type = "Polygon";
  } else {
    geoJson = GeoJson[code];
  }

  const extent = [
    geoBounds.getSouthWest().lat,
    geoBounds.getSouthWest().lng,
    geoBounds.getNorthEast().lat,
    geoBounds.getNorthEast().lng,
  ];
  let cellSide;

  if (code === "us") {
    cellSide = 400;
  } else {
    cellSide = 50;
  }

  const options = { units: "miles" };

  window.handlePopulateFn = (object) => {
    const grid = turf.pointGrid(extent, cellSide, options);
    grid.features.reverse();

    const GeoJsonLength = geoJson.features[0].geometry.coordinates.length;
    let newPol;
    if (GeoJsonLength === 1) {
      newPol = geoJson.features[0].geometry.coordinates[0].map((item) => {
        const newItem = [...item];
        return newItem.reverse();
      });
    } else if (GeoJsonLength === 2) {
      newPol = geoJson.features[0].geometry.coordinates[1][0].map((item) => {
        const newItem = [...item];
        return newItem.reverse();
      });
    } else {
      newPol = geoJson.features[0].geometry.coordinates[5][0].map((item) => {
        const newItem = [...item];
        return newItem.reverse();
      });
    }
    grid.features.forEach((item) => {
      if (
        i <= 20 &&
        turf.booleanPointInPolygon(
          item.geometry.coordinates,
          turf.polygon([newPol])
        )
      ) {
        if (object === "function-person") {
          i % 2 !== 0 &&
            L.marker(item.geometry.coordinates, {
              draggable: !lock,
              index: markerPersonIndex[0],
              icon: divPerson(
                styles["person"],
                `Person ${markerPersonIndex[0]}`
              ),
            })

              .on("contextmenu", changeIcon.bind(this, map, SetModal))
              .addTo(map) &&
            markerPersonIndex[0]++;

          i % 2 === 0 &&
            L.marker(item.geometry.coordinates, {
              draggable: !lock,
              index: markerFnIndex[0],
              icon: divFunction(
                [styles["rectangle-fn"], styles["fn--black"]].join(" "),
                `Function ${markerFnIndex[0]}`
              ),
            })

              .on("contextmenu", changeIcon.bind(this, map, SetModal))
              .addTo(map) &&
            markerFnIndex[0]++;
        } else {
          object === "function"
            ? L.marker(item.geometry.coordinates, {
                draggable: !lock,
                index: markerFnIndex[0],
                icon: divFunction(
                  [styles["rectangle-fn"], styles["fn--black"]].join(" "),
                  `Function ${markerFnIndex[0]}`
                ),
              })

                .on("contextmenu", changeIcon.bind(this, map, SetModal))
                .addTo(map) && markerFnIndex[0]++
            : L.marker(item.geometry.coordinates, {
                draggable: !lock,
                index: markerPersonIndex[0],
                icon: divPerson(
                  styles["person"],
                  `Person ${markerPersonIndex[0]}`
                ),
              })

                .on("contextmenu", changeIcon.bind(this, map, SetModal))
                .addTo(map) && markerPersonIndex[0]++;
        }
        i++;
      }
    });
    i = 0;
    map.closePopup();
  };

  useEffect(() => {
    const makeEvent = (e) => {
      L.popup()
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(
          `
          <div style="background-color:#fff;padding:10px;min-width:180px">
            <div onclick ="handleAddFunction(event)" class = "${[
              styles["menu-geojson"],
              styles["on-hover-function"],
            ].join(" ")}">
          Function
          <div class="${styles["hover-func"]}">
          <div onclick="handleAddFunction(event, 'Natural function')">Natural function</div>
          <div onclick="handleAddFunction(event, 'Non-natural function')">Non-natural function</div>
          <div onclick="handleAddFunction(event, 'Added function')">Added function</div>
          <div onclick="handleAddFunction(event, 'Existing function')">Existing function</div>
          </div>
          </div>
          <h3 onclick ="handlePopulateFn('function')" class = ${
            styles["menu-geojson"]
          }>Populate Function</h3>
          <h3 onclick ="handlePopulateFn('person')" class = ${
            styles["menu-geojson"]
          }>Populate Person</h3>
          <h3 onclick ="handlePopulateFn('function-person')" class = ${
            styles["menu-geojson"]
          }>Populate Person & Function</h3>
          </div>

        `
        )
        .openOn(map);

      window.handleAddFunction = (event, name) => {
        event.preventDefault();
        event.stopPropagation();
        L.marker([e.latlng.lat, e.latlng.lng], {
          draggable: !lock,
          index: markerFnIndex[0],
          icon: divFunction(
            [
              styles["rectangle-fn"],
              styles["fn--black"],
              name ? styles["width-max-content"] : "",
            ].join(" "),
            name
              ? `${name} ${markerFnIndex[0]}`
              : `Function ${markerFnIndex[0]}`
          ),
        })
          .addTo(map)
          .on("contextmenu", changeIcon.bind(this, map, SetModal));
        markerFnIndex[0]++;
        map.closePopup();
      };

      window.handleGroup = () => {
        L.marker([e.latlng.lat, e.latlng.lng], {
          draggable: !lock,
          group: [],
          icon: divFunction(
            [styles["rectangle-fn"], styles["fn--black"]].join(" "),

            `Group function ${groupFnIndex[0]}`
          ),
        })
          .addTo(map)
          .bindPopup(
            (e) => {
              return groupLayout(e.options.group);
            },
            { className: styles["group-elip"], offset: L.point(30, -12) }
          )
          .on("popupopen", popupGroup.bind(this, map, SetModal))
          .openPopup();
        groupFnIndex[0]++;
      };
    };

    //add Geojson border
    const countryGeo = L.geoJSON(geoJson, {
      onEachFeature(feature, layer) {
        layer.on("contextmenu", makeEvent);
      },
      style: (feature) => {
        return {
          weight: 1,
          fillColor: "#fff",
          color: "black",
        };
      },
    }).on("click", (e) => {
      if (STORES.addIcon === "house") {
        const layers = [];
        map.eachLayer((layer) => {
          layer._icon && layers.push(layer);
        });

        const addHouse = layers.filter((item) => {
          return item.options.infor;
        });

        if (addHouse.length === 0) {
          L.marker([e.latlng.lat, e.latlng.lng], {
            icon: divHouse(),
            infor: {
              name: code,
            },
          }).addTo(map);
        } else {
          const notExistHouse = [];
          addHouse.forEach((item) => {
            notExistHouse.push(item.options.infor.name);
          });

          !notExistHouse.includes(code) &&
            L.marker([e.latlng.lat, e.latlng.lng], {
              icon: divHouse(),
              infor: {
                name: code,
              },
            }).addTo(map);
        }
        addIconHandle("");
      }
    });

    //cut Geojson country
    const countryLand = L.TileLayer.boundaryCanvas(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        noWrap: true,
        boundary: geoJson,
        zIndex: 0,
        attribution: "Mile-2-23112022",
      }
    );
    !houseView && countryGeo.addTo(map) && countryLand.addTo(map);
    map.fitBounds(countryGeo.getBounds(), map.getZoom());
    return () => {
      countryGeo && map.removeLayer(countryGeo);
      countryLand && map.removeLayer(countryLand);
    };
  }, [houseView, code, mainLand, lock]);

  return null;
});
