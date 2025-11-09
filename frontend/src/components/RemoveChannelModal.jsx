import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { deleteChannel } from '../slices/channelSlice.jsx';
import { showError } from '../utils/notifications.js';
import { toast } from 'react-toastify';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);
  const { t } = useTranslation();
  
  const channel = channels.find(ch => ch.id === channelId);
  const isDefaultChannel = channelId === 1; // general канал нельзя удалять

  const handleDelete = async () => {
    if (isDefaultChannel) return;

    setIsSubmitting(true);

    try {
      await dispatch(deleteChannel(channelId)).unwrap();
      toast.success(t('toast.removedChannel')); 
      onHide();
    } catch (error) {
      console.error('Ошибка удаления канала:', error);
      showError(t('toast.fetchError')); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        {isDefaultChannel ? (
          <p>Невозможно удалить основной канал #general</p>
        ) : (
          <p>{t('modal.removeChannel.body')}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('modal.cancelBtn')}
        </Button>
        {!isDefaultChannel && (
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={isSubmitting}
          >
            {isSubmitting ? t('modal.confirmBtn') : t('modal.removeChannel.deleteBtn')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;