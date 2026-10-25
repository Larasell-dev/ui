// Used by stories only.
// A self-contained picture, so the stories don't depend on the network.
export function swatch(color: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${color}"/><circle cx="12" cy="9" r="4" fill="#fff" opacity=".8"/><rect x="5" y="15" width="14" height="9" rx="7" fill="#fff" opacity=".8"/></svg>`,
  )}`;
}
