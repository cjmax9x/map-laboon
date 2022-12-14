import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const GridLayerCustom = L.GridLayer.extend({
  createTile: function () {
    var tile = L.DomUtil.create("canvas", "leaflet-tile");
    this.options = {
      tileSize: 64,
      pane: "tilePane",
      opacity: 0.6,
      zIndex: 10,
    };
    tile.style.border = "1px solid #DDDDDD";
    return tile;
  },
});
export const Grid = new GridLayerCustom();

export default function GridLayer({ grid }: { grid: boolean }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ lat: 20, lng: 20 }, map.getZoom());
  }, []);

  useEffect(() => {
    if (grid) {
      map.addLayer(Grid);
    } else {
      map.removeLayer(Grid);
    }
  }, [grid]);

  return null;
}
