import { memo } from "react";
import styles from "../../../../styles/modal/Modal.module.scss";
export interface Props {
  title: string;
  options: string[];
  value: string[];
  handleChange?: () => void;
}
const Selection = ({ title, options, value, handleChange }: Props) => {
  return (
    <div className={styles["input-wrapper"]}>
      <span className={styles["input-title"]}>{title}</span>
      <select
        defaultValue={value[0]}
        onChange={(e) => {
          value[0] = e.target.value;
          handleChange && handleChange();
        }}
        className={styles["input-selection"]}
      >
        {options.map((option, index) => {
          return (
            <option
              key={index}
              className={styles["input-selector"]}
              value={`${option}`}
            >
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default memo(Selection);
