import us from "../countries/geoJson/USA.geo.json";
import vn from "../countries/geoJson/VNM.geo.json";
import gbr from "../countries/geoJson/GBR.geo.json";
import bel from "../countries/geoJson/BEL.geo.json";
import bol from "../countries/geoJson/BOL.geo.json";
import { GeoJSONObject } from "@turf/helpers";

export enum GeoJsonType {
  us = "us",
  vn = "vn",
  gbr = "gbr",
  bel = "bel",
  bol = "bol",
}

export let GeoJson: { [key in GeoJsonType]: GeoJSONObject } = {
  us,
  vn,
  gbr,
  bel,
  bol,
};
