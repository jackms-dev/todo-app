// Helper functions

// Checks if str is a valid string
export function isValidString(str) {
  return typeof str == "string" && str.length > 0;
}

// Checks if priority is a valid priority
// 0 = high, 1 = medium, 2 = low
export function isValidPriority(priority) {
  let values = new Set(["low", "medium", "high"]);
  return isValidString(priority) && values.has(priority);
}

// Converts obj to an array
// Does not flatten values
export function normalizeToArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

// Bulk adds an array of text values as classes
export function addHTMLClasses(obj, classes = []) {
  normalizeToArray(classes)
    .filter((e) => isValidString(e))
    .forEach((e) => obj.classList.add(e));
}
