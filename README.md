# Prompt Shorthand Analyzer V3.3

> **Aplikasi Web Cerdas Analisis Prompt Semantik, Rekomendasi Notasi Shorthand Visual, Preservasi Identitas, dan Fitur Perkaya dengan AI (Generasi V3.3).**  
> **Arsitektur: SAFE PATCH-ONLY ARCHITECTURE &bull; Basis / Source of Truth: Prompt Shorthand Analyzer V3.2 (Stable Base).**

[![Version: 3.3.0](https://img.shields.io/badge/Version-3.3.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Architecture: Safe Patch-Only](https://img.shields.io/badge/Architecture-Safe%20Patch--Only-orange.svg)](#arsitektur-safe-patch-only)
[![BYOK Gemini](https://img.shields.io/badge/Gemini%20API-BYOK%20Enabled-blueviolet.svg)](https://aistudio.google.com/)

---

## 🌐 Akses Web Publik (GitHub Pages V3.3)
👉 **Live Web App**: [https://sevenprojectchannel.github.io/prompt-shorthand-analyzer-v3.3/](https://sevenprojectchannel.github.io/prompt-shorthand-analyzer-v3.3/)

---

## 🏛️ Fitur Unggulan Warisan V3.2: ✨ PERKAYA DENGAN AI

Pada bagian **PROMPT OPTIMAL**, tersedia tombol canggih:
`✨ PERKAYA DENGAN AI`

- **Prinsip Utama**: *"ENRICH, NOT REPLACE"*. Prompt Optimal asli adalah SOURCE OF TRUTH.
- **Kondisi Tombol**: Aktif hanya ketika Gemini API Key terhubung; disabled dengan indikator jelas saat belum terhubung.
- **Preservasi Mutlak**: AI tidak mengubah subjek, objek, aktivitas, maksud, batasan, maupun kode shorthand yang terpasang.
- **Peningkatan Kualitas**: AI memperkaya deskripsi visual, tekstur, pencahayaan alami/sinematik, atmosfer, dan koherensi komposisi untuk generator gambar AI.
- **Penyajian Terpadu**: Hasil pengayaan langsung ditampilkan pada kolom Prompt Optimal yang sama tanpa memakan ruang vertikal tambahan.

---

## 🏛️ Prinsip Dasar & Source of Truth
Proyek ini dibangun dengan mematuhi hierarki stabilitas yang ketat:
1. **Prompt Shorthand Analyzer V3.2 sebagai BASIS / SOURCE OF TRUTH**:
   - Seluruh kode, struktur direktori, UI, fitur Kamus Shorthand, deduplikasi semantik, rekomendasi resolusi `/highresolution`, box Saran Solusi pada Shorthand Konflik, Default-Hide pada Shorthand Dikecualikan, dan tombol Perkaya dengan AI dipertahankan 100%.
   - V3.2 tetap utuh dan independen pada repository serta URL Pages tersendiri.
2. **Tidak Rebuild dari Nol**:
   - Fondasi V3.3 mewarisi seluruh stabilitas, optimasi responsif, dan 293 skenario uji otomatis.
3. **SAFE PATCH-ONLY ARCHITECTURE**:
   - Semua modifikasi, aturan tambahan, perbaikan, dan fitur baru diterapkan secara patch/additive terisolasi (`src/patches/`).

---

## 🚀 Fitur Lengkap Warisan Stabil (100% Preserved)
- **📚 Kamus Shorthand Terpadu**: Kolom pencarian tunggal cerdas untuk katalog lokal dan online fallback.
- **💡 Box Saran Solusi pada Shorthand Konflik (Card G)**: Rekomendasi kontekstual cerdas pada setiap pertentangan direktif.
- **👁️ Fitur Show/Hide pada Shorthand Dikecualikan (Card H)**: Default Hide saat render awal agar tampilan compact.
- **Pipeline Analisis Semantik Menyeluruh**: Normalisasi, intent extraction, entity & area matching, tiered recommendations, optimal prompt synthesis.
- **Preservasi & Lock Cerdas**: Deteksi akurat instruksi preservasi (`/facelock`, `/posepreserve`, dll).
- **Centralized BYOK (Bring Your Own Key) Gemini API**: Mendukung `gemini-2.0-flash`, `gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-1.5-flash`, dengan fallback lokal otomatis.

---

## 💻 Menjalankan Aplikasi

```bash
# Menjalankan development server
npm run dev

# Menjalankan pengujian otomatis (293 tests)
npm test

# Build production web bundle
npm run build

# Sinkronisasi asset web ke Android
npm run android:sync

# Build Android APK Debug
npm run android:apk:debug

# Build Android APK Release
npm run android:apk:release
```

---

## 📱 Aplikasi Android (APK Wrapper V3.3)

- **Package ID**: `com.sevenprojectchannel.promptshorthand.v33`
- **Application Name**: `Prompt Shorthand Analyzer V3.3`
- **Version**: `versionName = 3.3` | `versionCode = 330`
- **Arsitektur**: Native Android WebView Hybrid Wrapper (mendukung online GitHub Pages V3.3 dan fallback offline lokal otomatis).
- **Fitur Khusus Android**:
  - Pull-to-refresh (`SwipeRefreshLayout`)
  - Tombol Back hardware Android dengan history navigasi (`OnBackPressedDispatcher`)
  - Indikator koneksi internet & layar error ramah pengguna dengan tombol *"Coba Lagi"* dan *"Mode Offline (Lokal)"*
  - Dukungan rotasi Portrait & Landscape tanpa me-reload aplikasi atau menghilangkan input prompt pengguna
  - Penyimpanan BYOK Gemini API Key di dalam secure Web Storage perangkat (tanpa hardcode key)
