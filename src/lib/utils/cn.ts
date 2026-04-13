export function joinText(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}
