import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChannelDropdown = ({ channelId, onRename, onRemove,  isActive = false }) => {
  const [show, setShow] = useState(false);
  const { channels } = useSelector(state => state.channels);

  const channel = channels.find(ch => ch.id === channelId);

  // Защищаем системные каналы
  const isSystemChannel = channel?.name === 'general' || channel?.name === 'random';

  // Если системный канал - не показываем меню вообще
  if (isSystemChannel) {
    return null;
  }

  const handleRename = () => {
    onRename();
    setShow(false);
  };

  const handleRemove = () => {
    onRemove();
    setShow(false);
  };

  return (
    <Dropdown show={show} onToggle={setShow}>
       <Dropdown.Toggle
        variant={isActive ? "secondary" : "light"}
        className="flex-grow-0 dropdown-toggle dropdown-toggle-split"
        style={{
          minWidth: '30px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          // borderTopRightRadius: '0.375rem',
          // borderBottomRightRadius: '0.375rem'
        }}
        id={`dropdown-channel-${channelId}`}
      >
        <span className="visually-hidden">Управление каналом</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRemove}>
          Удалить
        </Dropdown.Item>
        <Dropdown.Item onClick={handleRename}>
          Переименовать
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelDropdown;