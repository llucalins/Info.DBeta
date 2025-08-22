import React, { useState } from 'react';

function RightClickTrainer({ onComplete }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [completedActions, setCompletedActions] = useState([]);

  const items = [
    { name: 'Documento.docx', type: 'file', icon: '📄' },
    { name: 'Imagem.jpg', type: 'image', icon: '🖼️' },
    { name: 'Pasta Trabalho', type: 'folder', icon: '📁' },
    { name: 'Apresentação.pptx', type: 'file', icon: '📊' }
  ];

  const menuOptions = {
    file: [
      { label: 'Abrir', action: 'open', icon: '🔓' },
      { label: 'Copiar', action: 'copy', icon: '📋' },
      { label: 'Colar', action: 'paste', icon: '📋' },
      { label: 'Renomear', action: 'rename', icon: '✏️' },
      { label: 'Excluir', action: 'delete', icon: '🗑️' },
      { label: 'Propriedades', action: 'properties', icon: 'ℹ️' }
    ],
    image: [
      { label: 'Abrir', action: 'open', icon: '🔓' },
      { label: 'Copiar', action: 'copy', icon: '📋' },
      { label: 'Definir como papel de parede', action: 'wallpaper', icon: '🖼️' },
      { label: 'Editar', action: 'edit', icon: '✏️' },
      { label: 'Excluir', action: 'delete', icon: '🗑️' }
    ],
    folder: [
      { label: 'Abrir', action: 'open', icon: '🔓' },
      { label: 'Copiar', action: 'copy', icon: '📋' },
      { label: 'Colar', action: 'paste', icon: '📋' },
      { label: 'Renomear', action: 'rename', icon: '✏️' },
      { label: 'Excluir', action: 'delete', icon: '🗑️' },
      { label: 'Propriedades', action: 'properties', icon: 'ℹ️' }
    ]
  };

  const handleRightClick = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMenuAction = (action) => {
    if (!selectedItem) return;

    let actionMessage = '';
    
    switch (action) {
      case 'open':
        actionMessage = `Abrindo ${selectedItem.name}`;
        break;
      case 'copy':
        actionMessage = `Copiando ${selectedItem.name}`;
        break;
      case 'paste':
        actionMessage = `Colando ${selectedItem.name}`;
        break;
      case 'rename':
        actionMessage = `Renomeando ${selectedItem.name}`;
        break;
      case 'delete':
        actionMessage = `Excluindo ${selectedItem.name}`;
        break;
      case 'properties':
        actionMessage = `Mostrando propriedades de ${selectedItem.name}`;
        break;
      case 'wallpaper':
        actionMessage = `Definindo ${selectedItem.name} como papel de parede`;
        break;
      case 'edit':
        actionMessage = `Editando ${selectedItem.name}`;
        break;
      default:
        actionMessage = `Ação ${action} em ${selectedItem.name}`;
    }

    setMessage(actionMessage);
    setShowMenu(false);

    // Marcar ação como completa
    if (!completedActions.includes(action)) {
      setCompletedActions([...completedActions, action]);
    }

    // Verificar se todas as ações foram completadas
    setTimeout(() => {
      const allActions = ['open', 'copy', 'paste', 'rename', 'delete', 'properties'];
      const allCompleted = allActions.every(action => completedActions.includes(action));
      
      if (allCompleted && !completedActions.includes('complete')) {
        setCompletedActions([...completedActions, 'complete']);
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      }
    }, 1000);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setSelectedItem(null);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">🖱️ Botão Direito</h2>
        <p className="text-lg text-muted">Clique com o botão direito para ver as opções</p>
      </div>

      {/* Área de itens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-all"
            onContextMenu={(e) => handleRightClick(e, item)}
            onClick={() => setSelectedItem(item)}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="font-medium text-sm">{item.name}</div>
            <div className="text-xs text-gray-500">{item.type}</div>
          </div>
        ))}
      </div>

      {/* Menu de contexto */}
      {showMenu && (
        <div className="context-menu" style={{ left: menuPosition.x, top: menuPosition.y }}>
          {menuOptions[selectedItem.type].map((option, index) => (
            <div
              key={index}
              className="context-menu-item"
              onClick={() => handleMenuAction(option.action)}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem de ação */}
      {message && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <p className="text-blue-800 font-medium">{message}</p>
        </div>
      )}

      {/* Progresso das ações */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-bold mb-2">Ações completadas:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['open', 'copy', 'paste', 'rename', 'delete', 'properties'].map(action => (
            <div
              key={action}
              className={`p-2 rounded text-sm ${
                completedActions.includes(action) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {completedActions.includes(action) ? '✅' : '⏳'} {action}
            </div>
          ))}
        </div>
      </div>

      {/* Instruções */}
      <div className="text-center text-sm text-gray-600">
        <p>💡 Dica: Clique com o botão direito do mouse nos itens para ver o menu de contexto</p>
        <p>🎯 Objetivo: Complete todas as ações para finalizar o treinamento</p>
      </div>

      {/* Overlay para fechar menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={closeMenu}
        />
      )}
    </div>
  );
}

export default RightClickTrainer;
