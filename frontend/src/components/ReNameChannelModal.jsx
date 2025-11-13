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
  const [validationError, setValidationError] = useState('');
  const { channels } = useSelector(state => state.channels);
  const { t } = useTranslation();

  const channel = channels.find(ch => ch.id === channelId);

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name);
      setValidationError('');
    }
  }, [channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = channelName.trim();
    setValidationError('');

    if (!name || !channel) return;

    // Проверка на уникальность имени (исключая текущий канал)
    const isNameUnique = !channels.some(ch =>
      ch.id !== channelId && ch.name.toLowerCase() === name.toLowerCase()
    );

    if (!isNameUnique) {
      setValidationError(t('modal.error.notOneOf'));
      return;
    }

    if (name.length < 3 || name.length > 20) {
      setValidationError(t('modal.error.length'));
      return;
    }

    if (hasProfanity(name)) {
      setValidationError(t('modal.error.profanity'));
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(renameChannel({ id: channelId, name })).unwrap();
      toast.success(t('toast.renamedChannel'));
      onHide();
    } catch (error) {
      setValidationError(t('toast.renameChannelerror'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChannelName(channel?.name || '');
    setValidationError('');
    onHide();
  };

    const handleInputChange = (e) => {
    setChannelName(e.target.value);
    setValidationError('');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="name" className="visually-hidden">
              Имя канала
            </Form.Label>
            <Form.Control
              type="text"
              id="name"
              value={channelName}
             onChange={handleInputChange}
              placeholder=""
              required
              disabled={isSubmitting}
              className={`mb-2 form-control ${validationError ? 'is-invalid' : ''}`}
            />  
            {validationError && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {validationError}
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting} className="me-2">
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