import styles from "../../styles/home/Home.module.scss";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Map from "../../src/components/map/Map";
import { RearTool } from "../../src/components/tool/RearTool";
import { TopTool } from "../../src/components/tool/TopTool";
import { STORES } from "../../src/components/store/GlobalStore";
import { MapInforMation } from "../../src/components/map/MapInforMation";

const Home = (): React.ReactElement => {
  // const Router = useRouter();

  // const { user } = STORES;

  // useEffect(() => {
  //   !user && Router.push("/login");
  // }, [user]);

  // if (!user) return <div></div>;

  return (
    <div className={styles["container"]}>
      <TopTool />
      <div className={styles["content"]}>
        <div className={styles["side-bar"]}>
          <RearTool />
        </div>
        <div className={styles["map"]}>
          <Map />
          <MapInforMation />
        </div>
      </div>
    </div>
  );
};

export default observer(Home);

