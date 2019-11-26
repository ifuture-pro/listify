<h1 align="center">Welcome to @ifuture/listify 👋</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/@ifuture/listify" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@ifuture/listify.svg">
  </a>
  <a href="https://github.com/ifuture-pro/listify#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ifuture-pro/listify/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/ifuture-pro/listify/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/ifuture-pro/listify" />
  </a>
</p>

[![](https://github.com/ifuture-pro/listify/workflows/Node.js%20Package/badge.svg)](https://github.com/ifuture-pro/listify/actions)

> Auto generate table of contents  
> Generate and merge all directories to the specified file.

### ✨ [Demo](demo/README.md)

## Install

```sh
npm install @ifuture/listify -g
```

## Usage

```sh
listify ./ 
```
**options**
- `--out` Result out file. Default: work dir README.md
- `--maxlevel` Header level. Default: 4
- `--title` The Title of list
- `--containroot` Contain root path.When linked in local,change it `true`.Default: `false`
- `--suffix` contain file suffix in out file.Default: `false`
- `--exclude` Exclude files.  
    e.g.  
    Ignore multi file `--exclude a.md --exclude b.md  `  
    Support regexp. Ignore start with `_` `--exclude='^_\S*'`
- `--blog` parse YAML `frontmatter` block in the Markdown file.  
    Front matter options `title`,`publish`
- `--package` Parent directory as the first header

    

## Author

👤 **ifuture**

* Website: https://ifuture.pro
* Github: [@ifuture-pro](https://github.com/ifuture-pro)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [ifuture](https://github.com/ifuture-pro).<br />
This project is [MIT](https://github.com/ifuture-pro/listify/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_