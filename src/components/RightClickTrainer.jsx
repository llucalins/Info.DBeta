import React, { useState, useEffect } from 'react';

// Utilitário para síntese de voz
const say = (text) => {
  try {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  } catch (error) {
    console.log('Síntese de voz não disponível');
  }
};

function RightClickTrainer({ onComplete }) {
  const [message, setMessage] = useState('Clique com o botão direito na área abaixo para abrir o menu de contexto.');
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedItem, setSelectedItem] = useState('arquivo');
  const [completedActions, setCompletedActions] = useState([]);

  useEffect(() => {
    say("Vamos aprender sobre o botão direito do mouse! Clique com o botão direito para ver as opções.");
  }, []);

  const getContextMenuOptions = () => {
    return [
      {
        key: 'abrir',
        label: 'Abrir',
        icon: '📄',
        description: 'Abre o item selecionado',
        action: () => {
          setMessage(`Você escolheu: Abrir ${selectedItem}`);
          say(`Você escolheu abrir ${selectedItem}`);
          addCompletedAction('abrir');
        }
      },
      {
        key: 'copiar',
        label: 'Copiar',
        icon: '📋',
        description: 'Copia o item para a área de transferência',
        action: () => {
          setMessage(`Você escolheu: Copiar ${selectedItem}`);
          say(`Você escolheu copiar ${selectedItem}`);
          addCompletedAction('copiar');
        }
      },
      {
        key: 'colar',
        label: 'Colar',
        icon: '📋',
        description: 'Cola o item da área de transferência',
        action: () => {
          setMessage(`Você escolheu: Colar ${selectedItem}`);
          say(`Você escolheu colar ${selectedItem}`);
          addCompletedAction('colar');
        }
      },
      {
        key: 'renomear',
        label: 'Renomear',
        icon: '✏️',
        description: 'Permite alterar o nome do item',
        action: () => {
          setMessage(`Você escolheu: Renomear ${selectedItem}`);
          say(`Você escolheu renomear ${selectedItem}`);
          addCompletedAction('renomear');
        }
      },
      {
        key: 'excluir',
        label: 'Excluir',
        icon: '🗑️',
        description: 'Remove o item permanentemente',
        action: () => {
          setMessage(`Você escolheu: Excluir ${selectedItem}`);
          say(`Você escolheu excluir ${selectedItem}`);
          addCompletedAction('excluir');
        }
      },
      {
        key: 'propriedades',
        label: 'Propriedades',
        icon: '⚙️',
        description: 'Mostra informações detalhadas do item',
        action: () => {
          setMessage(`Você escolheu: Propriedades de ${selectedItem}`);
          say(`Você escolheu ver propriedades de ${selectedItem}`);
          addCompletedAction('propriedades');
        }
      }
    ];
  };

  const addCompletedAction = (action) => {
    setCompletedActions(prev => {
      const newActions = [...prev, action];
      if (newActions.length >= 3) {
        setTimeout(() => {
          say("Parabéns! Você completou o treinamento do botão direito!");
          onComplete?.();
        }, 1000);
      }
      return newActions;
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    say("Menu de contexto aberto. Escolha uma opção.");
  };

  const handleMenuClose = () => {
    setMenuPosition(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setMessage(`Item selecionado: ${item}. Clique com o botão direito para ver as opções.`);
    say(`Você selecionou ${item}`);
  };

  const contextMenuOptions = getContextMenuOptions();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-between mb-6">
        <div className="flex flex-center gap-4">
          <span className="badge badge-danger">
            Botão Direito do Mouse
          </span>
          <div className="text-sm text-muted">
            Ações completadas: {completedActions.length}/3
          </div>
        </div>
      </div>

      {/* Área de treinamento */}
      <div className="card">
        <div className="mb-6 text-center">
          <div className="text-6xl mb-4">🖱️</div>
          <h3 className="text-2xl font-bold mb-2">Menu de Contexto</h3>
          <p className="text-lg text-muted mb-6">
            Aprenda a usar o botão direito do mouse para acessar opções rápidas
          </p>
        </div>

        {/* Seleção de item */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Selecione um item para testar:</h4>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'arquivo', label: 'Arquivo', icon: '📄' },
              { key: 'pasta', label: 'Pasta', icon: '📁' },
              { key: 'imagem', label: 'Imagem', icon: '🖼️' },
              { key: 'musica', label: 'Música', icon: '🎵' },
              { key: 'video', label: 'Vídeo', icon: '🎬' }
            ].map(item => (
              <button
                key={item.key}
                className={`button ${selectedItem === item.key ? 'button-primary' : 'button-secondary'}`}
                onClick={() => handleItemSelect(item.key)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Área de teste */}
        <div className="mb-6">
          <div
            onContextMenu={handleContextMenu}
            className="training-area"
            style={{ 
              borderColor: '#d1d5db',
              backgroundColor: '#f9fafb'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.backgroundColor = '#fef2f2';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.backgroundColor = '#f9fafb';
              handleMenuClose();
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedItem === 'arquivo' && '📄'}
                {selectedItem === 'pasta' && '📁'}
                {selectedItem === 'imagem' && '🖼️'}
                {selectedItem === 'musica' && '🎵'}
                {selectedItem === 'video' && '🎬'}
              </div>
              <p className="font-semibold text-gray-700 mb-2">
                {selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)} selecionado
              </p>
              <p className="text-sm text-gray-500">
                Clique com o botão direito aqui
              </p>
            </div>

            {/* Menu de contexto */}
            {menuPosition && (
              <div
                style={{
                  position: 'absolute',
                  top: menuPosition.y,
                  left: menuPosition.x,
                  zIndex: 50
                }}
                className="context-menu"
                onMouseLeave={handleMenuClose}
              >
                {contextMenuOptions.map((option, index) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      option.action();
                      handleMenuClose();
                    }}
                    className="context-menu-item"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: 'slideIn 0.3s ease-out'
                    }}
                  >
                    <div className="text-gray-600">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de feedback */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-800 text-center font-medium">
            {message}
          </p>
        </div>
      </div>

      {/* Ações completadas */}
      {completedActions.length > 0 && (
        <div className="card">
          <h4 className="font-semibold mb-3">Ações realizadas:</h4>
          <div className="flex flex-wrap gap-2">
            {completedActions.map((action, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                style={{
                  animation: 'fadeIn 0.5s ease-out',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                ✓ {action}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="card" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Dicas sobre o botão direito:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Botão esquerdo = ação principal (abrir, selecionar)</li>
              <li>• Botão direito = menu de opções (copiar, colar, excluir)</li>
              <li>• O menu muda dependendo do que você clica</li>
              <li>• É uma forma rápida de acessar ações comuns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightClickTrainer;
