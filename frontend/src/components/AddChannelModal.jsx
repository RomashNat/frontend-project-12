import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createChannel } from '../store/slices/channelSlice.jsx'
import { useTranslation } from 'react-i18next'
import { showError } from '../utils/notifications.js'
import { filterProfanity } from '../utils/wordsfilter.js'
import { toast } from 'react-toastify'
import { validateChannelNameForCreation } from '../validation/validators.js'

const AddChannelModal = ({ show, onHide }) => {
  const [channelName, setChannelName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const dispatch = useDispatch()
  const { channels } = useSelector(state => state.channels)
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = channelName.trim()
    setValidationError('')

    // Используем вынесенную валидацию
    const error = validateChannelNameForCreation(name, channels)
    if (error) {
      setValidationError(t(`modal.error.${getErrorKey(error)}`))
      return
    }

    setIsSubmitting(true)

    try {
      // Создаем канал с зацензуренным именем
      const censoredName = filterProfanity(name)
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

  // Вспомогательная функция для получения ключа ошибки
  const getErrorKey = (error) => {
    const errorMap = {
      'Обязательное поле': 'required',
      'От 3 до 20 символов': 'length',
      'Канал с таким именем уже существует': 'notOneOf',
    }
    return errorMap[error] || 'required'
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
