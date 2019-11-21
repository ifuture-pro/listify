listify
------------------------

Generate and merge all directories to the specified file.

Automatically generate a directory for the document, add it to README.md or other files.   

Support for summarizing multiple documents and generating directory.


Usage
-------------

```bash
# registry = https://npm.pkg.github.com/

npm install @ifuture-pro/listify
```

*recommend*
    
```bash
# https://registry.npmjs.org/

npm install @ifuture/listify -g
```


```bash
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
    


Demo
----------------
Example result out file
[demo](demo/README.md)
