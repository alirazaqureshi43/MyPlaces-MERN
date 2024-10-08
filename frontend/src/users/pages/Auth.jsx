import { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormELements/Input'
import Button from '../../shared/components/FormELements/Button/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators'
import { useForm } from '../../hooks/form-hook'
import { AuthContext } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import ImageUpload from '../../shared/components/FormELements/ImageUpload'
import { useHttpClient } from '../../hooks/http-hook'
import './Auth.css'
const Auth = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

 const [formState, inputHandler,setFormData] = useForm({
    email:{
        value:'',
        isValid: false
    },
    password:{
        value:'',
        isValid: false
    }
 })   

 const authSubmitHandler = async(e) =>{
    e.preventDefault()
  
    if(isLoginMode){
          const body = {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
        }
        try {
            const data = await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/users/login`, 'POST',JSON.stringify(body) ,
            {
               'Content-Type': 'application/json',
            })
        auth.login(data.userId, data.token);
        navigate(`/${data.userId}/places`); 
        } catch (err) {
            
        }
          
    }else{        
        try{
            const formData = new FormData()
            formData.append('name', formState.inputs.name.value)
            formData.append('email', formState.inputs.email.value)
            formData.append('password', formState.inputs.password.value)
            formData.append('image', formState.inputs.image.value)
            const data =  await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, 'POST',formData)
             auth.login(data.userId);
             navigate(`/${data.userId}/places`); 
        }catch(err){
            
        }
    }
   
  
 }
 const switchHandler = () =>{
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name: undefined,
            image: undefined
        }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    }else{
        setFormData({
            ...formState.inputs,
            name:{
                value:'',
                isValid: false
            },
            image:{
                value:null,
                isValid: false
            }
        }, false)
    }
    setIsLoginMode(!isLoginMode)
 }

  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay/>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
            {!isLoginMode &&
            <>
              <Input 
              element='input'
              id='name'
              type='text'
              label='Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name'
              onInput={inputHandler}
              />
              <ImageUpload id='image' center onInput={inputHandler} errorText='Please provide an image' />
              </>
            }
            <Input 
            element='input'
            id='email'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email'
            onInput={inputHandler}
            />
            <Input 
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid password, at least 5 characters'
            onInput={inputHandler}
            />
            <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGN UP'}</Button>
        </form>
            <Button inverse onClick={switchHandler}>Switch to {!isLoginMode ? 'LOGIN' : 'SIGN UP'}</Button>
    </Card>
    </>
  )
}

export default Auth