import React from 'react';
import { useRollbar } from '@rollbar/react';

function TestError() {
  const a = null;
  return a.hello(); // Это вызовет ошибку
}

export default function TestRollbar() {
  const rollbar = useRollbar();

  const testSimpleError = () => {
    try {
      const b = null;
      b.hello(); // Простая ошибка
    } catch (error) {
      rollbar.error('Simple test error', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Test Rollbar Integration</h3>
      <button onClick={testSimpleError} className="btn btn-danger">
        Test Simple Error
      </button>
      <div style={{ marginTop: '20px' }}>
        <TestError /> {/* Этот компонент вызовет ошибку автоматически */}
      </div>
    </div>
  );
}