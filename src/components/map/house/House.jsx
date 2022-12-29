import L from "leaflet";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import styles from "../../../../styles/map/Map.module.scss";
import { STORES } from "../../store/GlobalStore";
import { divHouse, divHouseName, divHouseWorld } from "../marker/Icon";
import { allLayer } from "../marker/Marker";

export const House = observer(({}) => {
  const map = useMap();
  const { country, countryName, houseView } = STORES;

  useEffect(() => {
    let World = {};
    if (country && houseView) {
      map.eachLayer((layer) => {
        allLayer.push(layer);
        map.removeLayer(layer);
      });
      World = L.marker([44.96479793033104, -6.416015625000001], {
        icon: divHouseWorld("1", "WORLD"),
      }).addTo(map);
      map.zoomOut(2);
    } else {
      allLayer.forEach((layer) => {
        map.addLayer(layer);
      });
    }

    return () => {
      map.removeLayer(World);
    };
  }, [country, houseView]);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer.options?.infor) {
        if (countryName === "location") {
          layer.setIcon(
            divHouseName("1", `Location${layer.options?.infor.index}`)
          );
        } else if (countryName === "l") {
          layer.setIcon(divHouseName("1", `L${layer.options?.infor.index}`));
        }
      }
    });
  }, [countryName]);

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
