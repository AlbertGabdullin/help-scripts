const babel = require('@babel/core');
const fs = require('fs');
const glob = require('glob');
const FlowToTypescript = require('babel-plugin-flow-to-typescript');

async function transformFile(filename) {
  console.log(`converting ${filename} to TypeScript`);
  let { code } = babel.transformFileSync(filename, {
    plugins: [FlowToTypescript],
  });

  const extension = getFileExtension(code);
  const tsFilename = filename.replace('.jsx', extension);

  console.log(`deleting ${filename}`);
  fs.unlinkSync(filename);

  await fs.writeFile(tsFilename, code, function(error, result) {
    console.log('error:', error);
    console.log('result', result);
  });
}

function getFileExtension(code) {
  if (code.includes("from 'react'") || code.includes('@jsx')) {
    return '.tsx';
  }

  return '.ts';
}

glob.sync('src/**/*.js').forEach((file) => {
  console.log(file);
  transformFile(file);
});
