import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { deleteChannel } from '../slices/channelSlice.jsx'
import { showError } from '../utils/notifications.js'
import { toast } from 'react-toastify'
import { Modal, Button, Form } from 'react-bootstrap'

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const isDefaultChannel = channelId === 1 // general канал нельзя удалять

  const handleDelete = async () => {
    if (isDefaultChannel) return

    setIsSubmitting(true)

    try {
      await dispatch(deleteChannel(channelId)).unwrap()
      toast.success(t('toast.removedChannel'))
      onHide()
    }
    catch {
      showError(t('toast.removeChannelerror'))
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          {isDefaultChannel
            ? <p>Невозможно удалить основной канал #general</p>
            : <p>{t('modal.removeChannel.body')}</p>}
        </Form.Group>
      </Modal.Body>
      <div className="d-flex me-2 mb-3 justify-content-end">
        <Button
          variant="secondary"
          onClick={onHide}
          className="me-2"
        >
          {t('modal.cancelBtn')}
        </Button>
        {!isDefaultChannel && (
          <Button
            className="me-2"
            variant="danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('modal.confirmBtn') : t('modal.removeChannel.deleteBtn')}
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default RemoveChannelModal
