import { cn } from "@/lib/utils";
import * as React from "react";

const ProposerAILogo = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    className={cn(className)}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 18H9v-2H7v-2h2v-2H7V8h4a2 2 0 012 2v2a2 2 0 01-2 2h2v2z"
    />
  </svg>
));
ProposerAILogo.displayName = "ProposerAILogo";
export default ProposerAILogo;
