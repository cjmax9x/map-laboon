export const markerFnIndex = [1];
export const markerPersonIndex = [1];
window.eFunction = [1];
window.aFunction = [1];
window.natural = [1];
window.nonNatural = [1];
window.addedFunction = [1];
window.existingFunction = [1];
window.UnT = [1];
window.HnT = [1];
export const handleName = (name, index, currentName) => {
  if (name && index) {
    return name + " " + index[0]++;
  } else if (name) {
    return name;
  } else if (!name && !index) {
    return currentName;
  }
};
