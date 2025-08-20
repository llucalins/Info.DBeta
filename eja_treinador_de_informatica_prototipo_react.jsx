import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * EJA – Treinador de Informática (Protótipo)
 *
 * Feito para adultos/idosos: botões grandes, linguagem simples, repetição guiada e feedback positivo.
 * Módulos inclusos: Mouse, Digitação, Pastas (Explorador), Menu do Botão Direito.
 *
 * Dicas:
 * - Este é um arquivo único para demonstração. Em produção, separe por pastas/rotas.
 * - Você pode colar este componente em um projeto React (Vite) e usar Tailwind.
 */

// Utilitário simples para falar mensagens (acessibilidade)
function say(text) {
  try {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "pt-BR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  } catch {}
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const Section = ({ title, children, right }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      {right}
    </div>
    <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl shadow p-4 border border-zinc-200 dark:border-zinc-800">{children}</div>
  </div>
);

const BigButton = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-lg rounded-2xl shadow focus:outline-none focus:ring-4 ring-offset-2 ring-blue-300 select-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-2xl text-base font-semibold border transition ${
      active ? "bg-blue-600 text-white border-blue-700" : "bg-white hover:bg-zinc-50 border-zinc-200"
    }`}
  >
    {children}
  </button>
);

function MouseTrainer({ onComplete }) {
  const [step, setStep] = useState(0); // 0: clique esquerdo, 1: duplo clique, 2: arrastar, 3: rolagem
  const [dragOk, setDragOk] = useState(false);
  const [scroll, setScroll] = useState(0);
  const draggableRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    say("Vamos treinar o mouse. Siga as instruções na tela.");
  }, []);

  const reset = () => { setStep(0); setDragOk(false); setScroll(0); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Passo {step + 1} de 4
        </span>
        <BigButton className="bg-zinc-100" onClick={reset}>Recomeçar</BigButton>
      </div>

      {step === 0 && (
        <Section title="Clique Esquerdo">
          <p className="mb-4 text-lg">Clique no botão abaixo <b>uma vez</b> com o botão esquerdo.</p>
          <BigButton
            className="bg-green-100 hover:bg-green-200"
            onClick={() => { say("Muito bem! Agora vamos para o próximo."); setStep(1); }}
          >
            Clique aqui
          </BigButton>
        </Section>
      )}

      {step === 1 && (
        <Section title="Duplo Clique">
          <p className="mb-4 text-lg">Dê <b>dois cliques rápidos</b> (duplo clique) no quadrado.</p>
          <div
            onDoubleClick={() => { say("Perfeito! Próximo passo."); setStep(2); }}
            className="w-40 h-40 rounded-2xl bg-yellow-200 hover:bg-yellow-300 flex items-center justify-center text-lg font-bold cursor-pointer select-none"
          >
            Duplo Clique
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Arrastar e Soltar">
          <p className="mb-4 text-lg">Clique, segure e <b>arraste</b> o quadrado azul até o alvo tracejado.</p>
          <div className="flex items-center gap-6">
            <div
              ref={draggableRef}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "drag");
              }}
              className="w-24 h-24 rounded-2xl bg-blue-500 shadow-lg cursor-grab active:cursor-grabbing"
            />
            <div
              ref={targetRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragOk(true);
                say("Mandou bem! Último passo: rolar a página.");
                setStep(3);
              }}
              className="w-40 h-40 rounded-2xl border-4 border-dashed border-zinc-400 flex items-center justify-center text-zinc-600"
            >
              Alvo
            </div>
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section title="Rolar a Página">
          <p className="mb-4 text-lg">Use a <b>rodinha do mouse</b> para rolar e alcançar 100%.</p>
          <div
            onWheel={(e) => {
              setScroll((s) => Math.min(100, Math.max(0, s + (e.deltaY > 0 ? 5 : -5))));
            }}
            className="h-40 overflow-y-auto bg-zinc-50 rounded-2xl p-4 border"
          >
            <div style={{ height: 400 }} className="relative">
              <div className="sticky top-0 p-2 bg-zinc-100 rounded">Role aqui dentro…</div>
              <p className="mt-40 text-center text-3xl">Progresso: {scroll}%</p>
            </div>
          </div>
          {scroll >= 100 && (
            <div className="mt-4">
              <BigButton className="bg-blue-600 text-white" onClick={() => { say("Parabéns! Você completou o treino de mouse."); onComplete?.(); }}>Concluir Treino</BigButton>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function TypingTrainer() {
  const phrases = [
    "Bom dia!",
    "Meu nome é ...",
    "Estou aprendendo informática.",
    "WhatsApp, Google e YouTube.",
  ];
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const target = phrases[index];

  const correct = input.trim() === target;

  useEffect(() => { say("Vamos treinar a digitação. Copie a frase mostrada."); }, []);

  return (
    <Section title="Digitação (copiar a frase)">
      <div className="flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-zinc-100 text-xl select-none"><b>Frase:</b> {target}</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Digite aqui…"
          className="w-full p-3 rounded-xl border text-lg focus:outline-none focus:ring-4 ring-blue-300"
        />
        <div className="flex items-center gap-3">
          <BigButton
            className={` ${correct ? "bg-green-600 text-white" : "bg-zinc-200"}`}
            onClick={() => {
              if (correct) {
                say("Perfeito! Próxima frase.");
                setIndex((i) => (i + 1) % phrases.length);
                setInput("");
              } else {
                say("Quase! Reveja a frase.");
              }
            }}
          >
            Verificar
          </BigButton>
          <BigButton className="bg-zinc-100" onClick={() => setInput(target)}>Colar a frase (dica)</BigButton>
          <BigButton className="bg-zinc-100" onClick={() => { setInput(""); say("Campo limpo"); }}>Limpar</BigButton>
        </div>
      </div>
    </Section>
  );
}

// Explorador de pastas/arquivos (simulado)
function FileExplorer() {
  const [fs, setFs] = useLocalStorage("eja_fs", {
    root: {
      type: "folder",
      children: {},
    },
  });
  const [cwd, setCwd] = useLocalStorage("eja_cwd", ["root"]); // caminho como array
  const [name, setName] = useState("");
  const [type, setType] = useState("folder");
  const [selected, setSelected] = useState(null);

  const current = useMemo(() => {
    let node = fs.root;
    for (let i = 1; i < cwd.length; i++) node = node.children[cwd[i]];
    return node;
  }, [fs, cwd]);

  const pathStr = cwd.join(" / ");

  const createNode = () => {
    if (!name) return;
    setFs((prev) => {
      const clone = structuredClone(prev);
      let node = clone.root;
      for (let i = 1; i < cwd.length; i++) node = node.children[cwd[i]];
      if (!node.children[name]) node.children[name] = type === "folder" ? { type: "folder", children: {} } : { type: "file", content: "" };
      return clone;
    });
    setName("");
  };

  const open = (key) => {
    const node = current.children[key];
    if (node.type === "folder") setCwd((c) => [...c, key]);
    else setSelected({ path: [...cwd, key], content: node.content ?? "" });
  };

  const goUp = () => { if (cwd.length > 1) setCwd((c) => c.slice(0, -1)); };

  const delSelected = () => {
    if (!selected) return;
    setFs((prev) => {
      const clone = structuredClone(prev);
      let parent = clone.root;
      for (let i = 1; i < selected.path.length - 1; i++) parent = parent.children[selected.path[i]];
      delete parent.children[selected.path.at(-1)];
      return clone;
    });
    setSelected(null);
  };

  const saveSelected = () => {
    if (!selected) return;
    setFs((prev) => {
      const clone = structuredClone(prev);
      let node = clone.root;
      for (let i = 1; i < selected.path.length; i++) node = node.children[selected.path[i]];
      node.content = selected.content;
      return clone;
    });
  };

  return (
    <Section title="Pastas e Arquivos (simulador)">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-lg"><b>Caminho:</b> {pathStr}</div>
          <div className="flex items-center gap-2">
            <BigButton className="bg-zinc-100" onClick={goUp} disabled={cwd.length === 1}>Subir</BigButton>
            <input className="px-3 py-2 rounded-xl border" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <select className="px-3 py-2 rounded-xl border" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="folder">Pasta</option>
              <option value="file">Arquivo</option>
            </select>
            <BigButton className="bg-blue-600 text-white" onClick={createNode}>Criar</BigButton>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.keys(current.children).length === 0 && (
            <div className="text-zinc-500">(vazio)</div>
          )}
          {Object.entries(current.children).map(([key, node]) => (
            <div key={key} className="p-3 rounded-xl border bg-white hover:bg-zinc-50 cursor-pointer" onDoubleClick={() => open(key)}>
              <div className="text-5xl mb-2">{node.type === "folder" ? "📁" : "📄"}</div>
              <div className="font-semibold truncate" title={key}>{key}</div>
              <div className="text-sm text-zinc-500">{node.type === "folder" ? "Pasta" : "Arquivo"}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Editando: {selected.path.at(-1)}</div>
              <div className="flex gap-2">
                <BigButton className="bg-green-600 text-white" onClick={saveSelected}>Salvar</BigButton>
                <BigButton className="bg-red-600 text-white" onClick={delSelected}>Excluir</BigButton>
                <BigButton className="bg-zinc-100" onClick={() => setSelected(null)}>Fechar</BigButton>
              </div>
            </div>
            <textarea
              rows={6}
              className="w-full p-3 rounded-xl border"
              value={selected.content}
              onChange={(e) => setSelected((s) => ({ ...s, content: e.target.value }))}
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function RightClickTrainer() {
  const [message, setMessage] = useState("Clique com o botão direito na área abaixo para abrir o menu.");
  const [menu, setMenu] = useState(null); // {x,y}

  const options = [
    { key: "abrir", label: "Abrir" },
    { key: "renomear", label: "Renomear" },
    { key: "copiar", label: "Copiar" },
    { key: "colar", label: "Colar" },
    { key: "excluir", label: "Excluir" },
    { key: "propriedades", label: "Propriedades" },
  ];

  return (
    <Section title="Botão Direito do Mouse (Menu de Opções)">
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
          say("Menu aberto. Escolha uma opção.");
        }}
        className="h-56 border rounded-2xl bg-zinc-50 flex items-center justify-center text-lg select-none"
      >
        {message}
      </div>

      {menu && (
        <div
          style={{ top: menu.y, left: menu.x }}
          className="fixed z-50 w-56 bg-white border rounded-xl shadow-lg overflow-hidden"
          onMouseLeave={() => setMenu(null)}
        >
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { setMessage(`Você escolheu: ${opt.label}`); setMenu(null); say(`Você escolheu ${opt.label}`); }}
              className="w-full text-left px-4 py-3 hover:bg-zinc-100"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 text-sm text-zinc-600">
        Dica: botão esquerdo = ação principal (abrir), botão direito = ver opções.
      </div>
    </Section>
  );
}

export default function EjaInformaticaTrainer() {
  const [tab, setTab] = useLocalStorage("eja_tab", "mouse");
  const [highContrast, setHighContrast] = useLocalStorage("eja_contrast", false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", highContrast);
  }, [highContrast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Treinador de Informática – EJA</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">Aprenda passo a passo: mouse, digitação, pastas e menu do botão direito.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
              Alto contraste (modo escuro)
            </label>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 mb-6">
          <TabButton active={tab === "mouse"} onClick={() => setTab("mouse")}>🖱️ Mouse</TabButton>
          <TabButton active={tab === "typing"} onClick={() => setTab("typing")}>⌨️ Digitação</TabButton>
          <TabButton active={tab === "files"} onClick={() => setTab("files")}>📂 Pastas & Arquivos</TabButton>
          <TabButton active={tab === "right"} onClick={() => setTab("right")}>🖱️ Botão Direito</TabButton>
        </nav>

        {tab === "mouse" && <MouseTrainer onComplete={() => setTab("typing")} />}
        {tab === "typing" && <TypingTrainer />}
        {tab === "files" && <FileExplorer />}
        {tab === "right" && <RightClickTrainer />}

        <footer className="mt-8 text-sm text-zinc-500">
          Dica do instrutor: mantenha uma rotina fixa de 5 passos no começo da aula para reforçar a memória.
        </footer>
      </div>
    </div>
  );
}
