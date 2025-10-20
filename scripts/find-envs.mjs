// scripts/find-envs.mjs
import fs from "fs/promises";
import path from "path";

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const ignoreDirs = new Set([
  "node_modules", ".git", ".next", ".expo", "dist", "build", "out", ".vercel"
]);

const ENV_PATTERNS = [
  // process.env.MY_VAR
  /\bprocess\.env\.([A-Z0-9_]+)\b/g,
  // process.env['MY_VAR']  /  process.env["MY_VAR"]
  /\bprocess\.env\[['"]([A-Z0-9_]+)['"]\]/g,
  // import.meta.env.MY_VAR (Vite, etc.)
  /\bimport\.meta\.env\.([A-Z0-9_]+)\b/g
];

// helper: get line numbers for matches
function findMatchesWithLines(text, regex) {
  const lines = text.split(/\r?\n/);
  const matches = [];
  let m;
  const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  while ((m = re.exec(text))) {
    const idx = m.index;
    // compute line number
    let pos = 0, line = 0;
    for (let i = 0; i < lines.length; i++) {
      const len = lines[i].length + 1; // + newline
      if (pos + len > idx) { line = i + 1; break; }
      pos += len;
    }
    matches.push({ name: m[1], line });
  }
  return matches;
}

async function walk(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!ignoreDirs.has(e.name)) {
        await walk(path.join(dir, e.name), acc);
      }
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (exts.has(ext)) acc.push(path.join(dir, e.name));
    }
  }
  return acc;
}

const found = new Map(); // varName -> [{file, line}]
const files = await walk(ROOT);

for (const file of files) {
  const txt = await fs.readFile(file, "utf8");
  for (const re of ENV_PATTERNS) {
    const matches = findMatchesWithLines(txt, re);
    for (const { name, line } of matches) {
      if (!found.has(name)) found.set(name, []);
      found.get(name).push({ file: path.relative(ROOT, file), line });
    }
  }
}

// print report
if (found.size === 0) {
  console.log("Nenhuma variável de ambiente encontrada.");
  process.exit(0);
}

console.log("🔎 Variáveis de ambiente encontradas:\n");
for (const [name, locs] of found) {
  console.log(`- ${name}`);
  for (const { file, line } of locs) {
    console.log(`   • ${file}:${line}`);
  }
}
console.log("\nTotal:", found.size);

// generate .env.sample
const sampleLines = [];
for (const name of found.keys()) {
  sampleLines.push(`${name}=# preencha aqui`);
}
const sample = sampleLines.join("\n") + "\n";
const outPath = path.join(ROOT, ".env.sample");
await fs.writeFile(outPath, sample, "utf8");
console.log(`\n📝 Gerado ${path.relative(process.cwd(), outPath)} com as chaves detectadas.`);