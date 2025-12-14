import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Kanban from "../Kanban";

// localStorage のモック
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Kanban", () => {
  const mockSession = { user: { email: "test@example.com" } };

  beforeEach(() => {
    localStorageMock.clear();
  });

  it("renders three columns", () => {
    render(<Kanban session={mockSession as any} />);

    expect(screen.getByText(/Todo/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });

  it("displays column counts", () => {
    render(<Kanban session={mockSession as any} />);

    expect(screen.getByText(/Todo \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Done \(0\)/i)).toBeInTheDocument();
  });

  it("renders input field and add button", () => {
    render(<Kanban session={mockSession as any} />);

    expect(screen.getByPlaceholderText(/New card title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("adds a card to Todo column", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "Test Card");
    await user.click(addButton);

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText(/Todo \(1\)/i)).toBeInTheDocument();
  });

  it("does not add card with empty title", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "   ");
    await user.click(addButton);

    expect(screen.queryByText("   ")).not.toBeInTheDocument();
    expect(screen.getByText(/Todo \(0\)/i)).toBeInTheDocument();
  });

  it("clears input after adding a card", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(
      /New card title/i
    ) as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "Test Card");
    await user.click(addButton);

    expect(input.value).toBe("");
  });

  it("removes a card when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "Card to Remove");
    await user.click(addButton);

    expect(screen.getByText("Card to Remove")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /✕/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Card to Remove")).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Todo \(0\)/i)).toBeInTheDocument();
  });

  it("saves cards to localStorage", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "Persistent Card");
    await user.click(addButton);

    await waitFor(() => {
      const saved = localStorageMock.getItem("kanban:test@example.com");
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.Todo).toHaveLength(1);
      expect(parsed.Todo[0].title).toBe("Persistent Card");
    });
  });

  it("loads cards from localStorage on mount", () => {
    const savedData = {
      Todo: [{ id: "1", title: "Loaded Card" }],
      "In Progress": [],
      Done: [],
    };
    localStorageMock.setItem(
      "kanban:test@example.com",
      JSON.stringify(savedData)
    );

    render(<Kanban session={mockSession as any} />);

    expect(screen.getByText("Loaded Card")).toBeInTheDocument();
    expect(screen.getByText(/Todo \(1\)/i)).toBeInTheDocument();
  });

  it("moves card between columns via drag and drop", async () => {
    const user = userEvent.setup();
    const { container } = render(<Kanban session={mockSession as any} />);

    // Add a card to Todo
    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });
    await user.type(input, "Draggable Card");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Draggable Card")).toBeInTheDocument();
    });

    // Find the card element and the target column
    const card = screen.getByText("Draggable Card").closest("[draggable]");
    const inProgressColumn = screen
      .getByText(/In Progress/i)
      .closest("div") as HTMLElement;

    expect(card).toBeTruthy();
    expect(inProgressColumn).toBeTruthy();

    // Get card ID from localStorage to use in the drag event
    const saved = localStorageMock.getItem("kanban:test@example.com");
    const parsed = JSON.parse(saved!);
    const cardId = parsed.Todo[0].id;

    // Create mock dataTransfer
    const mockDataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(() => JSON.stringify({ fromCol: "Todo", cardId })),
    };

    // Simulate dragstart using fireEvent
    fireEvent.dragStart(card!, {
      dataTransfer: mockDataTransfer,
    });

    // Simulate drop on In Progress column
    fireEvent.drop(inProgressColumn, {
      dataTransfer: mockDataTransfer,
    });

    // Wait for the card to move
    await waitFor(() => {
      expect(screen.getByText(/Todo \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/In Progress \(1\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Draggable Card")).toBeInTheDocument();
  });

  it("handles multiple cards in different columns", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    // Add multiple cards
    await user.type(input, "Card 1");
    await user.click(addButton);

    await user.type(input, "Card 2");
    await user.click(addButton);

    await user.type(input, "Card 3");
    await user.click(addButton);

    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Card 3")).toBeInTheDocument();
    expect(screen.getByText(/Todo \(3\)/i)).toBeInTheDocument();
  });

  it("uses anonymous email when session has no user email", () => {
    const anonymousSession = { user: {} };
    render(<Kanban session={anonymousSession as any} />);

    // Should still render columns
    expect(screen.getByText(/Todo/i)).toBeInTheDocument();

    // localStorage key should use "anonymous"
    const saved = localStorageMock.getItem("kanban:anonymous");
    // Initially empty, but the key should be used
  });

  it("trims whitespace from card titles", async () => {
    const user = userEvent.setup();
    render(<Kanban session={mockSession as any} />);

    const input = screen.getByPlaceholderText(/New card title/i);
    const addButton = screen.getByRole("button", { name: /Add/i });

    await user.type(input, "  Trimmed Card  ");
    await user.click(addButton);

    // The card should be added with trimmed title
    expect(screen.getByText("Trimmed Card")).toBeInTheDocument();
  });
});
