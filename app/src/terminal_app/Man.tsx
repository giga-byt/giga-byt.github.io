import './TextFormatting.css'

export const helpText = convert(`
GNU bash, version 4.4.23(1)-release (x86_64-pc-msys)
These shell commands are defined internally.  Type 'help' to see this list.

A star (*) next to a name means that the command is disabled.

exit  return to graphical mode
ls    view
`)

export const helpCommands = new Map<string, string>([
    ['a', 'b']
]);

function convert(str: string): JSX.Element {
    let splitString = str.split('\n')
    if(!splitString[0]){
        splitString.shift()
    }
    return (
        <div>
            {splitString.map((line) => <span className='multiple-space-span'>{line + '\n'}</span>)}
        </div>
    )
}