/** ProfileGate — previously redirected to /profile for incomplete profiles.
 *  Now disabled: users can access all routes freely. Profile completion is optional. */
export default function ProfileGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
