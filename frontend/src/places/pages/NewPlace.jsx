import Input from "../../shared/components/FormELements/Input";
import "./PlaceForm.css";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from '../../shared/components/FormELements/Button/Button'
import { useForm } from "../../hooks/form-hook";

function NewPlace() {
  const [formState, inputHandler]= useForm({
    inputs:{
      title:{
        value: '',
        isValid: false
      },
      description:{
        value: '',
        isValid: false
    },
      address:{
        value: '',
        isValid: false
    }
    },
   
  }, false)

  const placeSubmitHandler = (e) =>{
    e.preventDefault()
    console.log(formState.inputs)
  }
  return (
    <form action="" className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id='title'
        type="text"
        label="Title"
        element="input"
        errorText="Please enter a valid title."
        validators= {[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
      />
      <Input
        id='description'
        label="Description"
        element="textarea"
        errorText="Please enter a valid description (at least 5 characters)"
        validators= {[VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
      />
      <Input
        id='address'
        label="Address"
        element="input"
        errorText="Please enter a valid address"
        validators= {[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>Add Place</Button>
    </form>
  );
}

export default NewPlace;
