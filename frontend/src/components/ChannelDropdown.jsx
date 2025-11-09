import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChannelDropdown = ({ channelId, onRename, onRemove }) => {
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
        variant="light"
        className="p-1 border-0 bg-transparent"
        style={{ minWidth: '30px' }}
        id={`dropdown-channel-${channelId}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          {/* <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/> */}
        </svg>
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