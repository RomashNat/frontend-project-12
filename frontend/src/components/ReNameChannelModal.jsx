import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../slices/channelSlice.jsx';
import { useTranslation } from 'react-i18next';
import { showError } from '../utils/notifications.js';
import { hasProfanity } from '../utils/wordsfilter.js';
import { toast } from 'react-toastify';


const ReNameChannelModal = ({ show, onHide, channelId }) => {
  const [channelName, setChannelName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);
   const { t } = useTranslation();
  
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
      showError(t('modal.error.notOneOf'));
      return;
    }

    if (name.length < 3 || name.length > 20) {
      showError(t('modal.error.length'));
      return;
    }

      if (hasProfanity(name)) {
      showError(t('modal.error.profanity'));
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(renameChannel({ id: channelId, name })).unwrap();
      toast.success(t('toast.renamedChannel'));
      onHide();
    } catch (error) {
      console.error('Ошибка переименования канала:', error);
      showError(t('toast.fetchError'));
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
        <Modal.Title>{t('modal.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Имя канала"
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
            {isSubmitting ? t('modal.confirmBtn') : t('modal.renameChannel.confirmBtn')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReNameChannelModal;