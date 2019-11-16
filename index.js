'use strict';

const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const parse = require('./lib/parse');

const markdownExts = ['.md', '.markdown'];
const ignoredDirs  = ['.idea', '.git', 'node_modules'];


function findMarddownFile(dirPath) {

  let dir = fs.readdirSync(dirPath);
  dir = dir.filter(d => ignoredDirs.indexOf(d) < 0);

  for (var i = 0; i < dir.length; i++) {

    const tdir = dir[i];
    const tpath = path.join(dirPath, tdir);

    if (fs.statSync(tpath).isDirectory()) {
      findMarddownFile(tpath)
    } else {

      if (markdownExts.indexOf(path.extname(tdir)) >= 0) {
        mdFiles.push(tpath);
      }

    }
  }
}

function generateList(markdownFilePath) {
  const content = fs.readFileSync(markdownFilePath,'utf8');
  parse({content:content});
}

const args = minimist(process.argv.slice(2),
  { boolean: ['blog'],
    string: ['title', 'maxlevel', 'out']
  });

const maxlevel = args.maxlevel || '3';
let outFile = args.out || 'README.md';

let mdFiles = [];
for (var i = 0; i < args._.length; i++) {
  let root = args._[i];
  root = (root.indexOf('~') === 0) ? process.env.HOME + root.substr(1) : root;

  outFile = path.join(root, outFile);

  let stat = fs.statSync(root);

  if (stat.isDirectory()) {
    findMarddownFile(root);
  }else {
    mdFiles = [{path: root}];
  }

}

console.log(mdFiles);
generateList(mdFiles[6]);
