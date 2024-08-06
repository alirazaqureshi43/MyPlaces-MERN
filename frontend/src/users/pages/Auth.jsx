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
import './Auth.css'
const Auth = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState()
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
    setIsLoading(true)

    if(isLoginMode){
          const body = {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
        }
        console.log(body)
        try{
            setIsError(null)
            const res = await fetch('http://localhost:5000/api/users/login', {
                 method: 'POST',
                 headers:{
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(body)
             })
             const data = await res.json()
             if(!res.ok){ 
                throw new Error(data.message)
             }
             console.log(data)
             setIsLoading(false)
             auth.login();
             navigate('/u1/places');
        }catch(err){
            console.log(err)
            setIsLoading(false)
            setIsError(err.message || 'Something went wrong, please try again.')
        }
    }else{
        const body = {
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
        }
        console.log(body)
        try{
            setIsError(null)
            const res = await fetch('http://localhost:5000/api/users/signup', {
                 method: 'POST',
                 headers:{
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(body)
             })
             const data = await res.json()
             if(!res.ok){ 
                throw new Error(data.message)
             }
             console.log(data)
             setIsLoading(false)
             auth.login();
             navigate('/u1/places');
        }catch(err){
            console.log(err)
            setIsLoading(false)
            setIsError(err.message || 'Something went wrong, please try again.')
        }
    }
   
  
 }
 const switchHandler = () =>{
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name: undefined
        }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    }else{
        setFormData({
            ...formState.inputs,
            name:{
                value:'',
                isValid: false
            }
        }, false)
    }
    setIsLoginMode(!isLoginMode)
 }

 const errorHandler = ()=>{
    setIsError(null)
 }

  return (
    <>
    <ErrorModal error={isError} onClear={errorHandler}/>
    <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay/>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
            {!isLoginMode &&
              <Input 
              element='input'
              id='name'
              type='text'
              label='Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name'
              onInput={inputHandler}
              />
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