let path = '/a/b/d/c';
path = path.slice(1, path.length)
console.log(path)
let fpath = path.split('/').reverse();
console.log(fpath.pop());