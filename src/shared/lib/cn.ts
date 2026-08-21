// Tiny className combiner — avoids pulling a dependency just for clsx.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
