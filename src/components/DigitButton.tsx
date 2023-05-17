import { ACTIONS } from "../App.tsx";

export default function DigitButton({
  dispatch,
  digit,
}: {
  dispatch: Function;
  digit: string;
}) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}
