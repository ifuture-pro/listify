'use strict';

const md = require("@textlint/markdown-to-ast");


module.exports = ({content,options={}}) => {
  //const lines = content.split('\n')
  //console.log(options)
  const headers = md.parse(content).children
    .filter(c => c.type === md.Syntax.Header && c.depth <=options.maxlevel)
    .map(c => {return c.raw});
  return {headers:headers}
};
