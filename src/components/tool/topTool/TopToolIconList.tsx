import Tippy from "@tippyjs/react";
import { observer } from "mobx-react";
import styles from "../../../../styles/tool/Toptool.module.scss";
import { STORES, house } from "../../store/GlobalStore";
import { IconProps } from "../rearTool/RearIconList";

export const TopToolIconList = observer(({ Icon }: IconProps) => {
  const { houseView, toggleHouseView } = STORES;
  return (
    <span
      style={
        Icon.name === "House View" && houseView !== ""
          ? { backgroundColor: "#ddd" }
          : {}
      }
    >
      <Tippy
        placement="bottom"
        interactive
        content={Icon.name}
      >
        <span
          onClick={() => {
            Icon.name === "House View" && toggleHouseView("house-name");
          }}
          className={styles["top-tool-icon"]}
        >
          <Icon.Icon />
        </span>
      </Tippy>
    </span>
  );
});
