import { makeAutoObservable } from "mobx";
import { GeoJsonType } from "../map/countries/GeoJson";
export interface User {
  username: string;
  password: string;
}
export const house = [];
class STORE {
  user: User | undefined;
  grid: boolean = true;
  country: boolean = true;
  mainLand: boolean = false;
  code = GeoJsonType.us;
  position: string = "right";
  addIcon: string = "";
  click: boolean = true;
  lock: boolean = true;
  houseView: string = "";
  constructor() {
    makeAutoObservable(this);
  }

  getUser = (user: User) => {
    this.user = user;
  };

  switchGrid = () => {
    this.grid = !this.grid;
  };

  switchCountry = () => {
    this.country = !this.country;
    this.addIcon = "";
  };

  switchMainLand = (boolean: boolean) => {
    if (!this.country) this.mainLand = boolean;
  };

  changeCode = (code: GeoJsonType) => {
    if (GeoJsonType.hasOwnProperty(code)) this.code = code;
  };

  changePosition = (position: string) => {
    this.position = position;
  };

  addIconHandle = (value: string) => {
    if (value === this.addIcon) {
      this.addIcon = "";
      return;
    }
    this.addIcon = value;
  };
  toggleClick = () => {
    this.click = !this.click;
    this.addIcon = "";
  };
  toggleLock = () => {
    this.lock = !this.lock;
  };
  toggleHouseView = (value: string) => {
    if (value === this.houseView) {
      this.houseView = "";
      return;
    }
    this.houseView = value;
  };
}
export const STORES = new STORE();
