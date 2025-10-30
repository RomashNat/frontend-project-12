// components/RenameChannelModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../slices/channelSlice.jsx';

const RenameChannelModal = ({ show, onHide, channelId }) => {
  const [channelName, setChannelName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);
  
  const channel = channels.find(ch => ch.id === channelId);

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name);
    }
  }, [channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const name = channelName.trim();
    if (!name || !channel) return;

    // Проверка на уникальность имени (исключая текущий канал)
    const isNameUnique = !channels.some(ch => 
      ch.id !== channelId && ch.name.toLowerCase() === name.toLowerCase()
    );

    if (!isNameUnique) {
      alert('Канал с таким именем уже существует');
      return;
    }

    if (name.length < 3 || name.length > 20) {
      alert('Название канала должно быть от 3 до 20 символов');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(renameChannel({ id: channelId, name })).unwrap();
      onHide();
    } catch (error) {
      console.error('Ошибка переименования канала:', error);
      alert('Не удалось переименовать канал');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChannelName(channel?.name || '');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Введите новое название канала"
              required
              minLength={3}
              maxLength={20}
              disabled={isSubmitting}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение' : 'Сохранить'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;