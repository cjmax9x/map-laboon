import styles from "../../../../styles/map/Map.module.scss";
import { divFunction, divFunctionCircle, divPerson } from "../marker/Icon";
import L, { map } from "leaflet";
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import {
  functionSelected,
  groupFnIndex,
  markerProblemIndex,
} from "../marker/Marker";
import { STORES } from "../../store/GlobalStore";

// for Function/Person
export const customPopUp = (SetModal, index, type, error) => {
  const checked = functionSelected.find((item) => {
    return item === index;
  });
  window.openModal = () => {
    SetModal("modal");
  };
  if (error) window.problem = error;
  return `<div style="background-color:#fff;padding:10px; min-width:180px" class="${
    styles["popup-interact-function"]
  }">
  <div class="${[styles.row, styles["on-hover-rename"]].join(" ")}">
    Function type
    <div class="${styles["hover-func"]}">
      <div onclick="edittingItem('black','Function ${index}')">Function with index</div>
      <div onclick="edittingItem('black','eFunction ${index}')">eFunction with index</div>
      <div onclick="edittingItem('black','aFunction ${index}')">aFunction with index</div>
      <div onclick="edittingItem('black','Natural function')">Natural function</div>
      <div onclick="edittingItem('black','Non-natural function')">Non-natural function</div>
      <div onclick="edittingItem('black','Added Function ${index}')">Added Function with index</div>
      <div onclick="edittingItem('black','Existing Function ${index}')">Existing Function with index</div>
      <div onclick="edittingItem('black','u<sub>${index}</sub>(t)')">u<sub>n</sub>(t)</div>
      <div onclick="edittingItem('black','h<sub>${index}</sub>(t)')">h<sub>n</sub>(t)</div>
    </div>
  </div>
  <div class="${[styles.row].join(" ")}" onclick="openModal()">Rename</div>
  <div class="${[styles.row, styles["on-hover"]].join(" ")}">
      Function Execution
    <div  class="${styles["hover-func-block"]}">
      <div onclick="edittingItem('green')" >
        ${type ? "Normal" : "Positive"} 
      </div>
      <div onclick="edittingItem('${type ? "yellow" : "red"}')">
        ${type ? "Abnormal" : "Negative"} 
      </div>
    </div>
  </div>








<div onclick="handleAddProblem(problem)" style="display:${
    error ? "auto" : "none"
  }" class="${styles.row}">
${error === "solution" ? "Identify as solution" : "Identify as problem "}
  </div>




  <div class="${[styles.row, styles["on-hover"]].join(" ")}">
      Show Function
    <div  class="${styles["hover-func"]}">
      <div onclick = "changeShape('circle')"  class="${[
        styles.black,
        styles["color-circle"],
      ].join(" ")}">
      </div>

      <div onclick = "changeShape('elip')"  class="${[
        styles.black,
        styles["color-elip"],
      ].join(" ")}">
      </div>

      <div onclick = "changeShape('rectangle')" class="${[
        styles.black,
        styles["color-rectangle"],
      ].join(" ")}">
      </div>
    </div>
  </div>
  <div onclick="deleteItem()" class="${[styles.row].join(" ")}">
    Delete
  </div>
  <div  style="display:flex; ${
    functionSelected.length < 9 || checked
      ? "color:unset"
      : "color:#ddd;pointer-events: none"
  }" class="${
    styles.row
  }"><label style="margin-left:4px;hieght:20px;width:100%" for="input">Select</label>
  <input style="${
    functionSelected.length < 9 || checked ? "opacity:1 " : "opacity:0.2"
  }" onchange="inputChange(event,${index})" id="input" ${
    checked ? "checked" : ""
  } type ="checkbox"/> </div>
  <div onclick="${
    checked && functionSelected.length > 1
  } ? makeGroup():makeGroup" style="${
    checked && functionSelected.length > 1 ? "" : "color:#ddd"
  }" class="${[styles.row].join(" ")}">
    Make Group
  </div>
  </div>`;
};

export const customPersonPopUp = (SetModal) => {
  window.openModal = () => {
    SetModal("modal");
  };
  return `<div style="background-color:#fff;padding:10px;min-width:180px" class="${
    styles["popup-interact-function"]
  }">
  <div onclick="openModal()" class="${styles.row}">
    Rename
  </div>
  <div class="${[styles.row, styles["upload-file-wrapper"]].join(" ")}">
    Upload your image
    <input type="file" className='upload-input' onchange="setProfile(event, 'Natural function')" />
  </div>
  <div onclick="deleteItem()" class="${[styles.row].join(" ")}">
    Delete
  </div>
  </div>`;
};

export const changeIcon = (map, SetModal, e) => {
  let type = false;
  let error = e.target.options.solution;
  if (!error) error = e.target.options.problem;
  const name = e.target._icon.textContent;
  if (
    name.startsWith("Natural") ||
    name.startsWith("Non-natural") ||
    name.startsWith("Existing") ||
    name.startsWith("Added")
  ) {
    type = true;
  }
  !e.target._icon.classList.contains(styles["person"])
    ? L.popup()
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(customPopUp(SetModal, e.target.options.index, type, error))
        .openOn(map)
    : L.popup()
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(customPersonPopUp(SetModal))
        .openOn(map);

  window.edittingItem = (
    color,
    name,
    currentColor = e.target._icon.classList[2],
    currentName = e.target._icon.textContent
  ) => {
    if (!name || color) {
      e.target.options.solution && delete e.target.options.solution;
      e.target.options.problem && delete e.target.options.problem;
    }
    if (color === "green" && !type) e.target.options.solution = "solution";
    if (color === "red") e.target.options.problem = "problem";
    if (e.target._icon.classList.contains(styles["circle-fn"])) {
      e.target.setIcon(
        divFunctionCircle(
          [
            styles["circle-fn"],
            color ? styles[`fn--${color}`] : currentColor,
          ].join(" "),
          name ? name : currentName
        )
      );
    } else if (e.target._icon.classList.contains(styles["person"])) {
      const img = e.target._icon.firstChild.currentSrc;
      e.target.setIcon(divPerson(styles["person"], name, img));
    } else if (e.target._icon.classList.contains(styles["rectangle-fn"])) {
      e.target.setIcon(
        divFunction(
          [
            styles["rectangle-fn"],
            color ? styles[`fn--${color}`] : currentColor,
          ].join(" "),
          name ? name : currentName
        )
      );
    } else if (e.target._icon.classList.contains(styles["elip-fn"])) {
      e.target.setIcon(
        divFunction(
          [
            styles["elip-fn"],
            color ? styles[`fn--${color}`] : currentColor,
          ].join(" "),
          name ? name : currentName
        )
      );
    }
    map.closePopup();
  };

  window.setProfile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const objectUrl = URL.createObjectURL(event.target.files[0]);

    e.target.setIcon(
      divPerson(styles["person"], e.target._icon.textContent, objectUrl)
    );

    map.closePopup();
  };

  window.changeShape = (shape) => {
    if (shape === "circle") {
      e.target.setIcon(
        divFunctionCircle(
          [styles["circle-fn"], e.target._icon.classList[2]].join(" "),
          e.target._icon.textContent
        )
      );
    } else if (shape === "rectangle") {
      e.target.setIcon(
        divFunction(
          [styles["rectangle-fn"], e.target._icon.classList[2]].join(" "),
          e.target._icon.textContent
        )
      );
    } else if (shape === "elip") {
      e.target.setIcon(
        divFunction(
          [styles["elip-fn"], e.target._icon.classList[2]].join(" "),
          e.target._icon.textContent
        )
      );
    }

    map.closePopup();
  };

  window.inputChange = (event, index) => {
    if (event.target.checked) {
      functionSelected.length < 9 && functionSelected.push(index);
    } else {
      let length = functionSelected.length;
      for (let i = 0; i < length; i++) {
        if (functionSelected[i] === index) {
          functionSelected.splice(i, 1);
          break;
        }
      }
    }
    map.closePopup();
  };

  window.makeGroup = () => {
    L.marker([e.latlng.lat, e.latlng.lng], {
      draggable: !STORES.lock,
      group: { group: [...functionSelected].sort(), index: groupFnIndex[0] },
      icon: divFunction(
        [styles["rectangle-fn"], styles["fn--black"]].join(" "),
        `Group function ${groupFnIndex[0]}`
      ),
    })
      .addTo(map)
      .bindPopup(
        (e) => {
          return groupLayoutPopup(e.options.group.group);
        },
        {
          className: styles["group-rectangle"],
          offset: L.point(30, -12),
          autoClose: false,
          closeOnClick: false,
        }
      )
      .on("contextmenu", changeGroup.bind(this, map))
      .openPopup();
    groupFnIndex[0]++;
    map.eachLayer((layer) => {
      if (layer.options.index) {
        functionSelected.forEach((element) => {
          if (element === layer.options.index) {
            layer.remove();
          }
        });
      }
    });
    functionSelected.splice(0, functionSelected.length);
  };

  // replace problem/solution
  window.handleAddProblem = (name) => {
    const first = name[0].toUpperCase();
    const remain = name.slice(1, name.length);
    L.marker([e.latlng.lat, e.latlng.lng], {
      draggable: !STORES.lock,
      type: { index: markerProblemIndex[0], title: "problem" },
      icon: divFunction(
        [
          styles["rectangle-fn"],
          name === "solution" ? styles["fn--green"] : styles["fn--red"],
        ].join(" "),
        `${first}${remain} ${markerProblemIndex[0]}`
      ),
    })
      .addTo(map)
      .on("contextmenu", customProblemPopup.bind(map))
      .on("dblclick	", (e) => {
        if (e.target.options.type.title === "problem") {
          e.target.options.type.title = "solution";
          e.target._icon.textContent = `Solution ${e.target.options.type.index}`;
          e.target._icon.classList.add(styles["fn--green"]);
          e.target._icon.classList.remove(styles["fn--red"]);
        } else {
          e.target.options.type.title = "problem";
          e.target._icon.textContent = `Problem ${e.target.options.type.index}`;
          e.target._icon.classList.remove(styles["fn--green"]);
          e.target._icon.classList.add(styles["fn--red"]);
        }
      });

    markerProblemIndex[0]++;
    map.removeLayer(e.target);
    map.closePopup();
  };

  window.deleteItem = () => {
    map.removeLayer(e.target);
    map.closePopup();
  };
};
export function customProblemPopup(e) {
  const popup = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(
      `<div style="background-color:#fff;padding:10px; min-width:180px" class="${
        styles["popup-interact-function"]
      }">
    <div class="${[styles.row, styles["on-hover"]].join(" ")}">
    Show Function
  <div  class="${styles["hover-func"]}">
    <div onclick = "changeShapeProblem('circle')"  class="${[
      styles.black,
      styles["color-circle"],
    ].join(" ")}">
    </div>
  
    <div onclick = "changeShapeProblem('elip')"  class="${[
      styles.black,
      styles["color-elip"],
    ].join(" ")}">
    </div>
  
    <div onclick = "changeShapeProblem('rectangle')" class="${[
      styles.black,
      styles["color-rectangle"],
    ].join(" ")}">
      </div>
      </div>
    </div>
  </div>
    `
    )
    .addTo(this);
  window.changeShapeProblem = (shape) => {
    if (shape === "circle") {
      e.target._icon.classList.add(styles["circle-fn-1"]);
      e.target._icon.classList.remove(styles["rectangle-fn"]);
      e.target._icon.classList.remove(styles["elip-fn"]);
    } else if (shape === "rectangle") {
      e.target._icon.classList.remove(styles["circle-fn-1"]);
      e.target._icon.classList.add(styles["rectangle-fn"]);
      e.target._icon.classList.remove(styles["elip-fn"]);
    } else if (shape === "elip") {
      e.target._icon.classList.add(styles["elip-fn"]);
      e.target._icon.classList.remove(styles["circle-fn-1"]);
      e.target._icon.classList.remove(styles["rectangle-fn"]);
    }
    this.removeLayer(popup);
  };
}
// for Group function/Person

export const changeGroup = (map, e) => {
  const popup = L.popup();
  popup
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(groupContext(e.target.options.group.index, popup, map, e))
    .openOn(map);
};

export const groupContext = (index, popup, map, e) => {
  window.changeShapeOption = (shape) => {
    if (shape === "rectangle") {
      e.target.getPopup()._container.classList.remove(styles["group-elip"]);
      e.target.getPopup()._container.classList.add(styles["group-rectangle"]);
      e.target._icon.classList.add(styles["rectangle-fn"]);
      e.target._icon.classList.remove(styles["elip-fn"]);
      e.target._icon.classList.remove(styles["circle-fn"]);
    } else {
      e.target
        .getPopup()
        ._container.classList.remove(styles["group-rectangle"]);
      e.target.getPopup()._container.classList.add(styles["group-elip"]);
      e.target._icon.classList.add(styles["elip-fn"]);
      e.target._icon.classList.remove(styles["rectangle-fn"]);
      e.target._icon.classList.remove(styles["circle-fn"]);
    }

    map.removeLayer(popup);
  };

  return `<div style="background-color:#fff;padding:10px; min-width:180px" class="${
    styles["popup-interact-function"]
  }">
  <div class="${[styles.row, styles["on-hover-rename"]].join(" ")}">
    Group function type
    <div class="${styles["hover-func"]}">
      <div>Group function with index</div>
      <div>Group eFunction with index</div>
      <div>Group aFunction with index</div>
      <div>Group natural function</div>
      <div>Group non-natural function</div>
      <div>Group added Function with index</div>
      <div>Group existing Function with index</div>
    </div>
  </div>
  <div class="${[styles.row, styles["on-hover"]].join(" ")}">
      Show group function
    <div class="${styles["hover-func"]}">
      <div onclick="changeShapeOption('elip')" class="${[
        styles.black,
        styles["color-circle"],
      ].join(" ")}">
      </div>
      <div onclick="changeShapeOption('rectangle')" class="${[
        styles.black,
        styles["color-rectangle"],
      ].join(" ")}">
      </div>
    </div>
  </div>
  <div class="${[styles.row].join(" ")}">
    Delete
  </div>
  </div>`;
};

export const groupLayoutPopup = (group) => {
  return `
  <div class="${styles["group-function"]}">
  ${group
    .map((item) => {
      return `<div  class="${[
        styles["rectangle-fn-gr"],
        styles["fn--black"],
      ].join(" ")}">Function ${item} </div>`;
    })
    .join("")}
  </div>
  `;
};

export const groupPersonLayoutPopup = (group) => {
  return `
  <div class="${styles["group-function"]}">
    ${group
      .map((item) => {
        return `<div style="margin-right:6px">
      <img src="/../user_md.png" alt="person" width="40" height="40">
      <div class="">Person ${item}</div>
    </div>`;
      })
      .join("")}
  </div>
  `;
};
//----------------------------------------------------------------------

//for Distance popup
export function routePopup(distancePoint, distancePoint1, e) {
  const popup = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(
      `
      <div style="background-color:#fff;padding:10px;min-width:180px">
        <div onclick="changeRoute()" class = "${[
          styles["menu-geojson"],
          styles["on-hover-function"],
        ].join(" ")}">
          Change
        </div>
      </div>
    </div>
  `
    )
    .addTo(this);

  window.changeRoute = () => {
    let direct;
    console.log(distancePoint.parentArc);
    if (distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng) {
      direct = true;
    } else {
      direct = false;
    }
    if (
      distancePoint.parentArc.options.color === "blue" ||
      distancePoint.parentArc.options.color === "black"
    ) {
      this.eachLayer((layer) => {
        if (layer.options.type === "distance") {
          layer.parentLine.options.color === "blue" &&
            layer.parentLine.setStyle({ color: "black" });
          layer.parentArc.options.color === "blue" &&
            layer.parentArc.setStyle({ color: "black" });
        }
      });

      distancePoint.parentLine.setStyle({
        color: "blue",
      });
      distancePoint.parentArc.setStyle({ color: "transparent" });

      distancePoint.parentArc.setText(null);

      distancePoint.parentLine.setText("Inter-route", {
        center: true,
        offset: -3,
        orientation: !direct ? 180 : 0,
      });
    } else {
      this.eachLayer((layer) => {
        if (layer.options.type === "distance") {
          layer.parentLine.options.color === "blue" &&
            layer.parentLine.setStyle({ color: "black" });
          layer.parentArc.options.color === "blue" &&
            layer.parentArc.setStyle({ color: "black" });
        }
      });

      distancePoint.parentArc.setStyle({
        color: "blue",
      });
      distancePoint.parentLine.setStyle({ color: "transparent" });

      distancePoint.parentLine.setText(null);

      distancePoint.parentArc.setText("Arc-route", {
        center: true,
        offset: -3,
        orientation: !direct ? 180 : 0,
      });
    }

    this.removeLayer(popup);
  };
}

export function distancePopup(distancePoint, distancePoint1, e) {
  const popup = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(
      `
      <div style="background-color:#fff;padding:10px;min-width:180px">
        <div onclick="changeDistance()" class = "${[
          styles["menu-geojson"],
          styles["on-hover-function"],
        ].join(" ")}">
          Change
        </div>
      </div>
    </div>
  `
    )
    .addTo(this);

  window.changeDistance = () => {
    let direct;
    let name = distancePoint.parentLine._text;
    if (!name) name = distancePoint.parentArc._text;
    if (distancePoint.getLatLng().lng < distancePoint1.getLatLng().lng) {
      direct = true;
    } else {
      direct = false;
    }
    if (
      distancePoint.parentArc.options.color === "blue" ||
      distancePoint.parentArc.options.color === "black"
    ) {
      this.eachLayer((layer) => {
        if (layer.options.type === "distance") {
          layer.parentLine.options.color === "blue" &&
            layer.parentLine.setStyle({ color: "black" });
          layer.parentArc.options.color === "blue" &&
            layer.parentArc.setStyle({ color: "black" });
        }
      });

      distancePoint.parentLine.setStyle({
        color: "blue",
      });
      distancePoint.parentArc.setStyle({ color: "transparent" });

      distancePoint.parentArc.setText(null);

      distancePoint.parentLine.setText(name, {
        center: true,
        offset: -3,
        orientation: !direct ? 180 : 0,
      });
    } else {
      this.eachLayer((layer) => {
        if (layer.options.type === "distance") {
          layer.parentLine.options.color === "blue" &&
            layer.parentLine.setStyle({ color: "black" });
          layer.parentArc.options.color === "blue" &&
            layer.parentArc.setStyle({ color: "black" });
        }
      });

      distancePoint.parentArc.setStyle({
        color: "blue",
      });
      distancePoint.parentLine.setStyle({ color: "transparent" });

      distancePoint.parentLine.setText(null);

      distancePoint.parentArc.setText(name, {
        center: true,
        offset: -3,
        orientation: !direct ? 180 : 0,
      });
    }

    this.removeLayer(popup);
  };
}
