/* eslint-disable react-hooks/exhaustive-deps */
import L from "leaflet";
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import {
  divFunction,
  divPerson,
  divNavigationSigns,
  divDistancePoint,
} from "./Icon";
import styles from "../../../../styles/map/Map.module.scss";
import { useEffect } from "react";
import { changeIcon, distancePopup } from "../popup/Popup";
import {
  dragEndHandler,
  dragStartHandlerLine,
  dragHandlerLine,
} from "../routeDistance/handleDistance";
export const markerPersonIndex = [1];
export const markerFnIndex = [1];
export const groupFnIndex = [1];
export const groupPersonIndex = [1];
export const functionSelected = [];
export const defaulFunction = ["20"];
export const defaultPerson = ["20"];
export const defaultFunctionPerson = ["20"];

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
  const { click, lock, addIcon, addIconHandle } = STORES;
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
    click(e) {
      addIconHandle("");
      if (addIcon === "person" && click) {
        L.marker([e.latlng.lat, e.latlng.lng], {
          index: markerPersonIndex[0],
          draggable: !lock,
          icon: divPerson(styles["person"], `Person ${markerPersonIndex[0]}`),
        })
          .on("contextmenu", changeIcon.bind(this, map, SetModal))
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
          .on("contextmenu", changeIcon.bind(this, map, SetModal));
        markerFnIndex[0]++;
        addIconHandle("");
      } else if (addIcon === "inter-route") {
        // distance-------------------------------------------------

        const distancePoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: divDistancePoint(),
          draggable: !lock,
          type: "distance",
        })
          .on("dragstart", dragStartHandlerLine.bind(this))
          .on("drag", dragHandlerLine.bind(this))
          .on("dragend", dragEndHandler)
          // .on("click", () => {
          //   console.log(e.target);
          // })
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
