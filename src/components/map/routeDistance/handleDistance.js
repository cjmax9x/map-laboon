//-------------------------------------
export function dragStartHandlerLine(e) {
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

  const polyline = e.target.parentLine;

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
    } else {
      e.target.polylineLatlng_y = i;
    }
  }
}

//-------------------------------------

// const first = (deg) => {

//   if (deg > 0 && deg <= 70) {
//     console.log(1, deg, Number(deg) - (deg / 4.2));

//     return (Number(deg) - (deg / 4.2))
//   }
//   else if (deg > 70 && deg <= 80) {
//     console.log(2, deg, Number(deg) - (deg / 5.2));

//     return (Number(deg) - (deg / 5.2))
//   }
//   else if (deg > 100 && deg <= 160) {
//     // console.log(2, deg, Number(deg) + (deg / 10));

//     return (Number(deg) + (deg / 10))
//   }
//   else if (deg > 170 && deg <= 240) {
//     console.log(4, deg, Number(deg) - (deg / 25));

//     return (Number(deg) - (deg / 25))
//   }
//   else if (deg > 280 && deg <= 350) {
//     console.log(5, deg, Number(deg) + (deg / 25));

//     return (Number(deg) + (deg / 25))
//   }
//   // else if (deg > 75 && deg <= 80) {
//   //   console.log(deg, Number(deg) - (deg / 12));

//   //   return (Number(deg) - (deg / 5.2))
//   // }
//   return deg
// }
// function angleFromCoordinate(lat1, lon1, lat2, lon2, revert) {

//   var p1 = {
//     x: lat1,
//     y: lon1
//   };

//   var p2 = {
//     x: lat2,
//     y: lon2
//   };
//   const angle = (anchor, point) => Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180 / Math.PI + 180;
//   angle(p1, p2); // 225
//   let angleDeg = 0
//   if (revert) {
//     angleDeg = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI + 360; // 45

//   }
//   else {
//     angleDeg = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI + 180; // 45

//   }

//   return first(angleDeg.toFixed(0));

// }
export function dragHandlerLine(e) {
  let title = e.target.parentLine.setText.bind(e.target.parentLine);
  let text = e.target.parentLine._text;
  if (e.target.parentLine.options.color === "transparent") {
    title = e.target.parentArc.setText.bind(e.target.parentArc);
    text = e.target.parentArc._text;
  }
  // calcAngle
  const polyline = e.target.parentLine;
  const polyArc = e.target.parentArc;
  const thetaOffset = 3.14 / 9;
  const thetaOffsetRev = 3.14 / -9;
  const latLng = polyline.getLatLngs();
  let thetaOffsetData;
  const latlngMarker = e.target.getLatLng();

  // if (nameArrow === "first-arrow-line") {
  //   document.querySelector(`.second-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng)}deg)`
  //   document.querySelector(`.first-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng, true)}deg)`
  // } else {
  //   document.querySelector(`.first-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng, true)}deg)`
  //   document.querySelector(`.second-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng)}deg)`
  // }

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
  // if (nameArrow === "first-arrow-line") {
  //   document.querySelector(`.second-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng)}deg)`
  //   document.querySelector(`.first-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng, true)}deg)`
  // } else {
  //   document.querySelector(`.first-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng, true)}deg)`
  //   document.querySelector(`.second-arrow-line.rotate_id_${id_line}`).style.transform = `rotate(${angleFromCoordinate(latLng[0].lat, latLng[0].lng, latLng[1].lat, latLng[1].lng)}deg)`
  // }

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
  delete this.polyArcLatlng;
}
