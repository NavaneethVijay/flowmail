import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SiteHeaderProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SiteHeader({ title, actions }: SiteHeaderProps) {
  return (
    <header className="px-4 rounded-t-lg  md:px-6  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {typeof title === "string" ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            title
          )}
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </header>
  );
}
