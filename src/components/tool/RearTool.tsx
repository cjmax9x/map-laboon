import styles from "../../../styles/tool/RearTool.module.scss";
import { useState } from "react";
import {
  CircleIcon,
  HomeIcon,
  LeftArrow,
  LocationIcon,
  MainsetIcon,
  PerSonIcon,
  RectangleIcon,
  RightArrow,
  SwitchIcon,
  VectorIcon,
  WelcomeSignIcon,
} from "../icon/Icon";
import "tippy.js/dist/tippy.css";
import { observer } from "mobx-react";
import { RearIconList } from "./rearTool/RearIconList";
import { STORES } from "../store/GlobalStore";

const IconList = [
  { value: "function", Icon: RectangleIcon, name: "Function", ability: true },
  { value: "person", Icon: PerSonIcon, name: "Person", ability: true },
  { value: "main-set", Icon: MainsetIcon, name: "The Given Set" },
  { value: "house", Icon: HomeIcon, name: "House", ability: true },
  { value: "straight", Icon: VectorIcon, name: "Inter-Route", ability: true },
  { value: "distance", Icon: LocationIcon, name: "Distance" },
  { value: "philosophy", Icon: CircleIcon, name: "Philosophy" },
  {
    value: "welcome-sign",
    Icon: WelcomeSignIcon,
    name: "Welcome",
    ability: true,
  },
];
export const RearTool = observer((): React.ReactElement => {
  const [width, setWidth] = useState(true);
  const {
    click: map,
    toggleClick: setMap,
    lock: grid,
    toggleLock: setGrid,
  } = STORES;

  return (
    <div
      style={width ? { width: 250 } : { width: 90 }}
      className={styles["container"]}
    >
      <div className={styles["tool"]}>
        <div
          style={{
            height: 40,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 10,
          }}
        >
          {width && (
            <>
              <SwitchIcon
                state={{ map, setMap }}
                title={{ on: "Click", off: "Drag" }}
                className={styles["switch"]}
              />
              <SwitchIcon
                state={{ grid, setGrid }}
                title={{ on: "Lock", off: "Unlock" }}
                className={styles["switch"]}
              />
            </>
          )}
          <span
            onClick={setWidth.bind(this, !width)}
            className={styles["arrow"]}
          >
            {width && <LeftArrow />}
            {!width && <RightArrow />}
          </span>
        </div>

        {IconList.map((icon, index) => {
          return (
            <RearIconList
              Icon={icon}
              key={index}
              width={width}
            />
          );
        })}
      </div>
    </div>
  );
});
