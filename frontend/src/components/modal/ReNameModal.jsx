import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { renameChannel } from '../slices/channelsSlice';
import routes from '../routes';

const ReNameModal = ({ modalInfo, onHide }) => {
  const inputRef = useRef();
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [isSubmitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const channelsNames = useSelector((state) => state.channels.channels)
    .map((channel) => channel.name)
    .filter(name => name !== modalInfo.item.name); // Исключаем текущее имя канала

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

  const editChannel = async (newName, id) => {
    setSubmitting(true);
    try {
      const response = await axios.patch(
        `${routes.channelsPath()}/${id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const renamedChannel = response.data;
      dispatch(renameChannel(renamedChannel));
    } catch (error) {
      console.log(error.message);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: { name: modalInfo.item.name },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const newName = values.name;
      const { id } = modalInfo.item;
      editChannel(newName, id);
      onHide();
    },
  });

  return (
    <Modal show centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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
              {formik.errors.name ? formik.errors.name : ''}
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

export default ReNameModal;