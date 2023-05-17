import { useReducer } from "react";
import "./styles/style.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import logo from "./assets/github.png";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

function reducer(
  state: any,
  { type, payload }: { type: string; payload?: any }
) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overwrite: false,
        };
      }

      //Avoid Logic Errors
      //Handles user inputting "." as first digit
      if (payload.digit === "." && state.currOperand == null) {
        return {
          ...state,
          currOperand: "0" + payload.digit,
        };
      }
      //Stops user from entering multiple periods
      if (payload.digit === "." && state.currOperand.includes("."))
        return state;
      //Numbers cannot start with multtiple '0's
      if (payload.digit === "0" && state.currOperand === "0") return state;

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.prevOperand && !state.currOperand) {
        return state;
      }

      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (!state.prevOperand) {
        return {
          ...state,
          prevOperand: state.currOperand,
          operation: payload.operation,
          currOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (!state.currOperand || !state.operation || !state.prevOperand)
        return state;

      return {
        ...state,
        prevOperand: null,
        operation: null,
        overwrite: true,
        currOperand: evaluate(state),
      };

    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: null,
        };
      }

      if (state.currOperand == null) return state;

      if (state.currOperand.length === 1) {
        return {
          ...state,
          currOperand: 0,
        };
      }

      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
  }
}

function evaluate({ currOperand, prevOperand, operation }: any) {
  console.log("Entered Evaluate");
  const curr = parseFloat(currOperand);
  const prev = parseFloat(prevOperand);
  console.log("Set Values");
  if (isNaN(curr) || isNaN(prev)) return "";

  console.log("Passed Number Check");
  let computation: any = "";
  switch (operation) {
    case "+":
      console.log("Divide");
      computation = curr + prev;
      break;

    case "-":
      console.log("Subtract");
      computation = prev - curr;
      break;

    case "*":
      console.log("Multiply");
      computation = prev * curr;
      break;

    case "÷":
      console.log("Divide");
      computation = prev / curr;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand: any) {
  if (operand == null) {
    return;
  }
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="git-link">
        <img src={logo} alt="logo" className="git-logo" />
      </div>
      <div className="calc">
        <div className="output">
          <div className="prev-operand">
            {formatOperand(prevOperand)} {operation}
          </div>
          <div className="curr-operand">{formatOperand(currOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.DELETE });
          }}
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => {
            dispatch({ type: ACTIONS.EVALUATE });
          }}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
