import Card from '../../shared/components/UIElements/Card'
import  UserItem  from './UserItem'
import './UserList.css'

const UserList= props => {
  console.log(props.items)
    if (props.items.length === 0){
        return(
            <div className="center">
               <Card>
                <h2>No Users Founds</h2>
                </Card>
            </div>
        )
    }
   
  return (
    <ul className='users-list'>
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
}

export default UserList