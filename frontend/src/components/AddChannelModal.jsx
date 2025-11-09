import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../slices/channelSlice.jsx';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../utils/notifications.js';
import { hasProfanity } from '../utils/wordsfilter.js';

const AddChannelModal = ({ show, onHide }) => {
  const [channelName, setChannelName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = channelName.trim();
    if (!name) return;

    // Проверка на уникальность имени
    const isNameUnique = !channels.some(channel =>
      channel.name.toLowerCase() === name.toLowerCase()
    );

    if (!isNameUnique) {
      showError(t('modal.error.notOneOf'));
      return;
    }

    if (name.length < 3 || name.length > 20) {
      alert('Название канала должно быть от 3 до 20 символов');
      return;
    }

    if (hasProfanity(name)) {
      showError(t('modal.error.profanity'));
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(createChannel(name)).unwrap();
      setChannelName('');

      showSuccess('Канал создан');

      await new Promise(resolve => setTimeout(resolve, 5000));

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
        <Modal.Title>{t('modal.addChannel.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Label>{t('modal.addChannel.label')}</Form.Label>
          <Form.Group>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={t('modal.addChannel.placeholder')}
              required
              minLength={3}
              maxLength={20}
              disabled={isSubmitting}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            {t('modal.cancelBtn')}
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('modal.confirmBtn') : t('modal.addChannel.createBtn')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChannelModal;