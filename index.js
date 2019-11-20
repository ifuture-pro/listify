#! /usr/bin/env node

'use strict';

const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const generateList = require('./lib/parse');

const markdownExts = ['.md', '.markdown'];
const ignoredDirs  = ['.idea', '.github', 'node_modules'];


function findMarddownFile(dirPath) {

  let dir = fs.readdirSync(dirPath);
  dir = dir
    .filter(d => ignoredDirs.indexOf(d) < 0)
    .filter(d => path.join(dirPath, d)!== config.outFile);

  if (config.exclude){
    let type = typeof config.exclude;
    switch (type) {
      case 'string':
        dir = dir.filter(d => !(new RegExp(config.exclude).test(d)));
        break;
      case 'object':
        dir = dir.filter(d => config.exclude.indexOf(d) < 0);
        break;
      default:
        console.error('invalid option "exclude" ')
    }
  }

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
  { boolean: ['blog','containroot','suffix'],
    string: ['title', 'maxlevel', 'out', 'exclude']
  });

let config = {
  maxlevel: args.maxlevel || '4',
  outFile: args.out || 'README.md',
  title: args.title || '\nTable of Contents\n-----------\n  > *generated with [listify](https://github.com/ifuture-pro/listify)*\n',
  containRoot: args.containroot || false,
  exclude: args.exclude,
  suffix: args.suffix || false,
  prefix: '-',
  markStart: '<!-- start listify -->',
  markEnd: '<!-- end listify -->'
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

generateList({markdownFiles:mdFiles, options: config});


