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
export const defaulFunction = [20];
export const defaultPerson = [20];
export const defaultFunctionPerson = [20];

export const Markers = observer(({ SetModal }) => {
  const { click, lock, addIcon, addIconHandle } = STORES;

  const map = useMap();
  map.doubleClickZoom.disable()
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
      }
    },
  });

  return null;
});
