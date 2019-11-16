'use strict';

const md = require("@textlint/markdown-to-ast");
const fs = require('fs');
const path = require('path');


let config = {
  maxlevel: 3
};

function addAnchor(str,path) {
  let header = str;
  if ( config.containRoot ){
    str = path + '#' + str
  } else {
    str = path.substring(config.rootPath.length) + '#' + str;
  }

  return '[' + header + '](' + customEncodeURI(str) + ')';
}

function getIndent(depth) {
  let indent = '';
  for (let i = 0; i < (2 * (depth-1) + 1); i++) {
    indent += ' ';
  }
  return indent;
}

function customEncodeURI(uri) {
  var newURI = encodeURI(uri);

  return newURI.replace(/%E2%80%8D/g, '\u200D');
}

function generateList(markdownFilePath) {
  const content = fs.readFileSync(markdownFilePath,'utf8');
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
  fs.writeFileSync(config.outFile, all.join('\n\n'), 'utf8');
  console.log('writed to "%s"',config.outFile)
};
