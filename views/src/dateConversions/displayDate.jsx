export function displayDate(isoDateStr) {
  const date = new Date(isoDateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}
// const formatted = displayDate(isoDate);
// console.log(formatted);
