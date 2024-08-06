import "./Input.css";
import { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
        return{
            ...state,
            isTouched: true
        }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false
  });
  const onChangeHandler = (e) => {
    dispatch({
      type: "CHANGE",
      val: e.target.value,
      validators: props.validators,
    });
  };
  
  const onTouchHandler = (e) => {
    dispatch({
      type: "TOUCH"
    });
  };
  
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        value={inputState.value}
      />
    );

    const {id, onInput} = props;
    const { isValid, value} = inputState

    useEffect(() => {
      onInput(id, value, isValid)
    }, [id, value, isValid, onInput])
    
  return (
    <div
      className={`form-control ${
        !inputState.isValid &&  inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid &&  inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
