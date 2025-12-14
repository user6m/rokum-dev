import React, { useEffect, useState } from "react";
import type { Session } from "next-auth";

type Card = { id: string; title: string };
type Columns = { [key: string]: Card[] };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Kanban({ session }: { session: Session }) {
  const email = session.user?.email || "anonymous";
  const key = `kanban:${email}`;
  const [cols, setCols] = useState<Columns>({
    Todo: [],
    "In Progress": [],
    Done: [],
  });
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setCols(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(cols));
  }, [key, cols]);

  function addCard() {
    if (!newTitle.trim()) return;
    setCols((prev) => ({
      ...prev,
      Todo: [{ id: uid(), title: newTitle.trim() }, ...prev.Todo],
    }));
    setNewTitle("");
  }

  function onDragStart(e: React.DragEvent, fromCol: string, cardId: string) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ fromCol, cardId }));
  }

  function onDrop(e: React.DragEvent, toCol: string) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    const { fromCol, cardId } = JSON.parse(data);
    if (fromCol === toCol) return;
    setCols((prev) => {
      const card = prev[fromCol].find((c) => c.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((c) => c.id !== cardId),
        [toCol]: [card, ...prev[toCol]],
      };
    });
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function removeCard(col: string, id: string) {
    setCols((prev) => ({
      ...prev,
      [col]: prev[col].filter((c) => c.id !== id),
    }));
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New card title"
        />
        <button onClick={addCard} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {Object.keys(cols).map((col) => (
          <div
            key={col}
            onDragOver={allowDrop}
            onDrop={(e) => onDrop(e, col)}
            style={{
              flex: 1,
              minWidth: 180,
              background: "#f4f4f5",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {col} ({cols[col].length})
            </h3>
            {cols[col].map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => onDragStart(e, col, card.id)}
                style={{
                  padding: 8,
                  background: "white",
                  borderRadius: 6,
                  marginBottom: 8,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>{card.title}</div>
                  <button
                    onClick={() => removeCard(col, card.id)}
                    style={{ marginLeft: 8 }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
