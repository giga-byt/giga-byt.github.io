import './TextFormatting.css'

export function displayStringArray(strs: Array<string>): JSX.Element {
    return (
        <div>
            {strs.map((line) => <span className='multiple-space-span'>{line + '\n'}</span>)}
        </div>
    )
}