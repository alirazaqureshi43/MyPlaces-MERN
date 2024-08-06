import { useContext } from "react"
import Card from "../../shared/components/UIElements/Card";
import "./PlaceItem.css";
import Button from "../../shared/components/FormELements/Button/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { useState} from 'react'
import { AuthContext } from "../../context/auth-context"

const PlaceItem = (props) => {
  const auth = useContext(AuthContext)
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal,setShowConfirmModal] = useState(false)
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showDeleteWarningHandler = () => setShowConfirmModal(true)
  const cancelDeleteHandler = () => setShowConfirmModal(false)
  const confirmDeleteHandler = () => console.log('true')
  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map/>
        </div>
      </Modal>
      <Modal header='Are you sure?' footerClass='place-item__modal-actions'
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
      footer={
        <>
        <Button inverse onClick={cancelDeleteHandler} >Cancel</Button>
        <Button danger onClick={confirmDeleteHandler}>Delete</Button>
        </>
      }>
          <p>
            Do you want to proceed and delete the place ? Please note that
            it can not be undone thereafter.
          </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {
      auth.isLoggedIn && (
        <>
            <Button to={`/places/${props.id}`}>EDIT</Button>
            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
            </>
      )
      }
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
