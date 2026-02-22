import packageJson from "../../package.json";

export function Footer() {
  return (
    <footer className="app-footer" aria-label="App-Version">
      <small>Version {packageJson.version}</small>
    </footer>
  );
}
