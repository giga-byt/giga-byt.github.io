import { parseTokens, escapeRegExp } from '../src/utils/str_utils.js'

let asTokens = parseTokens('echo read*');
let expanded: Array<string> = [];
let children: Array<string> = ['areader.png', 'readme.md', 'read2.ogg', 'third.png']

for(let tok of asTokens){
    if(tok.includes('*')){
        tok = escapeRegExp(tok);
        tok = tok.replace('\\*', '.*');
        tok = '^' + tok;
        const re = new RegExp(tok);
        children.forEach((fn) => {
            if(re.test(fn)){
                expanded.push(fn);
            }
        });
    } else {
        expanded.push(tok);
    }
}
console.log(expanded.join(' '));
