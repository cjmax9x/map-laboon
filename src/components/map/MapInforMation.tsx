import { DotIcon } from "../icon/Icon";
import styles from "../../../styles/home/Home.module.scss";
import { STORES } from "../store/GlobalStore";
import { observer } from "mobx-react";
export const MapInforMation = observer(() => {
  const { position } = STORES;
  return (
    <div
      style={
        position === "left"
          ? {
              top: "70%",
              left: 0,
              right: "unset",
            }
          : position === "right"
          ? { top: "70%", left: "unset", right: 0 }
          : position === "top"
          ? {
              paddingLeft: 60,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              top: 0,
              height: 100,
              bottom: "unset",
            }
          : {
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              bottom: 0,
              height: 100,
              top: "unset",
            }
      }
      className={styles["map-information"]}
    >
      <div>
        <h4>
          <DotIcon />
          Personal Responsibility
        </h4>
        <h4>
          <DotIcon />
          Self - Contribution
        </h4>
      </div>
      <div>
        <h4>
          <DotIcon />
          Averaging
        </h4>
        <h4>
          <DotIcon />
          Feedback
        </h4>
      </div>
      <div>
        <h4>
          <DotIcon />
          Correction
        </h4>
        <h4>
          <DotIcon />
          Function Boudary
        </h4>
      </div>
    </div>
  );
});
