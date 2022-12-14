import L from "leaflet";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import styles from "../../../../styles/map/Map.module.scss";
import { STORES } from "../../store/GlobalStore";
import { divHouse, divHouseName } from "../marker/Icon";

export const House = observer(({}) => {
  const map = useMap();
  const { houseView } = STORES;

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
  }, [houseView]);
  return null;
});
