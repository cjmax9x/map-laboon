import { useEffect, useState } from "react";
import styles from "../../../../styles/map/Map.module.scss";
import {
  defaulFunction,
  defaultPerson,
  defaultFunctionPerson,
} from "../marker/Marker";
export const PopulateModal = ({ modal, SetModal }) => {
  const [defaultValue, setDefaultValue] = useState(defaulFunction);

  let inputValue;
  let selectionValue;

  const handlePopulateFnModal = () => {
    inputValue.value > 0 &&
      window.handlePopulateFn(selectionValue.value, inputValue.value);
    SetModal("");
  };

  const handleInputOnchange = (e) => {
    setDefaultValue([e.target.value]);
    if (selectionValue.value === "function") defaulFunction[0] = e.target.value 
    else if (selectionValue.value === "person") defaultPerson[0] = e.target.value 
    else if (selectionValue.value === "function-person")
    defaultFunctionPerson[0] = e.target.value 
  };

  const handleChange = () => {
    if (selectionValue.value === "function") setDefaultValue(defaulFunction);
    else if (selectionValue.value === "person") setDefaultValue(defaultPerson);
    else if (selectionValue.value === "function-person")
      setDefaultValue(defaultFunctionPerson);
  };
  return (
    <div className={styles["container"]}>
      <div
        style={{
          textAlign: "center",
          paddingTop: 20,
          paddingBottom: 20,
          borderRadius: 6,
          width: 400,
          minHeight: 150,
          backgroundColor: "#ddd",
        }}
      >
        <h3 style={{ marginBottom: 6, fontSize: 22 }}>Property Dialog</h3>

        <div className={styles["box-wrapper"]}>
          <h4 style={{ paddingLeft: 20 }} className={styles["infor"]}>
            Country: {modal.code.toUpperCase()}
          </h4>
          <h4
            style={{ marginBottom: 10, paddingLeft: 20 }}
            className={styles["infor"]}
          >
            Population: 330 Million
          </h4>
          <div className={styles["infor-selection"]}>
            <span className={styles["selection-title"]}>Display options:</span>
            <select
              ref={(e) => {
                selectionValue = e;
              }}
              onChange={handleChange}
              className={styles["selection"]}
              defaultValue="function"
            >
              <option value="function">Populate function</option>
              <option value="person">Polpulate person</option>
              <option value="function-person">
                Populate function & person
              </option>
            </select>
          </div>
          <div className={styles["infor-selection"]}>
            <span className={styles["infor"]}>Population Default Value:</span>
            <div style={{ width: 166 }}>
              <input
                type="number"
                ref={(e) => {
                  inputValue = e;
                }}
                min={0}
                className={styles["input-infor"]}
                value={defaultValue[0]}
                onChange={handleInputOnchange}
              />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={handlePopulateFnModal}
              className={styles["button"]}
            >
              OK
            </button>
            <button
              onClick={SetModal.bind(this, "")}
              className={styles["button"]}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
