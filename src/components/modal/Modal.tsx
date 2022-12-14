import { Dispatch, SetStateAction } from "react";
import styles from "../../../styles/modal/Modal.module.scss";
import { Simulation } from "./Simulation";
export interface Props {
  onClick?: Dispatch<SetStateAction<boolean>>;
}
export const Modal = ({ onClick }: Props): React.ReactElement => {
  return (
    <div className={styles["container"]}>
      <Simulation onClick={onClick} />
    </div>
  );
};
