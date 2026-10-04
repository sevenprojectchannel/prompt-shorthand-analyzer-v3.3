/**
 * Preset Test Cases V2
 * Dirancang untuk menguji kepatuhan semantik, lock extraction, dan deteksi konflik.
 */

export const PRESET_TEST_CASES = [
  {
    id: 'test-1',
    label: 'Test 1: Hijab & Wajah',
    badge: 'Headwear & Lock',
    prompt: 'hapus hijab, jangan ubah wajah',
    description: 'Mengubah penutup kepala/hijab namun mengunci 100% struktur wajah & identitas tanpa menyentuh background.'
  },
  {
    id: 'test-2',
    label: 'Test 2: Baju & Wajah',
    badge: 'Outfit & Lock',
    prompt: 'ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah',
    description: 'Mengganti pakaian menjadi tanktop putih dengan menjaga identitas wajah tetap terkunci.'
  },
  {
    id: 'test-3',
    label: 'Test 3: Ketajaman',
    badge: 'Enhance & Sharpen',
    prompt: 'buat foto lebih tajam dan perbaiki pencahayaan',
    description: 'Meningkatkan mikrokontras detail dan menyeimbangkan pencahayaan visual.'
  },
  {
    id: 'test-4',
    label: 'Test 4: Transparan',
    badge: 'Background Removal',
    prompt: 'hapus latar belakang',
    description: 'Menghapus background menjadi transparan tanpa menyentuh wajah atau pakaian subjek.'
  },
  {
    id: 'test-5',
    label: 'Test 5: Konflik Rambut',
    badge: 'Conflict Detection',
    prompt: 'pertahankan rambut asli tetapi ubah gaya rambut menjadi botak',
    description: 'Instruksi bertentangan: mengunci rambut sekaligus meminta mencukur botak, memicu deteksi konflik otomatis.'
  },
  {
    id: 'test-6',
    label: 'Test 6: Full Body & Ratio',
    badge: 'Canvas & Aspect Ratio',
    prompt: 'ubah rasio menjadi 9:16 dan tampilkan full body',
    description: 'Mengubah format kanvas vertikal 9:16 dan memperluas komposisi ke seluruh tubuh.'
  },
  {
    id: 'test-7',
    label: 'Test 7: Lighting Foto',
    badge: 'Lighting Quality',
    prompt: 'perbaiki pencahayaan foto',
    description: 'Memperbaiki dan meningkatkan kualitas pencahayaan pada foto.'
  },
  {
    id: 'test-8',
    label: 'Test 8: Multi-Lock',
    badge: 'Multi-Lock Isolation',
    prompt: 'pertahankan background dan baju, tapi ubah warna rambut jadi merah',
    description: 'Mengunci background & pakaian, hanya mengubah warna rambut secara presisi.'
  }
];
