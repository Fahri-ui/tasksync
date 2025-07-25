import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    // Base classes
    let buttonClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    // Variant classes
    if (variant === "default") {
      buttonClasses += " bg-blue-600 text-white hover:bg-blue-700"
    } else if (variant === "outline") {
      buttonClasses += " border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900"
    } else if (variant === "ghost") {
      buttonClasses += " hover:bg-gray-100 hover:text-gray-900"
    }

    // Size classes
    if (size === "default") {
      buttonClasses += " h-10 py-2 px-4"
    } else if (size === "sm") {
      buttonClasses += " h-9 px-3 rounded-md"
    } else if (size === "lg") {
      buttonClasses += " h-11 px-8 rounded-md"
    }

    // Add custom className if provided
    if (className) {
      buttonClasses += " " + className
    }

    return <button className={buttonClasses} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
