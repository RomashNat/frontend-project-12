import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const ChatPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container fluid className="h-100">
      <div className="h-100 d-flex">
        {/* Боковая панель с каналами */}
        <div className="bg-light border-end" style={{ width: '300px' }}>
          <h4 className="p-3 border-bottom">Каналы</h4>
          {/* Список каналов будет здесь */}
        </div>
        
        {/* Основная область чата */}
        <div className="flex-grow-1 d-flex flex-column">
          <div className="border-bottom p-3">
            <h5># general</h5>
          </div>
          
          {/* Сообщения */}
          <div className="flex-grow-1 p-3">
            {/* Сообщения будут здесь */}
          </div>
          
          {/* Форма отправки сообщения */}
          <div className="border-top p-3">
            <form>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Введите сообщение..."
                />
                <button className="btn btn-primary" type="submit">
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ChatPage;