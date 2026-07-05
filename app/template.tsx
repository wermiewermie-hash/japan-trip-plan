// A template re-mounts on every navigation, so this wrapper replays its
// entrance animation each time a page loads — giving smooth route transitions.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
