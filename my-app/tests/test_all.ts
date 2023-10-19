import { parseTokens } from '../src/utils/str_utils.js'

function _assert_equal(a: any, b: any){
    if(a != b){
        throw Error("test failed: " + a + ' is not equal to ' + b);
    }
}

function parse_tok_test() {
    let input = 'echo a "b c" d';
    let output = parseTokens(input);
    _assert_equal(output.toString(), ['echo', 'a', 'b c', 'd'].toString());
}

function run_all(){
    parse_tok_test()
}

run_all()