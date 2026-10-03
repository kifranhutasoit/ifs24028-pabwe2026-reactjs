import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../test-utils";
import * as lostFoundSlice from "./lostFoundSlice";
import * as toolsHelper from "../../helpers/toolsHelper";
import * as apiHelper from "../../helpers/apiHelper";

vi.mock("./lostFoundSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncGetOne: vi.fn(),
    asyncChange: vi.fn(),
    asyncCover: vi.fn(),
    asyncDelete: vi.fn(),
  };
});

vi.mock("../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
  formatDate: (d) => `Formatted ${d}`,
}));

vi.mock("../../helpers/apiHelper", () => ({
  assetUrl: (p) => `https://example.com/${p}`,
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  api: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lostFoundSlice.asyncGetOne.mockReturnValue({ type: "mockGetOne" });
    window.URL.createObjectURL = vi.fn(() => "blob:test");
  });

  it("should show loading state initially", () => {
    renderWithProviders(<DetailPage />);
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    expect(lostFoundSlice.asyncGetOne).toHaveBeenCalledWith("1");
  });

  it("should render item details", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details", status: "lost", is_completed: 0, author: { name: "John" }, created_at: "2023-01-01" },
        }
      }
    });

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Hilang")).toBeInTheDocument();
    expect(screen.getByText("Diproses")).toBeInTheDocument();
  });

  it("should toggle edit mode and save changes", async () => {
    lostFoundSlice.asyncChange.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details", status: "lost", is_completed: 0 },
        }
      }
    });

    await userEvent.click(screen.getByRole("button", { name: "Ubah data" }));

    const titleInput = screen.getByDisplayValue("Phone");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Phone 2");

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(lostFoundSlice.asyncChange).toHaveBeenCalledWith({ id: "1", title: "Phone 2", description: "Details", status: "lost", is_completed: 1 });
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Data diubah");
    expect(lostFoundSlice.asyncGetOne).toHaveBeenCalled();
  });

  it("should handle save error", async () => {
    lostFoundSlice.asyncChange.mockReturnValue(() => ({ unwrap: () => Promise.reject(new Error("Save error")) }));
    
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details", status: "lost", is_completed: 0 },
        }
      }
    });

    await userEvent.click(screen.getByRole("button", { name: "Ubah data" }));
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Save error");
  });

  it("should handle delete with confirmation", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue(true);
    lostFoundSlice.asyncDelete.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details" },
        }
      }
    });

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    
    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    expect(lostFoundSlice.asyncDelete).toHaveBeenCalledWith("1");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should not delete if confirmation is cancelled", async () => {
    toolsHelper.showConfirmDialog.mockResolvedValue(false);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details" },
        }
      }
    });

    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    
    expect(lostFoundSlice.asyncDelete).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should upload cover file", async () => {
    lostFoundSlice.asyncCover.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        lostFounds: {
          lostFound: { id: 1, title: "Phone", description: "Details" },
        }
      }
    });

    const fileInput = screen.getByLabelText("Pilih cover");
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);

    const uploadButton = await screen.findByRole("button", { name: "Unggah cover" });
    await userEvent.click(uploadButton);

    expect(lostFoundSlice.asyncCover).toHaveBeenCalledWith({ id: "1", file });
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover diubah");
  });
});
