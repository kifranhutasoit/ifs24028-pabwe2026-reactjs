import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthPage from "./AuthPage";
import { renderWithProviders } from "../../test-utils";
import * as apiHelper from "../../helpers/apiHelper";
import * as toolsHelper from "../../helpers/toolsHelper";
import * as authSlice from "./authSlice";

vi.mock("../../helpers/apiHelper", () => ({
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  api: vi.fn(),
}));

vi.mock("../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

// Mock unwrap for thunks
vi.mock("./authSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncLogin: vi.fn(),
    asyncRegister: vi.fn(),
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
  };
});

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiHelper.getAccessToken.mockReturnValue(null);
  });

  it("should render Login form", () => {
    renderWithProviders(<AuthPage mode="login" />);
    expect(screen.getByText("Masuk ke akun kamu")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Kata sandi")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Nama")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Masuk" })).toBeInTheDocument();
  });

  it("should render Register form", () => {
    renderWithProviders(<AuthPage mode="register" />);
    expect(screen.getByText("Buat akun baru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nama")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Kata sandi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Daftar" })).toBeInTheDocument();
  });

  it("should navigate to / if already logged in", () => {
    apiHelper.getAccessToken.mockReturnValue("some-token");
    renderWithProviders(<AuthPage mode="login" />);
    expect(screen.getByTestId("navigate")).toHaveTextContent("/");
  });

  it("should show error if fields are empty on login submit", async () => {
    renderWithProviders(<AuthPage mode="login" />);
    const button = screen.getByRole("button", { name: "Masuk" });
    await userEvent.click(button);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Semua field wajib diisi");
  });

  it("should dispatch asyncLogin on valid login submit", async () => {
    authSlice.asyncLogin.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    renderWithProviders(<AuthPage mode="login" />);
    
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("Kata sandi"), "password");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));

    expect(authSlice.asyncLogin).toHaveBeenCalledWith({ name: "", email: "test@test.com", password: "password" });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle login error", async () => {
    authSlice.asyncLogin.mockReturnValue(() => ({ unwrap: () => Promise.reject(new Error("Login failed")) }));
    renderWithProviders(<AuthPage mode="login" />);
    
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("Kata sandi"), "password");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Login failed");
  });

  it("should dispatch asyncRegister on valid register submit", async () => {
    authSlice.asyncRegister.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    authSlice.asyncLogin.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
    renderWithProviders(<AuthPage mode="register" />);
    
    await userEvent.type(screen.getByPlaceholderText("Nama"), "John");
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("Kata sandi"), "password");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));

    expect(authSlice.asyncRegister).toHaveBeenCalledWith({ name: "John", email: "test@test.com", password: "password" });
    expect(authSlice.asyncLogin).toHaveBeenCalledWith({ email: "test@test.com", password: "password" });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
