//-------------------------------------
export function dragStartHandlerLine(e) {
  // active when click
  this.eachLayer((layer) => {
    if (layer.options.type === "distance") {
      layer.parentLine.options.color === "blue" &&
        layer.parentLine.setStyle({ color: "black" });
      layer.parentArc.options.color === "blue" &&
        layer.parentArc.setStyle({ color: "black" });
    }
  });

  e.target.parentLine.options.color === "black" &&
    e.target.parentLine.setStyle({ color: "blue" });
  e.target.parentArc.options.color === "black" &&
    e.target.parentArc.setStyle({ color: "blue" });
  //------------------
  const polyline = e.target.parentLine;
  const polyline_1 = e.target.parentLine_1;
  const polyArc = e.target.parentArc;

  const latlngMarker = e.target.getLatLng();

  const latlngPolyArc = polyArc.getLatLngs();
  for (let i = 0; i < latlngPolyArc.length; i++) {
    if (
      Array.isArray(latlngPolyArc[i]) &&
      latlngMarker.equals(latlngPolyArc[i])
    ) {
      e.target.polyArcLatlng = i;
    }
  }

  const latlngPolyLine = polyline.getLatLngs();
  for (let i = 0; i < latlngPolyLine.length; i++) {
    if (latlngMarker.equals(latlngPolyLine[i])) {
      e.target.polylineLatlng = i;
    }
  }

  const latlngPolyLine_1 = polyline_1.getLatLngs();
  for (let i = 0; i < latlngPolyLine.length; i++) {
    if (latlngMarker.equals(latlngPolyLine_1[i])) {
      e.target.polylineLatlng_1 = i;
    }
  }
}

//-------------------------------------

export function dragHandlerLine(e) {
  let title = e.target.parentLine.setText.bind(e.target.parentLine);
  let text = e.target.parentLine._text;
  if (e.target.parentLine.options.color === "transparent") {
    title = e.target.parentArc.setText.bind(e.target.parentArc);
    text = e.target.parentArc._text;
  }
  // calcAngle
  const polyline = e.target.parentLine;
  const polyline_1 = e.target.parentLine_1;
  const polyArc = e.target.parentArc;
  const thetaOffset = 3.14 / 9;
  const thetaOffsetRev = 3.14 / -9;
  const latLng = polyline.getLatLngs();
  let thetaOffsetData;
  const latlngMarker = e.target.getLatLng();

  const latlngPolyArc = polyArc.getLatLngs();
  const latlng1 = latlngPolyArc[1],
    latlng2 = latlngPolyArc[4];

  const offsetX = latlng2[1] - latlng1[1],
    offsetY = latlng2[0] - latlng1[0];

  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
    theta = Math.atan2(offsetY, offsetX);
  if (latLng[1].lng < latLng[0].lng) {
    thetaOffsetData = thetaOffsetRev;
  } else {
    thetaOffsetData = thetaOffset;
  }

  const r2 = r / 2 / Math.cos(thetaOffsetData),
    theta2 = theta + thetaOffsetData;

  const midpointX = r2 * Math.cos(theta2) + latlng1[1],
    midpointY = r2 * Math.sin(theta2) + latlng1[0];

  const midpointLatLng = [midpointY, midpointX];

  latlngPolyArc.splice(e.target.polyArcLatlng, 1, [
    latlngMarker.lat,
    latlngMarker.lng,
  ]);

  latlngPolyArc.splice(3, 1, midpointLatLng);
  polyArc.setLatLngs(latlngPolyArc);

  // arc arrow rotate
  const point = polyArc.trace([0, 0.1, 0.9, 1]);
  if (e.target.parrentArcArrow && e.target.polyArcLatlng === 1) {
    e.target.parrentArcArrow.setLatLngs([
      [point[1].lat, point[1].lng],
      latlngMarker,
    ]);
    e.target.parrentArcArrow_1.setLatLngs([
      [point[2].lat, point[2].lng],
      [point[3].lat, point[3].lng],
    ]);
  } else if (e.target.parrentArcArrow_1 && e.target.polyArcLatlng === 4) {
    e.target.parrentArcArrow_1.setLatLngs([
      [point[2].lat, point[2].lng],
      latlngMarker,
    ]);
    e.target.parrentArcArrow.setLatLngs([
      [point[1].lat, point[1].lng],
      [point[0].lat, point[0].lng],
    ]);
  }
  //-----------------

  //---------------------------------------

  const latlngPolyLine = polyline.getLatLngs();
  const latlngPolyLine_1 = polyline_1.getLatLngs();
  latlngPolyLine.splice(e.target.polylineLatlng, 1, latlngMarker);
  latlngPolyLine_1.splice(e.target.polylineLatlng_1, 1, latlngMarker);

  polyline.setLatLngs(latlngPolyLine);
  polyline_1.setLatLngs(latlngPolyLine_1);

  if (latLng[1].lng < latLng[0].lng) {
    title(null);
    title(text, {
      center: true,
      offset: -3,
      orientation: 180,
    });
    if (text === "Inter-route" || text === "Arc-route") {
    } else {
      title(null);
      const distance = this.distance(
        L.latLng(latLng[0].lat, latLng[0].lng),
        L.latLng(latLng[1].lat, latLng[1].lng)
      );
      title(null);
      title(`${(distance * 0.001).toFixed()} km`, {
        center: true,
        offset: -3,
        orientation: 180,
      });
    }
  } else {
    title(null);
    title(text, {
      center: true,
      offset: -3,
    });
    if (text === "Inter-route" || text === "Arc-route") {
    } else {
      title(null);
      const distance = this.distance(
        L.latLng(latLng[0].lat, latLng[0].lng),
        L.latLng(latLng[1].lat, latLng[1].lng)
      );
      title(null);
      title(`${(distance * 0.001).toFixed()} km`, {
        center: true,
        offset: -3,
      });
    }
  }
}

export function dragHandlerLine_distance(e) {
  const polyline_1 = e.target.parentLine_1;

  let title = e.target.parentLine.setText.bind(e.target.parentLine);
  let text = e.target.parentLine._text;

  if (e.target.parentLine.options.color === "transparent") {
    title = e.target.parentArc.setText.bind(e.target.parentArc);
    text = e.target.parentArc._text;
  }

  const polyline = e.target.parentLine;
  const polyArc = e.target.parentArc;
  const thetaOffset = 3.14 / 9;
  const thetaOffsetRev = 3.14 / -9;
  const latLng = polyline.getLatLngs();
  let thetaOffsetData;

  const latlngMarker = e.target.getLatLng();

  const latlngPolyArc = polyArc.getLatLngs();

  const latlng1 = latlngPolyArc[1],
    latlng2 = latlngPolyArc[4];

  const offsetX = latlng2[1] - latlng1[1],
    offsetY = latlng2[0] - latlng1[0];

  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
    theta = Math.atan2(offsetY, offsetX);
  if (latLng[1].lng < latLng[0].lng) {
    thetaOffsetData = thetaOffsetRev;
  } else {
    thetaOffsetData = thetaOffset;
  }

  const r2 = r / 2 / Math.cos(thetaOffsetData),
    theta2 = theta + thetaOffsetData;

  const midpointX = r2 * Math.cos(theta2) + latlng1[1],
    midpointY = r2 * Math.sin(theta2) + latlng1[0];

  const midpointLatLng = [midpointY, midpointX];

  latlngPolyArc.splice(e.target.polyArcLatlng, 1, [
    latlngMarker.lat,
    latlngMarker.lng,
  ]);

  latlngPolyArc.splice(3, 1, midpointLatLng);
  polyArc.setLatLngs(latlngPolyArc);

  // arc arrow rotate
  const point = polyArc.trace([0, 0.1, 0.9, 1]);
  if (e.target.parrentArcArrow && e.target.polyArcLatlng === 1) {
    e.target.parrentArcArrow.setLatLngs([
      [point[1].lat, point[1].lng],
      latlngMarker,
    ]);
    e.target.parrentArcArrow_1.setLatLngs([
      [point[2].lat, point[2].lng],
      [point[3].lat, point[3].lng],
    ]);
  } else if (e.target.parrentArcArrow_1 && e.target.polyArcLatlng === 4) {
    e.target.parrentArcArrow_1.setLatLngs([
      [point[2].lat, point[2].lng],
      latlngMarker,
    ]);
    e.target.parrentArcArrow.setLatLngs([
      [point[1].lat, point[1].lng],
      [point[0].lat, point[0].lng],
    ]);
  }
  //-----------------

  //Polyline

  const latlngPolyLine = polyline.getLatLngs();
  const latlngPolyLine_1 = polyline_1.getLatLngs();
  latlngPolyLine.splice(e.target.polylineLatlng, 1, latlngMarker);
  latlngPolyLine_1.splice(e.target.polylineLatlng_1, 1, latlngMarker);

  polyline.setLatLngs(latlngPolyLine);
  polyline_1.setLatLngs(latlngPolyLine_1);

  if (latLng[1].lng < latLng[0].lng) {
    title(null);
    title(text, {
      center: true,
      offset: -3,
      orientation: 180,
    });
    if (text !== "Distance") {
      title(null);
      const distance = this.distance(
        L.latLng(latLng[0].lat, latLng[0].lng),
        L.latLng(latLng[1].lat, latLng[1].lng)
      );
      title(null);
      title(`${(distance * 0.001).toFixed()} km`, {
        center: true,
        offset: -3,
        orientation: 180,
      });
    }
  } else {
    title(null);
    title(text, {
      center: true,
      offset: -3,
    });
    if (text !== "Distance") {
      title(null);
      const distance = this.distance(
        L.latLng(latLng[0].lat, latLng[0].lng),
        L.latLng(latLng[1].lat, latLng[1].lng)
      );
      title(null);
      title(`${(distance * 0.001).toFixed()} km`, {
        center: true,
        offset: -3,
      });
    }
  }
}

//------------------------
export function dragEndHandler() {
  delete this.polylineLatlng;
  delete this.polylineLatlng_1;
  delete this.polyArcLatlng;
}
