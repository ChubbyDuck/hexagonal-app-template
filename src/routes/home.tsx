import { Link } from 'react-router';

export function meta() {
  return [{ title: 'Bundle Template' }];
}

export default function Home() {
  return (
    <main className="page">
      <h1>Bundle Template</h1>
      <p>
        Hexagonal starter: domain in <code>src/Core</code>, adapters in <code>src/Infrastructure</code>, wired by awilix
        and exposed through tRPC, React Router loaders and a CLI.
      </p>
      <p>
        See the <Link to="/notes">Notes</Link> example module end to end.
      </p>
    </main>
  );
}
