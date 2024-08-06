import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormELements/Input";
import Button from "../../shared/components/FormELements/Button/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../hooks/form-hook";

import "./PlaceForm.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [isLoading, setIsLoading] = useState(true)
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

  
  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false)
  }, [setFormData, identifiedPlace]);


  const placeUpdateSubmit = (e) => {
    e.preventDefault()
    console.log(formState.inputs)
  }

  if(isLoading){
    return(
      <div className="center">
        <h2>loading</h2>
      </div>
    )
  }

  if(!identifiedPlace){
    return(
      <div className="center">
        <Card>
        <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }
  return (
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
  );
};

export default UpdatePlace;
