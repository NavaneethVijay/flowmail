import { SiteHeader } from "./site-header";

export function PageLayout({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader title={title} actions={actions} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
