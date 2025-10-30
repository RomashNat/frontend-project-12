import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChannel } from '../slices/channelSlice.jsx';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);
  
  const channel = channels.find(ch => ch.id === channelId);
  const isDefaultChannel = channelId === 1; // general канал нельзя удалять

  const handleDelete = async () => {
    if (isDefaultChannel) return;

    setIsSubmitting(true);

    try {
      await dispatch(deleteChannel(channelId)).unwrap();
      onHide();
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
      alert('Не удалось удалить канал');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isDefaultChannel ? (
          <p>Невозможно удалить основной канал #general</p>
        ) : (
          <p>Уверены, что хотите удалить канал <strong>#{channel?.name}</strong>? Все сообщения будут удалены.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        {!isDefaultChannel && (
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Удаление' : 'Удалить'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;