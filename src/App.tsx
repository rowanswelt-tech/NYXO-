import React, { useEffect, useMemo, useState } from "react";

type Page =
  | "home"
  | "ai"
  | "chat"
  | "shopping"
  | "notes"
  | "learning"
  | "tools"
  | "flux"
  | "design"
  | "profile"
  | "settings";

type Message = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

type ShoppingItem = {
  id: string;
  name: string;
  done: boolean;
};

type Note = {
  id: string;
  title: string;
  text: string;
};

const pages: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Start", icon: "⌂" },
  { id: "ai", label: "NYXO AI", icon: "✦" },
  { id: "chat", label: "Chat", icon: "◌" },
  { id: "shopping", label: "Einkaufen", icon: "🛒" },
  { id: "notes", label: "Notizen", icon: "▤" },
  { id: "learning", label: "Lernen", icon: "📚" },
  { id: "tools", label: "Tools", icon: "⌘" },
  { id: "flux", label: "FLUX", icon: "◆" },
  { id: "design", label: "Design", icon: "✎" },
  { id: "profile", label: "Profil", icon: "●" },
  { id: "settings", label: "Einstellungen", icon: "⚙" },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function currentTime() {
  return new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayText() {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [darkMode, setDarkMode] = useLocalStorage("nyxo-dark", false);

  const [shopping, setShopping] = useLocalStorage<ShoppingItem[]>(
    "nyxo-shopping",
    [],
  );

  const [notes, setNotes] = useLocalStorage<Note[]>("nyxo-notes", []);

  const [messages, setMessages] = useLocalStorage<Message[]>(
    "nyxo-chat",
    [
      {
        id: "welcome",
        text: "Willkommen bei NYXO 👋",
        mine: false,
        time: currentTime(),
      },
    ],
  );

  const [budget, setBudget] = useLocalStorage<number>(
    "nyxo-budget",
    35,
  );

  const [aiMessages, setAiMessages] = useLocalStorage<
    { id: string; text: string; user: boolean }[]
  >("nyxo-ai", [
    {
      id: "welcome",
      text: "Hi! Ich bin NYXO AI. Was möchtest du machen?",
      user: false,
    },
  ]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  function navigate(next: Page) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageTitle =
    pages.find((item) => item.id === page)?.label ?? "NYXO";

  return (
    <div className="app">
      <Sidebar page={page} navigate={navigate} />

      <main className="main">
        <div className="content">
          <header className="topbar">
            <div className="topbar-title">NYXO</div>

            <div className="topbar-actions">
              <button
                className="btn"
                onClick={() => navigate("search" as Page)}
              >
                🔎
              </button>

              <button
                className="btn"
                onClick={() => navigate("profile")}
              >
                👤
              </button>
            </div>
          </header>

          {page === "home" && (
            <Home
              navigate={navigate}
              shoppingCount={shopping.filter((x) => !x.done).length}
              notesCount={notes.length}
            />
          )}

          {page === "ai" && (
            <AI
              messages={aiMessages}
              setMessages={setAiMessages}
            />
          )}

          {page === "chat" && (
            <Chat
              messages={messages}
              setMessages={setMessages}
            />
          )}

          {page === "shopping" && (
            <Shopping
              items={shopping}
              setItems={setShopping}
              budget={budget}
              setBudget={setBudget}
            />
          )}

          {page === "notes" && (
            <Notes notes={notes} setNotes={setNotes} />
          )}

          {page === "learning" && <Learning />}

          {page === "tools" && <Tools />}

          {page === "flux" && <Flux />}

          {page === "design" && <Design />}

          {page === "profile" && <Profile />}

          {page === "settings" && (
            <Settings
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </div>
      </main>

      <BottomNav page={page} navigate={navigate} />
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  page,
  navigate,
}: {
  page: Page;
  navigate: (page: Page) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">N</div>
        <span>NYXO</span>
      </div>

      <nav className="sidebar-nav">
        {pages.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              page === item.id ? "active" : ""
            }`}
            onClick={() => navigate(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="card">
          <strong>NYXO</strong>
          <p className="card-subtitle">
            Dein persönlicher Workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   BOTTOM NAV
========================================================= */

function BottomNav({
  page,
  navigate,
}: {
  page: Page;
  navigate: (page: Page) => void;
}) {
  const mobilePages: Page[] = [
    "home",
    "ai",
    "chat",
    "shopping",
    "profile",
  ];

  return (
    <nav className="bottom-nav">
      {mobilePages.map((id) => {
        const item = pages.find((x) => x.id === id)!;

        return (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => navigate(id)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({
  navigate,
  shoppingCount,
  notesCount,
}: {
  navigate: (page: Page) => void;
  shoppingCount: number;
  notesCount: number;
}) {
  const cards: {
    page: Page;
    icon: string;
    title: string;
    text: string;
  }[] = [
    {
      page: "ai",
      icon: "✦",
      title: "NYXO AI",
      text: "Dein intelligenter Assistent",
    },
    {
      page: "chat",
      icon: "◌",
      title: "Chat",
      text: "Nachrichten und Gespräche",
    },
    {
      page: "shopping",
      icon: "🛒",
      title: "Einkaufen",
      text: `${shoppingCount} offene Artikel`,
    },
    {
      page: "notes",
      icon: "▤",
      title: "Notizen",
      text: `${notesCount} gespeicherte Notizen`,
    },
    {
      page: "learning",
      icon: "📚",
      title: "Lernen",
      text: "Dein Lernbereich",
    },
    {
      page: "tools",
      icon: "⌘",
      title: "Tools",
      text: "Praktische Werkzeuge",
    },
    {
      page: "flux",
      icon: "◆",
      title: "FLUX",
      text: "NYXO Game",
    },
    {
      page: "design",
      icon: "✎",
      title: "Design Studio",
      text: "Passe NYXO an",
    },
  ];

  return (
    <>
      <section className="hero">
        <h1>Willkommen bei NYXO 👋</h1>

        <p>
          Dein persönlicher Workspace für KI, Chat,
          Einkaufen, Lernen und mehr.
        </p>

        <div className="date-text">{todayText()}</div>
      </section>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <button
            key={card.page}
            className="card dashboard-card"
            onClick={() => navigate(card.page)}
            style={{ textAlign: "left" }}
          >
            <div className="dashboard-icon">{card.icon}</div>

            <h3 className="card-title">{card.title}</h3>

            <p className="card-subtitle">{card.text}</p>
          </button>
        ))}
      </div>
    </>
  );
}

/* =========================================================
   AI
========================================================= */

function AI({
  messages,
  setMessages,
}: {
  messages: { id: string; text: string; user: boolean }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      { id: string; text: string; user: boolean }[]
    >
  >;
}) {
  const [input, setInput] = useState("");

  function send() {
    const text = input.trim();

    if (!text) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text,
      user: true,
    };

    setMessages((old) => [...old, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((old) => [
        ...old,
        {
          id: crypto.randomUUID(),
          text:
            "Ich habe deine Nachricht erhalten. Die echte NYXO-KI wird später über einen sicheren Backend-/API-Zugang verbunden. 🤖",
          user: false,
        },
      ]);
    }, 500);
  }

  return (
    <>
      <div className="page-header">
        <h1>NYXO AI</h1>
        <p>Dein persönlicher KI-Assistent.</p>
      </div>

      <div className="ai-container">
        <section className="ai-header">
          <div className="ai-logo">✦</div>

          <h2>NYXO AI</h2>

          <p className="card-subtitle">
            Frage etwas, plane etwas oder lass dir helfen.
          </p>
        </section>

        <div className="ai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${
                message.user ? "user" : "bot"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="ai-input">
          <input
            className="input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") send();
            }}
            placeholder="Schreibe an NYXO AI..."
          />

          <button className="btn primary" onClick={send}>
            Senden
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   CHAT
========================================================= */

function Chat({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [input, setInput] = useState("");

  function sendMessage() {
    const text = input.trim();

    if (!text) return;

    setMessages((old) => [
      ...old,
      {
        id: crypto.randomUUID(),
        text,
        mine: true,
        time: currentTime(),
      },
    ]);

    setInput("");
  }

  return (
    <>
      <div className="page-header">
        <h1>Chat</h1>
        <p>Deine NYXO-Nachrichten.</p>
      </div>

      <section className="chat-layout">
        <div className="chat-list">
          <button className="chat-list-item active">
            <div className="avatar">N</div>

            <div>
              <strong>NYXO</strong>

              <div className="card-subtitle">
                Dein Chat
              </div>
            </div>
          </button>
        </div>

        <div className="chat-main">
          <div className="chat-header">NYXO Chat</div>

          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.mine ? "me" : "other"
                }`}
              >
                <div>{message.text}</div>

                <div className="message-time">
                  {message.time}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              className="input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder="Nachricht schreiben..."
            />

            <button
              className="btn primary"
              onClick={sendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   SHOPPING
========================================================= */

function Shopping({
  items,
  setItems,
  budget,
  setBudget,
}: {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  budget: number;
  setBudget: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [input, setInput] = useState("");

  function addItem() {
    const name = input.trim();

    if (!name) return;

    setItems((old) => [
      ...old,
      {
        id: crypto.randomUUID(),
        name,
        done: false,
      },
    ]);

    setInput("");
  }

  function toggleItem(id: string) {
    setItems((old) =>
      old.map((item) =>
        item.id === id
          ? { ...item, done: !item.done }
          : item,
      ),
    );
  }

  function deleteItem(id: string) {
    setItems((old) =>
      old.filter((item) => item.id !== id),
    );
  }

  const openItems = items.filter((item) => !item.done).length;
  const completedItems = items.filter(
    (item) => item.done,
  ).length;

  return (
    <>
      <div className="page-header">
        <h1>Einkaufen 🛒</h1>
        <p>
          Einkaufsliste, Budget und später Kassenbon-Analyse.
        </p>
      </div>

      <div className="shopping-layout">
        <section className="card">
          <div className="input-row">
            <input
              className="input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addItem();
              }}
              placeholder="Was möchtest du einkaufen?"
            />

            <button
              className="btn primary"
              onClick={addItem}
            >
              Hinzufügen
            </button>
          </div>

          <div className="divider" />

          {items.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🛒</div>
              <strong>Deine Einkaufsliste ist leer.</strong>
              <p>Füge deinen ersten Artikel hinzu.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`shopping-item ${
                  item.done ? "completed" : ""
                }`}
              >
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItem(item.id)}
                />

                <span className="item-name">
                  {item.name}
                </span>

                <button
                  className="btn small danger"
                  onClick={() => deleteItem(item.id)}
                >
                  Löschen
                </button>
              </div>
            ))
          )}

          <div className="divider" />

          <button
            className="btn"
            onClick={() =>
              setItems((old) =>
                old.filter((item) => !item.done),
              )
            }
          >
            Erledigte löschen
          </button>
        </section>

        <aside className="card">
          <h2 className="card-title">Budget</h2>

          <p className="card-subtitle">
            Dein maximal geplantes Budget.
          </p>

          <div className="budget-box">
            <div>Maximal</div>

            <div className="budget-value">
              {budget.toFixed(2)} €
            </div>
          </div>

          <div style={{ marginTop: 15 }}>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(event) =>
                setBudget(Number(event.target.value))
              }
            />
          </div>

          <div className="divider" />

          <span className="badge">
            {openItems} offen
          </span>

          <span
            className="badge"
            style={{ marginLeft: 7 }}
          >
            {completedItems} erledigt
          </span>

          <div style={{ marginTop: 18 }}>
            <button
              className="btn primary"
              style={{ width: "100%" }}
              onClick={() =>
                alert(
                  "Kassenbon-Scanner wird als nächstes mit OCR integriert.",
                )
              }
            >
              📷 Kassenbon scannen
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

/* =========================================================
   NOTES
========================================================= */

function Notes({
  notes,
  setNotes,
}: {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function addNote() {
    if (!title.trim() && !text.trim()) return;

    setNotes((old) => [
      {
        id: crypto.randomUUID(),
        title: title.trim() || "Neue Notiz",
        text: text.trim(),
      },
      ...old,
    ]);

    setTitle("");
    setText("");
  }

  return (
    <>
      <div className="page-header">
        <h1>Notizen 📝</h1>
        <p>Alles Wichtige an einem Ort.</p>
      </div>

      <section className="card" style={{ marginBottom: 18 }}>
        <input
          className="input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titel"
        />

        <div style={{ height: 10 }} />

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Was möchtest du notieren?"
        />

        <div style={{ marginTop: 10 }}>
          <button
            className="btn primary"
            onClick={addNote}
          >
            + Notiz speichern
          </button>
        </div>
      </section>

      <div className="notes-grid">
        {notes.map((note) => (
          <article className="note-card" key={note.id}>
            <h3>{note.title}</h3>

            <p>{note.text}</p>

            <div style={{ marginTop: 15 }}>
              <button
                className="btn small danger"
                onClick={() =>
                  setNotes((old) =>
                    old.filter((x) => x.id !== note.id),
                  )
                }
              >
                Löschen
              </button>
            </div>
          </article>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📝</div>
          Noch keine Notizen.
        </div>
      )}
    </>
  );
}

/* =========================================================
   LEARNING
========================================================= */

function Learning() {
  return (
    <>
      <div className="page-header">
        <h1>Lernen 📚</h1>
        <p>Dein Lernbereich in NYXO.</p>
      </div>

      <div className="three-column">
        <div className="card">
          <div className="dashboard-icon">🇬🇧</div>
          <h2 className="card-title">Englisch</h2>
          <p className="card-subtitle">
            Vokabeln, Übungen und Lernfortschritt.
          </p>
        </div>

        <div className="card">
          <div className="dashboard-icon">➗</div>
          <h2 className="card-title">Mathe</h2>
          <p className="card-subtitle">
            Aufgaben und Rechenübungen.
          </p>
        </div>

        <div className="card">
          <div className="dashboard-icon">🧠</div>
          <h2 className="card-title">Lernmodus</h2>
          <p className="card-subtitle">
            Später wird hier dein bestehender Lern-Code
            integriert.
          </p>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   TOOLS
========================================================= */

function Tools() {
  const [display, setDisplay] = useState("");

  function add(value: string) {
    setDisplay((old) => old + value);
  }

  function calculate() {
    try {
      if (!/^[0-9+\-*/().% ]+$/.test(display)) return;

      // Kleine lokale Rechenhilfe.
      // Keine Netzwerkverbindung notwendig.
      const result = Function(
        `"use strict"; return (${display})`,
      )();

      setDisplay(String(result));
    } catch {
      setDisplay("Fehler");
    }
  }

  function clear() {
    setDisplay("");
  }

  return (
    <>
      <div className="page-header">
        <h1>Tools 🧰</h1>
        <p>Praktische Werkzeuge für deinen Alltag.</p>
      </div>

      <div className="two-column">
        <section className="card">
          <h2 className="card-title">Taschenrechner</h2>

          <input
            className="input"
            value={display}
            readOnly
            placeholder="0"
            style={{
              fontSize: 25,
              textAlign: "right",
              marginBottom: 12,
            }}
          />

          <div className="tools-grid">
            {[
              "7",
              "8",
              "9",
              "/",
              "4",
              "5",
              "6",
              "*",
              "1",
              "2",
              "3",
              "-",
              "0",
              ".",
              "%",
              "+",
            ].map((key) => (
              <button
                key={key}
                className="btn"
                onClick={() => add(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="input-row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={clear}>
              C
            </button>

            <button
              className="btn primary"
              onClick={calculate}
              style={{ flex: 1 }}
            >
              =
            </button>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Weitere Tools</h2>

          <div className="settings-list">
            <div className="settings-row">
              <div className="settings-info">
                <strong>Prozentrechner</strong>
                <span>Prozentwerte berechnen</span>
              </div>
              <span>％</span>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <strong>Einheiten</strong>
                <span>Länge, Gewicht und mehr</span>
              </div>
              <span>↔</span>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <strong>Timer</strong>
                <span>Zeit messen</span>
              </div>
              <span>◷</span>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <strong>JSON Tool</strong>
                <span>JSON prüfen und formatieren</span>
              </div>
              <span>{ }</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================================================
   FLUX
========================================================= */

function Flux() {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [playing, setPlaying] = useState(false);

  function start() {
    setScore(0);
    setEnergy(100);
    setPlaying(true);
  }

  function collect() {
    if (!playing || energy <= 0) return;

    setScore((old) => old + 10);
    setEnergy((old) => Math.max(0, old - 5));
  }

  return (
    <>
      <div className="page-header">
        <h1>NYXO: FLUX ◆</h1>
        <p>Dein kleines NYXO-Game.</p>
      </div>

      <section className="game-card">
        <div className="game-score">
          {score}
        </div>

        <div>
          Energie: {energy}%
        </div>

        <div className="game-area">
          <button
            onClick={collect}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 85,
              height: 85,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#a78bfa,#7c3aed)",
              color: "white",
              fontSize: 30,
              cursor: "pointer",
              boxShadow:
                "0 15px 35px rgba(124,58,237,.4)",
            }}
          >
            ◆
          </button>
        </div>

        {!playing ? (
          <button className="btn primary" onClick={start}>
            FLUX starten
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => setPlaying(false)}
          >
            Spiel pausieren
          </button>
        )}
      </section>
    </>
  );
}

/* =========================================================
   DESIGN
========================================================= */

function Design() {
  const [glass, setGlass] = useState(30);
  const [rounding, setRounding] = useState(28);

  return (
    <>
      <div className="page-header">
        <h1>Design Studio ✎</h1>
        <p>Gestalte deinen persönlichen NYXO-Look.</p>
      </div>

      <div className="two-column">
        <section className="card">
          <h2 className="card-title">Liquid Glass</h2>

          <label>
            <strong>Glass-Stärke</strong>

            <input
              type="range"
              min="0"
              max="60"
              value={glass}
              onChange={(event) =>
                setGlass(Number(event.target.value))
              }
              style={{ width: "100%" }}
            />
          </label>

          <div style={{ height: 20 }} />

          <label>
            <strong>Ecken</strong>

            <input
              type="range"
              min="8"
              max="50"
              value={rounding}
              onChange={(event) =>
                setRounding(Number(event.target.value))
              }
              style={{ width: "100%" }}
            />
          </label>
        </section>

        <section className="design-preview">
          <div
            className="glass-preview"
            style={{
              borderRadius: rounding,
              backdropFilter: `blur(${glass}px)`,
              WebkitBackdropFilter: `blur(${glass}px)`,
            }}
          >
            <span className="badge">LIVE PREVIEW</span>

            <h2 style={{ marginTop: 15 }}>
              NYXO Liquid Glass
            </h2>

            <p className="card-subtitle">
              So kann dein persönlicher NYXO-Look aussehen.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function Profile() {
  const [name, setName] = useLocalStorage(
    "nyxo-name",
    "Rowan",
  );

  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="page-header">
        <h1>Profil</h1>
        <p>Dein persönliches NYXO-Konto.</p>
      </div>

      <section className="profile-header">
        <div className="profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <h2 className="profile-name">{name}</h2>

          <div className="profile-id">
            NYXO-ID: @rowan
          </div>
        </div>

        <button
          className="btn"
          onClick={() => setEditing(!editing)}
        >
          Bearbeiten
        </button>
      </section>

      {editing && (
        <section className="card" style={{ marginTop: 18 }}>
          <label>
            <strong>Name</strong>

            <input
              className="input"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              style={{ marginTop: 8 }}
            />
          </label>
        </section>
      )}

      <div className="three-column" style={{ marginTop: 18 }}>
        <div className="card">
          <h3 className="card-title">NYXO-ID</h3>
          <p className="card-subtitle">@rowan</p>
        </div>

        <div className="card">
          <h3 className="card-title">Daten</h3>
          <p className="card-subtitle">
            Lokal gespeichert
          </p>
        </div>

        <div className="card">
          <h3 className="card-title">Konto</h3>
          <p className="card-subtitle">
            Bereit für Firebase
          </p>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function Settings({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="page-header">
        <h1>Einstellungen ⚙️</h1>
        <p>Verwalte deinen NYXO-Workspace.</p>
      </div>

      <section className="card">
        <div className="settings-list">
          <div className="settings-row">
            <div className="settings-info">
              <strong>Dark Mode</strong>
              <span>
                Dunkles Liquid-Glass-Design
              </span>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) =>
                setDarkMode(event.target.checked)
              }
              className="checkbox"
            />
          </div>

          <div className="settings-row">
            <div className="settings-info">
              <strong>Lokale Daten</strong>
              <span>
                Deine aktuellen Daten werden im Browser
                gespeichert.
              </span>
            </div>

            <span className="badge">AKTIV</span>
          </div>

          <div className="settings-row">
            <div className="settings-info">
              <strong>Firebase</strong>
              <span>
                Wird für Konto und Echtzeitdaten verbunden.
              </span>
            </div>

            <span className="badge">NEXT</span>
          </div>

          <div className="settings-row">
            <div className="settings-info">
              <strong>AI Backend</strong>
              <span>
                API-Key darf später nicht im Frontend liegen.
              </span>
            </div>

            <span className="badge">SECURE</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;