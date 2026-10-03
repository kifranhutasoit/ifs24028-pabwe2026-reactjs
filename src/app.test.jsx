import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import App from "./App";

describe("Pengujian Integrasi Aplikasi - App.test.jsx (2.1.8)", () => {
  it("harus mengalihkan pengguna yang belum terautentikasi dari rute terlindungi ke halaman login", async () => {
    // Pastikan token bersih dari localStorage
    localStorage.clear();

    renderWithProviders(<App />, {
      route: "/",
    });

    // Verifikasi bahwa elemen halaman login berhasil dirender setelah pengalihan
    // (Sesuaikan teks heading atau elemen penanda pada halaman LoginPage Anda)
    const loginHeading = await screen.findByRole("heading", {
      name: /masuk|login/i,
    });
    expect(loginHeading).toBeInTheDocument();
  });
});
