import UserList from "../components/UserList"
import { useState, useEffect } from 'react'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import {useHttpClient} from '../../hooks/http-hook'
const User=()=> {
  const [loadedUsers, setLoadedUsers] = useState([])
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  useEffect(() => {
   const fetchUsers = async () =>{
    try {
      const data = await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/users`)
      setLoadedUsers(data.users)
    } catch (error) {
    }
   }
   fetchUsers()
  }, [sendRequest])
  
  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
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