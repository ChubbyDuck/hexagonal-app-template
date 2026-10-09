import { NavLink } from 'react-router';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/notes">Notes</NavLink>
      </nav>
      {children}
    </>
  );
}
