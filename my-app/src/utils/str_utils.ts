export function insert(str: string, index: number, value: string){
    return str.slice(0, index) + value + str.slice(index);
}

export function remove(str: string, index: number){
    return str.slice(0, index) + str.slice(index + 1);
}

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function strcmp(a: string, b: string) {
    if(a < b){
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
}

export function longestCommonPrefix(arr: Array<string>)
{
  if (!arr.length)
  {
    return "";
  }
  arr.sort();
  let prefix = "";
  for (let i = 0; i < arr[0].length; i++)
  {
    if (arr.every((x) => x[i] === arr[0][i]))
    {
      prefix += arr[0][i];
    }
    else {
      break;
    }
  }
  return prefix;
}

export function expandToken(token: string, search: Array<string>): Array<string> {
    let matched: Array<string> = []
    token = escapeRegExp(token);
    token = token.replace('\\*', '.*');
    token = '^' + token;
    const re = new RegExp(token);
    search.forEach((fn) => {
        if(re.test(fn)){
            matched.push(fn);
        }
    });
    return matched;
}

export function parseTokens(s: string): Array<string> {
    let parsed: Array<string> = []
    let curr = ''
    let inQuot = false;
    for(const c of s){
        if(c == '"'){
            inQuot = !inQuot;
        } else if (c == ' '){
            if(!inQuot){
                parsed.push(curr);
                curr = '';
            } else {
                curr += c;
            }
        } else {
            curr += c;
        }
    }
    if(curr){
        parsed.push(curr);
    }
    return parsed;
}