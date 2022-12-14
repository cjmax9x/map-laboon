import { useEffect } from "react";
import styles from "../../../../styles/map/Map.module.scss";

export const PopulateModal = ({ modal, SetModal }) => {
  let inputValue;
  let selectionValue;
const handlePopulateFnModal =() => {
  inputValue.value > 0 && window.handlePopulateFn(selectionValue.value,inputValue.value)
  SetModal('')
}
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
        <h3 style={{ marginBottom: 6,fontSize:22 }}>Property Dialog</h3>

        <div className={styles['box-wrapper']}>
          <h4 className={styles["infor"]}>Country: {modal.code.toUpperCase()}</h4>
          <h4 style={{marginBottom:10}} className={styles["infor"]}>Population: 100Million</h4>
          <div className={styles['infor-selection']}>
            <span className={styles["selection-title"]}>Display options:</span>
            <select ref={(e) => {
            selectionValue = e;
          }} className={styles["selection"]} defaultValue="function">
              <option value="function">Populate function</option>
              <option value="person">Polpulate person</option>
              <option value="function-person">Populate function & person</option>
            </select>
          </div>
          <div className={styles['infor-selection']}>
            <span className={styles["infor"]}>Population Default Value:</span>
            <input type="number" ref={(e) => {
            inputValue = e;
          }} className={styles['input-infor']} defaultValue='20'/>
          </div>
          <div style={{ marginTop: 10 }}>
            <button onClick={handlePopulateFnModal} className={styles["button"]}>OK</button>
            <button onClick={SetModal.bind(this,'')} className={styles["button"]}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
