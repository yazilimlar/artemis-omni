import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * HTML layout tags Container may render as. Kept to plain HTML: since ADR-015,
 * @react-three/fiber adds three.js elements to React's global JSX types, and an
 * open `React.ElementType` would then include them and collapse props to `never`.
 */
type ContainerTag = "div" | "section" | "article" | "header" | "footer" | "main" | "nav" | "aside";

/** Centered max-width content container with consistent gutters. */
export function Container({
  className,
  as: Comp = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: ContainerTag }) {
  return (
    <Comp
      className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}
      {...props}
    />
  );
}
