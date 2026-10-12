import fs from 'node:fs';
import path from 'node:path';
import { API } from 'typescript/unstable/sync';
import * as ts from 'typescript/unstable/ast';
const files = [];
function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else if (/\.ts$/.test(p)) files.push(p); } }
walk('src'); walk('tests');
const problems = [];
const api = new API({ cwd: process.cwd() });
const snapshot = api.updateSnapshot({ openProjects: [path.resolve('tsconfig.json')] });
const project = snapshot.getProject(path.resolve('tsconfig.json'));
if (!project) throw new Error('lint_project_missing');
try {
for (const file of files) {
  const source = project.program.getSourceFile(path.resolve(file));
  if (!source) throw new Error(`lint_source_missing: ${file}`);
  const core = file.replaceAll('\\', '/').startsWith('src/core/');
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword || ts.isDebuggerStatement(node)) problems.push(`${file}: forbidden any/debugger`);
    if (core && ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && !node.moduleSpecifier.text.startsWith('./')) problems.push(`${file}: core boundary import ${node.moduleSpecifier.text}`);
    if (core && ts.isIdentifier(node) && ['window', 'document', 'navigator', 'Phaser', 'indexedDB'].includes(node.text)) problems.push(`${file}: browser/framework identifier ${node.text} in core`);
    node.forEachChild(visit);
  }
  visit(source);
  if (/@ts-(ignore|nocheck)/.test(source.text)) problems.push(`${file}: forbidden type suppression`);
}
} finally { snapshot.dispose(); api.close(); }
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${files.length} TypeScript files; no any/debugger/suppression; pure-core boundaries valid`);
