import styles from "../../../../styles/map/Map.module.scss";
import { divFunction, divFunctionCircle, divPerson } from "../marker/Icon";
import L from "leaflet";
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import { functionSelected, groupFnIndex } from "../marker/Marker";
import { STORES } from "../../store/GlobalStore";

// for Function/Person
export const customPopUp = (SetModal, index, type) => {
  const checked = functionSelected.find((item) => {
    return item === index;
  });

  window.openModal = () => {
    SetModal("modal");
  };
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
        .setContent(customPopUp(SetModal, e.target.options.index, type))
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

  window.deleteItem = () => {
    map.removeLayer(e.target);
    map.closePopup();
  };
};

// for Group function/Person

export const changeGroup = (map, e) => {
  L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(groupContext(e.target.options.group.index))
    .openOn(map);
};

export const groupContext = (index) => {
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
      <div class="${[styles.black, styles["color-circle"]].join(" ")}">
      </div>
      <div class="${[styles.black, styles["color-rectangle"]].join(" ")}">
      </div>
    </div>
  </div>
  <div class="${[styles.row].join(" ")}">
    Delete
  </div>
  </div>`;
};

/* <span  onclick="addFnToGroup()"  class="${
  styles["button-group"]
}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 122.875 122.648" enable-background="new 0 0 122.875 122.648" xml:space="preserve"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M108.993,47.079c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.683-6.26,13.959-13.942,14.019L75.24,75.138l-0.235,33.73c-0.063,7.619-6.338,13.789-14.014,13.78 c-7.678-0.01-13.848-6.197-13.785-13.818l0.233-33.497l-33.558,0.235C6.2,75.628-0.016,69.448,0,61.764 c0.018-7.683,6.261-13.959,13.943-14.018l33.692-0.236l0.236-33.73C47.935,6.161,54.209-0.009,61.885,0 c7.678,0.009,13.848,6.197,13.784,13.818l-0.233,33.497L108.993,47.079L108.993,47.079z"/></g></svg></span> */
// oncontextmenu="makeEvent(event,${item})"

export const groupLayoutPopup = (group) => {
  return `
  <div class="${styles["group-function"]}">
  ${group.map((item) => {
    return `<div  class="${[
      styles["rectangle-fn-gr"],
      styles["fn--black"],
    ].join(" ")}">Function ${item} </div>`;
  })}
  </div>
  `;
};

// export const popupGroup = (map, SetModal, e) => {
//   window.addFnToGroup = () => {
//     if (e.target.options.group.length < 9) {
//       e.target.closePopup();
//       e.target.unbindPopup();
//       e.target.options.group.push(markerFnIndex[0]);
//       markerFnIndex[0]++;
//       e.target.bindPopup(groupLayout(e.target.options.group), {
//         autoClose: false,
//         className: styles["group-elip"],
//         offset: L.point(30, -12),
//       });
//       e.target.togglePopup();
//     }
//   };

//   window.makeEvent = (event, index) => {
//     event.preventDefault();

//     const latlng = map.containerPointToLatLng(
//       L.point(event.layerX, event.layerY)
//     );

//     L.popup({ offset: L.point(-130, 0) })
//       .setLatLng([latlng.lat, latlng.lng])
//       .setContent(customPopUp(SetModal, index))
//       .openOn(map);
//   };
// };

//----------------------------------------------------------------------

//for Distance popup
export function distancePopup(distancePoint, distancePoint1, e) {
  const popup = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent(
      `
      <div style="background-color:#fff;padding:10px;min-width:180px">
        <div onclick="changeRoute()" class = "${[
          styles["menu-geojson"],
          styles["on-hover-function"],
        ].join(" ")}">
          Change-Route
        </div>
      </div>
    </div>
  `
    )
    .addTo(this);

  window.changeRoute = () => {
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
