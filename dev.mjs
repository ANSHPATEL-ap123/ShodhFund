import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

function run(cwd, cmd, args) {
  const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false });
  child.on("exit", (code) => {
    if (code) process.exit(code ?? 1);
  });
}

run(path.join(root, "backend"), "node", ["src/server.js"]);
run(path.join(root, "frontend"), "npx", ["next", "dev", "-H", "0.0.0.0", "-p", "3000"]);
