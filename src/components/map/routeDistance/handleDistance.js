//-------------------------------------
export function dragStartHandlerLine(e) {
  const polyline = e.target.parentLine;
  const polyArc = e.target.parentArc;
  if (polyline.options.color === "transparent") {
    // arc route
    const latlngMarker = this.getLatLng();
    const latlngPolyArc = polyArc.getLatLngs();
    for (let i = 0; i < latlngPolyArc.length; i++) {
      if (
        Array.isArray(latlngPolyArc[i]) &&
        latlngMarker.equals(latlngPolyArc[i])
      ) {
        this.polyArcLatlng = i;
      }
    }
    const latlngPolyLine = polyline.getLatLngs();
    for (let i = 0; i < latlngPolyLine.length; i++) {
      if (latlngMarker.equals(latlngPolyLine[i])) {
        this.polylineLatlng = i;
      }
    }
  } else {
    // inter route
    const latlngPoly = polyline.getLatLngs(),
      latlngMarker = this.getLatLng();
    for (let i = 0; i < latlngPoly.length; i++) {
      if (latlngMarker.equals(latlngPoly[i])) {
        this.polylineLatlng = i;
      }
    }
  }
}

//-------------------------------------
export function dragHandlerLine(e) {
  const polyline = e.target.parentLine;
  const polyArc = e.target.parentArc;
  const thetaOffset = 3.14 / 9;
  const thetaOffsetRev = 3.14 / -9;
  const latLng = polyline.getLatLngs();
  let thetaOffsetData;

  if (polyline.options.color === "transparent") {
    // arc route
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
    //---------------------------------------

    const latlngPolyLine = polyline.getLatLngs();

    latlngPolyLine.splice(e.target.polylineLatlng, 1, latlngMarker);

    polyline.setLatLngs(latlngPolyLine);

    if (latLng[1].lng < latLng[0].lng) {
      const text = e.target.parentLine._text;
      e.target.parentLine.setText(null);
      e.target.parentLine.setText(text, {
        center: true,
        offset: -3,
        orientation: 180,
      });
      if (e.target.parentLine._text !== "Distance") {
        e.target.parentLine.setText(null);
        const distance = this.distance(
          L.latLng(latLng[0].lat, latLng[0].lng),
          L.latLng(latLng[1].lat, latLng[1].lng)
        );
        e.target.parentLine.setText(null);
        e.target.parentLine.setText(`${(distance * 0.001).toFixed()} km`, {
          center: true,
          offset: -3,
          orientation: 180,
        });
      }
    } else {
      const text = e.target.parentLine._text;
      e.target.parentLine.setText(null);
      e.target.parentLine.setText(text, {
        center: true,
        offset: -3,
      });
      if (e.target.parentLine._text !== "Distance") {
        e.target.parentLine.setText(null);
        const distance = this.distance(
          L.latLng(latLng[0].lat, latLng[0].lng),
          L.latLng(latLng[1].lat, latLng[1].lng)
        );
        e.target.parentLine.setText(null);
        e.target.parentLine.setText(`${(distance * 0.001).toFixed()} km`, {
          center: true,
          offset: -3,
        });
      }
    }
  } else {
    // inter route

    const latlngPoly = e.target.parentLine.getLatLngs(),
      latlngMarker = e.target.getLatLng();
    latlngPoly.splice(e.target.polylineLatlng, 1, latlngMarker);
    polyline.setLatLngs(latlngPoly);
    const latLng = e.target.parentLine.getLatLngs();
    if (latLng[1].lng < latLng[0].lng) {
      const text = e.target.parentLine._text;
      e.target.parentLine.setText(null);
      e.target.parentLine.setText(text, {
        center: true,
        offset: -3,
        orientation: 180,
      });
      if (e.target.parentLine._text !== "Distance") {
        e.target.parentLine.setText(null);
        const distance = this.distance(
          L.latLng(latLng[0].lat, latLng[0].lng),
          L.latLng(latLng[1].lat, latLng[1].lng)
        );
        e.target.parentLine.setText(null);
        e.target.parentLine.setText(`${(distance * 0.001).toFixed()} km`, {
          center: true,
          offset: -3,
          orientation: 180,
        });
      }
    } else {
      const text = e.target.parentLine._text;
      e.target.parentLine.setText(null);
      e.target.parentLine.setText(text, {
        center: true,
        offset: -3,
      });
      if (e.target.parentLine._text !== "Distance") {
        e.target.parentLine.setText(null);
        const distance = this.distance(
          L.latLng(latLng[0].lat, latLng[0].lng),
          L.latLng(latLng[1].lat, latLng[1].lng)
        );
        e.target.parentLine.setText(null);
        e.target.parentLine.setText(`${(distance * 0.001).toFixed()} km`, {
          center: true,
          offset: -3,
        });
      }
    }
  }
}
//------------------------
export function dragEndHandler(e) {
  delete this.polylineLatlng;
  delete this.polyArcLatlng;
}
