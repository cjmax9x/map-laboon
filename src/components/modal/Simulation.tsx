import styles from "../../../styles/modal/Modal.module.scss";
import { CloseIcon, SimulationSettingIcon } from "../icon/Icon";

import { Props } from "./Modal";
import Selection from "./simulation/Selection";
import { useRef, useState, useEffect, useCallback } from "react";
import { Props as PropsState } from "../modal/simulation/Selection";

export const Simulation = ({ onClick }: Props): React.ReactElement => {
  const prevData = useRef<{ value: string[] }[] | undefined>();
  const currentData = useRef<{ value: string[] }[] | undefined>();

  const [button, setButton] = useState<boolean>(false);

  const [data] = useState<{
    genrenal: PropsState[];
    signalTravel: PropsState[];
  }>({
    genrenal: [
      {
        title: "Flash Time (milliseconds)",
        value: ["2000"],
        options: ["1000", "2000", "3000"],
      },
      {
        title: "Fill Time (milliseconds)",
        value: ["1000"],
        options: ["1000", "2000", "3000", "4000"],
      },
      {
        title: "List Shape",
        value: ["Yes"],
        options: ["Yes", "No"],
      },
      {
        title: "Signal Types",
        value: ["Green"],
        options: ["Green", "Red"],
      },
      {
        title: "Check Error for",
        value: ["Person"],
        options: ["Person", "Group"],
      },
      {
        title: "Person & Comm Holder Flash",
        value: ["Signal Type"],
        options: ["Signal Type", "No Signal Type"],
      },
      {
        title: "Allow all shapes to blink",
        value: ["Yes"],
        options: ["Yes", "No"],
      },
      {
        title: "Allow signals go to Comm & App Mix together",
        value: ["Yes"],
        options: ["Yes", "No"],
      },
      {
        title: "Allow signals goto Comm Mix together",
        value: ["Yes"],
        options: ["Yes", "No"],
      },
    ],
    signalTravel: [
      { title: "Types", value: ["Online"], options: ["Online", "Offline"] },
      {
        title: "Token Travel Time (milliseconds)",
        value: ["5000"],
        options: ["5000", "2000", "3000", "4000"],
      },
      {
        title: "Show Signal on Receiving",
        value: ["Yes"],
        options: ["Yes", "No"],
      },
    ],
  });

  useEffect(() => {
    const prevGenrenal = data.genrenal.map((item) => {
      return {
        value: [...item.value],
      };
    });
    const prevSignalTravel = data.signalTravel.map((item) => {
      return {
        value: [...item.value],
      };
    });
    prevData.current = [...prevGenrenal, ...prevSignalTravel];

    const currentGenrenal = data.genrenal.map((item) => {
      return {
        value: item.value,
      };
    });
    const currentSignalTravel = data.signalTravel.map((item) => {
      return {
        value: item.value,
      };
    });
    currentData.current = [...currentGenrenal, ...currentSignalTravel];
  }, []);

  const handleOnChange = useCallback(
    (
      currentData: { value: string[] }[] | undefined,
      prevData: { value: string[] }[] | undefined
    ) => {
      for (let i in prevData) {
        if (
          currentData &&
          prevData[Number(i)].value[0] !== currentData[Number(i)].value[0]
        ) {
          setButton(true);
          break;
        } else {
          setButton(false);
        }
      }
    },
    []
  );

  const handleChange = useCallback(() => {
    handleOnChange(currentData.current, prevData.current);
  }, []);

  const handleUpdate = (
    currentData: { value: string[] }[] | undefined,
    prevData: { value: string[] }[] | undefined
  ) => {
    for (let i in prevData) {
      if (
        currentData &&
        prevData[Number(i)].value[0] !== currentData[Number(i)].value[0]
      ) {
        console.log("call-api");
        console.log(data.genrenal, data.signalTravel);
        onClick && onClick(false);
        break;
      }
    }
  };

  return (
    <div className={styles["simulation"]}>
      <h3 className={styles["simulation-title"]}>Simulation Setting</h3>
      <CloseIcon
        onClick={onClick}
        className={styles["close-icon"]}
      />
      <div className={styles["simulation-table"]}>
        <div className={styles["table-header"]}>
          <SimulationSettingIcon />
          <span className={styles["table-title"]}>Setting Parameters</span>
        </div>
        <div className={styles["wrapper-table"]}>
          <div className={styles["table-main"]}>
            <h3 className={styles["main-title"]}>General</h3>
            {data.genrenal.map((item, index) => (
              <Selection
                handleChange={handleChange}
                key={index}
                title={item.title}
                options={item.options}
                value={item.value}
              />
            ))}
          </div>
          <div
            style={{
              borderBottomWidth: 0,
            }}
            className={styles["table-main"]}
          >
            <h3 className={styles["main-title"]}>Signal Travel</h3>
            {data.signalTravel.map((item, index) => (
              <Selection
                handleChange={handleChange}
                key={index}
                title={item.title}
                options={item.options}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles["wrapper-button"]}>
        <button
          onClick={() => {
            handleUpdate(currentData.current, prevData.current);
          }}
          className={[
            styles["simulation-botton"],
            button ? styles["button-selection"] : styles["button-confirm"],
          ].join(" ")}
        >
          OK
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={onClick?.bind(this, false)}
          className={[
            styles["simulation-botton"],
            styles["button-cancel"],
          ].join(" ")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
