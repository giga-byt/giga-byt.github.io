export function insert(str: string, index: number, value: string){
    return str.slice(0, index) + value + str.slice(index);
}

export function remove(str: string, index: number){
    return str.slice(0, index) + str.slice(index + 1);
}