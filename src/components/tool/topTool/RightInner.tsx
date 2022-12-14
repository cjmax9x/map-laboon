import styles from "../../../../styles/tool/Toptool.module.scss";
import HeadlessTippy from "@tippyjs/react/headless";
import { SearchIcon, SwitchIcon } from "../../icon/Icon";
import { STORES } from "../../store/GlobalStore";
import { observer } from "mobx-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Pallet } from "../../pallet/Pallet";
import { GeoJsonType } from "../../map/countries/GeoJson";

const totalList: GeoJsonType[] = Object.values(GeoJsonType);

export const RightInner = observer((): React.ReactElement => {
  const [searchValue, setSearchValue] = useState<GeoJsonType[]>(totalList);

  const [hideSearch, setHideSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [defaultCode, setDefaultCode] = useState<boolean>(false);

  const {
    code,
    grid,
    country: map,
    switchGrid: setGrid,
    switchCountry: setMap,
    changeCode,
  } = STORES;

  const handleOnChange = (code: string) => {
    setSearchValue(totalList);

    totalList.forEach((item) => {
      if (item === code) {
        setSearchValue([code]);
      }
    });
  };

  useEffect(() => {
    const code = localStorage.getItem("dfLocation");
    if (code) {
      changeCode(code as GeoJsonType);
      setMap();
    }
  }, []);

  return (
    <div className={styles["right-inner"]}>
      {!map && (
        <HeadlessTippy
          interactive
          onClickOutside={() => {
            setSearchValue(totalList);
            setHideSearch(false);
          }}
          visible={hideSearch}
          placement="bottom"
          render={(attrs) => (
            <div
              className={styles["input-search"]}
              {...attrs}
            >
              {searchValue.map((value, index) => {
                return (
                  <span
                    onClick={() => {
                      setSearchValue(totalList);
                      setHideSearch(false);
                      changeCode(value);
                    }}
                    key={index}
                    className={styles["search-result"]}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
          )}
        >
          <div className={styles["input-wrapper"]}>
            <input
              ref={inputRef}
              onFocus={setHideSearch.bind(this, true)}
              onChange={(e) => {
                inputRef.current?.value &&
                  handleOnChange(inputRef.current?.value);
              }}
              placeholder="Search"
              className={styles["input"]}
            />
            <SearchIcon className={styles["search-icon"]} />
          </div>
        </HeadlessTippy>
      )}
      <div style={{ textAlign: "center" }}>
        <SwitchIcon
          state={{ map, setMap }}
          title={{ on: "WORLD", off: "Country" }}
          className={styles["switch"]}
        />
        <div style={{ cursor: "pointer", fontSize: "15px" }}>Mode 1</div>
      </div>
      <div>
        <div style={{ marginRight: "16px", textAlign: "center" }}>
          <SwitchIcon
            state={{ grid, setGrid }}
            title={{ on: "On Grid", off: "Off Grid" }}
            className={styles["switch"]}
          />
          <div style={{ cursor: "pointer", fontSize: "15px" }}>Mode 2</div>
        </div>
      </div>

      <div className={styles["menu-wrapper-user"]}>
        <div className={styles["menu-list-user"]}>
          <Image
            style={{ cursor: "pointer" }}
            alt="user-error"
            src={"/user.jpg"}
            width={50}
            height={50}
          />
          <h3 className={styles["title-user"]}>Pham Mai Huong</h3>
          <div className={styles["profile-line"]}>
            <span className={styles["profile-title"]}>Title:</span>
            <span className={styles["profile-properties"]}>Lorem Ipsum</span>
          </div>
          <div className={styles["profile-line"]}>
            <span className={styles["profile-title"]}>Function:</span>
            <span className={styles["profile-properties"]}>Lorem Ipsum</span>
          </div>
          <div className={styles["profile-line"]}>
            <span className={styles["profile-title"]}>Default location:</span>
            <span
              onClick={setDefaultCode.bind(this, !defaultCode)}
              className={styles["profile-properties-1"]}
            >
              {code}
            </span>
            {defaultCode && (
              <div className={styles["profile-line-children"]}>
                {searchValue.map((value, index) => {
                  return (
                    <span
                      onClick={() => {
                        changeCode(value);
                        localStorage.setItem("dfLocation", value);
                        setDefaultCode(false);
                      }}
                      key={index}
                      className={styles["search-result"]}
                    >
                      {value}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Image
          style={{ cursor: "pointer" }}
          alt="user-error"
          src={"/user.jpg"}
          width={30}
          height={30}
        />
      </div>
      <Pallet />
    </div>
  );
});
