/**
 * AppLayout — full-width on mobile, max 600px centered on desktop.
 * Pure layout wrapper with no store dependency.
 * @param {{ children: React.ReactNode }} props
 */
function AppLayout({ children }) {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6">
      {children}
    </div>
  );
}

export default AppLayout;
