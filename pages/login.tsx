import Image from "next/image";
import styles from "../styles/author/Login.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import { User, STORES } from "../src/components/store/GlobalStore";

const Login = (): React.ReactElement => {
  const [author] = useState<User>({ username: "", password: "" });
  const { getUser } = STORES;
  const Router = useRouter();

  return (
    <div
      id="form-1"
      className={styles["container"]}
    >
      <div className={styles["title"]}>Laboon Map</div>
      <button
        type="button"
        className={styles["socail-button"]}
      >
        <span className={styles["socail-icon"]}>
          <Image
            className={styles["socail-icon"]}
            alt="google"
            src="/Group_43.svg"
            height={30}
            width={30}
          />
        </span>
        Login with Google
      </button>
      <button
        type="button"
        style={{
          backgroundColor: " #3284F4",
          color: "#fff",
          marginBottom: "30px",
        }}
        className={styles["socail-button"]}
      >
        <span className={styles["socail-icon"]}>
          <Image
            alt="facebook"
            src="/Group_42.svg"
            height={30}
            width={30}
          />
        </span>
        Login with Facebook
      </button>
      <div className={styles["separations"]}>
        <span className={styles["separation"]}></span>
        <span className={styles["separations-text"]}>or</span>
        <span className={styles["separation"]}></span>
      </div>
      <label className={styles["label"]}>Username:</label>
      <div className="form__name">
        <input
          id="email"
          className={styles["input"]}
          placeholder="Enter user name"
          type="email"
          name="email"
          onChange={(e) => {
            author.username = e.target.value;
          }}
        />
        <span className="form-message"></span>
      </div>

      <label className={styles["label"]}>Password:</label>
      <div className="form__name">
        <input
          name="password"
          id="password"
          type="password"
          className={styles["input"]}
          placeholder="Enter password"
          onKeyUp={(e) => {
            if (
              e.key === "Enter" &&
              author.username === "worldmap" &&
              author.password === "laboon"
            ) {
              getUser(author);
              Router.push("/");
            }
          }}
          onChange={(e) => {
            author.password = e.target.value;
          }}
        />
        <span className="form-message"></span>
      </div>
      <div className={styles["login-button-wrapper"]}>
        <h4 className={styles["error-login"]}>
          Just for private only, not security & not save your infor
        </h4>
        <button
          onClick={() => {
            if (
              author.username === "worldmap" &&
              author.password === "laboon"
            ) {
              getUser(author);
              Router.push("/");
            }
          }}
          id="submit"
          type="button"
          className={styles["login-button"]}
        >
          {/* <LoadingIcon className={styles["login-icon"]} />
          <WarningIcon className={styles["login-icon"]} /> */}
          Login
        </button>
      </div>
      <div className={styles["suggestion"]}>
        <a className={styles["link"]}>Register</a> or{" "}
        <a className={styles["link"]}>Forgot your password</a>
      </div>
    </div>
  );
};
export default Login;
