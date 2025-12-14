import React from "react";
import { render, screen } from "@testing-library/react";
import Kanban from "../Kanban";

describe("Kanban", () => {
  it("renders three columns", () => {
    const session: any = { user: { email: "test@example.com" } };
    render(<Kanban session={session} />);

    expect(screen.getByText(/Todo/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });
});
