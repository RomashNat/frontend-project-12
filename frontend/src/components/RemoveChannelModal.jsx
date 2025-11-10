import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { deleteChannel } from '../slices/channelSlice.jsx';
import { showError } from '../utils/notifications.js';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';

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
        <Form.Group>
          {isDefaultChannel ? (
            <p>Невозможно удалить основной канал #general</p>
          ) : (
            <p>{t('modal.removeChannel.body')}</p>
          )}
        </Form.Group>
      </Modal.Body>
      <div className="d-flex me-2 mb-2 justify-content-end">
        <Button variant="secondary" onClick={onHide}>
          {t('modal.cancelBtn')}
        </Button>
        {!isDefaultChannel && (
          <Button
          className="d-flex me-2 mb-2 justify-content-end"
            variant="danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('modal.confirmBtn') : t('modal.removeChannel.deleteBtn')}
          </Button>
        )}
    </div>
    </Modal>
  );
};

export default RemoveChannelModal;