import Input from "../../shared/components/FormELements/Input";
import { useNavigate } from 'react-router-dom'
import "./PlaceForm.css";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from '../../shared/components/FormELements/Button/Button'
import { useForm } from "../../hooks/form-hook";
import {useHttpClient} from '../../hooks/http-hook'
import { AuthContext } from '../../context/auth-context'
import { useContext } from "react";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import ImageUpload from '../../shared/components/FormELements/ImageUpload'

function NewPlace() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
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
    },
      image:{
        value: null,
        isValid: false
    }
    },
   
  }, false)

  const placeSubmitHandler = async(e) =>{
    e.preventDefault()
    try {
      const formData = new FormData()
            formData.append('title', formState.inputs.title.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('address', formState.inputs.address.value)
            formData.append('image', formState.inputs.image.value)
      await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/places`, 'POST',formData, {
        Authorization : `Bearer ${auth.token}`
      } )

      navigate('/')
    } catch (err) {
      
    }
  }
  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading &&
    <div className="center">
      <LoadingSpinner asOverlay/>
    </div>
    }

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
      <ImageUpload id='image' onInput={inputHandler} errorText='Please provide an image' />
      <Button type='submit' >Add Place</Button>
    </form>
    </>
  );
}

export default NewPlace;

