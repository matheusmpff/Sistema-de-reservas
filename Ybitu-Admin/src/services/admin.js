// services/admin.js
import { api } from "../hooks/api.js";

// ─── RESERVAS ────────────────────────────────────────────────
export const listarReservas = () => api.get("/admin/reservas");

export const criarReserva = (dados) =>
  api.post("/admin/reservas", dados);

export const alterarQuartoReserva = (dados) =>
  api.patch("/admin/reservas/quarto", dados);

export const alterarDataReserva = (dados) =>
  api.patch("/admin/reservas/data", dados);

export const alterarStatusReserva = (dados) =>
  api.patch("/admin/reservas/status", dados);

export const alterarValorReserva = (dados) =>
  api.patch("/admin/reservas/valor", dados);

// ─── QUARTOS ─────────────────────────────────────────────────
export const listarQuartos = () => api.get("/admin/quartos");

export const alterarStatusQuarto = (dados) =>
  api.patch("/admin/quartos/status", dados);

// ─── HÓSPEDES ────────────────────────────────────────────────
export const listarHospedes = () => api.get("/admin/hospedes");

export const alterarHospedeDados = (dados) =>
  api.patch("/admin/hospedes/dados", dados);

export const promoverHospede = (dados) =>
  api.patch("/admin/hospedes/tipos", dados);

// ─── FEEDBACKS ───────────────────────────────────────────────
export const listarFeedbacks = () => api.get("/admin/feedbacks");