import { useNavigate, useHref } from "react-router-dom";
import type { NavigateOptions } from "react-router-dom";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: string;
    routerOptions?: NavigateOptions;
  }
}

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <AriaRouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </AriaRouterProvider>
  );
}
