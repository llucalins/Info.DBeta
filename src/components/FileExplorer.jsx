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

// Hook para localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log('Erro ao salvar no localStorage');
    }
  };

  return [storedValue, setValue];
};

function FileExplorer({ onComplete }) {
  const [fileSystem, setFileSystem] = useLocalStorage('fileSystem', {
    root: {
      type: 'folder',
      children: {
        'Documentos': {
          type: 'folder',
          children: {
            'Minhas Notas.txt': {
              type: 'file',
              content: 'Aqui você pode escrever suas anotações importantes.'
            }
          }
        },
        'Imagens': {
          type: 'folder',
          children: {}
        },
        'Downloads': {
          type: 'folder',
          children: {}
        }
      }
    }
  });

  const [currentPath, setCurrentPath] = useLocalStorage('currentPath', ['root']);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('folder');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const currentFolder = (() => {
    let node = fileSystem.root;
    for (let i = 1; i < currentPath.length; i++) {
      node = node.children[currentPath[i]];
    }
    return node;
  })();

  const pathString = currentPath.slice(1).join(' / ') || 'Início';

  useEffect(() => {
    say("Vamos explorar pastas e arquivos! Clique duas vezes para abrir.");
  }, []);

  const createItem = () => {
    if (!newItemName.trim()) {
      alert('Digite um nome para o item!');
      return;
    }

    if (currentFolder.children[newItemName]) {
      alert('Já existe um item com este nome!');
      return;
    }

    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      let node = newFs.root;
      
      for (let i = 1; i < currentPath.length; i++) {
        node = node.children[currentPath[i]];
      }

      node.children[newItemName] = {
        type: newItemType,
        ...(newItemType === 'folder' ? { children: {} } : { content: '' })
      };

      return newFs;
    });

    setNewItemName('');
    setShowCreateForm(false);
    say(`${newItemType === 'folder' ? 'Pasta' : 'Arquivo'} criado com sucesso!`);
  };

  const openItem = (name) => {
    const item = currentFolder.children[name];
    
    if (item.type === 'folder') {
      setCurrentPath(prev => [...prev, name]);
      say(`Abrindo pasta ${name}`);
    } else {
      setSelectedFile({
        path: [...currentPath, name],
        content: item.content || ''
      });
      say(`Abrindo arquivo ${name}`);
    }
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
      say('Voltando para pasta anterior');
    }
  };

  const saveFile = () => {
    if (!selectedFile) return;

    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      let node = newFs.root;
      
      for (let i = 1; i < selectedFile.path.length - 1; i++) {
        node = node.children[selectedFile.path[i]];
      }

      node.children[selectedFile.path[selectedFile.path.length - 1]].content = selectedFile.content;
      return newFs;
    });

    alert('Arquivo salvo com sucesso!');
  };

  const deleteFile = () => {
    if (!selectedFile) return;

    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      setFileSystem(prev => {
        const newFs = JSON.parse(JSON.stringify(prev));
        let node = newFs.root;
        
        for (let i = 1; i < selectedFile.path.length - 1; i++) {
          node = node.children[selectedFile.path[i]];
        }

        delete node.children[selectedFile.path[selectedFile.path.length - 1]];
        return newFs;
      });

      setSelectedFile(null);
      say('Arquivo excluído com sucesso!');
    }
  };

  const goHome = () => {
    setCurrentPath(['root']);
    say('Voltando para o início');
  };

  const items = Object.entries(currentFolder.children);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-between mb-6">
        <div className="flex flex-center gap-4">
          <span className="badge badge-warning">
            Explorador de Arquivos
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            className="button button-secondary"
            onClick={goHome}
          >
            🏠 Início
          </button>
          <button
            className="button button-secondary"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Novo Item
          </button>
        </div>
      </div>

      {/* Barra de navegação */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <button
            className="button button-secondary"
            onClick={goUp}
            disabled={currentPath.length === 1}
          >
            ⬆️ Voltar
          </button>
          
          <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              📁 {pathString}
            </span>
          </div>
        </div>

        {/* Formulário de criação */}
        {showCreateForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl border">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nome do item..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500"
              />
              
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500"
              >
                <option value="folder">Pasta</option>
                <option value="file">Arquivo</option>
              </select>
              
              <button
                className="button button-primary"
                onClick={createItem}
                disabled={!newItemName.trim()}
              >
                Criar
              </button>
              
              <button
                className="button button-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de itens */}
        <div className="grid grid-4">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <div className="text-6xl mb-2">📁</div>
              <p>Esta pasta está vazia</p>
              <p className="text-sm">Clique em "Novo Item" para criar algo</p>
            </div>
          ) : (
            items.map(([name, item]) => (
              <div
                key={name}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-warning-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => openItem(name)}
                style={{ 
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {item.type === 'folder' ? '📁' : '📄'}
                  </div>
                  <div className="font-semibold text-sm truncate" title={name}>
                    {name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.type === 'folder' ? 'Pasta' : 'Arquivo'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor de arquivo */}
      {selectedFile && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>📄</span>
              <span className="font-semibold">
                Editando: {selectedFile.path[selectedFile.path.length - 1]}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                className="button button-primary"
                onClick={saveFile}
              >
                💾 Salvar
              </button>
              <button
                className="button button-danger"
                onClick={deleteFile}
              >
                🗑️ Excluir
              </button>
              <button
                className="button button-secondary"
                onClick={() => setSelectedFile(null)}
              >
                ❌ Fechar
              </button>
            </div>
          </div>
          
          <textarea
            value={selectedFile.content}
            onChange={(e) => setSelectedFile(prev => prev ? { ...prev, content: e.target.value } : null)}
            rows={8}
            className="input"
            placeholder="Digite o conteúdo do arquivo..."
          />
        </div>
      )}

      {/* Dicas */}
      <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Dicas de uso:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Clique duas vezes em uma pasta para abrir</li>
              <li>• Clique duas vezes em um arquivo para editar</li>
              <li>• Use "Voltar" para navegar entre pastas</li>
              <li>• Crie novos itens com o botão "Novo Item"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileExplorer;
