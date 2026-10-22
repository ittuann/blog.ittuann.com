import { useState } from "react"
import type React from "react"
import { Highlighter, type HighlighterProps } from "@/components/ui/highlighter"
import { cn } from "@/lib/utils"

interface HighlightLinkProps extends Omit<
  HighlighterProps,
  "children" | "active"
> {
  href: string
  external?: boolean  // Whether the link should open in a new tab
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

// Text link that draws a hand-drawn annotation on hover / keyboard focus
export default function HighlightLink({
  href,
  external = false,
  disabled = false,
  className,
  children,
  action = "underline",
  color = "currentColor",
  strokeWidth = 1.5,
  animationDuration = 400,
  iterations = 2,
  padding = 2,
  multiline = false,
  isView,
}: HighlightLinkProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "text-muted-foreground hover:text-primary focus-visible:text-primary w-fit transition-colors",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Highlighter
        action={action}
        color={color}
        strokeWidth={strokeWidth}
        animationDuration={animationDuration}
        iterations={iterations}
        padding={padding}
        multiline={multiline}
        isView={isView}
        active={!disabled && hovered}
      >
        {children}
      </Highlighter>
    </a>
  )
}
