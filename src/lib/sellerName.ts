// Format a seller's public display name for the buy side.
// Rules:
//   - "First Last"      -> "First L."
//   - "First"           -> "First"
//   - no first name     -> "DISbook user"
//   - never expose full surname or user id
export function formatSellerName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = (firstName ?? "").trim();
  const last = (lastName ?? "").trim();
  if (!first) return "DISbook user";
  if (!last) return first;
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}
