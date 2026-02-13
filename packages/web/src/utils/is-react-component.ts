import type { JSX } from "react";

export function isReactComponent(
  element: unknown,
): element is (props: Record<string, unknown>) => JSX.Element {
  return typeof element === "function";
}
