import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import styles from "../../../styles/tool/Toptool.module.scss";
import {
  BookIcon,
  CheckIcon,
  LayerIcon,
  LogoIcon,
  MenuIcon,
  MessageIcon,
  PeopleIcon,
  RightArrow,
  SettingIcon,
  SimulationIcon,
  ThreeGearIcon,
  TwoGearIcon,
  UserIcon,
} from "../icon/Icon";
import { Modal } from "../modal/Modal";
import { RightInner } from "./topTool/RightInner";
import { useState } from "react";
import { STORES } from "../store/GlobalStore";
import { TopToolIconList } from "./topTool/TopToolIconList";
import { observer } from "mobx-react";

const IconList = [
  { value: "", Icon: SettingIcon, name: "House View" },
  { value: "", Icon: ThreeGearIcon, name: "Room View" },
  { value: "", Icon: PeopleIcon, name: "Floor Plan View" },
  { value: "", Icon: TwoGearIcon, name: "Boat View" },
  { value: "", Icon: MessageIcon, name: "Rectangular View" },
  { value: "", Icon: LayerIcon, name: "Map view" },
  { value: "", Icon: BookIcon, name: "Table View" },
];

export const TopTool = observer((): React.ReactElement => {
  const [showSumilation, setShowSumilation] = useState<boolean>(false);
  const {
    houseView,
    countryName,
    toggleCountryName,
    changePosition,
    switchMainLand,
    getClear,
  } = STORES;
  return (
    <div className={styles["container"]}>
      {showSumilation && <Modal onClick={setShowSumilation} />}
      <div className={styles["inner"]}>
        <div className={styles["left-inner"]}>
          <LogoIcon className={styles["top-tool-icon"]} />
          <div className={styles["menu-wrapper"]}>
            <MenuIcon />
            <div className={styles["menu-list"]}>
              <span className={styles["menu-item"]}>Save</span>
              <span className={styles["menu-item"]}>Save as</span>
              <span className={styles["menu-item"]}>Save map Image</span>
              <span className={styles["menu-item"]}>Open</span>
              <span className={styles["menu-item"]}>New</span>
              <span className={styles["menu-item"]}>Share map</span>
              <span className={styles["menu-item"]}>Print</span>
              <span className={styles["menu-item"]}>Exit</span>
            </div>
          </div>

          {IconList.map((icon, index) => {
            return <TopToolIconList key={index} Icon={icon} />;
          })}

          <div className={styles["menu-wrapper"]}>
            <SimulationIcon />
            <div className={styles["menu-list"]}>
              <span className={styles["menu-item"]}>Simulation</span>
              <span
                onClick={setShowSumilation.bind(this, true)}
                className={styles["menu-item"]}
              >
                Simulation setting
              </span>
            </div>
          </div>
          <div className={styles["menu-wrapper"]}>
            <UserIcon />
            <div className={styles["menu-list"]}>
              <div className={styles["menu-item"]}>
                Show map element <RightArrow className={styles["arrow-icon"]} />
                <div className={styles["menu-list-2nd"]}>
                  <span
                    onClick={changePosition.bind(this, "top")}
                    className={styles["menu-item"]}
                  >
                    Top
                  </span>
                  <span
                    onClick={changePosition.bind(this, "left")}
                    className={styles["menu-item"]}
                  >
                    Left
                  </span>
                  <span
                    onClick={changePosition.bind(this, "right")}
                    className={styles["menu-item"]}
                  >
                    Right
                  </span>
                  <span
                    onClick={changePosition.bind(this, "buttom")}
                    className={styles["menu-item"]}
                  >
                    Bottom
                  </span>
                </div>
              </div>
              <span
                onClick={switchMainLand.bind(this, true)}
                className={styles["menu-item"]}
              >
                Show mainland only
              </span>
              <span
                onClick={switchMainLand.bind(this, false)}
                className={styles["menu-item"]}
              >
                Show all areas
              </span>
              <span
                onClick={toggleCountryName.bind(this, "location")}
                className={styles["menu-item"]}
              >
                Replace Location with index{" "}
                {countryName === "location" && (
                  <CheckIcon className={styles["check-icon"]} />
                )}
              </span>
              <span
                onClick={toggleCountryName.bind(this, "l")}
                className={styles["menu-item"]}
              >
                Replace L with index{" "}
                {countryName === "l" && (
                  <CheckIcon className={styles["check-icon"]} />
                )}
              </span>
              <span
                onClick={toggleCountryName.bind(this, "")}
                className={styles["menu-item"]}
              >
                Origin{" "}
                {!countryName && <CheckIcon className={styles["check-icon"]} />}
              </span>
              <span
                onClick={() => {
                  !houseView && getClear();
                }}
                className={styles["menu-item"]}
              >
                Clear all elements
              </span>
            </div>
          </div>
        </div>
        <RightInner />
      </div>
    </div>
  );
});
