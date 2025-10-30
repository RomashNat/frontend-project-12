import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addChannel } from '../slices/channelsSlice';
import routes from '../routes';

const AddModal = ({ onHide, setCurrentChannelId }) => {
  const inputRef = useRef();
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [isSubmitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const channelsNames = useSelector((state) => state.channels.channels).map((channel) => channel.name);
  const { userId } = useSelector((state) => state.auth);
  const token = userId?.token;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channelsNames, 'Должно быть уникальным')
  });

  const sendChannel = async (name) => {
    setSubmitting(true);
    try {
      const response = await axios.post(routes.channelsPath(), { name }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const newChannel = response.data;
      dispatch(addChannel(newChannel));
      setCurrentChannelId(newChannel.id);
    } catch (error) {
      console.log(error.message);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const { name } = values;
      sendChannel(name);
      onHide();
    },
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              className={`mb-2 ${formik.errors.name ? 'is-invalid' : ''}`}
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              Имя канала
            </Form.Label>
            <div className="invalid-feedback">
              {formik.errors.name && formik.touched.name ? formik.errors.name : ''}
            </div>
            <div className="d-flex justify-content-end">
              <Button 
                type="button" 
                variant="secondary" 
                className="me-2" 
                onClick={onHide}
              >
                Отменить
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;