import { useEffect } from "react";
import styles from "../../../../styles/map/Map.module.scss";

const handleCutName = (name) => {
  if (name.length > 12) {
    return name.slice(0, 12) + "...";
  } else {
    return name;
  }
};

export const Modal = ({ SetModal }) => {
  let inputValue;

  const handleChangeName = () => {
    if (inputValue.value.trim()) {
      edittingItem(false, handleCutName(inputValue.value));
      SetModal(false);
    }
  };

  useEffect(() => {
    inputValue.focus();
  }, []);

  return (
    <div className={styles["container"]}>
      <div
        style={{
          textAlign: "center",
          paddingTop: 20,
          borderRadius: 6,
          width: 300,
          height: 150,
          backgroundColor: "#ddd",
        }}
      >
        <h3 style={{ marginBottom: 6 }}>Your new name</h3>
        <input
          onKeyUp={(e) => {
            e.key === "Enter" && handleChangeName();
          }}
          ref={(e) => {
            inputValue = e;
          }}
          className={styles["input"]}
        />
        <div style={{ marginTop: 10 }}>
          <button
            onClick={handleChangeName}
            className={styles["button"]}
          >
            OK
          </button>
          <button
            onClick={SetModal.bind(this, false)}
            className={styles["button"]}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
