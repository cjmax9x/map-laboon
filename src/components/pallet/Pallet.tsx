import { observer } from "mobx-react";
import styles from "../../../styles/tool/Toptool.module.scss";
import {
  AIcon,
  EllipseIcon,
  ExtenderIcon,
  LineIcon,
  PlalletIcon,
  PlalletIcon2,
  PlalletIcon3,
  PlalletIcon4,
  PointerIcon,
  RectanglePlallet,
} from "../icon/Icon";
import { STORES } from "../store/GlobalStore";
export const Pallet = observer((): React.ReactElement => {
  const { position } = STORES;
  return (
    <div
      style={position === "top" ? { top: 170 } : {}}
      className={styles["pallet"]}
    >
      <div className={styles["wrapper-icon"]}>
        <PointerIcon />
        <h4 className={styles["title-icon"]}>Pointer</h4>
      </div>
      <div className={styles["wrapper-icon"]}>
        <AIcon />
        <h4 className={styles["title-icon"]}>Text</h4>
      </div>
      <div className={styles["wrapper-icon"]}>
        <ExtenderIcon className={styles["extender-icon"]} />
        <LineIcon />
        <h4 className={styles["title-icon"]}>Line</h4>

        <div className={styles["pallet-1"]}>
          <div className={styles["wrapper-icon"]}>
            <LineIcon />
          </div>
          <div className={styles["wrapper-icon"]}>
            <PlalletIcon />
          </div>
          <div className={styles["wrapper-icon"]}>
            <PlalletIcon2 />
          </div>
          <div className={styles["wrapper-icon"]}>
            <PlalletIcon3 />
          </div>
          <div className={styles["wrapper-icon"]}>
            <PlalletIcon4 />
          </div>
        </div>
      </div>
      <div className={styles["wrapper-icon"]}>
        <RectanglePlallet />
        <h4 className={styles["title-icon"]}>Rectangle</h4>
      </div>
      <div className={styles["wrapper-icon"]}>
        <EllipseIcon />
        <h4 className={styles["title-icon"]}>Ellipse</h4>
      </div>
    </div>
  );
});
