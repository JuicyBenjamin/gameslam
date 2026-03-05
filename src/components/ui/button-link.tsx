import type { VariantProps } from "class-variance-authority"
import { Link } from "@tanstack/react-router"

import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"

type TButtonVariants = VariantProps<typeof buttonVariants>

interface IButtonLinkBase extends TButtonVariants {
  className?: string
  children?: React.ReactNode
}

interface IInternalButtonLinkProps extends IButtonLinkBase {
  to: string
  params?: Record<string, string>
  href?: never
  target?: never
  rel?: never
}

interface IExternalButtonLinkProps
  extends IButtonLinkBase,
    Omit<React.ComponentProps<"a">, "className" | "children" | "size"> {
  to?: never
  params?: never
}

type TButtonLinkProps = IInternalButtonLinkProps | IExternalButtonLinkProps

export const ButtonLink = (props: TButtonLinkProps) => {
  const { variant, size, className, children } = props
  const classes = cn(buttonVariants({ variant, size }), className)

  if ("to" in props && props.to != null) {
    return (
      <Link to={props.to} params={props.params as never} className={classes}>
        {children}
      </Link>
    )
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    to: _to,
    params: _params,
    ...anchorProps
  } = props

  return (
    <a className={classes} {...anchorProps}>
      {children}
    </a>
  )
}
