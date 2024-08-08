import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormELements/Input";
import Button from "../../shared/components/FormELements/Button/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../hooks/form-hook";
import { useNavigate } from "react-router-dom";
import "./PlaceForm.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import {useHttpClient} from '../../hooks/http-hook'
import { AuthContext } from '../../context/auth-context'
import { useContext } from "react";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'


const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [userPlace, setUserPlace] = useState([])
  const [formState, inputHandler,setFormData]= useForm({
      title:{
        value: '',
        isValid: false
      },
      description:{
        value: '',
        isValid: false
    }
   
  }, false)

useEffect(() => {
  const fetchPlace = async()=>{
    try {
      const data = await sendRequest(`http://localhost:5000/api/places/${placeId}` )
      setUserPlace(data.place)
      setFormData(
        {
          title: {
            value: data.place.title,
            isValid: true,
          },
          description: {
            value: data.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (err) {
      
    }
  }

  fetchPlace()
  
  }, [sendRequest,placeId,setFormData]);



  const placeUpdateSubmit = async(e) => {
    e.preventDefault()
    const body = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value
    }
    try{
      await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify(body),
      {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${auth.token}`
      })
      navigate('/' + auth.userId + '/places')
    }catch(err){

    }
  }

  if(isLoading){
    return(
      <div className="center">
        <LoadingSpinner/>
      </div>
    )
  }

  if(!userPlace && !error){
    return(
      <div className="center">
        <Card>
        <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }
  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    {
      !isLoading && userPlace &&
   
    <form className="place-form" onSubmit={placeUpdateSubmit}>
    <Input
      id="title"
      element="input"
      type="text"
      label="Title"
      validators={[VALIDATOR_REQUIRE()]}
      errorText='Please enter a valid title.'
      onInput={inputHandler}
      initialValue={formState.inputs.title.value}
      initialValid={formState.inputs.title.isValid}  
     />
    <Input
          id='description'
          label="Description"
          element="textarea"
          errorText="Please enter a valid description (at least 5 characters)"
          validators= {[VALIDATOR_MINLENGTH(5)]}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
          onInput={inputHandler}
     />
     
     <Button type='submit' disabled={!formState.isValid}>Add Place</Button>
    </form>
     }
    </>
  );
};

export default UpdatePlace;
