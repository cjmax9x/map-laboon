import { useEffect, useRef, useState } from "react";
import styles from "../../../../styles/map/Map.module.scss";
import {
  defaulFunction,
  defaultPerson,
  defaultFunctionPerson,
} from "../marker/Marker";
export const PopulateModal = ({ modal, SetModal }) => {
  const defaultRef = useRef({
    defaulFunction:defaulFunction[0],
    defaultPerson:defaultPerson[0],
    defaultFunctionPerson:defaultFunctionPerson[0]
  });
  const [defaultValue, setDefaultValue] = useState(
    defaultRef.current.defaulFunction
  );
  let population;

  let selectionValue;

  if (modal.code === "us") population = "330 Million";
  else if (modal.code === "vn") population = "98 Million";
  else if (modal.code === "gbr") population = "67 Million";
  else if (modal.code === "bel") population = "11 Million";
  else if (modal.code === "bol") population = "1.6 Thousand";

  const handlePopulateFnModal = () => {
      defaulFunction[0] = defaultRef.current.defaulFunction;
      defaultPerson[0] = defaultRef.current.defaultPerson
      defaultFunctionPerson[0] = defaultRef.current.defaultFunctionPerson
    SetModal("");
  };

  const handleInputOnchange = (e) => {
    setDefaultValue([e.target.value]);
    if (selectionValue.value === "function")
      defaultRef.current.defaulFunction = e.target.value;
    else if (selectionValue.value === "person")
      defaultRef.current.defaultPerson = e.target.value;
    else if (selectionValue.value === "function-person")
      defaultRef.current.defaultFunctionPerson = e.target.value;
  };

  const handleChange = () => {
    if (selectionValue.value === "function")
      setDefaultValue(defaultRef.current.defaulFunction);
    else if (selectionValue.value === "person")
      setDefaultValue(defaultRef.current.defaultPerson);
    else if (selectionValue.value === "function-person")
      setDefaultValue(defaultRef.current.defaultFunctionPerson);
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
            Population: {population}
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
            <div style={{ width: 166, textAlign: "left" }}>
              <input
                type="number"
                min={0}
                className={styles["input-infor"]}
                value={defaultValue}
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
