export function formatShortDate(input?: string | null) {
  if (!input) return "Not set";
  return new Date(input).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
