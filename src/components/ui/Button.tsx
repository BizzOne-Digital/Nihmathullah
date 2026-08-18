import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/animation/MagneticButton";

type ButtonVariant = "gold" | "black" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  gold: "bg-gold-gradient text-obsidian hover:brightness-110 shadow-lg shadow-signature-gold/20",
  black: "bg-obsidian text-ivory border border-antique-gold/30 hover:border-signature-gold",
  outline:
    "border border-signature-gold/50 text-signature-gold hover:bg-signature-gold/10",
  ghost: "text-ivory hover:text-signature-gold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-all duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-50 disabled:pointer-events-none";

function ButtonInner({
  variant = "gold",
  size = "md",
  magnetic = false,
  className,
  children,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel, ...rest } = props as ButtonAsLink;
    const link = (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
    return magnetic ? <MagneticButton>{link}</MagneticButton> : link;
  }

  const { ref, ...buttonProps } = props as ButtonAsButton & {
    ref?: React.Ref<HTMLButtonElement>;
  };
  const button = (
    <button ref={ref} className={classes} {...buttonProps}>
      {children}
    </button>
  );
  return magnetic ? <MagneticButton>{button}</MagneticButton> : button;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonInner {...props} ref={ref} />
));

Button.displayName = "Button";
