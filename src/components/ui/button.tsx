import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl",
        outline:
          "border-2 border-input bg-white/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient:
          "gradient-primary text-white shadow-lg hover:shadow-xl",
        glass:
          "glass-morphism text-foreground hover:bg-white/95 hover:shadow-xl",
        elegant:
          "bg-gray-900 text-white shadow-elegant hover:bg-gray-800 hover:shadow-xl",
        minimal:
          "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot 
          className={cn(buttonVariants({ variant, size, className }))} 
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.div
        whileHover={{ 
          scale: variant === "link" ? 1 : 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: variant === "link" ? 1 : 0.98,
          transition: { duration: 0.1 }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <motion.span
            className="relative z-10 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.span>
          
          {/* Ripple effect background */}
          {variant !== "link" && variant !== "ghost" && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </button>
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 