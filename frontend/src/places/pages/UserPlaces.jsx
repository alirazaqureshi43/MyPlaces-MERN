import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import {useHttpClient} from '../../hooks/http-hook'

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const userId = useParams().userId
  const [userPlaces, setUserPlaces] = useState([])
  useEffect(() => {
    const fetchPlaces = async()=>{
      try {
        const data = await sendRequest(`http://localhost:5000/api/places/user/${userId}` )
        setUserPlaces(data.places)
      } catch (err) {
        
      }
    }

    fetchPlaces()
   
  }, [sendRequest,userId])

  const deletePlaceHandler = (deletedPlaceId) =>{
    setUserPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
  }
  
  return <>
  <ErrorModal error={error} onClear={clearError}/>
  {isLoading &&
  <div className="center">
    <LoadingSpinner asOverlay/>
  </div>
  }
  {
    !isLoading && userPlaces &&
    <PlaceList items={userPlaces} onDeletePlace={deletePlaceHandler} />
  }
</>
};

export default UserPlaces;