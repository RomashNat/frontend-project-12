import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../slices/channelSlice.jsx';

const AddChannelModal = ({ show, onHide }) => {
  const [channelName, setChannelName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const name = channelName.trim();
    if (!name) return;

    // Проверка на уникальность имени
    const isNameUnique = !channels.some(channel => 
      channel.name.toLowerCase() === name.toLowerCase()
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
      await dispatch(createChannel(name)).unwrap();
      setChannelName('');
      onHide();
    } catch (error) {
      console.error('Ошибка создания канала:', error);
      alert('Не удалось создать канал');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChannelName('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder=""
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
            {isSubmitting ? 'Создание' : 'Создать'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChannelModal;