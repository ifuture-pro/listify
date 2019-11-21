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

function help() {
  console.log('Usage: listify <path>  [options]\n' +
    'options:\n'+
    '- `--out` Result out file. Default: work dir README.md\n' +
    '- `--maxlevel` Header level. Default: 4\n' +
    '- `--title` The Title of list\n' +
    '- `--containroot` Contain root path.When linked in local,change it `true`.Default: `false`\n' +
    '- `--suffix` contain file suffix in out file.Default: `false`\n' +
    '- `--exclude` Exclude files.  \n' +
    '    e.g.  \n' +
    '    Ignore multi file `--exclude a.md --exclude b.md  `  \n' +
    '    Support regexp. Ignore start with `_` `--exclude=\'^_\\S*\'`');
  process.exit(0);
}



const args = minimist(process.argv.slice(2),
  { boolean: ['h','help','blog','containroot','suffix'],
    string: ['title', 'maxlevel', 'out', 'exclude']
  });

if (args.h || args.help) {
  help();
}

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
if (mdFiles.length <=0 ) {
  console.log('Can not found markdown file.Do nothing!')
  process.exit(0);
}
generateList({markdownFiles:mdFiles, options: config});


