import { helpText } from "./Man";

export function helpFunc(arg?: string): JSX.Element {
  console.log(arg)
  if (arg == "") {
    return helpText;
  }
  else {
    return <p>""</p>;
  }
}