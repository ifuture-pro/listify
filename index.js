'use strict';

const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const generateList = require('./lib/parse');

const markdownExts = ['.md', '.markdown'];
const ignoredDirs  = ['.idea', '.git', 'node_modules'];


function findMarddownFile(dirPath) {

  let dir = fs.readdirSync(dirPath);
  dir = dir.filter(d => ignoredDirs.indexOf(d) < 0 && path.join(dirPath, d)!== config.outFile);

  for (let i = 0; i < dir.length; i++) {

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



const args = minimist(process.argv.slice(2),
  { boolean: ['blog','containroot'],
    string: ['title', 'maxlevel', 'out']
  });

let config = {
  maxlevel: args.maxlevel || '3',
  outFile: args.out || 'README.md',
  containRoot: args.containroot,
  prefix: '-'
};

let mdFiles = [];
for (let i = 0; i < args._.length; i++) {
  let root = args._[i];
  root = (root.indexOf('~') === 0) ? process.env.HOME + root.substr(1) : root;
  root = (root.indexOf('.') === 0) ? process.cwd() + root.substr(1) : root;

  config.outFile = path.join(root, config.outFile);
  config.rootPath = root;

  let stat = fs.statSync(root);

  if (stat.isDirectory()) {
    findMarddownFile(root);
  }else {
    mdFiles = [{path: root}];
  }
}

generateList({markdownFiles:mdFiles, options: config})


