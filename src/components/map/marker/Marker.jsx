/* eslint-disable react-hooks/exhaustive-deps */
import L from "leaflet";
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import "leaflet-arrowheads";

import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import "@bopen/leaflet-area-selection/dist/index.css";
import { DrawAreaSelection } from "@bopen/leaflet-area-selection";

import {
  divFunction,
  divPerson,
  divNavigationSigns,
  divDistancePoint,
} from "./Icon";
import styles from "../../../../styles/map/Map.module.scss";
import { useEffect } from "react";
import {
  changeIcon,
  distancePopup,
  changeGroup,
  routePopup,
} from "../popup/Popup";
import {
  dragEndHandler,
  dragStartHandlerLine,
  dragHandlerLine,
  dragHandlerLine_distance,
} from "../routeDistance/handleDistance";

import * as turf from "@turf/turf";

export const markerPersonIndex = [1];
export const markerFnIndex = [1];
export const markerProblemIndex = [1];
export const markerHouseIndex = [1];
export const groupFnIndex = [1];
export const groupPersonIndex = [1];
export const functionSelected = [];
export const defaulFunction = ["20"];
export const defaultPerson = ["20"];
export const defaultFunctionPerson = ["20"];
export let selectedList = [];
export const allLayer = [];

const popupWorld = L.popup();

const arcRouteInit = (e) => {
  const thetaOffset = 3.14 / 9;
  const latlng1 = [e.latlng.lat, e.latlng.lng],
    latlng2 = [e.latlng.lat, e.latlng.lng + 10];
  const offsetX = latlng2[1] - latlng1[1],
    offsetY = latlng2[0] - latlng1[0];
  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
    theta = Math.atan2(offsetY, offsetX);
  const r2 = r / 2 / Math.cos(thetaOffset),
    theta2 = theta + thetaOffset;
  const midpointX = r2 * Math.cos(theta2) + latlng1[1],
    midpointY = r2 * Math.sin(theta2) + latlng1[0];

  const midpointLatLng = [midpointY, midpointX];
  const pathOptions = {
    color: "transparent",
    weight: 3,
    type: "arc",
  };

  return {
    latlng1,
    latlng2,
    midpointLatLng,
    pathOptions,
  };
};
export const Markers = observer(({ SetModal }) => {
  const {
    country,
    click,
    lock,
    addIcon,
    houseView,
    addIconHandle,
    toggleHouseView,
    switchCountry,
  } = STORES;
  const map = useMap();
  let areaSelection;
  const addSelectedItem = (event) => {
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();
    if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
      const isExistItem = selectedList.find((item) => item === event.target);

      // add item to list
      if (!isExistItem) {
        selectedList.push(event.target);
        event.target._icon.classList.add("selected-icon");
      } else {
        // const index = selectedList.indexOf(isExistItem);
        // console.log("remove selected item from list", index);
        // selectedList.splice(index, 1);

        // remove selected item from list
        selectedList.forEach((item, index) => {
          if (isExistItem === item) {
            selectedList.splice(index, 1);
            item._icon.classList.remove("selected-icon");
          }
        });
      }

      if (selectedList.length > 0) {
        window.handleRemoveTempList = () => {
          for (let index = 0; index < selectedList.length; index++) {
            selectedList[index]._icon.classList.remove("selected-icon");
          }
          selectedList = [];
          // map.closePopup();
        };

        window.getSelectedList = (_event) => {
          _event.stopPropagation();
          _event.preventDefault();

          selectedList.forEach((e) => {
            functionSelected.push(e.options.index);
          });
          L.marker([event.latlng.lat, event.latlng.lng], {
            draggable: !STORES.lock,
            group: {
              group: [...functionSelected].sort(),
              index: groupFnIndex[0],
            },
            icon: divFunction(
              [styles["rectangle-fn"]].join(" "),
              `Group function ${groupFnIndex[0]}`
            ),
          })
            .addTo(map)
            .bindPopup(
              (e) => {
                return `
                <div class="${styles["group-function"]}">
                ${e.options.group.group.map((item) => {
                  return `<div  class="${[
                    styles["rectangle-fn-gr"],
                    styles["fn--black"],
                  ].join(" ")}">Function ${item} </div>`;
                })}
                </div>
                `;
              },
              {
                className: `${styles["group-rectangle"]} id-group-${groupFnIndex[0]}`,
                offset: L.point(30, -12),
                id: "check",
                autoClose: false,
                closeOnClick: false,
              }
            )
            .on("contextmenu", changeGroup.bind(this, map))
            .on("popupclose", (e) => {
              e.target._icon.classList.add(`${styles["group-fn-border"]}`);
            })
            .on("popupopen", (e) => {
              e.target._icon.classList.remove(`${styles["group-fn-border"]}`);
            })
            .openPopup();

          groupFnIndex[0]++;
          map.eachLayer((layer) => {
            if (layer.options.index) {
              functionSelected.forEach((element) => {
                if (element === layer.options.index) {
                  layer.remove();
                }
              });
            }
          });
          functionSelected.splice(0, functionSelected.length);
          selectedList.splice(0, selectedList.length);
        };
        const popupScan = L.popup()
          .setLatLng([event.latlng.lat, event.latlng.lng])
          .setContent(
            `
            <div onclick="closePopupScan()" style="background-color:#fff;padding:10px;min-width:100px;padding-right: 40px;
            display: flex;
            justify-content: space-between;">
            <div class="group-button" onclick="getSelectedList(event)">Group</div>
            <div class="group-button" onclick="handleRemoveTempList()">Cancel</div>
            </div>
            `
          )
          .openOn(map);
        window.closePopupScan = () => {
          map.removeLayer(popupScan);
        };
      }
    }
  };
  map.doubleClickZoom.disable();
  useEffect(() => {
    if (lock) {
      map.eachLayer((layer) => {
        layer._icon && layer.dragging.disable();
      });
    } else {
      map.eachLayer((layer) => {
        layer._icon && layer.dragging.enable();
        layer._icon?.src && layer.dragging.disable();
        layer.options?.infor && layer.dragging.disable();
      });
    }
  }, [lock]);

  // Scan Selection function

  useEffect(() => {
    const getButton = document.getElementById("pointer-event");

    areaSelection = new DrawAreaSelection({
      onPolygonReady: (polygon) => {
        if (polygon && polygon._latlngs) {
          let index = 0;
          const arr = polygon._latlngs[0].map((e) => Object.values(e));

          map.eachLayer((layer) => {
            if (layer._latlng) {
              if (
                turf.booleanPointInPolygon(
                  turf.point(Object.values(layer._latlng)),
                  turf.polygon([[...arr, arr[0]]])
                )
              ) {
                if (layer.options.index) {
                  selectedList.push(layer);
                  layer._icon.classList.add("selected-icon");
                  index++;
                }
              }
            }
          });

          if (index > 0) {
            window.handleRemoveTempList = () => {
              for (let index = 0; index < selectedList.length; index++) {
                selectedList[index]._icon.classList.remove("selected-icon");
              }
              selectedList = [];
            };

            window.getSelectedList = (_event) => {
              _event.stopPropagation();
              _event.preventDefault();

              selectedList.forEach((e) => {
                functionSelected.push(e.options.index);
              });

              const groupMarker = L.marker([arr[2][0], arr[2][1]], {
                draggable: !STORES.lock,
                group: {
                  group: [...functionSelected].sort(),
                  index: groupFnIndex[0],
                },
                icon: divFunction(
                  [styles["rectangle-fn"]].join(" "),
                  `Group function ${groupFnIndex[0]}`
                ),
              })
                .addTo(map)
                .bindPopup(
                  (e) => {
                    return `
                      <div class="${styles["group-function"]}">
                      ${e.options.group.group.map((item) => {
                        return `<div  class="${[
                          styles["rectangle-fn-gr"],
                          styles["fn--black"],
                        ].join(" ")}">Function ${item} </div>`;
                      })}
                      </div>
                      `;
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
                  e.target._icon.classList.add(`${styles["group-fn-border"]}`);
                })
                .on("popupopen", (e) => {
                  e.target._icon.classList.remove(
                    `${styles["group-fn-border"]}`
                  );
                })
                .openPopup();

              groupFnIndex[0]++;
              map.eachLayer((layer) => {
                if (layer.options.index) {
                  functionSelected.forEach((element) => {
                    if (element === layer.options.index) {
                      layer.remove();
                    }
                  });
                }
              });
              functionSelected.splice(0, functionSelected.length);
              selectedList.splice(0, selectedList.length);
            };

            const popupScan = L.popup()
              .setLatLng([arr[2][0], arr[2][1]])
              .setContent(
                `
                <div onclick="closePopupScan()" style="background-color:#fff;padding:10px;min-width:100px;padding-right: 40px;
                display: flex;
                justify-content: space-between;">
                <div class="group-button" onclick="getSelectedList(event)">Group</div>
                <div class="group-button" onclick="handleRemoveTempList()">Cancel</div>
                </div>
                `
              )
              .openOn(map);
            window.closePopupScan = () => {
              map.removeLayer(popupScan);
            };

            // .on('remove', () =>
            //   handleRemoveTempList()
            // );
          }
          areaSelection.deactivate();
        }
      },
    });
    map.addControl(areaSelection);
    const showScanSelection = () => {
      areaSelection.activate();
    };
    getButton.addEventListener("click", showScanSelection);
    return () => {
      getButton.removeEventListener("click", showScanSelection);
    };
  }, []);
  useEffect(() => {
    const onClick = (event) => {
      if (
        window.handleRemoveTempList &&
        (!event.ctrlKey || !event.metaKey) &&
        event.target.classList &&
        !event.target.classList.contains(styles["rectangle-fn"])
      ) {
        window.handleRemoveTempList();
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!click) {
      const mapContainer = document.querySelector(".leaflet-container");
      mapContainer.ondragover = function (e) {
        e.preventDefault();
      };

      mapContainer.ondrop = function (e) {
        const latlng = map.containerPointToLatLng(L.point(e.layerX, e.layerY));

        if (addIcon === "person") {
          L.marker([latlng.lat, latlng.lng], {
            index: markerPersonIndex[0],
            icon: divPerson(styles["person"], `Person ${markerPersonIndex[0]}`),
            draggable: !lock,
          })

            .on("contextmenu", changeIcon.bind(this, map, SetModal))
            .addTo(map);
          markerPersonIndex[0]++;
          addIconHandle("");
        } else if (addIcon === "welcome-sign") {
          L.marker([latlng.lat, latlng.lng], {
            icon: divNavigationSigns(),
            draggable: !lock,
          }).addTo(map);
          addIconHandle("");
        } else if (addIcon === "function") {
          L.marker([latlng.lat, latlng.lng], {
            index: markerFnIndex[0],
            icon: divFunction(
              [styles["rectangle-fn"], styles["fn--black"]].join(" "),
              `Function ${markerFnIndex[0]}`
            ),
            draggable: !lock,
          })
            .addTo(map)
            .on("contextmenu", changeIcon.bind(this, map, SetModal));
          markerFnIndex[0]++;
          addIconHandle("");
        }
      };
    }
  }, [click, addIcon]);

  useMapEvents({
    contextmenu(e) {
      if (country) {
        map.removeLayer(popupWorld);
        popupWorld
          .setLatLng([e.latlng.lat, e.latlng.lng])
          .setContent(
            `<div style="background-color:#fff;padding:10px; min-width:180px" class="${
              styles["popup-interact-function"]
            }">
                <div class="${[styles.row, "world", styles["on-hover"]].join(
                  " "
                )}">
                  Show World as house
                </div>
                <div class="${[styles.row, "country", styles["on-hover"]].join(
                  " "
                )}">
                  Show all Countries as house
                </div>
            </div>
    `
          )
          .addTo(map);

        const world = document.querySelector(".world");
        const country = document.querySelector(".country");
        world.onclick = () => {
          toggleHouseView("house-name");
          map.removeLayer(popupWorld);
        };
        country.onclick = () => {
          !houseView && toggleHouseView("house-name");
          switchCountry();
          map.removeLayer(popupWorld);
        };
      }
    },

    click(e) {
      addIconHandle("");
      if (addIcon === "person" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          index: markerPersonIndex[0],
          draggable: !lock,
          icon: divPerson(styles["person"], `Person ${markerPersonIndex[0]}`),
        })
          .on("contextmenu", changeIcon.bind(this, map, SetModal))
          .on("click", (e) => addSelectedItem(e))
          .addTo(map);

        markerPersonIndex[0]++;
        addIconHandle("");
      } else if (addIcon === "welcome-sign" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          icon: divNavigationSigns(),
          draggable: !lock,
        }).addTo(map);
        addIconHandle("");
      } else if (addIcon === "function" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          index: markerFnIndex[0],
          icon: divFunction(
            [styles["rectangle-fn"], styles["fn--black"]].join(" "),
            `Function ${markerFnIndex[0]}`
          ),
          draggable: !lock,
        })
          .addTo(map)
          .on("contextmenu", changeIcon.bind(this, map, SetModal))
          .on("click", (e) => addSelectedItem(e));
        markerFnIndex[0]++;
        addIconHandle("");
      } else if (addIcon === "inter-route") {
        // inter-route-------------------------------------------------

        const distancePoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: divDistancePoint(),
          draggable: !lock,
          type: "distance",
        })
          .on("dragstart", dragStartHandlerLine.bind(this))
          .on("drag", dragHandlerLine.bind(this))
          .on("dragend", dragEndHandler)

          .addTo(map);

        const distancePoint1 = L.marker([e.latlng.lat, e.latlng.lng + 10], {
          icon: divDistancePoint(),
          draggable: !lock,
          type: "distance",
        })
          .on("dragstart", dragStartHandlerLine.bind(this))
          .on("drag", dragHandlerLine.bind(this))
          .on("dragend", dragEndHandler)
          .addTo(map);

        const polyline = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng + 10],
          ],

          { type: "line", color: "black" }
        )
          .setText("Inter-route", {
            center: true,
            offset: -3,
          })
          .on(
            "contextmenu",
            routePopup.bind(this, distancePoint, distancePoint1)
          )
          .on("click", (e) => {
            map.eachLayer((layer) => {
              if (layer.options.type === "distance") {
                layer.parentLine.options.color === "blue" &&
                  layer.parentLine.setStyle({ color: "black" });
                layer.parentArc.options.color === "blue" &&
                  layer.parentArc.setStyle({ color: "black" });
              }
            });

            e.target.setStyle({ color: "blue" });
            let direct;
            if (
              distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng
            ) {
              direct = true;
            } else {
              direct = false;
            }

            if (e.target._text === "Inter-route") {
              const latLng = e.target.getLatLngs();
              const distance = map.distance(
                L.latLng(latLng[0].lat, latLng[0].lng),
                L.latLng(latLng[1].lat, latLng[1].lng)
              );

              e.target.setText(null);
              e.target.setText(`${(distance * 0.001).toFixed()} km`, {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            } else {
              e.target.setText(null);
              e.target.setText("Inter-route", {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            }
          })
          .addTo(map);

        distancePoint.parentLine = polyline;
        distancePoint1.parentLine = polyline;

        const { midpointLatLng, latlng2, latlng1, pathOptions } =
          arcRouteInit(e);
        const curvedPath = L.curve(
          ["M", latlng1, "Q", midpointLatLng, latlng2],
          pathOptions
        )
          .addTo(map)

          .on(
            "contextmenu",
            routePopup.bind(this, distancePoint, distancePoint1)
          )
          .on("click", (e) => {
            map.eachLayer((layer) => {
              if (layer.options.type === "distance") {
                layer.parentLine.options.color === "blue" &&
                  layer.parentLine.setStyle({ color: "black" });
                layer.parentArc.options.color === "blue" &&
                  layer.parentArc.setStyle({ color: "black" });
              }
            });

            e.target.setStyle({ color: "blue" });
            let direct;

            if (
              distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng
            ) {
              direct = true;
            } else {
              direct = false;
            }

            if (distancePoint.parentArc._text === "Arc-route") {
              const latLng = distancePoint.parentLine.getLatLngs();
              const distance = map.distance(
                L.latLng(latLng[0].lat, latLng[0].lng),
                L.latLng(latLng[1].lat, latLng[1].lng)
              );

              distancePoint.parentArc.setText(null);
              distancePoint.parentArc.setText(
                `${(distance * 0.001).toFixed()} km`,
                {
                  center: true,
                  offset: -3,
                  orientation: !direct ? 180 : 0,
                }
              );
            } else {
              distancePoint.parentArc.setText(null);
              distancePoint.parentArc.setText("Arc-route", {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            }
          });

        curvedPath.setText = polyline.setText;
        distancePoint.parentArc = curvedPath;
        distancePoint1.parentArc = curvedPath;
        distancePoint.on("click", (e) => {
          map.eachLayer((layer) => {
            if (layer.options.type === "distance") {
              layer.parentLine.options.color === "blue" &&
                layer.parentLine.setStyle({ color: "black" });
              layer.parentArc.options.color === "blue" &&
                layer.parentArc.setStyle({ color: "black" });
            }
          });
          distancePoint.parentLine.options.color === "black" &&
            distancePoint.parentLine.setStyle({ color: "blue" });
          distancePoint.parentArc.options.color === "black" &&
            distancePoint.parentArc.setStyle({ color: "blue" });
        });
        distancePoint1.on("click", (e) => {
          map.eachLayer((layer) => {
            if (layer.options.type === "distance") {
              layer.parentLine.options.color === "blue" &&
                layer.parentLine.setStyle({ color: "black" });
              layer.parentArc.options.color === "blue" &&
                layer.parentArc.setStyle({ color: "black" });
            }
          });
          distancePoint1.parentLine.options.color === "black" &&
            distancePoint1.parentLine.setStyle({ color: "blue" });
          distancePoint1.parentArc.options.color === "black" &&
            distancePoint1.parentArc.setStyle({ color: "blue" });
        });

        ///
        //
        //
      } else if (addIcon === "distance") {
        // distance-------------------------------------------------

        const distancePoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: divDistancePoint(),
          draggable: !lock,
          type: "distance",
        })
          .on("dragstart", dragStartHandlerLine.bind(this))
          .on("drag", dragHandlerLine_distance.bind(this))
          .on("dragend", dragEndHandler)

          .addTo(map);

        const distancePoint1 = L.marker([e.latlng.lat, e.latlng.lng + 10], {
          icon: divDistancePoint(),
          draggable: !lock,
          type: "distance",
        })
          .on("dragstart", dragStartHandlerLine.bind(this))
          .on("drag", dragHandlerLine_distance.bind(this))
          .on("dragend", dragEndHandler)
          .addTo(map);

        const polyline = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng + 10],
          ],

          { type: "line", color: "black" }
        )
          .setText("Distance", {
            center: true,
            offset: -3,
          })
          .on(
            "contextmenu",
            distancePopup.bind(this, distancePoint, distancePoint1)
          )
          .on("click", (e) => {
            map.eachLayer((layer) => {
              if (layer.options.type === "distance") {
                layer.parentLine.options.color === "blue" &&
                  layer.parentLine.setStyle({ color: "black" });
                layer.parentArc.options.color === "blue" &&
                  layer.parentArc.setStyle({ color: "black" });
              }
            });

            e.target.setStyle({ color: "blue" });
            let direct;
            if (
              distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng
            ) {
              direct = true;
            } else {
              direct = false;
            }

            if (e.target._text === "Distance") {
              const latLng = e.target.getLatLngs();
              const distance = map.distance(
                L.latLng(latLng[0].lat, latLng[0].lng),
                L.latLng(latLng[1].lat, latLng[1].lng)
              );

              e.target.setText(null);
              e.target.setText(`${(distance * 0.001).toFixed()} km`, {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            } else {
              e.target.setText(null);
              e.target.setText("Distance", {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            }
          })
          .addTo(map);

        distancePoint.parentLine = polyline;
        distancePoint1.parentLine = polyline;

        const { midpointLatLng, latlng2, latlng1, pathOptions } =
          arcRouteInit(e);
        const curvedPath = L.curve(
          ["M", latlng1, "Q", midpointLatLng, latlng2],
          pathOptions
        )
          .addTo(map)
          .on(
            "contextmenu",
            distancePopup.bind(this, distancePoint, distancePoint1)
          )
          .on("click", (e) => {
            map.eachLayer((layer) => {
              if (layer.options.type === "distance") {
                layer.parentLine.options.color === "blue" &&
                  layer.parentLine.setStyle({ color: "black" });
                layer.parentArc.options.color === "blue" &&
                  layer.parentArc.setStyle({ color: "black" });
              }
            });

            e.target.setStyle({ color: "blue" });
            let direct;

            if (
              distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng
            ) {
              direct = true;
            } else {
              direct = false;
            }

            if (distancePoint.parentArc._text === "Distance") {
              const latLng = distancePoint.parentLine.getLatLngs();
              const distance = map.distance(
                L.latLng(latLng[0].lat, latLng[0].lng),
                L.latLng(latLng[1].lat, latLng[1].lng)
              );

              distancePoint.parentArc.setText(null);
              distancePoint.parentArc.setText(
                `${(distance * 0.001).toFixed()} km`,
                {
                  center: true,
                  offset: -3,
                  orientation: !direct ? 180 : 0,
                }
              );
            } else {
              distancePoint.parentArc.setText(null);
              distancePoint.parentArc.setText("Distance", {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
              });
            }
          });
        curvedPath.setText = polyline.setText;
        distancePoint.parentArc = curvedPath;
        distancePoint1.parentArc = curvedPath;
        distancePoint.on("click", (e) => {
          map.eachLayer((layer) => {
            if (layer.options.type === "distance") {
              layer.parentLine.options.color === "blue" &&
                layer.parentLine.setStyle({ color: "black" });
              layer.parentArc.options.color === "blue" &&
                layer.parentArc.setStyle({ color: "black" });
            }
          });
          distancePoint.parentLine.options.color === "black" &&
            distancePoint.parentLine.setStyle({ color: "blue" });
          distancePoint.parentArc.options.color === "black" &&
            distancePoint.parentArc.setStyle({ color: "blue" });
        });
        distancePoint1.on("click", (e) => {
          map.eachLayer((layer) => {
            if (layer.options.type === "distance") {
              layer.parentLine.options.color === "blue" &&
                layer.parentLine.setStyle({ color: "black" });
              layer.parentArc.options.color === "blue" &&
                layer.parentArc.setStyle({ color: "black" });
            }
          });
          distancePoint1.parentLine.options.color === "black" &&
            distancePoint1.parentLine.setStyle({ color: "blue" });
          distancePoint1.parentArc.options.color === "black" &&
            distancePoint1.parentArc.setStyle({ color: "blue" });
        });
      }
    },
  });

  return null;
});
