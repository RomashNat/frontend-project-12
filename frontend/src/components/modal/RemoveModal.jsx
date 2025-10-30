import { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { removeChannel } from '../slices/channelsSlice';
import routes from '../routes';

const RemoveModal = ({ modalInfo, onHide, setCurrentChannelId }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const token = userId?.token;
  const [isRemoving, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    setRemoving(true);
    try {
      const response = await axios.delete(
        `${routes.channelsPath()}/${modalInfo.item.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { id } = response.data;
      dispatch(removeChannel(id));
      setCurrentChannelId('1');
      onHide();
    } catch (error) {
      console.log(error.message);
    }
    setRemoving(false);
  };

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button 
            type="button" 
            variant="secondary" 
            className="me-2" 
            onClick={onHide}
          >
            Отменить
          </Button>
          <Button 
            type="button" 
            variant="danger" 
            onClick={handleRemove} 
            disabled={isRemoving}
          >
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;