export function dateToMysql(date: Date) {
  return date.toISOString().split(".")[0].replace("T", " ");
}
