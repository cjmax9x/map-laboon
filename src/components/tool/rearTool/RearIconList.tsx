import Tippy from "@tippyjs/react";
import { observer } from "mobx-react";
import styles from "../../../../styles/tool/RearTool.module.scss";
import { STORES } from "../../store/GlobalStore";

export interface IconProps {
  width?: boolean;
  Icon: {
    value: string;
    Icon: ({ className }: { className?: string }) => React.ReactElement;
    name: string;
    ability?: boolean;
  };
}

export const RearIconList = observer(({ width, Icon }: IconProps) => {
  const { click, addIcon, addIconHandle } = STORES;
  return (
    <>
      {!width && (
        <Tippy
          placement="right"
          interactive
          content={Icon.name}
        >
          <div
            draggable={!click}
            onClick={() => {
              click && addIconHandle(Icon.value);
            }}
            onDragStart={() => {
              !click && addIconHandle(Icon.value);
            }}
            style={addIcon === Icon.value ? { backgroundColor: "#d1d1d1" } : {}}
            className={[
              styles["item-tool"],
              !Icon.ability ? styles.ability : "",
            ].join(" ")}
          >
            <div>
              <Icon.Icon className={styles["icon-color "]} />
            </div>
          </div>
        </Tippy>
      )}

      {width && (
        <div
          draggable={!click}
          onClick={() => {
            click && addIconHandle(Icon.value);
          }}
          onDragStart={() => {
            !click && addIconHandle(Icon.value);
          }}
          style={addIcon === Icon.value ? { backgroundColor: "#d1d1d1" } : {}}
          className={[
            styles["item-tool"],
            !Icon.ability ? styles.ability : "",
          ].join(" ")}
        >
          <div>
            <Icon.Icon className={styles["icon-color "]} />
          </div>
          <h3 className={styles["title-tool"]}>{Icon.name}</h3>
        </div>
      )}
    </>
  );
});
