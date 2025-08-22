import React, { useState, useEffect } from 'react';

function FileExplorer({ onComplete }) {
  const [currentPath, setCurrentPath] = useState(['Início']);
  const [items, setItems] = useState([
    { name: 'Documentos', type: 'folder', contents: [
      { name: 'Trabalho', type: 'folder', contents: [
        { name: 'Relatório.docx', type: 'file' },
        { name: 'Apresentação.pptx', type: 'file' }
      ]},
      { name: 'Pessoal', type: 'folder', contents: [
        { name: 'Fotos', type: 'folder', contents: [
          { name: 'foto1.jpg', type: 'file' },
          { name: 'foto2.jpg', type: 'file' }
        ]},
        { name: 'Músicas', type: 'folder', contents: [
          { name: 'música1.mp3', type: 'file' },
          { name: 'música2.mp3', type: 'file' }
        ]}
      ]}
    ]},
    { name: 'Downloads', type: 'folder', contents: [
      { name: 'arquivo1.pdf', type: 'file' },
      { name: 'imagem.png', type: 'file' }
    ]},
    { name: 'Imagens', type: 'folder', contents: [
      { name: 'wallpaper.jpg', type: 'file' },
      { name: 'screenshot.png', type: 'file' }
    ]}
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('folder');
  const [completedTasks, setCompletedTasks] = useState([]);

  const getCurrentItems = () => {
    let current = items;
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.find(item => item.name === currentPath[i] && item.type === 'folder');
      if (folder) {
        current = folder.contents;
      }
    }
    return current;
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const goToRoot = () => {
    setCurrentPath(['Início']);
    setSelectedItem(null);
  };

  const createItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      name: newItemName,
      type: newItemType,
      contents: newItemType === 'folder' ? [] : undefined
    };

    const currentItems = getCurrentItems();
    currentItems.push(newItem);
    setItems([...items]);

    // Marcar tarefa como completa
    const taskKey = `create_${newItemType}`;
    if (!completedTasks.includes(taskKey)) {
      setCompletedTasks([...completedTasks, taskKey]);
    }

    setNewItemName('');
    setShowCreateMenu(false);
  };

  const deleteItem = (itemName) => {
    const currentItems = getCurrentItems();
    const index = currentItems.findIndex(item => item.name === itemName);
    if (index !== -1) {
      currentItems.splice(index, 1);
      setItems([...items]);
      setSelectedItem(null);

      // Marcar tarefa como completa
      if (!completedTasks.includes('delete')) {
        setCompletedTasks([...completedTasks, 'delete']);
      }
    }
  };

  const openItem = (item) => {
    if (item.type === 'folder') {
      navigateToFolder(item.name);
    } else {
      setSelectedItem(item);
    }
  };

  const checkCompletion = () => {
    const requiredTasks = ['create_folder', 'create_file', 'delete'];
    const allCompleted = requiredTasks.every(task => completedTasks.includes(task));
    
    if (allCompleted && !completedTasks.includes('complete')) {
      setCompletedTasks([...completedTasks, 'complete']);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  };

  // Verificar conclusão sempre que completedTasks mudar
  useEffect(() => {
    checkCompletion();
  }, [completedTasks]);

  const currentItems = getCurrentItems();

  return (
    <div className="card">
      {/* Header do explorador */}
      <div className="flex flex-between mb-4">
        <div className="flex flex-center gap-4">
          <span className="badge badge-primary">
            📁 Explorador de Arquivos
          </span>
          <div className="progress-container" style={{ width: '200px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${(completedTasks.length / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="button button-secondary" 
            onClick={goToRoot}
            disabled={currentPath.length === 1}
          >
            🏠 Início
          </button>
          <button 
            className="button button-secondary" 
            onClick={goBack}
            disabled={currentPath.length === 1}
          >
            ⬅️ Voltar
          </button>
          <button 
            className="button button-primary" 
            onClick={() => setShowCreateMenu(true)}
          >
            ➕ Criar
          </button>
        </div>
      </div>

      {/* Barra de navegação */}
      <div className="flex flex-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
        {currentPath.map((path, index) => (
          <React.Fragment key={index}>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              {path}
            </button>
            {index < currentPath.length - 1 && <span className="text-gray-400">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Área de criação */}
      {showCreateMenu && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold mb-2">Criar novo item:</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nome do item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="input flex-1"
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className="input"
            >
              <option value="folder">Pasta</option>
              <option value="file">Arquivo</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="button button-primary" onClick={createItem}>
              ✅ Criar
            </button>
            <button className="button button-secondary" onClick={() => setShowCreateMenu(false)}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              selectedItem === item 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => openItem(item)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {item.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className="font-medium">{item.name}</span>
            </div>
            
            {selectedItem === item && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex gap-1">
                  <button
                    className="button button-secondary text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.name);
                    }}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tarefas para completar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-bold mb-2">Tarefas para completar:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className={`p-2 rounded ${completedTasks.includes('create_folder') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {completedTasks.includes('create_folder') ? '✅' : '⏳'} Criar uma pasta
          </div>
          <div className={`p-2 rounded ${completedTasks.includes('create_file') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {completedTasks.includes('create_file') ? '✅' : '⏳'} Criar um arquivo
          </div>
          <div className={`p-2 rounded ${completedTasks.includes('delete') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {completedTasks.includes('delete') ? '✅' : '⏳'} Excluir um item
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>💡 Dica: Clique duas vezes para abrir pastas • Clique uma vez para selecionar • Use os botões para navegar</p>
      </div>
    </div>
  );
}

export default FileExplorer;
