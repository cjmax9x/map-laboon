<<<<<<< HEAD
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
        const distancePoint = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: divDistancePoint(),
          draggable: !lock,
        })
          .on("dragstart", dragStartHandlerLine)
          .on("drag", dragHandlerLine.bind(this))
          .on("dragend", dragEndHandler)
          .addTo(map);
        const distancePoint1 = L.marker([e.latlng.lat, e.latlng.lng + 10], {
          icon: divDistancePoint(),
          draggable: !lock,
        })
          .on("dragstart", dragStartHandlerLine)
          .on("drag", dragHandlerLine.bind(this))
          .on("dragend", dragEndHandler)
          .addTo(map);

        const polyline = new L.Polyline(
          [
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng + 10],
          ],

          { color: "black" }
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
              });
            } else {
              e.target.setText(null);
              e.target.setText("Distance", {
                center: true,
                offset: -3,
              });
            }
          })
          .addTo(map);
        distancePoint.parentLine = polyline;
        distancePoint1.parentLine = polyline;
      }
    },
  });

  return null;
});
=======
import L from "leaflet";
import { observer } from "mobx-react";
import { useMap, useMapEvents } from "react-leaflet";
import { STORES } from "../../store/GlobalStore";
import { divFunction, divPerson, divNavigationSigns } from "./Icon";
import styles from "../../../../styles/map/Map.module.scss";
import { useEffect } from "react";
import { changeIcon } from "../popup/Popup";
export const markerPersonIndex = [1];
export const markerFnIndex = [1];
export const groupFnIndex = [1];
export const groupPersonIndex = [1];
export const functionSelected = [];

export const Markers = observer(({ SetModal }) => {
  const { click, lock, addIcon, addIconHandle } = STORES;

  const map = useMap();

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
    const mapContainer = document.querySelector(".leaflet-container");
    if (!click) {
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
      }
    },
  });

  return null;
});
>>>>>>> parent of e03c2a2 ([MileStone 3] Add Populate property #1)
