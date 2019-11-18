'use strict';

const md = require("@textlint/markdown-to-ast");
const fs = require('fs');
const path = require('path');
const anchor = require('./anchor-markdown-header');


let config = {
  maxlevel: 3
};

function addAnchor(str,path) {
  let header = str;
  if ( config.containRoot ){
    str = path ;
  } else {
    str = path.substring(config.rootPath.length) ;
  }

  return anchor(header,str);
}

function getIndent(depth) {
  let indent = '';
  for (let i = 0; i < (2 * (depth-1) + 1); i++) {
    indent += ' ';
  }
  return indent;
}


function generateList(markdownFilePath) {
  let content = fs.readFileSync(markdownFilePath,'utf8');
  let headers = parse(content).map(h => {
    h.anchor = addAnchor(h.text,markdownFilePath);
    return h;
  });
  return {
    headers: headers,
    title: addAnchor(path.basename(markdownFilePath),markdownFilePath),
    path: markdownFilePath
  };
}

function parse(content){
  const headers = md.parse(content).children
    .filter(c => c.type === md.Syntax.Header && c.depth <= config.maxlevel)
    .map(c => {
      return {text: c.children.map(cc => {return cc.raw}).join(''), depth: c.depth};
    });
  //headers.forEach((v,i) => {console.log(v)})
  return headers;
}


module.exports = ({markdownFiles,options={}}) => {
  config = Object.assign(config,options);
  let all = [];
  for (let i = 0; i < markdownFiles.length; i++) {
    let parsed = generateList(markdownFiles[i]);
    all.push(parsed.title + '\n-------\n' + parsed.headers.map(p => {return getIndent(p.depth) + config.prefix + ' ' + p.anchor}).join("\n"));
  }
  let result = config.markStart + '\n' + config.title + '\n' + all.join('\n\n') + '\n' + config.markEnd + '\n';
  if (fs.existsSync(config.outFile)){
    let content = fs.readFileSync(config.outFile,'utf8');
    if (new RegExp(config.markStart,'gi').test(content) && new RegExp(config.markEnd,'gi').test(content)){
      result = content.replace(new RegExp(config.markStart+'\\s*\\S*'+config.markEnd,'gi'),result);
    }else {
      console.log('Flag('+config.markStart + config.markEnd +') not found. Replace all')
    }
  } else {
    console.log('Out file not exists. Create it!')
  }
  fs.writeFileSync(config.outFile, result, 'utf8');
  console.log('writed to "%s"',config.outFile)
};
