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
  divHouse,
} from "./Icon";
import styles from "../../../../styles/map/Map.module.scss";
import { useEffect } from "react";
import {
  changeIcon,
  distancePopup,
  changeGroup,
  routePopup,
  groupLayoutPopup,
  groupPersonLayoutPopup,
} from "../popup/Popup";
import {
  dragEndHandler,
  dragStartHandlerLine,
  dragHandlerLine,
  dragHandlerLine_distance,
} from "../routeDistance/handleDistance";
import { markerPersonIndex, markerFnIndex } from "../variable/variables";

import * as turf from "@turf/turf";

export const markerProblemIndex = [1];
export const markerHouseIndex = [1];
export const groupFnIndex = [1];
export const groupPersonIndex = [1];
export const functionSelected = [];
export const personSelected = [];
export const defaulFunction = ["20"];
export const defaultPerson = ["20"];
export const defaultFunctionPerson = ["20"];
export const textPath = [];
export let selectedList = [];

export const allLayer = [];
export const popupWorld = L.popup();
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
    status: "add",
  };

  return {
    latlng1,
    latlng2,
    midpointLatLng,
    pathOptions,
  };
};
//Selection item
let areaSelection;
export const addSelectedItem = (event, map) => {
  event.originalEvent.stopPropagation();
  event.originalEvent.preventDefault();
  if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
    const isExistItem = selectedList.find((item) => item === event.target);

    // add item to list
    if (!isExistItem) {
      selectedList.push(event.target);
      event.target._icon.classList.add("selected-icon");
    } else {
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
      };

      window.getSelectedList = (_event) => {
        _event.stopPropagation();
        _event.preventDefault();
        let groupShape = "rectangle";
        selectedList.forEach((e) => {
          if (e.options.target?.type === "person") {
            personSelected.push(e.options.target.index);
          } else {
            functionSelected.push(e.options.target);
          }
        });

        if (
          functionSelected.length > 0 &&
          functionSelected.every((item) => {
            return item.shape === "circle";
          })
        )
          groupShape = "circle";
        if (
          functionSelected.length > 0 &&
          functionSelected.every((item) => {
            return item.shape === "elip";
          })
        )
          groupShape = "elip";
        functionSelected.length > 0 &&
          L.marker([event.latlng.lat, event.latlng.lng], {
            draggable: !STORES.lock,
            group: {
              group: [...functionSelected],
              index: groupFnIndex[0],
              status: "add",
            },
            icon: divFunction(
              [
                styles[`${groupShape}-fn-group`],
                styles["group-fn-border"],
              ].join(" "),
              `Group function ${groupFnIndex[0]}`
            ),
          })
            .addTo(map)
            .bindPopup(
              (e) => {
                return groupLayoutPopup(e.options.group.group);
              },
              {
                className: `${styles[`group-${groupShape}`]} id-group-${
                  groupFnIndex[0]
                }`,
                offset: L.point(30, -12),
                autoClose: false,
                closeOnClick: false,
              }
            )
            .on("contextmenu", changeGroup.bind(this, map))
            .on("popupclose", (e) => {
              e.target._icon?.classList?.add(`${styles["group-fn-border"]}`);
            })
            .on("popupopen", (e) => {
              e.target._icon?.classList?.remove(`${styles["group-fn-border"]}`);
            })
            .openPopup();

        personSelected.length > 0 &&
          L.marker(
            [
              event.latlng.lat,
              functionSelected.length > 0
                ? event.latlng.lng + 10
                : event.latlng.lng,
            ],
            {
              draggable: !STORES.lock,
              group: {
                group: [...personSelected].sort(),
                index: groupPersonIndex[0],
                status: "add",
              },
              icon: divFunction(
                [styles["rectangle-fn"], styles["group-fn-border"]].join(" "),
                `Group person ${groupPersonIndex[0]}`
              ),
            }
          )
            .addTo(map)
            .bindPopup(
              (e) => {
                return groupPersonLayoutPopup(e.options.group.group);
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

        if (functionSelected.length > 0) {
          groupFnIndex[0]++;
          functionSelected.splice(0, functionSelected.length);
        }
        if (personSelected.length > 0) {
          groupPersonIndex[0]++;
          personSelected.splice(0, personSelected.length);
        }
        selectedList.forEach((item) => {
          map.removeLayer(item);
        });
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
//------------------------------------

export const Markers = observer(({ SetModal }) => {
  const { country, click, lock, addIcon, addIconHandle, toggleHouseView } =
    STORES;
  const map = useMap();

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
                if (
                  layer.options.index ||
                  layer.options.target ||
                  layer.options.options?.shape
                ) {
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

              let groupShape = "rectangle";

              selectedList.forEach((e) => {
                if (e.options.target?.type === "person") {
                  personSelected.push(e.options.target.index);
                } else {
                  functionSelected.push(e.options.target);
                }
              });
              if (
                functionSelected.length > 0 &&
                functionSelected.every((item) => {
                  return item.shape === "circle";
                })
              )
                groupShape = "circle";
              if (
                functionSelected.length > 0 &&
                functionSelected.every((item) => {
                  return item.shape === "elip";
                })
              )
                groupShape = "elip";

              functionSelected.length > 0 &&
                L.marker([arr[2][0], arr[2][1]], {
                  draggable: !STORES.lock,
                  group: {
                    group: [...functionSelected],
                    index: groupFnIndex[0],
                    status: "add",
                  },
                  icon: divFunction(
                    [
                      styles[`${groupShape}-fn-group`],
                      styles["group-fn-border"],
                    ].join(" "),
                    `Group function ${groupFnIndex[0]}`
                  ),
                })
                  .addTo(map)
                  .bindPopup(
                    (e) => {
                      return groupLayoutPopup(e.options.group.group);
                    },
                    {
                      className: `${styles[`group-${groupShape}`]} id-group-${
                        groupFnIndex[0]
                      }`,
                      offset: L.point(30, -12),
                      autoClose: false,
                      closeOnClick: false,
                    }
                  )
                  .on("contextmenu", changeGroup.bind(this, map))
                  .on("popupclose", (e) => {
                    e.target?._icon?.classList.add(
                      `${styles["group-fn-border"]}`
                    );
                  })
                  .on("popupopen", (e) => {
                    e.target?._icon?.classList.remove(
                      `${styles["group-fn-border"]}`
                    );
                  })
                  .openPopup();

              personSelected.length > 0 &&
                L.marker(
                  [
                    arr[2][0],
                    functionSelected.length > 0 ? arr[2][1] + 10 : arr[2][1],
                  ],
                  {
                    draggable: !STORES.lock,
                    group: {
                      group: [...personSelected].sort(),
                      index: groupPersonIndex[0],
                      status: "add",
                    },
                    icon: divFunction(
                      [styles["rectangle-fn"], styles["group-fn-border"]].join(
                        " "
                      ),
                      `Group person ${groupPersonIndex[0]}`
                    ),
                  }
                )
                  .addTo(map)
                  .bindPopup(
                    (e) => {
                      return groupPersonLayoutPopup(e.options.group.group);
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
                    e.target?._icon?.classList.add(
                      `${styles["group-fn-border"]}`
                    );
                  })
                  .on("popupopen", (e) => {
                    e.target?._icon?.classList.remove(
                      `${styles["group-fn-border"]}`
                    );
                  })
                  .openPopup();

              if (functionSelected.length > 0) {
                groupFnIndex[0]++;
                functionSelected.splice(0, functionSelected.length);
              }
              if (personSelected.length > 0) {
                groupPersonIndex[0]++;
                personSelected.splice(0, personSelected.length);
              }
              selectedList.forEach((item) => {
                map.removeLayer(item);
              });
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
  //-----------------------------------

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
  //-----------------------------------
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
            target: {
              type: "person",
              index: markerPersonIndex[0],
              status: "add",
            },
            icon: divPerson(styles["person"], `Person ${markerPersonIndex[0]}`),
            draggable: !lock,
          })
            .on("contextmenu", changeIcon.bind(this, map, SetModal))
            .on("click", (e) => addSelectedItem(e, map))
            .addTo(map);
          markerPersonIndex[0]++;
          addIconHandle("");
        } else if (addIcon === "welcome-sign") {
          L.marker([latlng.lat, latlng.lng], {
            target: { status: "add" },
            icon: divNavigationSigns(),
            draggable: !lock,
          }).addTo(map);

          addIconHandle("");
        } else if (addIcon === "function") {
          L.marker([latlng.lat, latlng.lng], {
            target: {
              type: "function",
              shape: "rectangle",
              index: markerFnIndex[0],
              status: "add",
            },
            icon: divFunction(
              [styles["rectangle-fn"], styles["fn--black"]].join(" "),
              `Function ${markerFnIndex[0]}`
            ),
            draggable: !lock,
          })
            .on("contextmenu", changeIcon.bind(this, map, SetModal))
            .on("click", (e) => addSelectedItem(e, map))
            .addTo(map);
          markerFnIndex[0]++;
          addIconHandle("");
        }
      };
    }
  }, [click, addIcon]);
  //-----------------------------------
  useMapEvents({
    contextmenu(e) {
      if (country) {
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
          toggleHouseView("house-world");
          map.removeLayer(popupWorld);
        };
        country.onclick = () => {
          toggleHouseView("house-countries");
          map.removeLayer(popupWorld);
        };
      }
    },

    click(e) {
      addIconHandle("");
      if (addIcon === "person" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          target: {
            type: "person",
            index: markerPersonIndex[0],
            status: "add",
          },
          draggable: !lock,
          icon: divPerson(styles["person"], `Person ${markerPersonIndex[0]}`),
        })
          .on("contextmenu", changeIcon.bind(this, map, SetModal))
          .on("click", (e) => addSelectedItem(e, map))
          .addTo(map);

        markerPersonIndex[0]++;
        addIconHandle("");
      } else if (addIcon === "welcome-sign" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          target: { status: "add" },
          icon: divNavigationSigns(),
          draggable: !lock,
        })
          .on("contextmenu", (e) => {
            const welcomePopup = L.popup()
              .setContent(
                `
              <div style="background-color:#fff;padding:10px;min-width:180px">
                <div onclick="deleteWelcome()" class = "${[
                  styles["menu-geojson"],
                  styles["on-hover-function"],
                ].join(" ")}">
                  Delete item
                </div>
              </div>
            </div>
          `
              )
              .setLatLng([e.latlng.lat, e.latlng.lng])
              .addTo(map);
            window.deleteWelcome = () => {
              map.removeLayer(e.target);
              map.removeLayer(welcomePopup);
            };
          })
          .addTo(map);
        addIconHandle("");
      } else if (addIcon === "function" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          target: {
            type: "function",
            shape: "rectangle",
            index: markerFnIndex[0],
            status: "add",
          },
          icon: divFunction(
            [styles["rectangle-fn"], styles["fn--black"]].join(" "),
            `Function ${markerFnIndex[0]}`
          ),
          draggable: !lock,
        })
          .addTo(map)
          .on("contextmenu", changeIcon.bind(this, map, SetModal))
          .on("click", (e) => addSelectedItem(e, map));
        markerFnIndex[0]++;
        addIconHandle("");
      } else if (addIcon === "house" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          target: { status: "add" },
          icon: divHouse(),
        })
          .on("contextmenu", (e) => {
            const housePopup = L.popup()
              .setContent(
                `
            <div style="background-color:#fff;padding:10px;min-width:180px">
              <div onclick="deleteHouse()" class = "${[
                styles["menu-geojson"],
                styles["on-hover-function"],
              ].join(" ")}">
                Delete item
              </div>
            </div>
          </div>
        `
              )
              .setLatLng([e.latlng.lat, e.latlng.lng])
              .addTo(map);
            window.deleteHouse = () => {
              map.removeLayer(e.target);
              map.removeLayer(housePopup);
            };
          })
          .addTo(map);
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

        const polyline_1 = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng + 10],
            [e.latlng.lat, e.latlng.lng],
          ],

          { color: "transparent", status: "add" }
        )

          .arrowheads({ size: "5%", color: "black", type: "arrow" })
          .addTo(map);

        const polyline = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng + 10],
          ],

          { kind: "inter-route", type: "line", color: "black", status: "add" }
        )
          .setText("Inter-route", {
            center: true,
            offset: -3,
          })
          .arrowheads({
            color: "black",
            type: "arrow",
            size: "5%",
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
        distancePoint.parentLine_1 = polyline_1;
        distancePoint1.parentLine_1 = polyline_1;
        const { midpointLatLng, latlng2, latlng1, pathOptions } =
          arcRouteInit(e);
        pathOptions.kind = "inter-route";

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

        const polyline_1 = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng + 10],
            [e.latlng.lat, e.latlng.lng],
          ],

          { color: "transparent", status: "add" }
        )

          .arrowheads({ color: "black", type: "arrow", size: "5%" })
          .addTo(map);

        const polyline = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng + 10],
          ],

          { kind: "distance", type: "line", color: "black", status: "add" }
        )
          .setText("Distance", {
            center: true,
            offset: -3,
          })
          .arrowheads({
            color: "black",
            type: "arrow",
            size: "5%",
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
        distancePoint.parentLine_1 = polyline_1;

        distancePoint1.parentLine = polyline;
        distancePoint1.parentLine_1 = polyline_1;

        const { midpointLatLng, latlng2, latlng1, pathOptions } =
          arcRouteInit(e);

        pathOptions.kind = "distance";
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
