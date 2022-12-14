import { observer } from "mobx-react";
import { DefaultLayout } from "../layout/defaultLayout/DefaultLayout";
import Home from "../layout/pageComponent/Home";

const HomePage = (): React.ReactElement => {
  return <DefaultLayout>{Home}</DefaultLayout>;
};

export default observer(HomePage);
