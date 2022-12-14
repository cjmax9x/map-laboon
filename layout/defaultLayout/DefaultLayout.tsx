import React from "react";
import styles from "../../styles/layout/DefaultLayout.module.scss";

interface Props {
  children: () => React.ReactElement;
}

export const DefaultLayout = ({ children }: Props): React.ReactElement => {
  const Children = children;
  return (
    <div className={styles["container"]}>
      <Children />
    </div>
  );
};
