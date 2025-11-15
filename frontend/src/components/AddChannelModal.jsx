import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createChannel } from '../store/slices/channelSlice.jsx'
import { useTranslation } from 'react-i18next'
import { showError } from '../utils/notifications.js'
import { filterProfanity } from '../utils/wordsfilter.js'
import { toast } from 'react-toastify'

const AddChannelModal = ({ show, onHide }) => {
  const [channelName, setChannelName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const dispatch = useDispatch()
  const { channels } = useSelector(state => state.channels)
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    let name = channelName.trim()
    setValidationError('')

    if (!name) {
      setValidationError(t('modal.error.required'))
      return
    }

    // Применяем цензуру к имени для проверки уникальности
    const censoredName = filterProfanity(name)

    // Проверка на уникальность имени
    const isNameUnique = !channels.some(channel =>
      channel.name.toLowerCase() === censoredName.toLowerCase(),
    )

    if (!isNameUnique) {
      setValidationError(t('modal.error.notOneOf'))
      return
    }

    if (name.length < 3 || name.length > 20) {
      setValidationError(t('modal.error.length'))
      return
    }

    setIsSubmitting(true)

    try {
      // Создаем канал с зацензуренным именем
      await dispatch(createChannel(censoredName)).unwrap()
      toast.success(t('toast.addChannel'))
      onHide()
      setChannelName('')
    }
    catch {
      showError(t('toast.addChannelerror'))
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setChannelName('')
    setValidationError('')
    onHide()
  }

  const handleInputChange = (e) => {
    setChannelName(e.target.value)
    setValidationError('')
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addChannel.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="name" className="visually-hidden">
              Имя канала
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              value={channelName}
              onChange={handleInputChange}
              placeholder=""
              disabled={isSubmitting}
              className={`mb-2 form-control ${validationError ? 'is-invalid' : ''}`}
            />
            {validationError && (
              <div className="invalid-feedback">
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
            {isSubmitting ? t('modal.confirmBtn') : t('modal.addChannel.createBtn')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddChannelModal
