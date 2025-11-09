import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchChannels, setCurrentChannel } from '../slices/channelSlice';
import { fetchMessages, initSocket, removeSocket, joinChannelSocket, leaveChannelSocket, addMessage } from '../slices/messageSlice.jsx';
import { onNewMessage, removeMessageListener } from '../socket';
import MessageForm from '../components/MessageForm.jsx';
import AddChannelModal from '../components/AddChannelModal.jsx';
import RemoveChannelModal from '../components/RemoveChannelModal.jsx';
import RenameChannelModal from '../components/ReNameChannelModal.jsx';
import ChannelDropdown from '../components/ChannelDropdown.jsx';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { channels, currentChannelId } = useSelector(state => state.channels);
  const { messages } = useSelector(state => state.messages);

  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const channelMessages = messages.filter(message => message.channelId === currentChannelId);

  // Разделяем каналы на системные и пользовательские
  const systemChannels = channels.filter(channel =>
    channel.name === 'general' || channel.name === 'random'
  );
  const userChannels = channels.filter(channel =>
    channel.name !== 'general' && channel.name !== 'random'
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Инициализируем WebSocket
    dispatch(initSocket());

    // Загружаем каналы и сообщения
    dispatch(fetchChannels());
    dispatch(fetchMessages());

    // Очистка при размонтировании
    return () => {
      dispatch(removeSocket());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Отдельный эффект для WebSocket слушателей
  useEffect(() => {
    if (!isAuthenticated) return;

    // Обработчик новых сообщений
    const handleNewMessage = (newMessage) => {
      // Очищаем сообщение от двоеточия если оно есть
      const cleanMessage = {
        ...newMessage,
        body: newMessage.body.startsWith(': ') ? newMessage.body.slice(2) : newMessage.body
      };
      dispatch(addMessage(cleanMessage));
    };

    // Устанавливаем слушатель для новых сообщений
    onNewMessage(handleNewMessage);

    // Очистка при размонтировании
    return () => {
      removeMessageListener();
    };
  }, [isAuthenticated, dispatch]);

  // Эффект для присоединения к каналу при смене текущего канала
  useEffect(() => {
    if (currentChannelId) {
      dispatch(joinChannelSocket(currentChannelId));
    }

    // При смене канала выходим из предыдущего
    return () => {
      if (currentChannelId) {
        dispatch(leaveChannelSocket(currentChannelId));
      }
    };
  }, [currentChannelId, dispatch]);

  // Автоматически выбираем канал general при первой загрузке
  useEffect(() => {
    if (channels.length > 0 && !currentChannelId) {
      const generalChannel = channels.find(channel => channel.name === 'general');
      if (generalChannel) {
        dispatch(setCurrentChannel(generalChannel.id));
    } else if (channels.length > 0) {
      dispatch(setCurrentChannel(channels[0].id));
    }
  }
  }, [channels, currentChannelId, dispatch]);

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleAddChannel = () => {
    setShowAddModal(true);
  };

  const handleRenameChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRenameModal(true);
  };

  const handleRemoveChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRemoveModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Функция для правильного склонения сообщений
  const getMessagesCountText = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return t('chat.messagesCount_0', { count });
    }
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return t('chat.messagesCount_1', { count });
    }
    return t('chat.messagesCount_2', { count });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-100 d-flex flex-column">
      <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">{t('mainHeader.hexletChat')}</a>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            {t('mainHeader.signOut')}
          </button>
        </div>
      </Nav>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white">
          {/* Боковая панель с каналами */}
          <div className="col-4 col-md-2 border-end px-0 bg-light d-flex flex-column">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('chat.channels')}</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical"
                onClick={handleAddChannel}
                title={t('modal.addChannel.title')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                <span className="visually-hidden">{t('chat.addChannelBtn')}</span>
              </button>
            </div>

            <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {/* Системные каналы - без выпадающего меню */}
              {systemChannels.map(channel => (
                <li key={channel.id} className="nav-item w-100">
                  <button
                    type="button"
                    className={`w-100 rounded-0 text-start btn ${channel.id === currentChannelId ? 'btn-secondary' : ''
                      }`}
                    onClick={() => handleChannelSelect(channel.id)}
                    role="button"
                    name={channel.name}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              ))}

              {/* Пользовательские каналы - с выпадающим меню */}
              {userChannels.map(channel => (
                <li key={channel.id} className="nav-item w-100">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start btn ${channel.id === currentChannelId ? 'btn-secondary' : ''
                        }`}
                      onClick={() => handleChannelSelect(channel.id)}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                    <div className="ms-2">
                      <ChannelDropdown
                        channelId={channel.id}
                        onRename={() => handleRenameChannel(channel.id)}
                        onRemove={() => handleRemoveChannel(channel.id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Основная область чата */}
          <div className="col-8 col-md-10 p-0 h-100">
            <div className="d-flex flex-column h-100">
              {/* Заголовок канала */}
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b># {currentChannel?.name || t('chat.noFoundChannel')}</b>
                </p>
                <span className="text-muted">
                  {getMessagesCountText(channelMessages.length)}
                </span>
              </div>

              {/* Область сообщений */}
              <div className="chat-messages overflow-auto px-5 flex-grow-1">
                {channelMessages.length > 0 ? (
                  channelMessages.map(message => (
                    <div key={message.id} className="message mb-3">
                      <strong>{message.username}: </strong>
                      {decodeHTML(message.body)}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted mt-5">
                  </div>
                )}
              </div>
              <MessageForm />
            </div>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        channelId={selectedChannelId}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        channelId={selectedChannelId}
      />
    </div>
  );
};

export default ChatPage;