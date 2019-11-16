'use strict';

const md = require("@textlint/markdown-to-ast");


module.exports = ({content}) => {
  //const lines = content.split('\n')
  const headers = md.parse(content).children.filter(c => c.type === md.Syntax.Header).map(c => {return c.raw});
  console.log(headers);
};
