import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../test-utils";
import * as lostFoundSlice from "./lostFoundSlice";
import * as toolsHelper from "../../helpers/toolsHelper";
import * as apiHelper from "../../helpers/apiHelper";

vi.mock("./lostFoundSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncGetAll: vi.fn(),
    asyncAdd: vi.fn(),
  };
});

vi.mock("../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  formatDate: (d) => `Formatted ${d}`,
}));

vi.mock("../../helpers/apiHelper", () => ({
  assetUrl: (p) => `https://example.com/${p}`,
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  api: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lostFoundSlice.asyncGetAll.mockReturnValue({ type: "mockGetAll" });
  });

  const initialState = {
    lostFounds: {
      items: [],
      isLostFound: false,
    }
  };

  it("should render and fetch initial data", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: {
          lostFounds: [
            { id: 1, title: "Phone", description: "Lost iPhone", status: "lost", is_completed: false, created_at: "2023-01-01", author: { name: "John" } },
            { id: 2, title: "Wallet", description: "Found wallet", status: "found", is_completed: true, cover: "img.png", created_at: "2023-01-02", author: { name: "Jane" } }
          ],
          isLostFound: false,
        }
      }
    });

    expect(lostFoundSlice.asyncGetAll).toHaveBeenCalledWith({ status: "", is_completed: "", is_me: "" });
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: { lostFounds: [], isLostFound: true }
      }
    });
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
  });

  it("should filter items by search query locally", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: {
          lostFounds: [
            { id: 1, title: "Apple", description: "red", status: "lost" },
            { id: 2, title: "Banana", description: "yellow", status: "found" }
          ],
          isLostFound: false,
        }
      }
    });

    const searchInput = screen.getByPlaceholderText("Cari barang...");
    await userEvent.type(searchInput, "apple");

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  it("should open and close modal", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: { lostFounds: { lostFounds: [], isLostFound: false } }
    });

    const addButton = screen.getByRole("button", { name: /tambah/i });
    await userEvent.click(addButton);

    expect(screen.getByText("Tambah Laporan")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Batal" });
    await userEvent.click(cancelButton);

    expect(screen.queryByText("Tambah Laporan")).not.toBeInTheDocument();
  });

  it("should submit new report successfully", async () => {
    lostFoundSlice.asyncAdd.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    renderWithProviders(<HomePage />, {
      preloadedState: { lostFounds: { lostFounds: [], isLostFound: false } }
    });

    await userEvent.click(screen.getByRole("button", { name: /tambah/i }));

    await userEvent.type(screen.getByPlaceholderText("Judul"), "New Item");
    await userEvent.type(screen.getByPlaceholderText("Deskripsi"), "Details");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(lostFoundSlice.asyncAdd).toHaveBeenCalledWith({ title: "New Item", description: "Details", status: "lost" });
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Laporan ditambahkan");
    expect(screen.queryByText("Tambah Laporan")).not.toBeInTheDocument();
  });

  it("should handle report submission error", async () => {
    lostFoundSlice.asyncAdd.mockReturnValue(() => ({ unwrap: () => Promise.reject(new Error("Submit error")) }));
    renderWithProviders(<HomePage />, {
      preloadedState: { lostFounds: { lostFounds: [], isLostFound: false } }
    });

    await userEvent.click(screen.getByRole("button", { name: /tambah/i }));
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Submit error");
  });

  it("should change filter dropdowns", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: { lostFounds: { lostFounds: [], isLostFound: false } }
    });

    const selects = screen.getAllByRole("combobox");
    
    // Status
    await userEvent.selectOptions(selects[0], "lost");
    expect(lostFoundSlice.asyncGetAll).toHaveBeenCalledWith(expect.objectContaining({ status: "lost" }));

    // is_completed
    await userEvent.selectOptions(selects[1], "1");
    expect(lostFoundSlice.asyncGetAll).toHaveBeenCalledWith(expect.objectContaining({ is_completed: "1" }));

    // is_me
    await userEvent.selectOptions(selects[2], "1");
    expect(lostFoundSlice.asyncGetAll).toHaveBeenCalledWith(expect.objectContaining({ is_me: "1" }));
  });
});
