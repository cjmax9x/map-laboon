<<<<<<< HEAD
import L from "leaflet";
import styles from "../../../../styles/map/Map.module.scss";

export const divPerson = (className: string, name: string, image: string) => {
  return L.divIcon({
    className: className,
    iconSize: [40, 40],
    iconAnchor: [20, 30],
    html: `<img src="${
      image ? image : "../../../../user_md.png"
    }"  style="position: absolute;left: 50%;transform: translateX(-50%);" alt="person" width="40" height="40">
    <div class="${styles["name-person"]}">${name}</div>
    `,
  });
};

export const divNavigationSigns = (className: string) => {
  return L.divIcon({
    className: className,
    iconSize: [80, 80],
    iconAnchor: [20, 30],
    html: `<img src="../../../../navigation_sign.png" alt="navigation" width="80" height="80">`,
  });
};
export const divThreeDot = (className: string) => {
  return L.divIcon({
    className: className,
    iconSize: [10, 10],
    iconAnchor: [20, 30],
    html: `<img src="../../../../group.png" alt="group" width="10" height="10">`,
  });
};
export const divFunction = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [100, 50],
    iconAnchor: [20, 30],
    html: name,
  });
};
export const divFunctionCircle = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [100, 100],
    iconAnchor: [20, 30],
    html: name,
  });
};
export const divHouse = (className: string) => {
  return L.divIcon({
    className: className,
    iconSize: [50, 50],
    iconAnchor: [20, 30],
    html: `<img src="../../../../house.png" alt="navigation" width="50" height="50">`,
  });
};
export const divHouseName = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [50, 50],
    iconAnchor: [20, 30],
    html: `<img src="../../../../house.png" alt="navigation" width="50" height="50">
    <div class="${styles["name-house"]}">${name}</div>
    `,
  });
};
export const divDistancePoint = () => {
  return L.divIcon({
    className: styles['dot-point-distance'],
    iconSize: [10, 10],
    iconAnchor: [2, 5],
    
  });
};
=======
import L from "leaflet";
import styles from "../../../../styles/map/Map.module.scss";

export const divPerson = (className: string, name: string, image: string) => {
  return L.divIcon({
    className: className,
    iconSize: [40, 40],
    iconAnchor: [20, 30],
    html: `<img src="${
      image ? image : "../../../../user_md.png"
    }"  style="position: absolute;left: 50%;transform: translateX(-50%);" alt="person" width="40" height="40">
    <div class="${styles["name-person"]}">${name}</div>
    `,
  });
};

export const divNavigationSigns = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [80, 80],
    iconAnchor: [20, 30],
    html: `<img src="../../../../navigation_sign.png" alt="navigation" width="80" height="80">`,
  });
};

export const divFunction = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [100, 50],
    iconAnchor: [20, 30],
    html: name,
  });
};
export const divHouse = (className: string) => {
  return L.divIcon({
    className: className,
    iconSize: [50, 50],
    iconAnchor: [20, 30],
    html: `<img src="../../../../house.png" alt="navigation" width="50" height="50">`,
  });
};
export const divHouseName = (className: string, name: string) => {
  return L.divIcon({
    className: className,
    iconSize: [50, 50],
    iconAnchor: [20, 30],
    html: `<img src="../../../../house.png" alt="navigation" width="50" height="50">
    <div class="${styles["name-house"]}">${name}</div>
    `,
  });
};
>>>>>>> parent of e03c2a2 ([MileStone 3] Add Populate property #1)
