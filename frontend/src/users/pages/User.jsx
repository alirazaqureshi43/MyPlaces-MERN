import UserList from "../components/UserList"
import { useState, useEffect } from 'react'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const User=()=> {
  const [loadedUsers, setLoadedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState()

  useEffect(() => {
   const sendRequest = async () =>{
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/users')
      const data = await res.json()
      if(!res.ok){ 
        throw new Error(data.message)
     }
      setLoadedUsers(data.users)
    } catch (error) {
      console.log(err)
      setIsError(err.message || 'Something went wrong.')
    }
    setIsLoading(false)
   }
   sendRequest()
  }, [])
  
  const errorHandler = ()=>{
    setIsError(null)
 }
  return (
    <>
    <ErrorModal error={isError} onClear={errorHandler}/>
    {isLoading &&
    <div className="center">
      <LoadingSpinner asOverlay/>
    </div>
    }

    {
      !isLoading && loadedUsers &&
    <UserList items={loadedUsers}/>  
    }
    </>
  )
}

export default User