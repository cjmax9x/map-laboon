import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet-boundary-canvas";
import "leaflet-textpath";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import { observer } from "mobx-react";
import { GeoJson } from "./GeoJson";
import styles from "../../../../styles/map/Map.module.scss";
import {
  markerPersonIndex,
  markerFnIndex,
  groupFnIndex,
  defaulFunction,
  defaultPerson,
  defaultFunctionPerson,
  markerProblemIndex,
  markerHouseIndex,
  groupPersonIndex,
} from "../marker/Marker";
import {
  divFunction,
  divHouse,
  divHouseName,
  divPerson,
  divThreeDot,
} from "../marker/Icon";
import {
  changeIcon,
  groupLayoutPopup,
  changeGroup,
  customProblemPopup,
  groupPersonLayoutPopup,
} from "../popup/Popup";

let y = 1;
const allLayer = [];
export const Countries = observer(({ SetModal }) => {
  const countryHouse = useRef({});
  const { country, houseView, lock, code, mainLand, addIconHandle } = STORES;
  const map = useMap();
  let cellSide;

  // House Icon
  useEffect(() => {
    let geoJsonCenter = GeoJson[code].features[0].geometry.coordinates[0];
    if (code === "us") {
      geoJsonCenter = GeoJson[code].features[0].geometry.coordinates[5][0];
    } else if (code === "gbr") {
      geoJsonCenter = GeoJson[code].features[0].geometry.coordinates[1][0];
    }
    const center = turf.center(turf.points(geoJsonCenter)).geometry.coordinates;

    countryHouse.current = L.marker(center.reverse(), {
      icon: divHouseName("1", code.toUpperCase()),
    });
  }, [code]);
  //----------------------

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

  if (code === "us") {
    cellSide = 400;
  } else {
    cellSide = 50;
  }

  const options = { units: "miles" };

  window.handlePopulateFn = (object, input) => {
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
    //-----------------------------------------------------------
    const newGrid = grid.features.filter((item) => {
      return turf.booleanPointInPolygon(
        item.geometry.coordinates,
        turf.polygon([newPol])
      );
    });
    const newArray = [];
    newGrid.forEach((item) => {
      newArray.push(item.geometry.coordinates);
    });

    const result = newArray.reduce(function (prev, cur) {
      prev[cur[0]] = prev[cur[0]] || [];
      prev[cur[0]].push(cur);
      return prev;
    }, {});
    const lengthItem = newArray.length;
    const newResult = Object.values(result);

    if (+input > lengthItem) {
      input = lengthItem - 1;
      L.marker(newResult[newResult.length - 1][0], {
        icon: divThreeDot(),
      }).addTo(map);
    }

    for (let i in result) {
      result[i].reverse();

      result[i].forEach((item) => {
        if (
          y <= +input &&
          turf.booleanPointInPolygon(item, turf.polygon([newPol]))
        ) {
          if (object === "function-person") {
            y % 2 !== 0 &&
              L.marker(item, {
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

            y % 2 === 0 &&
              L.marker(item, {
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
              ? L.marker(item, {
                  draggable: !lock,
                  index: markerFnIndex[0],
                  icon: divFunction(
                    [styles["rectangle-fn"], styles["fn--black"]].join(" "),
                    `Function ${markerFnIndex[0]}`
                  ),
                })

                  .on("contextmenu", changeIcon.bind(this, map, SetModal))
                  .addTo(map) && markerFnIndex[0]++
              : L.marker(item, {
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
          y++;
        }
      });
    }
    y = 1;
    map.closePopup();
  };

  useEffect(() => {
    const makeEvent = (e) => {
      window.openPopulateModal = () => {
        SetModal({ code });
      };

      window.makeGroupFromCountry = (type) => {
        L.marker([e.latlng.lat, e.latlng.lng], {
          draggable: !STORES.lock,
          group: {
            group: [],
            index: type === "function" ? groupFnIndex[0] : groupPersonIndex[0],
          },
          icon: divFunction(
            [styles["rectangle-fn"], styles["group-fn-border"]].join(" "),
            `${type === "function" ? "Group function" : "Group Person"} ${
              type === "function" ? groupFnIndex[0] : groupPersonIndex[0]
            }`
          ),
        })
          .addTo(map)
          .bindPopup(
            (e) => {
              return type === "function"
                ? groupLayoutPopup(e.options.group.group)
                : groupPersonLayoutPopup(e.options.group.group);
            },
            {
              className: `${styles["group-rectangle"]} id-group-${groupFnIndex[0]}`,
              offset: L.point(30, -12),
              autoClose: false,
              closeOnClick: false,
            }
          )
          .on("contextmenu", changeGroup.bind(this, map))
          .on("popupclose", (e) => {
            e.target?._icon?.classList.add(`${styles["group-fn-border"]}`);
          })
          .on("popupopen", (e) => {
            e.target?._icon?.classList.remove(`${styles["group-fn-border"]}`);
          })
          .openPopup();
        type === "function" ? groupFnIndex[0]++ : groupPersonIndex[0]++;
      };

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
          <h3 onclick ="handlePopulateFn('function',${
            defaulFunction[0]
          })" class = ${styles["menu-geojson"]}>Populate Function</h3>
          <h3 onclick ="handlePopulateFn('person',${
            defaultPerson[0]
          })" class = ${styles["menu-geojson"]}>Populate Person</h3>
          <h3 onclick ="handlePopulateFn('function-person',${
            defaultFunctionPerson[0]
          })" class = ${styles["menu-geojson"]}>Populate Person & Function</h3>
          <h3 onclick="openPopulateModal()" class = ${
            styles["menu-geojson"]
          }>Populate Property</h3>
          <h3 onclick="makeGroupFromCountry('function')" class=${
            styles["menu-geojson"]
          }>Group Function</h3>
          <h3 onclick="makeGroupFromCountry('person')" class=${
            styles["menu-geojson"]
          }>Group Person</h3>
          <h3 onclick ="handleAddProblem(event,'Problem')" class=${
            styles["menu-geojson"]
          }>Problem</h3>
          <h3 onclick ="handleAddProblem(event,'Solution')" class=${
            styles["menu-geojson"]
          }>Solution</h3>
          </div>
        `
        )
        .openOn(map);
      // add single function

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

      // add solution/problem
      window.handleAddProblem = (event, name) => {
        L.marker([e.latlng.lat, e.latlng.lng], {
          draggable: !lock,
          type: { index: markerProblemIndex[0], title: "problem" },
          icon: divFunction(
            [
              styles["rectangle-fn"],
              name === "Solution" ? styles["fn--green"] : styles["fn--red"],
            ].join(" "),
            name
              ? `${name} ${markerProblemIndex[0]}`
              : `Function ${markerProblemIndex[0]}`
          ),
        })
          .addTo(map)
          .on("contextmenu", customProblemPopup.bind(map))
          .on("dblclick	", (e) => {
            if (e.target.options.type.title === "problem") {
              e.target.options.type.title = "solution";
              e.target._icon.textContent = `Solution ${e.target.options.type.index}`;
              e.target._icon.classList.add(styles["fn--green"]);
              e.target._icon.classList.remove(styles["fn--red"]);
            } else {
              e.target.options.type.title = "problem";
              e.target._icon.textContent = `Problem ${e.target.options.type.index}`;
              e.target._icon.classList.remove(styles["fn--green"]);
              e.target._icon.classList.add(styles["fn--red"]);
            }
          });

        markerProblemIndex[0]++;
        map.closePopup();
      };
    };

    //add Geojson border
    const countryGeo = L.geoJSON(geoJson, {
      options: "countryGeo",
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
        const addHouse = [];
        map.eachLayer((layer) => {
          layer.options?.infor && addHouse.push(layer.options.infor.name);
        });

        if (addHouse.length === 0) {
          L.marker([e.latlng.lat, e.latlng.lng], {
            icon: divHouse(),
            infor: {
              name: code,
              index: markerHouseIndex[0],
            },
          }).addTo(map);
          markerHouseIndex[0]++;
        } else {
          !addHouse.includes(code) &&
            L.marker([e.latlng.lat, e.latlng.lng], {
              icon: divHouse(),
              infor: {
                name: code,
                index: markerHouseIndex[0],
              },
            }).addTo(map);
          markerHouseIndex[0]++;
        }
        addIconHandle("");
      }
    });

    //cut Geojson country
    const countryLand = L.TileLayer.boundaryCanvas(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        options: "countryLand",
        noWrap: true,
        boundary: geoJson,
        zIndex: 0,
        attribution: "Mile-2-23112022",
      }
    );
    countryGeo.addTo(map) && countryLand.addTo(map);
    map.fitBounds(countryGeo.getBounds(), map.getZoom());
    return () => {
      countryGeo && map.removeLayer(countryGeo);
      countryLand && map.removeLayer(countryLand);
    };
  }, [code, mainLand, lock]);

  useEffect(() => {
    if (!country && houseView === "house-country") {
      map.eachLayer((layer) => {
        layer._arrowheads && layer.remove();
        allLayer.push(layer);
      });
      map.eachLayer((layer) => {
        map.removeLayer(layer);
      });
      map.addLayer(countryHouse.current);
    } else if (!country && houseView === "") {
      let direct;
      let point_1;
      let point_2;
      let name;
      map.removeLayer(countryHouse.current);

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

          !layer._text &&
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
      map.removeLayer(countryHouse.current);
    };
  }, [houseView, code]);

  return null;
});
