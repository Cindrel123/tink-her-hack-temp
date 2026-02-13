import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-malachite-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-malachite-600 text-white hover:bg-malachite-700 active:bg-malachite-800 shadow-sm",
                destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
                outline: "border border-neutral-200 bg-white hover:bg-neutral-50 hover:text-neutral-900 shadow-sm",
                secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 shadow-sm",
                ghost: "hover:bg-neutral-100 hover:text-neutral-900",
                link: "text-malachite-600 underline-offset-4 hover:underline hover:text-malachite-700",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-11 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
