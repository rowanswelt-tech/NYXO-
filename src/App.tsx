import React, { useMemo, useState } from "react";

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
  | "settings"
  | "search";

type Note = {
  id: number;
  title: string;
  text: string;
};

type ShoppingItem = {
  id: number;
  name: string;
  done: boolean;
};

type Message = {
  id: number;
  text: string;
  mine: boolean;
  time: string;
};

const navigation: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Startseite", icon: "⌂" },
  { id: "ai", label: "NYXO AI", icon: "✦" },
  { id: "chat", label: "Chat", icon: "☵" },
  { id: "shopping", label: "Einkaufen", icon: "🛒" },
  { id: "notes", label: "Notizen", icon: "▤" },
  { id: "learning", label: "Lernen", icon: "🎓" },
  { id: "tools", label: "Tools", icon: "⚙" },
  { id: "flux", label: "FLUX", icon: "◆" },
  { id: "design", label: "Design", icon: "◈" },
];

function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const navigate = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">N</div>
          <div>
            <strong>NYXO</strong>
            <span>Workspace</span>
          </div>
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "nav-item active" : "nav-item"}
              onClick={() => navigate(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => navigate("profile")}
          >
            <span>●</span>
            Profil
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("settings")}
          >
            <span>⚙</span>
            Einstellungen
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <div className="topbar-title">
            <strong>NYXO</strong>
          </div>

          <button
            className="top-search"
            onClick={() => navigate("search")}
          >
            🔎 <span>Suchen</span>
          </button>
        </header>

        <div className="content">
          {page === "home" && (
            <Home
              navigate={navigate}
              notes={notes}
              shopping={shopping}
            />
          )}

          {page === "search" && (
            <Search
              navigate={navigate}
              notes={notes}
              shopping={shopping}
            />
          )}

          {page === "ai" && <AI />}
          
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
            />
          )}

          {page === "notes" && (
            <Notes
              notes={notes}
              setNotes={setNotes}
            />
          )}

          {page === "learning" && <Learning />}

          {page === "tools" && <Tools />}

          {page === "flux" && <Flux />}

          {page === "design" && <Design />}

          {page === "profile" && <Profile />}

          {page === "settings" && <Settings />}
        </div>
      </main>

      <nav className="bottom-nav">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => navigate("home")}
        >
          <span>⌂</span>
          Home
        </button>

        <button
          className={page === "search" ? "active" : ""}
          onClick={() => navigate("search")}
        >
          <span>⌕</span>
          Suche
        </button>

        <button
          className={page === "ai" ? "active" : ""}
          onClick={() => navigate("ai")}
        >
          <span>✦</span>
          AI
        </button>

        <button
          className={page === "chat" ? "active" : ""}
          onClick={() => navigate("chat")}
        >
          <span>☵</span>
          Chat
        </button>

        <button
          className={page === "profile" ? "active" : ""}
          onClick={() => navigate("profile")}
        >
          <span>●</span>
          Profil
        </button>
      </nav>
    </div>
  );
}

/* =========================
   HOME
========================= */

function Home({
  navigate,
  notes,
  shopping,
}: {
  navigate: (page: Page) => void;
  notes: Note[];
  shopping: ShoppingItem[];
}) {
  const date = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const openShopping = shopping.filter((item) => !item.done).length;

  return (
    <section className="page">
      <div className="hero-card">
        <div>
          <span className="eyebrow">DEIN WORKSPACE</span>
          <h1>Willkommen bei NYXO 👋</h1>
          <p>
            Dein persönlicher Workspace für KI, Kommunikation,
            Organisation und mehr.
          </p>
          <span className="date">{date}</span>
        </div>

        <div className="hero-logo">N</div>
      </div>

      <div className="quick-grid">
        <button
          className="quick-card"
          onClick={() => navigate("ai")}
        >
          <span>✦</span>
          <strong>NYXO AI</strong>
          <small>Mit deiner KI arbeiten</small>
        </button>

        <button
          className="quick-card"
          onClick={() => navigate("chat")}
        >
          <span>☵</span>
          <strong>Chat</strong>
          <small>Nachrichten senden</small>
        </button>

        <button
          className="quick-card"
          onClick={() => navigate("shopping")}
        >
          <span>🛒</span>
          <strong>Einkaufen</strong>
          <small>{openShopping} offene Artikel</small>
        </button>

        <button
          className="quick-card"
          onClick={() => navigate("notes")}
        >
          <span>▤</span>
          <strong>Notizen</strong>
          <small>{notes.length} Notizen</small>
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Alles an einem Ort</h2>
          <span>NYXO Funktionen</span>
        </div>
      </div>

      <div className="feature-grid">
        <Feature
          icon="🎓"
          title="Lernen"
          text="Lernen und Aufgaben organisieren"
          onClick={() => navigate("learning")}
        />

        <Feature
          icon="⚙"
          title="Tools"
          text="Praktische Werkzeuge für jeden Tag"
          onClick={() => navigate("tools")}
        />

        <Feature
          icon="◆"
          title="FLUX"
          text="Dein kleines NYXO Game"
          onClick={() => navigate("flux")}
        />

        <Feature
          icon="◈"
          title="Design Studio"
          text="Passe dein NYXO an"
          onClick={() => navigate("design")}
        />
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="feature-card" onClick={onClick}>
      <div className="feature-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <span>›</span>
    </button>
  );
}

/* =========================
   SEARCH
========================= */

function Search({
  navigate,
  notes,
  shopping,
}: {
  navigate: (page: Page) => void;
  notes: Note[];
  shopping: ShoppingItem[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    const pages = navigation.filter(
      (item) =>
        item.label.toLowerCase().includes(q)
    );

    const noteResults = notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.text.toLowerCase().includes(q)
      )
      .map((note) => ({
        title: note.title,
        type: "Notiz",
        page: "notes" as Page,
      }));

    const shoppingResults = shopping
      .filter((item) =>
        item.name.toLowerCase().includes(q)
      )
      .map((item) => ({
        title: item.name,
        type: "Einkauf",
        page: "shopping" as Page,
      }));

    return [
      ...pages.map((item) => ({
        title: item.label,
        type: "NYXO",
        page: item.id,
      })),
      ...noteResults,
      ...shoppingResults,
    ];
  }, [query, notes, shopping]);

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">NYXO</span>
        <h1>Suche</h1>
        <p>Finde schnell Inhalte in deinem Workspace.</p>
      </div>

      <div className="glass-card">
        <div className="search-box">
          <span>⌕</span>

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="In NYXO suchen..."
            autoFocus
          />

          {query && (
            <button onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {query && (
        <div className="glass-card">
          <div className="section-heading">
            <div>
              <h2>Ergebnisse</h2>
              <span>{results.length} Treffer</span>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
              <h3>Nichts gefunden</h3>
              <p>Versuche einen anderen Suchbegriff.</p>
            </div>
          ) : (
            <div className="result-list">
              {results.map((result, index) => (
                <button
                  className="result-item"
                  key={`${result.title}-${index}`}
                  onClick={() => navigate(result.page)}
                >
                  <div className="result-icon">✦</div>
                  <div>
                    <strong>{result.title}</strong>
                    <span>{result.type}</span>
                  </div>
                  <span>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* =========================
   AI
========================= */

function AI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; mine: boolean }[]
  >([]);

  const send = () => {
    const text = input.trim();

    if (!text) return;

    setMessages((old) => [
      ...old,
      { text, mine: true },
      {
        text:
          "Ich bin NYXO AI. Eine echte KI-API können wir später sicher über ein Backend verbinden.",
        mine: false,
      },
    ]);

    setInput("");
  };

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">INTELLIGENCE</span>
        <h1>NYXO AI ✦</h1>
        <p>Dein intelligenter Workspace-Assistent.</p>
      </div>

      <div className="ai-card">
        <div className="ai-orb">N</div>

        <h2>Wie kann ich dir helfen?</h2>

        <p>
          Schreibe etwas in das Eingabefeld und starte
          deine Unterhaltung.
        </p>

        <div className="ai-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.mine
                  ? "ai-message mine"
                  : "ai-message"
              }
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="ai-input">
          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") send();
            }}
            placeholder="Schreibe an NYXO AI..."
          />

          <button onClick={send}>➤</button>
        </div>
      </div>
    </section>
  );
}

/* =========================
   CHAT
========================= */

function Chat({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<
    React.SetStateAction<Message[]>
  >;
}) {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    setMessages((old) => [
      ...old,
      {
        id: Date.now(),
        text,
        mine: true,
        time: new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
  };

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">KOMMUNIKATION</span>
        <h1>Chat</h1>
        <p>Deine Nachrichten.</p>
      </div>

      <div className="chat-card">
        <div className="chat-header">
          <div className="avatar">N</div>
          <div>
            <strong>NYXO Chat</strong>
            <span>Lokaler Chat</span>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">☵</div>
              <h3>Noch keine Nachrichten</h3>
              <p>Schreibe deine erste Nachricht.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.mine
                    ? "message mine"
                    : "message"
                }
              >
                <span>{message.text}</span>
                <small>{message.time}</small>
              </div>
            ))
          )}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Nachricht schreiben..."
          />

          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </section>
  );
}

/* =========================
   SHOPPING
========================= */

function Shopping({
  items,
  setItems,
}: {
  items: ShoppingItem[];
  setItems: React.Dispatch<
    React.SetStateAction<ShoppingItem[]>
  >;
}) {
  const [input, setInput] = useState("");
  const [budget, setBudget] = useState("");

  const addItem = () => {
    const name = input.trim();

    if (!name) return;

    setItems((old) => [
      ...old,
      {
        id: Date.now(),
        name,
        done: false,
      },
    ]);

    setInput("");
  };

  const toggleItem = (id: number) => {
    setItems((old) =>
      old.map((item) =>
        item.id === id
          ? { ...item, done: !item.done }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems((old) =>
      old.filter((item) => item.id !== id)
    );
  };

  const remaining = items.filter(
    (item) => !item.done
  ).length;

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">ORGANISATION</span>
        <h1>Einkaufen 🛒</h1>
        <p>Deine Einkaufsliste und dein Budget.</p>
      </div>

      <div className="shopping-grid">
        <div className="glass-card">
          <h2>Neue Liste</h2>

          <div className="input-row">
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") addItem();
              }}
              placeholder="z. B. Milch"
            />

            <button onClick={addItem}>＋</button>
          </div>

          <div className="shopping-list">
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Liste ist leer</h3>
                <p>Füge deinen ersten Artikel hinzu.</p>
              </div>
            ) : (
              items.map((item) => (
                <div className="shopping-item" key={item.id}>
                  <button
                    className={
                      item.done
                        ? "check checked"
                        : "check"
                    }
                    onClick={() =>
                      toggleItem(item.id)
                    }
                  >
                    {item.done ? "✓" : ""}
                  </button>

                  <span
                    className={
                      item.done ? "completed" : ""
                    }
                  >
                    {item.name}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteItem(item.id)
                    }
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card budget-card">
          <span className="eyebrow">BUDGET</span>

          <h2>Maximales Budget</h2>

          <div className="budget-input">
            <input
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(event) =>
                setBudget(event.target.value)
              }
              placeholder="35,00"
            />
            <span>€</span>
          </div>

          <div className="budget-number">
            {budget || "0,00"} €
          </div>

          <p>
            Noch {remaining} Artikel offen.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================
   NOTES
========================= */

function Notes({
  notes,
  setNotes,
}: {
  notes: Note[];
  setNotes: React.Dispatch<
    React.SetStateAction<Note[]>
  >;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const addNote = () => {
    if (!title.trim() && !text.trim()) return;

    setNotes((old) => [
      {
        id: Date.now(),
        title: title.trim() || "Neue Notiz",
        text,
      },
      ...old,
    ]);

    setTitle("");
    setText("");
  };

  const removeNote = (id: number) => {
    setNotes((old) =>
      old.filter((note) => note.id !== id)
    );
  };

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">WORKSPACE</span>
        <h1>Notizen</h1>
        <p>Ideen, Gedanken und wichtige Informationen.</p>
      </div>

      <div className="notes-layout">
        <div className="glass-card">
          <h2>Neue Notiz</h2>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Titel"
          />

          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            placeholder="Was möchtest du notieren?"
            rows={7}
          />

          <button
            className="primary-button"
            onClick={addNote}
          >
            Notiz speichern
          </button>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="glass-card empty-state">
              <div className="empty-icon">▤</div>
              <h3>Noch keine Notizen</h3>
              <p>Erstelle deine erste Notiz.</p>
            </div>
          ) : (
            notes.map((note) => (
              <article className="note-card" key={note.id}>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.text}</p>
                </div>

                <button
                  onClick={() => removeNote(note.id)}
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   LEARNING
========================= */

function Learning() {
  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">SCHULE</span>
        <h1>Lernen 🎓</h1>
        <p>Dein Lernbereich in NYXO.</p>
      </div>

      <div className="feature-grid">
        <div className="glass-card">
          <h2>📚 Aufgaben</h2>
          <p>Schulaufgaben und Lerninhalte organisieren.</p>
        </div>

        <div className="glass-card">
          <h2>🧠 Lernen</h2>
          <p>Übungen und Lernmaterial an einem Ort.</p>
        </div>

        <div className="glass-card">
          <h2>⏱️ Fokus</h2>
          <p>Konzentriert an einer Aufgabe arbeiten.</p>
        </div>
      </div>
    </section>
  );
}

/* =========================
   TOOLS
========================= */

function Tools() {
  const [calculator, setCalculator] = useState("");

  const calculate = () => {
    try {
      const safe = calculator.replace(
        /[^0-9+\-*/().% ]/g,
        ""
      );

      if (!safe) return;

      const result = Function(
        `"use strict"; return (${safe})`
      )();

      setCalculator(String(result));
    } catch {
      setCalculator("Fehler");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">WERKZEUGE</span>
        <h1>Tools ⚙</h1>
        <p>Praktische Funktionen für jeden Tag.</p>
      </div>

      <div className="tools-grid">
        <div className="glass-card tool-card">
          <h2>🧮 Rechner</h2>

          <input
            value={calculator}
            onChange={(event) =>
              setCalculator(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") calculate();
            }}
            placeholder="z. B. 25 * 4"
          />

          <button
            className="primary-button"
            onClick={calculate}
          >
            Berechnen
          </button>
        </div>

        <div className="glass-card tool-card">
          <h2>📊 Prozent</h2>
          <p>Prozentwerte schnell berechnen.</p>
        </div>

        <div className="glass-card tool-card">
          <h2>📏 Einheiten</h2>
          <p>Einheiten umrechnen.</p>
        </div>

        <div className="glass-card tool-card">
          <h2>⏱️ Timer</h2>
          <p>Einfacher Zeitmesser für deinen Alltag.</p>
        </div>
      </div>
    </section>
  );
}

/* =========================
   FLUX
========================= */

function Flux() {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);

  const collect = () => {
    if (energy <= 0) return;

    setScore((old) => old + 10);
    setEnergy((old) => Math.max(0, old - 5));
  };

  const reset = () => {
    setScore(0);
    setEnergy(100);
  };

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">NYXO GAME</span>
        <h1>FLUX ◆</h1>
        <p>Ein kleiner Game-Bereich innerhalb von NYXO.</p>
      </div>

      <div className="flux-card">
        <div className="flux-top">
          <div>
            <span>POINTS</span>
            <strong>{score}</strong>
          </div>

          <div>
            <span>ENERGY</span>
            <strong>{energy}%</strong>
          </div>
        </div>

        <button className="flux-player" onClick={collect}>
          ◆
        </button>

        <p>
          Klicke auf den Spieler und sammle Punkte.
        </p>

        <button
          className="secondary-button"
          onClick={reset}
        >
          Neustart
        </button>
      </div>
    </section>
  );
}

/* =========================
   DESIGN
========================= */

function Design() {
  const [dark, setDark] = useState(false);
  const [glass, setGlass] = useState(70);

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">PERSONALISIERUNG</span>
        <h1>Design Studio ◈</h1>
        <p>Gestalte dein NYXO.</p>
      </div>

      <div className="design-layout">
        <div className="glass-card">
          <h2>Darstellung</h2>

          <label className="setting-row">
            <span>Dark Mode</span>

            <input
              type="checkbox"
              checked={dark}
              onChange={(event) =>
                setDark(event.target.checked)
              }
            />
          </label>

          <label>
            <span>Glass Stärke</span>

            <input
              type="range"
              min="20"
              max="100"
              value={glass}
              onChange={(event) =>
                setGlass(Number(event.target.value))
              }
            />
          </label>

          <p>Glass: {glass}%</p>
        </div>

        <div
          className="design-preview"
          style={{
            backdropFilter: `blur(${glass / 5}px)`,
          }}
        >
          <div className="brand-logo">N</div>
          <h2>NYXO</h2>
          <p>
            Deine persönliche Glass-Oberfläche.
          </p>

          <span>
            {dark ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================
   PROFILE
========================= */

function Profile() {
  const [name, setName] = useState("Rowan");

  return (
    <section className="page">
      <div className="profile-hero">
        <div className="profile-avatar">R</div>

        <div>
          <span className="eyebrow">DEIN PROFIL</span>
          <h1>{name || "Dein Name"}</h1>
          <p>@rowan · NYXO-ID</p>
        </div>
      </div>

      <div className="glass-card">
        <h2>Persönliche Daten</h2>

        <label>
          Name
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <div className="profile-info">
          <div>
            <span>NYXO-ID</span>
            <strong>@rowan</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Aktiv</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   SETTINGS
========================= */

function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">SYSTEM</span>
        <h1>Einstellungen</h1>
        <p>Verwalte deine NYXO Einstellungen.</p>
      </div>

      <div className="settings-list">
        <div className="setting-card">
          <div>
            <strong>Benachrichtigungen</strong>
            <span>NYXO Benachrichtigungen anzeigen</span>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(event) =>
              setNotifications(event.target.checked)
            }
          />
        </div>

        <div className="setting-card">
          <div>
            <strong>Datenschutz</strong>
            <span>Deine lokalen Daten verwalten</span>
          </div>

          <span>›</span>
        </div>

        <div className="setting-card">
          <div>
            <strong>Account</strong>
            <span>Account- und Anmeldedaten</span>
          </div>

          <span>›</span>
        </div>
      </div>
    </section>
  );
}

export default App;