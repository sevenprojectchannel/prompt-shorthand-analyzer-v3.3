/**
 * Shorthand Knowledge Base V2.1
 * Semantic Shorthand Knowledge Base terpusat untuk:
 * - Semantic Analyzer
 * - Recommendation Engine
 * - Conflict Detection
 * - Prompt Optimizer
 */

export const FUNCTION_GROUPS = {
  "FACE_PRESERVATION": "FACE_PRESERVATION",
  "HAIR_PRESERVATION": "HAIR_PRESERVATION",
  "BACKGROUND_PRESERVATION": "BACKGROUND_PRESERVATION",
  "OUTFIT_PRESERVATION": "OUTFIT_PRESERVATION",
  "BODY_PRESERVATION": "BODY_PRESERVATION",
  "HEADWEAR_PRESERVATION": "HEADWEAR_PRESERVATION",
  "FACE_RETOUCH": "FACE_RETOUCH",
  "FACE_SWAP": "FACE_SWAP",
  "FACE_EXPRESSION": "FACE_EXPRESSION",
  "HAIR_EDIT": "HAIR_EDIT",
  "HAIR_COLOR": "HAIR_COLOR",
  "NATURAL_HAIR_RECONSTRUCTION": "NATURAL_HAIR_RECONSTRUCTION",
  "HEADWEAR_REMOVAL": "HEADWEAR_REMOVAL",
  "HEADWEAR_ADD": "HEADWEAR_ADD",
  "OUTFIT_EDIT": "OUTFIT_EDIT",
  "OUTFIT_REMOVE": "OUTFIT_REMOVE",
  "OUTFIT_COLOR": "OUTFIT_COLOR",
  "FRAMING_FULL_BODY": "FRAMING_FULL_BODY",
  "FRAMING_CLOSEUP": "FRAMING_CLOSEUP",
  "BODY_POSE_EDIT": "BODY_POSE_EDIT",
  "BACKGROUND_REMOVAL": "BACKGROUND_REMOVAL",
  "BACKGROUND_REPLACEMENT": "BACKGROUND_REPLACEMENT",
  "BACKGROUND_BLUR": "BACKGROUND_BLUR",
  "BACKGROUND_CLEAN": "BACKGROUND_CLEAN",
  "SCENE_REPLACEMENT": "SCENE_REPLACEMENT",
  "LIGHTING_ENHANCEMENT": "LIGHTING_ENHANCEMENT",
  "LIGHTING_STUDIO": "LIGHTING_STUDIO",
  "LIGHTING_GOLDENHOUR": "LIGHTING_GOLDENHOUR",
  "IMAGE_SHARPENING": "IMAGE_SHARPENING",
  "IMAGE_DENOISE": "IMAGE_DENOISE",
  "COLOR_WARM_TONE": "COLOR_WARM_TONE",
  "COLOR_COOL_TONE": "COLOR_COOL_TONE",
  "ASPECT_RATIO_VERTICAL": "ASPECT_RATIO_VERTICAL",
  "ASPECT_RATIO_LANDSCAPE": "ASPECT_RATIO_LANDSCAPE",
  "ASPECT_RATIO_SQUARE": "ASPECT_RATIO_SQUARE",
  "ASPECT_RATIO_PORTRAIT": "ASPECT_RATIO_PORTRAIT",
  "ASPECT_RATIO_ULTRAWIDE": "ASPECT_RATIO_ULTRAWIDE",
  "TRANSPARENCY_ALPHA": "TRANSPARENCY_ALPHA",
  "OBJECT_REMOVAL": "OBJECT_REMOVAL",
  "OBJECT_ADD": "OBJECT_ADD",
  "STYLE_CINEMATIC": "STYLE_CINEMATIC",
  "STYLE_VINTAGE": "STYLE_VINTAGE",
  "STYLE_CYBERPUNK": "STYLE_CYBERPUNK",
  "CAMERA_RAW": "CAMERA_RAW",
  "CAMERA_BOKEH": "CAMERA_BOKEH",
  "CANVAS_OUTPAINT": "CANVAS_OUTPAINT"
};

export const RELATIONSHIP_TYPES = {
  "DIRECTLY_RELATED": "DIRECTLY_RELATED",
  "PRESERVATION_RELATED": "PRESERVATION_RELATED",
  "REVEALED_BY_REMOVAL": "REVEALED_BY_REMOVAL",
  "DEPENDENCY": "DEPENDENCY",
  "COMPATIBLE": "COMPATIBLE",
  "CONTEXTUAL": "CONTEXTUAL",
  "VISUAL_CONSEQUENCE": "VISUAL_CONSEQUENCE",
  "COMPOSITION_RELATED": "COMPOSITION_RELATED",
  "QUALITY_RELATED": "QUALITY_RELATED"
};

export const SHORTHAND_CATEGORIES = {
  "LOCK_PRESERVATION": {
    "id": "LOCK_PRESERVATION",
    "label": "Lock & Preservation",
    "code": "A",
    "color": "#3b82f6",
    "description": "Mengunci identitas, wajah, rambut, latar, busana, atau anatomi agar terlindungi 100% dari perubahan."
  },
  "FACE_IDENTITY": {
    "id": "FACE_IDENTITY",
    "label": "Face / Identity",
    "code": "B",
    "color": "#60a5fa",
    "description": "Modifikasi fitur wajah, ekspresi emosi, dan karakteristik muka."
  },
  "HAIR": {
    "id": "HAIR",
    "label": "Hair",
    "code": "C",
    "color": "#f59e0b",
    "description": "Modifikasi gaya rambut, potongan, tekstur helai, dan pewarnaan rambut."
  },
  "HEADWEAR": {
    "id": "HEADWEAR",
    "label": "Headwear",
    "code": "D",
    "color": "#8b5cf6",
    "description": "Pelepasan, penambahan, atau modifikasi hijab, topi, dan aksesori kepala."
  },
  "OUTFIT": {
    "id": "OUTFIT",
    "label": "Outfit / Clothing",
    "code": "E",
    "color": "#ec4899",
    "description": "Penggantian busana, tekstur pakaian, dan spesifikasi pakaian baru."
  },
  "BODY_POSE": {
    "id": "BODY_POSE",
    "label": "Body / Pose",
    "code": "F",
    "color": "#10b981",
    "description": "Pengaturan proporsi anatomi, gestur, skala framing tubuh (full body / closeup)."
  },
  "BACKGROUND": {
    "id": "BACKGROUND",
    "label": "Background",
    "code": "G",
    "color": "#14b8a6",
    "description": "Penggantian lokasi, manipulasi scene, dan studio backdrop."
  },
  "LIGHTING": {
    "id": "LIGHTING",
    "label": "Lighting",
    "code": "H",
    "color": "#facc15",
    "description": "Tata cahaya, dynamic range, golden hour, softbox, dan pencahayaan studio."
  },
  "IMAGE_QUALITY": {
    "id": "IMAGE_QUALITY",
    "label": "Image Quality",
    "code": "I",
    "color": "#06b6d4",
    "description": "Ketajaman mikrokontras, reduksi noise digital, dan kejernihan tekstur."
  },
  "COLOR_TONE": {
    "id": "COLOR_TONE",
    "label": "Color / Tone",
    "code": "J",
    "color": "#a855f7",
    "description": "Grading warna estetik, tone hangat/dingin, dan kurva warna profesional."
  },
  "CANVAS_RATIO": {
    "id": "CANVAS_RATIO",
    "label": "Canvas / Aspect Ratio",
    "code": "K",
    "color": "#f97316",
    "description": "Dimensi kanvas dan aspect ratio gambar (9:16, 16:9, 1:1, 4:5, 21:9)."
  },
  "TRANSPARENCY": {
    "id": "TRANSPARENCY",
    "label": "Transparency / Alpha",
    "code": "L",
    "color": "#64748b",
    "description": "Penghapusan background menjadi transparan dan isolasi subjek matte alpha."
  },
  "OBJECT_EDITING": {
    "id": "OBJECT_EDITING",
    "label": "Object Editing",
    "code": "M",
    "color": "#e11d48",
    "description": "Penghapusan objek yang mengganggu (inpainting) atau penambahan prop tertentu."
  },
  "STYLE_EFFECT": {
    "id": "STYLE_EFFECT",
    "label": "Style / Visual Effect",
    "code": "N",
    "color": "#d946ef",
    "description": "Gaya sinematik dramatis, nuansa vintage analog, dan palet futuristik."
  },
  "CAMERA_PHOTO": {
    "id": "CAMERA_PHOTO",
    "label": "Camera / Photographic Character",
    "code": "O",
    "color": "#0284c7",
    "description": "Karakteristik optik kamera nyata, lensa wide/macro, bokeh f/1.4, dan tekstur sensor RAW."
  }
};

export const INITIAL_SHORTHAND_CATALOG = [
  {
    "code": "/facelock",
    "name": "Face Lock & Identity Preservation",
    "category": "LOCK_PRESERVATION",
    "target": "FACE_IDENTITY",
    "description": "Mengunci struktur wajah, mata, hidung, dan ekspresi asli subjek agar identitas tetap konsisten 100% tanpa distorsi saat melakukan modifikasi visual lain.",
    "semanticTriggers": [
      "jangan ubah wajah",
      "pertahankan wajah",
      "wajah tetap sama",
      "jangan mengubah identitas",
      "kunci muka",
      "wajah asli",
      "wajah harus tetap sama",
      "preserve face",
      "keep face",
      "keep face unchanged",
      "same face",
      "preserve identity"
    ],
    "negativeTriggers": [
      "ubah wajah",
      "ganti wajah",
      "edit wajah",
      "makeover wajah",
      "ganti muka"
    ],
    "conflicts": [
      "/faceedit",
      "/facechange",
      "/expression"
    ],
    "compatibleWith": [
      "/outfit",
      "/bgreplace",
      "/bgremove",
      "/enhance",
      "/hairlock",
      "/ar 9:16",
      "/ar 16:9",
      "/sharpen"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat mengganti pakaian, latar belakang, pose, atau rasio kanvas dengan instruksi tegas bahwa wajah tidak boleh berubah.",
    "whenNotToUse": "Jangan gunakan jika user secara eksplisit meminta mengedit ekspresi, merias wajah, atau mengubah identitas subjek.",
    "functionGroup": "FACE_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/face-preserve",
      "/identity-lock"
    ],
    "relationships": [
      {
        "code": "/outfit",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Melindungi identitas wajah saat pakaian diganti."
      },
      {
        "code": "/headwear-remove",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Melindungi fitur wajah saat penutup kepala dilepas."
      },
      {
        "code": "/hairlock",
        "relationType": "COMPATIBLE",
        "reason": "Dapat dipadukan untuk menjaga wajah dan rambut sekaligus."
      }
    ]
  },
  {
    "code": "/hairlock",
    "name": "Hair Structure & Color Lock",
    "category": "LOCK_PRESERVATION",
    "target": "HAIR",
    "description": "Menjaga gaya rambut, tekstur helai rambut, dan warna rambut asli agar tidak ikut berubah saat mengganti pakaian atau latar.",
    "semanticTriggers": [
      "pertahankan rambut",
      "pertahankan rambut asli",
      "jangan ubah rambut",
      "rambut asli",
      "rambut tetap sama",
      "kunci rambut",
      "keep hair",
      "preserve hair",
      "same haircut",
      "hairlock"
    ],
    "negativeTriggers": [
      "ubah gaya rambut",
      "ganti rambut",
      "potong rambut",
      "botak",
      "cukur botak",
      "cat rambut",
      "ubah warna rambut"
    ],
    "conflicts": [
      "/hairchange",
      "/haircolor"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/bgremove",
      "/bgreplace",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika user meminta modifikasi tubuh atau pakaian namun mensyaratkan rambut asli tetap utuh.",
    "whenNotToUse": "Jangan gunakan jika user meminta model rambut baru, potong rambut, atau warna rambut lain.",
    "functionGroup": "HAIR_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hair-preserve",
      "/lock-hair"
    ],
    "relationships": [
      {
        "code": "/outfit",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga rambut tetap konsisten ketika perubahan pakaian dilakukan."
      },
      {
        "code": "/headwear-remove",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga rambut asli setelah penutup kepala dibuka."
      }
    ]
  },
  {
    "code": "/backgroundlock",
    "name": "Background Environment Lock",
    "category": "LOCK_PRESERVATION",
    "target": "BACKGROUND",
    "description": "Mengunci lingkungan, interior/eksterior latar belakang, dan pencahayaan ambien agar tidak termodifikasi saat subjek diperbaiki.",
    "semanticTriggers": [
      "jangan ubah latar",
      "pertahankan background",
      "latar asli",
      "kunci background",
      "latar tetap sama",
      "pertahankan latar belakang",
      "keep background",
      "same backdrop",
      "preserve background"
    ],
    "negativeTriggers": [
      "hapus background",
      "ganti background",
      "hapus latar",
      "ganti latar",
      "latar transparan",
      "latar baru",
      "gunakan latar baru",
      "pindah ke studio"
    ],
    "conflicts": [
      "/bgremove",
      "/bgreplace",
      "/bgblur",
      "/studiobg"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/sharpen"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika subjek ingin diedit (misal outfit atau pencahayaan) tanpa mengganggu lingkungan ruangan atau tempat foto diambil.",
    "whenNotToUse": "Jangan gunakan jika ada permintaan penghapusan background, penggantian lokasi, atau isolasi transparan.",
    "functionGroup": "BACKGROUND_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/bg-lock",
      "/lock-background"
    ],
    "relationships": [
      {
        "code": "/outfit",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga lingkungan latar belakang tetap utuh saat pakaian diganti."
      },
      {
        "code": "/facelock",
        "relationType": "COMPATIBLE",
        "reason": "Kompatibel penuh dengan penguncian wajah."
      }
    ]
  },
  {
    "code": "/outfitlock",
    "name": "Outfit & Clothing Lock",
    "category": "LOCK_PRESERVATION",
    "target": "OUTFIT",
    "description": "Mempertahankan busana, warna pakaian, dan tekstur kain asli subjek agar tidak berubah.",
    "semanticTriggers": [
      "jangan ubah baju",
      "jangan mengubah pakaian",
      "pertahankan pakaian",
      "pertahankan baju",
      "baju asli",
      "kunci outfit",
      "baju tetap sama",
      "keep outfit",
      "same clothes",
      "preserve clothing"
    ],
    "negativeTriggers": [
      "ganti baju",
      "ubah pakaian",
      "ganti outfit",
      "pakai tanktop",
      "pakai kemeja",
      "baju baru"
    ],
    "conflicts": [
      "/outfit",
      "/outfit-remove",
      "/outfit-color"
    ],
    "compatibleWith": [
      "/facelock",
      "/backgroundlock",
      "/enhance",
      "/ar 9:16"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika memperbaiki foto, wajah, atau latar namun pakaian subjek harus tetap sama persis.",
    "whenNotToUse": "Jangan gunakan jika user meminta mengganti baju atau gaya busana.",
    "functionGroup": "OUTFIT_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/clothes-lock",
      "/lock-outfit"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "COMPATIBLE",
        "reason": "Pencahayaan ditingkatkan tanpa mengubah tekstur atau warna busana asli."
      }
    ]
  },
  {
    "code": "/bodylock",
    "name": "Body Anatomy & Pose Lock",
    "category": "LOCK_PRESERVATION",
    "target": "BODY_POSE",
    "description": "Mempertahankan proporsi tubuh, pose subjek, dan gestur asli tanpa perubahan bentuk anatomi.",
    "semanticTriggers": [
      "jangan ubah tubuh",
      "pertahankan pose",
      "postur asli",
      "kunci pose",
      "anatomi tetap",
      "keep body",
      "same pose",
      "preserve anatomy"
    ],
    "negativeTriggers": [
      "ubah pose",
      "ganti gestur",
      "langsingkan",
      "tubuh berotot",
      "ganti posisi"
    ],
    "conflicts": [
      "/posechange"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/bgremove",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk menjaga proporsi tubuh dan pose natural subjek saat mengganti busana.",
    "whenNotToUse": "Jangan gunakan jika user secara spesifik meminta pose atau aksi gerak baru.",
    "functionGroup": "BODY_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/pose-lock",
      "/lock-body"
    ],
    "relationships": [
      {
        "code": "/outfit",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga proporsi tubuh dan postur asli subjek saat busana diganti."
      }
    ]
  },
  {
    "code": "/headwearlock",
    "name": "Headwear & Hijab Preservation Lock",
    "category": "LOCK_PRESERVATION",
    "target": "HEADWEAR",
    "description": "Mengunci hijab, kerudung, topi, atau aksesori kepala asli subjek agar tidak terlepas atau termodifikasi.",
    "semanticTriggers": [
      "pertahankan hijab",
      "jangan ubah hijab",
      "kunci hijab",
      "hijab asli",
      "pertahankan topi",
      "keep hijab",
      "preserve headwear"
    ],
    "negativeTriggers": [
      "hapus hijab",
      "lepas hijab",
      "buka hijab",
      "tanpa hijab",
      "lepas topi"
    ],
    "conflicts": [
      "/headwear-remove"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika user mensyaratkan hijab/penutup kepala tetap dikenakan apa adanya.",
    "whenNotToUse": "Jangan gunakan jika user meminta melepas atau menghapus hijab.",
    "functionGroup": "HEADWEAR_PRESERVATION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hijab-lock",
      "/lock-headwear"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "COMPATIBLE",
        "reason": "Menjaga penutup kepala dan wajah tetap utuh bersamaan."
      }
    ]
  },
  {
    "code": "/faceedit",
    "name": "Facial Feature Retouching & Editing",
    "category": "FACE_IDENTITY",
    "target": "FACE_IDENTITY",
    "description": "Memodifikasi atau merias karakteristik fitur wajah, make-up, atau perbaikan estetika wajah.",
    "semanticTriggers": [
      "ubah wajah",
      "edit wajah",
      "makeover wajah",
      "percantik wajah",
      "rias wajah",
      "edit muka",
      "retouch face"
    ],
    "negativeTriggers": [
      "jangan ubah wajah",
      "pertahankan wajah",
      "wajah asli",
      "kunci muka"
    ],
    "conflicts": [
      "/facelock"
    ],
    "compatibleWith": [
      "/outfit",
      "/enhance",
      "/sharpen"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat ada instruksi khusus untuk mempercantik atau merias wajah.",
    "whenNotToUse": "Jangan gunakan saat ada permintaan penguncian identitas atau /facelock.",
    "functionGroup": "FACE_RETOUCH",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/retouch-face",
      "/face-enhance"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Meningkatkan kualitas visual keseluruhan bersamaan dengan retouching wajah."
      }
    ]
  },
  {
    "code": "/facechange",
    "name": "Face & Subject Identity Swapping",
    "category": "FACE_IDENTITY",
    "target": "FACE_IDENTITY",
    "description": "Menggantikan seluruh struktur wajah dengan referensi karakter atau orang yang berbeda.",
    "semanticTriggers": [
      "ganti wajah",
      "tukar wajah",
      "ganti muka",
      "swap face",
      "replace face"
    ],
    "negativeTriggers": [
      "jangan ubah wajah",
      "pertahankan wajah",
      "wajah asli"
    ],
    "conflicts": [
      "/facelock"
    ],
    "compatibleWith": [
      "/outfit",
      "/bgreplace"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk face swapping atau penggantian identitas wajah.",
    "whenNotToUse": "Dilarang digunakan jika ada instruksi preservasi wajah asli.",
    "functionGroup": "FACE_SWAP",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/faceswap",
      "/swap-face"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyelaraskan tone pencahayaan wajah pengganti."
      }
    ]
  },
  {
    "code": "/expression",
    "name": "Facial Expression & Mood Styling",
    "category": "FACE_IDENTITY",
    "target": "FACE_IDENTITY",
    "description": "Menyesuaikan ekspresi emosi wajah (senyum, serius, percaya diri) tanpa mengubah fitur identitas dasar.",
    "semanticTriggers": [
      "buat tersenyum",
      "ubah ekspresi",
      "tampak tersenyum",
      "ekspresi percaya diri",
      "smile expression",
      "happy face"
    ],
    "negativeTriggers": [
      "pertahankan ekspresi",
      "jangan ubah ekspresi"
    ],
    "conflicts": [
      "/facelock"
    ],
    "compatibleWith": [
      "/enhance",
      "/colorgrade",
      "/rawphoto"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan ketika user ingin subjek tampak tersenyum atau berekspresi ramah.",
    "whenNotToUse": "Jangan gunakan jika wajah subjek dikunci mati termasuk ekspresinya.",
    "functionGroup": "FACE_EXPRESSION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/change-expression",
      "/facial-expression"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "COMPATIBLE",
        "reason": "Ekspresi diubah namun identitas tetap terhubung."
      }
    ]
  },
  {
    "code": "/hairchange",
    "name": "Hairstyle & Cut Modification",
    "category": "HAIR",
    "target": "HAIR",
    "description": "Mengubah gaya potongan rambut, model rambut pendek/panjang, atau memangkas botak.",
    "semanticTriggers": [
      "ubah gaya rambut",
      "ganti rambut",
      "potong rambut",
      "ganti model rambut",
      "gaya rambut botak",
      "cukur botak",
      "rambut pendek",
      "change hairstyle"
    ],
    "negativeTriggers": [
      "pertahankan rambut asli",
      "jangan ubah rambut",
      "rambut asli"
    ],
    "conflicts": [
      "/hairlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika user meminta gaya rambut baru atau potongan rambut spesifik.",
    "whenNotToUse": "Jangan gunakan jika rambut asli diminta dipertahankan.",
    "functionGroup": "HAIR_EDIT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/change-hairstyle",
      "/hair-style"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Mengubah gaya rambut dengan wajah tetap terlindungi."
      }
    ]
  },
  {
    "code": "/haircolor",
    "name": "Hair Color Tinting & Highlights",
    "category": "HAIR",
    "target": "HAIR",
    "description": "Mengubah warna rambut subjek (misal: pirang, merah, cokelat) dengan kilau pantulan alami.",
    "semanticTriggers": [
      "cat rambut",
      "ubah warna rambut",
      "rambut merah",
      "rambut pirang",
      "rambut hitam pekat",
      "dye hair",
      "change hair color"
    ],
    "negativeTriggers": [
      "pertahankan warna rambut",
      "rambut asli",
      "jangan ubah rambut"
    ],
    "conflicts": [
      "/hairlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk mewarnai rambut subjek.",
    "whenNotToUse": "Jangan gunakan jika warna rambut asli subjek dikunci.",
    "functionGroup": "HAIR_COLOR",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/dye-hair",
      "/hair-dye"
    ],
    "relationships": [
      {
        "code": "/hairlock",
        "relationType": "CONTEXTUAL",
        "reason": "Dapat mengganti warna tanpa mengubah struktur potongan rambut."
      }
    ]
  },
  {
    "code": "/naturalhair",
    "name": "Natural Hair Texture & Volume Reconstruction",
    "category": "HAIR",
    "target": "HAIR",
    "functionGroup": "NATURAL_HAIR_RECONSTRUCTION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/authentic-hair",
      "/real-hair"
    ],
    "description": "Merekonstruksi struktur helai rambut alami dan ketebalan natural yang terbuka saat hijab atau penutup kepala dilepas.",
    "semanticTriggers": [
      "tampilkan rambut natural",
      "rambut natural",
      "rekonstruksi rambut",
      "rambut alami",
      "natural hair"
    ],
    "negativeTriggers": [
      "pertahankan hijab",
      "rambut palsu",
      "cat rambut"
    ],
    "conflicts": [
      "/headwearlock"
    ],
    "compatibleWith": [
      "/headwear-remove",
      "/facelock",
      "/enhance",
      "/sharpen"
    ],
    "relationships": [
      {
        "code": "/headwear-remove",
        "relationType": "REVEALED_BY_REMOVAL",
        "reason": "Merekonstruksi rambut alami yang terbuka saat penutup kepala dibuka."
      },
      {
        "code": "/hairlock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga rambut tetap konsisten."
      },
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan pencahayaan pada helai rambut yang baru terbuka."
      }
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan ketika membuka penutup kepala untuk memastikan helai rambut yang tampak adalah rambut alami subjek.",
    "whenNotToUse": "Jangan gunakan jika hijab/penutup kepala tetap dikenakan."
  },
  {
    "code": "/headwear-remove",
    "name": "Headwear / Hijab Removal & Reconstruction",
    "category": "HEADWEAR",
    "target": "HEADWEAR",
    "description": "Melepaskan atau menghapus hijab, kerudung, topi, atau penutup kepala sambil merekonstruksi rambut alami dan garis leher secara anatomis.",
    "semanticTriggers": [
      "hapus hijab",
      "lepas hijab",
      "buka hijab",
      "tanpa hijab",
      "lepaskan hijab",
      "lepaskan penutup kepala",
      "hapus penutup kepala",
      "hapus topi",
      "remove hijab",
      "remove headwear",
      "no hijab"
    ],
    "negativeTriggers": [
      "pertahankan hijab",
      "jangan ubah hijab",
      "pakai hijab"
    ],
    "conflicts": [
      "/headwearlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat ada instruksi pelepasan atau penghapusan penutup kepala / hijab.",
    "whenNotToUse": "Jangan gunakan jika penutup kepala diminta dipertahankan.",
    "functionGroup": "HEADWEAR_REMOVAL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/remove-hijab",
      "/remove-head-cover",
      "/take-off-headwear"
    ],
    "relationships": [
      {
        "code": "/naturalhair",
        "relationType": "REVEALED_BY_REMOVAL",
        "reason": "Merekonstruksi struktur rambut alami yang terbuka saat penutup kepala dibuka."
      },
      {
        "code": "/hairlock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga rambut tetap konsisten ketika penutup kepala dibuka."
      },
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Melindungi identitas wajah saat penutup kepala dilepas."
      },
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan pencahayaan pada bagian kepala yang baru terbuka."
      },
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Menajamkan helai rambut yang direkonstruksi."
      }
    ]
  },
  {
    "code": "/headwear-add",
    "name": "Headwear & Hat Addition",
    "category": "HEADWEAR",
    "target": "HEADWEAR",
    "description": "Menambahkan aksesori kepala seperti topi fedora, beanie, cap, atau bando ke kepala subjek.",
    "semanticTriggers": [
      "pakai topi",
      "tambah topi",
      "kenakan topi",
      "add hat",
      "wear cap"
    ],
    "negativeTriggers": [
      "tanpa topi",
      "lepas topi"
    ],
    "conflicts": [
      "/headwear-remove"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat user meminta subjek mengenakan topi atau aksesori kepala.",
    "whenNotToUse": "Jangan gunakan saat melepas penutup kepala.",
    "functionGroup": "HEADWEAR_ADD",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/add-hat",
      "/wear-headwear"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menambahkan topi dengan wajah tetap terkunci."
      }
    ]
  },
  {
    "code": "/outfit",
    "name": "Selective Outfit Replacement",
    "category": "OUTFIT",
    "target": "OUTFIT",
    "description": "Mengganti pakaian subjek dengan spesifikasi busana baru secara presisi dengan tetap menjaga anatomi tubuh dan lipatan kain natural.",
    "semanticTriggers": [
      "ganti baju",
      "ubah pakaian",
      "ganti outfit",
      "pakai tanktop",
      "pakai kemeja",
      "baju baru",
      "ganti busana",
      "ganti baju menjadi tanktop",
      "change clothes",
      "change outfit",
      "wear tanktop"
    ],
    "negativeTriggers": [
      "jangan ubah baju",
      "pertahankan pakaian",
      "baju asli",
      "kunci outfit",
      "jangan mengubah pakaian"
    ],
    "conflicts": [
      "/outfitlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/hairlock",
      "/enhance",
      "/ar 9:16"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan ketika user menginstruksikan perubahan pakaian atau gaya busana subjek.",
    "whenNotToUse": "Jangan gunakan jika ada perintah eksplisit untuk mempertahankan pakaian asli.",
    "functionGroup": "OUTFIT_EDIT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/change-clothes",
      "/change-outfit",
      "/wear-clothes"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Melindungi identitas wajah saat mengganti pakaian subjek."
      },
      {
        "code": "/bodylock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga proporsi tubuh dan postur asli subjek saat mengganti busana."
      },
      {
        "code": "/hairlock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga rambut tetap konsisten saat pakaian diganti."
      },
      {
        "code": "/posechange",
        "relationType": "CONTEXTUAL",
        "reason": "Menyesuaikan pose agar selaras dengan pakaian baru."
      },
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan pencahayaan pada kain pakaian baru."
      },
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Mempertegas detail lipatan kain."
      }
    ]
  },
  {
    "code": "/outfit-remove",
    "name": "Outerwear Removal / Minimalist Layering",
    "category": "OUTFIT",
    "target": "OUTFIT",
    "description": "Melepaskan jaket, mantel, atau lapisan pakaian luar untuk menampilkan pakaian di lapisan dalamnya.",
    "semanticTriggers": [
      "lepas jaket",
      "buka mantel",
      "tanpa jaket",
      "remove jacket",
      "take off coat"
    ],
    "negativeTriggers": [
      "pertahankan jaket",
      "kunci outfit"
    ],
    "conflicts": [
      "/outfitlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan ketika user ingin melepas outer atau jaket subjek.",
    "whenNotToUse": "Jangan gunakan jika pakaian luar dikunci.",
    "functionGroup": "OUTFIT_REMOVE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/remove-jacket",
      "/take-off-outerwear"
    ],
    "relationships": [
      {
        "code": "/bodylock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga siluet tubuh saat outerwear dilepas."
      }
    ]
  },
  {
    "code": "/outfit-color",
    "name": "Fabric & Outfit Color Adjustment",
    "category": "OUTFIT",
    "target": "OUTFIT",
    "description": "Mengubah warna pakaian tanpa mengubah bentuk atau model pakaian yang dikenakan.",
    "semanticTriggers": [
      "ubah warna baju",
      "ganti warna pakaian",
      "baju warna hitam",
      "baju warna putih",
      "change outfit color"
    ],
    "negativeTriggers": [
      "pertahankan warna baju",
      "kunci outfit"
    ],
    "conflicts": [
      "/outfitlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan jika user hanya ingin mengganti warna kain baju tanpa merombak potongannya.",
    "whenNotToUse": "Jangan gunakan jika seluruh pakaian dirombak total.",
    "functionGroup": "OUTFIT_COLOR",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/recolor-outfit",
      "/change-clothes-color"
    ],
    "relationships": [
      {
        "code": "/outfitlock",
        "relationType": "CONTEXTUAL",
        "reason": "Mengubah warna kain dengan pola potongan pakaian tetap konsisten."
      }
    ]
  },
  {
    "code": "/fullbody",
    "name": "Full Body Framing & Shot Scale",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Memperluas framing gambar untuk menampilkan postur subjek secara penuh dari kepala hingga ujung kaki (full body framing).",
    "semanticTriggers": [
      "tampilkan full body",
      "seluruh tubuh",
      "tampak badan penuh",
      "badan penuh",
      "full body shot",
      "head to toe",
      "full length"
    ],
    "negativeTriggers": [
      "close up",
      "zoom wajah",
      "setengah badan",
      "portrait crop"
    ],
    "conflicts": [
      "/closeup"
    ],
    "compatibleWith": [
      "/ar 9:16",
      "/outfit",
      "/bodylock",
      "/facelock"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat user ingin melihat seluruh tubuh subjek termasuk sepatu dan ujung pakaian.",
    "whenNotToUse": "Jangan gunakan jika user meminta fokus foto wajah atau close-up.",
    "functionGroup": "FRAMING_FULL_BODY",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/expand-fullbody",
      "/head-to-toe"
    ],
    "relationships": [
      {
        "code": "/bodylock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Memastikan proporsi kepala hingga kaki seimbang saat framing diperluas."
      }
    ]
  },
  {
    "code": "/closeup",
    "name": "Tight Close-Up Portrait Framing",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Memusatkan framing kamera secara dekat ke area wajah dan bahu subjek.",
    "semanticTriggers": [
      "close up",
      "zoom wajah",
      "fokus wajah",
      "portrait close up",
      "tight shot"
    ],
    "negativeTriggers": [
      "full body",
      "seluruh tubuh"
    ],
    "conflicts": [
      "/fullbody"
    ],
    "compatibleWith": [
      "/facelock",
      "/sharpen",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk foto profil atau potret fokus detail wajah.",
    "whenNotToUse": "Jangan gunakan saat meminta tampilan seluruh badan.",
    "functionGroup": "FRAMING_CLOSEUP",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/portrait-closeup",
      "/tight-framing"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menampilkan detail wajah dekat dengan identitas asli."
      },
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Mempertajam mikrokontras pori-pori dan mata."
      }
    ]
  },
  {
    "code": "/posechange",
    "name": "Dynamic Posture & Gesture Modification",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Menyetel pose tubuh baru seperti berdiri tegak, duduk santai, atau melangkah.",
    "semanticTriggers": [
      "ubah pose",
      "ganti pose",
      "pose berdiri",
      "pose duduk",
      "change pose"
    ],
    "negativeTriggers": [
      "pertahankan pose",
      "jangan ubah tubuh",
      "pose asli"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/outfit",
      "/facelock"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika ada instruksi spesifik untuk memodifikasi pose subjek.",
    "whenNotToUse": "Jangan gunakan jika postur asli diminta dipertahankan.",
    "functionGroup": "BODY_POSE_EDIT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/change-pose",
      "/adjust-gesture"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Mengubah aksi tubuh tanpa merusak wajah."
      }
    ]
  },
  {
    "code": "/bodyvoluptuous",
    "name": "Natural Voluptuous Body Shape",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Membentuk proporsi tubuh montok, berisi, dan berlekuk secara natural dan realistis.",
    "semanticTriggers": [
      "montok",
      "tubuh montok",
      "badan montok",
      "berisi",
      "tubuh berisi",
      "badan berisi",
      "body voluptuous",
      "voluptuous body",
      "curvy natural",
      "montok natural",
      "tubuh montok natural",
      "montok dan berisi"
    ],
    "negativeTriggers": [
      "tubuh kurus",
      "skinny",
      "slim",
      "langsing",
      "badan kurus",
      "pertahankan tubuh",
      "jangan ubah tubuh"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/curvy",
      "/fullfigured",
      "/voluptuous"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat instruksi meminta bentuk tubuh montok atau berisi secara proporsional dan natural.",
    "whenNotToUse": "Jangan gunakan jika instruksi meminta tubuh langsing, kurus, atau postur netral.",
    "functionGroup": "BODY_SHAPE_VOLUPTUOUS",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/voluptuousbody",
      "/natural-voluptuous"
    ],
    "relationships": [
      {
        "code": "/curvy",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif siluet tubuh berlekuk feminin."
      },
      {
        "code": "/fullfigured",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tubuh berisi dengan proporsi penuh."
      },
      {
        "code": "/plussize",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif ukuran tubuh plus-size."
      },
      {
        "code": "/voluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif montok/berisi dengan lekuk yang lebih menonjol."
      },
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga identitas wajah saat proporsi tubuh diubah."
      }
    ]
  },
  {
    "code": "/curvy",
    "name": "Curvy Body Silhouette",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Tubuh berlekuk feminin dengan lekukan pinggang dan pinggul proporsional.",
    "semanticTriggers": [
      "curvy",
      "tubuh berlekuk",
      "berlekuk",
      "siluet berlekuk",
      "hourglass",
      "lekuk tubuh"
    ],
    "negativeTriggers": [
      "tubuh lurus",
      "straight body",
      "boyish"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/bodyvoluptuous"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat instruksi menginginkan lekukan tubuh yang tegas dan feminin (hourglass).",
    "whenNotToUse": "Jangan gunakan jika tidak menginginkan penonjolan lekuk tubuh.",
    "functionGroup": "BODY_SHAPE_CURVY",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hourglass",
      "/curvaceous"
    ],
    "relationships": [
      {
        "code": "/bodyvoluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif bentuk tubuh montok natural."
      },
      {
        "code": "/voluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif lekuk tubuh yang lebih menonjol."
      }
    ]
  },
  {
    "code": "/fullfigured",
    "name": "Full-Figured Proportions",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Tubuh berisi dengan proporsi penuh yang padat dan seimbang.",
    "semanticTriggers": [
      "fullfigured",
      "full figured",
      "proporsi penuh",
      "tubuh padat berisi"
    ],
    "negativeTriggers": [
      "petite",
      "kecil",
      "kurus"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat instruksi meminta proporsi tubuh yang lebih berisi dan berisi penuh.",
    "whenNotToUse": "Jangan gunakan untuk proporsi tubuh standar atau langsing.",
    "functionGroup": "BODY_SHAPE_FULLFIGURE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/full-figured"
    ],
    "relationships": [
      {
        "code": "/bodyvoluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tubuh montok natural."
      },
      {
        "code": "/plussize",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif ukuran tubuh plus-size."
      }
    ]
  },
  {
    "code": "/plussize",
    "name": "Plus-Size Body Scale",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Menampilkan ukuran tubuh plus-size dengan proporsi realistis.",
    "semanticTriggers": [
      "plus size",
      "plussize",
      "ukuran plus-size",
      "plus-size",
      "chubby",
      "tubuh gemuk berisi"
    ],
    "negativeTriggers": [
      "skinny",
      "kurus",
      "langsing"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat instruksi meminta skala tubuh plus-size secara khusus.",
    "whenNotToUse": "Jangan gunakan jika instruksi hanya meminta sedikit lekuk.",
    "functionGroup": "BODY_SHAPE_PLUSSIZE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/plus-size"
    ],
    "relationships": [
      {
        "code": "/bodyvoluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tubuh montok natural."
      },
      {
        "code": "/fullfigured",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tubuh berisi penuh."
      }
    ]
  },
  {
    "code": "/voluptuous",
    "name": "Voluptuous Prominent Curves",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Montok dan berisi dengan lekukan tubuh yang lebih menonjol.",
    "semanticTriggers": [
      "voluptuous",
      "voluptuous body",
      "voluptuous curves",
      "lekuk menonjol",
      "lekukan menonjol",
      "lekuk dramatis",
      "buxom"
    ],
    "negativeTriggers": [
      "flat",
      "rata",
      "kurus"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat instruksi meminta lekuk tubuh montok yang lebih dramatis dan menonjol.",
    "whenNotToUse": "Jangan gunakan jika menginginkan lekuk tubuh yang halus/natural.",
    "functionGroup": "BODY_SHAPE_VOLUPTUOUS_PROMINENT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/heavy-curves"
    ],
    "relationships": [
      {
        "code": "/bodyvoluptuous",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tubuh montok natural."
      },
      {
        "code": "/curvy",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif lekuk feminin standar."
      }
    ]
  },
  {
    "code": "/handperfect",
    "name": "Perfect Natural Hands & Fingers",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Menyempurnakan proporsi anatomi tangan dan jari agar tampak natural, simetris, dan proporsional.",
    "semanticTriggers": [
      "anatomi tangan natural",
      "tangan natural",
      "jari sempurna",
      "tangan sempurna",
      "perfect hands",
      "natural hands",
      "anatomi tangan",
      "tangan",
      "jari",
      "hand anatomy",
      "proporsi tangan",
      "bentuk tangan"
    ],
    "negativeTriggers": [
      "sembunyikan tangan",
      "tanpa tangan",
      "tangan di kantong"
    ],
    "conflicts": [
      "/bodylock"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/sharpen",
      "/hands",
      "/handanatomy"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk memastikan tangan dan jari subjek memiliki anatomi sempurna tanpa distorsi jari berlebih.",
    "whenNotToUse": "Jangan gunakan jika tangan tidak terlihat dalam komposisi frame gambar.",
    "functionGroup": "HAND_ANATOMY_PERFECT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/perfect-hands",
      "/natural-hands"
    ],
    "relationships": [
      {
        "code": "/hands",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif fokus komposisi pada tangan."
      },
      {
        "code": "/handanatomy",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif anatomi tangan natural."
      },
      {
        "code": "/fingerperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif fokus kesempurnaan jari."
      },
      {
        "code": "/handdetail",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif detail tangan dan jari."
      },
      {
        "code": "/handnatural",
        "relationType": "ALTERNATIVE",
        "reason": "Alternatif tangan natural dan proporsional."
      },
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga identitas wajah tetap konsisten saat menyempurnakan detail tangan."
      }
    ]
  },
  {
    "code": "/hands",
    "name": "Hands Framing & Pose Focus",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Fokus pada komposisi gestur tangan dan posisi tangan dalam frame.",
    "semanticTriggers": [
      "fokus pada tangan",
      "fokus tangan",
      "posisi tangan",
      "gestur tangan",
      "hands focus"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/handperfect",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat gestur tangan menjadi elemen fokus utama dalam gambar.",
    "whenNotToUse": "Jangan gunakan jika tangan tidak tampak di frame.",
    "functionGroup": "HAND_POSE_FOCUS",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hand-focus"
    ],
    "relationships": [
      {
        "code": "/handperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Rekomendasi utama tangan dan jari sempurna natural."
      }
    ]
  },
  {
    "code": "/handanatomy",
    "name": "Natural Hand Anatomy Structure",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Anatomi tangan dan persendian tulang yang natural dan proporsional.",
    "semanticTriggers": [
      "anatomi tangan",
      "struktur tangan",
      "sendi tangan",
      "hand anatomy"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/handperfect",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk memperbaiki struktur sendi dan anatomi tangan.",
    "whenNotToUse": "Jangan gunakan jika tangan tidak terlihat.",
    "functionGroup": "HAND_ANATOMY_STRUCTURE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hand-anatomy"
    ],
    "relationships": [
      {
        "code": "/handperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Rekomendasi utama tangan dan jari sempurna natural."
      }
    ]
  },
  {
    "code": "/fingerperfect",
    "name": "Detailed Finger Perfection",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Fokus pada kesempurnaan lima jari tangan tanpa peleburan atau duplikasi.",
    "semanticTriggers": [
      "fokus kesempurnaan jari",
      "kesempurnaan jari",
      "lima jari sempurna",
      "detail jari",
      "finger perfect"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/handperfect",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan ketika jari tangan mengalami artefak atau duplikasi.",
    "whenNotToUse": "Jangan gunakan jika jari tidak terlihat jelas.",
    "functionGroup": "FINGER_PERFECTION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/perfect-fingers"
    ],
    "relationships": [
      {
        "code": "/handperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Rekomendasi utama tangan dan jari sempurna natural."
      }
    ]
  },
  {
    "code": "/handdetail",
    "name": "Hand & Finger Texture Detail",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Detail tekstur tangan, kuku, garis telapak, dan pori-pori kulit tangan.",
    "semanticTriggers": [
      "detail tangan dan jari",
      "detail tangan",
      "tekstur tangan",
      "kuku tangan",
      "hand detail"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/handperfect",
      "/sharpen"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk close-up tangan yang membutuhkan mikrotekstur realistis.",
    "whenNotToUse": "Jangan gunakan untuk foto subjek jarak jauh.",
    "functionGroup": "HAND_TEXTURE_DETAIL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/hand-texture"
    ],
    "relationships": [
      {
        "code": "/handperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Rekomendasi utama tangan dan jari sempurna natural."
      }
    ]
  },
  {
    "code": "/handnatural",
    "name": "Proportional Natural Hands",
    "category": "BODY_POSE",
    "target": "BODY_POSE",
    "description": "Tangan natural dan proporsional sesuai postur dan ukuran tubuh subjek.",
    "semanticTriggers": [
      "tangan natural dan proporsional",
      "tangan natural",
      "proporsional tangan",
      "natural hand proportions"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/handperfect",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk memastikan ukuran tangan tidak terlalu besar atau kecil dibanding tubuh.",
    "whenNotToUse": "Jangan gunakan jika tidak ada subjek manusia.",
    "functionGroup": "HAND_PROPORTIONAL_NATURAL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/natural-hand-scale"
    ],
    "relationships": [
      {
        "code": "/handperfect",
        "relationType": "ALTERNATIVE",
        "reason": "Rekomendasi utama tangan dan jari sempurna natural."
      }
    ]
  },
  {
    "code": "/bgreplace",
    "name": "Background Scene Replacement",
    "category": "BACKGROUND",
    "target": "BACKGROUND",
    "description": "Mengganti latar belakang dengan pemandangan, studio, atau lokasi baru disertai harmonisasi bayangan dan cahaya subjek.",
    "semanticTriggers": [
      "ganti background",
      "ganti latar belakang",
      "gunakan latar baru",
      "latar baru",
      "pindah ke studio",
      "latar pantai",
      "pemandangan baru",
      "change background",
      "new backdrop",
      "replace background"
    ],
    "negativeTriggers": [
      "pertahankan background",
      "jangan ubah latar",
      "latar asli",
      "latar transparan",
      "hapus latar"
    ],
    "conflicts": [
      "/backgroundlock",
      "/bgremove"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan ketika user menginstruksikan perubahan atau penggantian latar belakang ke suasana baru.",
    "whenNotToUse": "Jangan gunakan jika latar belakang asli dikunci atau jika diminta transparan.",
    "functionGroup": "BACKGROUND_REPLACEMENT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/replace-background",
      "/change-bg",
      "/latar-baru"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyelaraskan pencahayaan subjek dengan latar baru."
      },
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Mengunci identitas wajah di latar pemandangan baru."
      },
      {
        "code": "/backgroundlock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Alternatif pembatalan penggantian latar."
      }
    ]
  },
  {
    "code": "/bgblur",
    "name": "Background Defocus & Depth Blur",
    "category": "BACKGROUND",
    "target": "BACKGROUND",
    "description": "Membuat latar belakang menjadi buram halus (depth of field) agar subjek di depan lebih menonjol.",
    "semanticTriggers": [
      "buramkan background",
      "latar belakang blur",
      "defocus background",
      "blur latar"
    ],
    "negativeTriggers": [
      "hapus latar",
      "latar transparan"
    ],
    "conflicts": [
      "/bgremove",
      "/backgroundlock"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk foto portrait dengan efek latar belakang buram profesional.",
    "whenNotToUse": "Jangan gunakan saat latar belakang dihapus transparan.",
    "functionGroup": "BACKGROUND_BLUR",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/blur-background",
      "/depth-blur"
    ],
    "relationships": [
      {
        "code": "/facelock",
        "relationType": "COMPATIBLE",
        "reason": "Subjek tetap fokus tajam di depan latar kabur."
      }
    ]
  },
  {
    "code": "/studiobg",
    "name": "Clean Studio Cyclorama Backdrop",
    "category": "BACKGROUND",
    "target": "BACKGROUND",
    "description": "Mengubah latar belakang menjadi studio foto profesional bersih dengan gradasi abu-abu atau putih solid.",
    "semanticTriggers": [
      "latar studio",
      "studio cyclorama",
      "background polos",
      "latar putih studio"
    ],
    "negativeTriggers": [
      "pertahankan background",
      "latar pemandangan"
    ],
    "conflicts": [
      "/backgroundlock",
      "/bgremove"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk foto produk atau foto profil studio profesional.",
    "whenNotToUse": "Jangan gunakan jika latar belakang asli dipertahankan.",
    "functionGroup": "LIGHTING_STUDIO",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/studio-background",
      "/studio-backdrop"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan pencahayaan studio dengan backdrop bersih."
      }
    ]
  },
  {
    "code": "/enhance",
    "name": "Global Lighting & Color Enhancement",
    "category": "LIGHTING",
    "target": "LIGHTING",
    "description": "Menganalisis dan menyeimbangkan ulang pencahayaan, tone warna, dynamic range, dan saturasi untuk hasil visual profesional.",
    "semanticTriggers": [
      "perbaiki pencahayaan",
      "perbaiki pencahayaan foto",
      "pencahayaan foto",
      "terangkan foto",
      "tata cahaya",
      "pencahayaan redup",
      "enhance lighting",
      "fix lighting",
      "lighting balance",
      "enhance"
    ],
    "negativeTriggers": [
      "pertahankan pencahayaan asli",
      "gelapkan foto"
    ],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/sharpen",
      "/outfit",
      "/hdr",
      "/denoise"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat pencahayaan foto kurang seimbang, redup, atau terlalu flat.",
    "whenNotToUse": "Jangan gunakan jika user secara sengaja menginginkan suasana siluet gelap.",
    "functionGroup": "LIGHTING_ENHANCEMENT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/enhance-lighting",
      "/lighting-fix",
      "/improve-lighting",
      "/improve-exposure"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyempurnakan mikrokontras dan ketajaman setelah pencahayaan ditingkatkan."
      },
      {
        "code": "/denoise",
        "relationType": "QUALITY_RELATED",
        "reason": "Membersihkan noise yang mungkin timbul saat exposure diangkat."
      },
      {
        "code": "/warmtone",
        "relationType": "CONTEXTUAL",
        "reason": "Memberikan nuansa hangat estetik pada pencahayaan."
      }
    ]
  },
  {
    "code": "/softlight",
    "name": "Soft Diffused Studio Illumination",
    "category": "LIGHTING",
    "target": "LIGHTING",
    "description": "Menerapkan cahaya lembut tersebar tanpa bayangan tajam yang keras, ideal untuk potret wajah.",
    "semanticTriggers": [
      "cahaya lembut",
      "soft lighting",
      "diffused light",
      "pencahayaan lembut"
    ],
    "negativeTriggers": [
      "cahaya keras",
      "harsh shadows"
    ],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/enhance",
      "/rawphoto"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk potret kecantikan atau foto yang memerlukan bayangan halus.",
    "whenNotToUse": "Jangan gunakan untuk scene yang memerlukan bayangan kontras dramatis.",
    "functionGroup": "LIGHTING_STUDIO",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/soft-light",
      "/diffused-lighting"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyempurnakan bayangan lembut pada wajah dan tubuh."
      }
    ]
  },
  {
    "code": "/goldenhour",
    "name": "Warm Sunset Golden Hour Sunlight",
    "category": "LIGHTING",
    "target": "LIGHTING",
    "description": "Menambahkan cahaya matahari senja hangat keemasan dari samping dengan flare lembut.",
    "semanticTriggers": [
      "golden hour",
      "cahaya senja",
      "matahari sore",
      "sunset lighting",
      "warm sunlight"
    ],
    "negativeTriggers": [
      "cahaya dingin",
      "studio light"
    ],
    "conflicts": [
      "/studiobg"
    ],
    "compatibleWith": [
      "/enhance",
      "/colorgrade",
      "/rawphoto"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk foto outdoor dengan suasana sore hangat dan romantis.",
    "whenNotToUse": "Jangan gunakan untuk foto studio formal latar polos.",
    "functionGroup": "LIGHTING_GOLDENHOUR",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/sunset-glow",
      "/warm-sunlight"
    ],
    "relationships": [
      {
        "code": "/warmtone",
        "relationType": "QUALITY_RELATED",
        "reason": "Mempertegas kehangatan warna matahari senja."
      }
    ]
  },
  {
    "code": "/sharpen",
    "name": "High-Frequency Detail Sharpening",
    "category": "IMAGE_QUALITY",
    "target": "IMAGE_QUALITY",
    "description": "Meningkatkan mikrokontras dan ketajaman detail halus tanpa menimbulkan artefak halo atau noise yang berlebihan.",
    "semanticTriggers": [
      "buat foto lebih tajam",
      "lebih tajam",
      "tajamkan",
      "perjelas detail",
      "ketajaman",
      "sharpen image",
      "crisp focus",
      "high clarity",
      "sharpen"
    ],
    "negativeTriggers": [
      "efek blur",
      "soft focus",
      "buramkan"
    ],
    "conflicts": [
      "/bokeh"
    ],
    "compatibleWith": [
      "/enhance",
      "/facelock",
      "/rawphoto",
      "/denoise"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat foto terlihat agak buram atau kurang fokus tajam.",
    "whenNotToUse": "Jangan gunakan jika user sengaja meminta efek soft vintage atau blur.",
    "functionGroup": "IMAGE_SHARPENING",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/clarity-boost",
      "/edge-sharpen",
      "/tajam"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Komplementer dengan peningkatan exposure dan dynamic range."
      }
    ]
  },
  {
    "code": "/highresolution",
    "name": "Ultra-High Resolution & Upscaling",
    "category": "IMAGE_QUALITY",
    "target": "IMAGE_QUALITY",
    "description": "Meningkatkan resolusi dan kepadatan piksel ke tingkat ultra-tinggi (4K/8K) dengan rekonstruksi mikrotekstur tajam dan jernih.",
    "semanticTriggers": [
      "resolusi tinggi",
      "high resolution",
      "high res",
      "kualitas tinggi",
      "super resolution",
      "superresolution",
      "upscale",
      "tingkatkan resolusi",
      "resolusi super",
      "resolusi 4k",
      "resolusi 8k",
      "4k",
      "8k",
      "ultra detailed",
      "high detail",
      "uhd"
    ],
    "negativeTriggers": [
      "low resolution",
      "resolusi rendah",
      "pixel art",
      "buram"
    ],
    "conflicts": [],
    "compatibleWith": [
      "/enhance",
      "/facelock",
      "/sharpen",
      "/rawphoto",
      "/denoise"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat instruksi meminta peningkatan resolusi gambar, detail ultra-tinggi, atau output 4K/8K.",
    "whenNotToUse": "Jangan gunakan jika user sengaja meminta gaya resolusi rendah atau pixel art.",
    "functionGroup": "IMAGE_RESOLUTION",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/superresolution",
      "/upscale",
      "/4k",
      "/8k",
      "/highdetail",
      "/ultradetailed",
      "/resolusi-tinggi"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyempurnakan mikrokontras dan ketajaman tepian pada resolusi tinggi."
      },
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan pencahayaan untuk mendukung detail resolusi tinggi."
      },
      {
        "code": "/denoise",
        "relationType": "QUALITY_RELATED",
        "reason": "Membersihkan noise piksel saat upscaling gambar."
      }
    ]
  },
  {
    "code": "/denoise",
    "name": "ISO Noise & Grain Reduction",
    "category": "IMAGE_QUALITY",
    "target": "IMAGE_QUALITY",
    "description": "Membersihkan noise digital dan bintik pada foto gelap atau beresolusi rendah sambil mempertahankan ketajaman tepian.",
    "semanticTriggers": [
      "hilangkan noise",
      "bersihkan bintik",
      "hapus grain",
      "foto bersih",
      "clean noise",
      "remove grain",
      "denoise"
    ],
    "negativeTriggers": [
      "vintage grain",
      "film grain",
      "tambah bintik"
    ],
    "conflicts": [
      "/vintage"
    ],
    "compatibleWith": [
      "/enhance",
      "/sharpen",
      "/facelock"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan pada foto malam hari atau hasil foto berpencahayaan rendah yang berbintik.",
    "whenNotToUse": "Jangan gunakan jika gaya film retro vintage diinginkan.",
    "functionGroup": "IMAGE_DENOISE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/noise-reduction",
      "/clean-noise"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Mencegah noise artefak teramplifikasi saat penajaman."
      }
    ]
  },
  {
    "code": "/hdr",
    "name": "High Dynamic Range Reconstruction",
    "category": "IMAGE_QUALITY",
    "target": "IMAGE_QUALITY",
    "description": "Memulihkan detail pada area sorotan terlalu terang (blown-out highlights) dan bayangan pekat (crushed shadows).",
    "semanticTriggers": [
      "hdr",
      "dynamic range",
      "pulihkan bayangan",
      "jangan terlalu silau",
      "seimbangkan highlight",
      "high dynamic range"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/enhance",
      "/colorgrade",
      "/rawphoto"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan jika ada area foto yang terlalu silau atau bagian bayangan yang gelap gulita.",
    "whenNotToUse": "Jangan gunakan pada foto yang kontras tinggi secara artistik (chiaroscuro).",
    "functionGroup": "LIGHTING_ENHANCEMENT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/high-dynamic-range",
      "/hdr-light"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyeimbangkan area shadow dan highlight ekstrem."
      }
    ]
  },
  {
    "code": "/cleandetail",
    "name": "Micro-Texture Clarity & Skin Cleanliness",
    "category": "IMAGE_QUALITY",
    "target": "IMAGE_QUALITY",
    "description": "Menjernihkan tekstur pori-pori dan serat pakaian dengan kejelasan ultra tanpa filter plastik.",
    "semanticTriggers": [
      "detail mikro",
      "tekstur jernih",
      "pori pori bersih",
      "serat kain detail",
      "clean detail"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/sharpen",
      "/enhance",
      "/rawphoto"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk meningkatkan fidelitas visual foto resolusi tinggi.",
    "whenNotToUse": "Tidak perlu jika ketajaman dasar /sharpen sudah mencukupi.",
    "functionGroup": "IMAGE_SHARPENING",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/clean-texture",
      "/micro-detail"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Membersihkan detail mikro tanpa distorsi."
      }
    ]
  },
  {
    "code": "/colorgrade",
    "name": "Master Color Grading",
    "category": "COLOR_TONE",
    "target": "COLOR_TONE",
    "description": "Menerapkan penyesuaian kurva warna terarah (misal: teal & orange, warm vintage, atau clean commercial) secara profesional.",
    "semanticTriggers": [
      "color grading",
      "atur warna",
      "tone warna",
      "palet warna estetik",
      "pewarnaan profesional",
      "grading warna"
    ],
    "negativeTriggers": [
      "hitam putih",
      "monokrom"
    ],
    "conflicts": [
      "/monochrome"
    ],
    "compatibleWith": [
      "/enhance",
      "/cinematic",
      "/facelock"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk menyelaraskan palet warna gambar secara estetis.",
    "whenNotToUse": "Jangan gunakan saat user meminta hasil hitam-putih monokrom.",
    "functionGroup": "COLOR_WARM_TONE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/cinematic-grade",
      "/color-grading"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyelaraskan tone warna dengan pencahayaan."
      }
    ]
  },
  {
    "code": "/monochrome",
    "name": "Fine-Art Black & White Tonal Range",
    "category": "COLOR_TONE",
    "target": "COLOR_TONE",
    "description": "Mengonversi gambar menjadi foto hitam-putih dengan gradasi kontras kaya dan midtone halus.",
    "semanticTriggers": [
      "hitam putih",
      "monokrom",
      "black and white",
      "grayscale",
      "b&w"
    ],
    "negativeTriggers": [
      "penuh warna",
      "saturasi tinggi"
    ],
    "conflicts": [
      "/colorgrade",
      "/warmtone",
      "/cooltone"
    ],
    "compatibleWith": [
      "/enhance",
      "/sharpen",
      "/facelock"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat ada permintaan foto hitam-putih atau seni monokrom.",
    "whenNotToUse": "Jangan gunakan jika foto berwarna diinginkan.",
    "functionGroup": "COLOR_COOL_TONE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/black-white",
      "/bnw"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Mempertegas kontras mikrotekstur hitam-putih."
      }
    ]
  },
  {
    "code": "/warmtone",
    "name": "Warm Amber & Gold Tonal Cast",
    "category": "COLOR_TONE",
    "target": "COLOR_TONE",
    "description": "Memberikan semburat warna hangat keemasan yang menenangkan dan ramah pada kulit.",
    "semanticTriggers": [
      "tone hangat",
      "warm tone",
      "nuansa hangat",
      "warna hangat"
    ],
    "negativeTriggers": [
      "tone dingin",
      "cool tone",
      "monokrom"
    ],
    "conflicts": [
      "/cooltone",
      "/monochrome"
    ],
    "compatibleWith": [
      "/enhance",
      "/goldenhour"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk kesan santai, hangat, dan ramah.",
    "whenNotToUse": "Jangan gunakan bersamaan dengan /cooltone.",
    "functionGroup": "COLOR_WARM_TONE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/warm-palette",
      "/golden-tone"
    ],
    "relationships": [
      {
        "code": "/goldenhour",
        "relationType": "CONTEXTUAL",
        "reason": "Selaras dengan tata cahaya hangat matahari."
      }
    ]
  },
  {
    "code": "/cooltone",
    "name": "Cool Steel & Blue Cinematic Cast",
    "category": "COLOR_TONE",
    "target": "COLOR_TONE",
    "description": "Memberikan nuansa warna dingin kebiruan yang modern, futuristik, dan berkarakter tajam.",
    "semanticTriggers": [
      "tone dingin",
      "cool tone",
      "nuansa biru",
      "warna sejuk"
    ],
    "negativeTriggers": [
      "tone hangat",
      "warm tone",
      "monokrom"
    ],
    "conflicts": [
      "/warmtone",
      "/monochrome"
    ],
    "compatibleWith": [
      "/enhance",
      "/cinematic"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk scene bertema sci-fi, malam kota, atau formal dingin.",
    "whenNotToUse": "Jangan gunakan bersamaan dengan /warmtone.",
    "functionGroup": "COLOR_COOL_TONE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/cool-palette",
      "/moody-blue-tone"
    ],
    "relationships": [
      {
        "code": "/cinematic",
        "relationType": "CONTEXTUAL",
        "reason": "Menciptakan nuansa sinematik moody modern."
      }
    ]
  },
  {
    "code": "/ar 9:16",
    "name": "Vertical Aspect Ratio 9:16",
    "category": "CANVAS_RATIO",
    "target": "CANVAS_RATIO",
    "description": "Menyetel rasio kanvas gambar menjadi format vertikal 9:16 yang optimal untuk smartphone, TikTok, Instagram Reels, dan YouTube Shorts.",
    "semanticTriggers": [
      "ubah rasio menjadi 9:16",
      "rasio 9:16",
      "format vertical",
      "story format",
      "reels format",
      "ar 9:16",
      "potret tinggi",
      "dimensi 9:16"
    ],
    "negativeTriggers": [
      "rasio 16:9",
      "rasio 1:1",
      "rasio 4:5",
      "landscape"
    ],
    "conflicts": [
      "/ar 16:9",
      "/ar 1:1",
      "/ar 4:5"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/fullbody"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat gambar ditujukan untuk platform vertikal seperti Reels, Shorts, atau Stories.",
    "whenNotToUse": "Jangan gunakan untuk banner desktop atau foto feed persegi.",
    "functionGroup": "ASPECT_RATIO_VERTICAL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/ratio 9:16",
      "/vertical-9-16"
    ],
    "relationships": [
      {
        "code": "/fullbody",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Sangat cocok untuk framing seluruh badan vertikal."
      }
    ]
  },
  {
    "code": "/ar 16:9",
    "name": "Widescreen Aspect Ratio 16:9",
    "category": "CANVAS_RATIO",
    "target": "CANVAS_RATIO",
    "description": "Menyetel rasio kanvas gambar menjadi format horizontal layar lebar 16:9 ideal untuk banner web dan desktop.",
    "semanticTriggers": [
      "ubah rasio menjadi 16:9",
      "rasio 16:9",
      "format landscape",
      "layar lebar",
      "ar 16:9",
      "widescreen"
    ],
    "negativeTriggers": [
      "rasio 9:16",
      "rasio 1:1",
      "vertical"
    ],
    "conflicts": [
      "/ar 9:16",
      "/ar 1:1",
      "/ar 4:5"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance",
      "/cinematic"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk video thumbnail YouTube, banner situs, atau presentasi layar lebar.",
    "whenNotToUse": "Jangan gunakan untuk konten stories ponsel vertikal.",
    "functionGroup": "ASPECT_RATIO_LANDSCAPE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/ratio 16:9",
      "/landscape-16-9"
    ],
    "relationships": [
      {
        "code": "/cinematic",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Format standar layar lebar sinematik."
      }
    ]
  },
  {
    "code": "/ar 1:1",
    "name": "Square Aspect Ratio 1:1",
    "category": "CANVAS_RATIO",
    "target": "CANVAS_RATIO",
    "description": "Menyetel kanvas menjadi persegi sama sisi 1:1 dengan framing seimbang.",
    "semanticTriggers": [
      "rasio 1:1",
      "format persegi",
      "kotak",
      "square aspect",
      "ar 1:1"
    ],
    "negativeTriggers": [
      "rasio 9:16",
      "rasio 16:9"
    ],
    "conflicts": [
      "/ar 9:16",
      "/ar 16:9",
      "/ar 4:5"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk feed Instagram standar atau avatar foto profil.",
    "whenNotToUse": "Jangan gunakan untuk format cerita vertikal atau sinematik layar lebar.",
    "functionGroup": "ASPECT_RATIO_SQUARE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/ratio 1:1",
      "/square-1-1"
    ],
    "relationships": [
      {
        "code": "/closeup",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Format avatar dan portrait persegi seimbang."
      }
    ]
  },
  {
    "code": "/ar 4:5",
    "name": "Instagram Portrait Aspect Ratio 4:5",
    "category": "CANVAS_RATIO",
    "target": "CANVAS_RATIO",
    "description": "Menyetel kanvas ke format potret 4:5 yang memaksimalkan tampilan layar feed Instagram.",
    "semanticTriggers": [
      "rasio 4:5",
      "format 4:5",
      "instagram portrait",
      "ar 4:5"
    ],
    "negativeTriggers": [
      "rasio 16:9",
      "rasio 1:1"
    ],
    "conflicts": [
      "/ar 9:16",
      "/ar 16:9",
      "/ar 1:1"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk foto feed Instagram format tinggi optimal.",
    "whenNotToUse": "Jangan gunakan untuk layar video landscape 16:9.",
    "functionGroup": "ASPECT_RATIO_PORTRAIT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/ratio 4:5",
      "/portrait-4-5"
    ],
    "relationships": [
      {
        "code": "/outfit",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Proporsi feed media sosial untuk busana subjek."
      }
    ]
  },
  {
    "code": "/bgremove",
    "name": "Background Removal / Transparent Alpha",
    "category": "TRANSPARENCY",
    "target": "BACKGROUND",
    "description": "Menghapus latar belakang subjek secara bersih hingga menjadi transparan (matte alpha channel) dengan isolasi tepian yang halus.",
    "semanticTriggers": [
      "hapus background",
      "hapus latar",
      "hapus latar belakang",
      "latar transparan",
      "hilangkan latar belakang",
      "buang background",
      "remove background",
      "transparent background",
      "clean cutout"
    ],
    "negativeTriggers": [
      "pertahankan background",
      "jangan ubah latar",
      "ganti background",
      "gunakan latar baru"
    ],
    "conflicts": [
      "/backgroundlock",
      "/bgreplace",
      "/studiobg"
    ],
    "compatibleWith": [
      "/facelock",
      "/outfit",
      "/enhance",
      "/sharpen"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan saat user membutuhkan gambar subjek terisolasi tanpa latar belakang untuk stiker, katalog, atau desain grafis.",
    "whenNotToUse": "Jangan gunakan jika latar belakang asli ingin dipertahankan atau diganti pemandangan lain.",
    "functionGroup": "BACKGROUND_REMOVAL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/remove-background",
      "/transparent-bg"
    ],
    "relationships": [
      {
        "code": "/alphachannel",
        "relationType": "DIRECTLY_RELATED",
        "reason": "Mengisolasi subjek ke alpha matte transparan murni."
      },
      {
        "code": "/facelock",
        "relationType": "PRESERVATION_RELATED",
        "reason": "Menjaga identitas wajah tetap utuh saat background dipotong."
      }
    ]
  },
  {
    "code": "/alphachannel",
    "name": "Clean Edge Alpha Masking",
    "category": "TRANSPARENCY",
    "target": "BACKGROUND",
    "description": "Mempertajam tepian rambut dan siluet transparan agar tidak menyisakan halo hijau/putih saat ditempel ke latar lain.",
    "semanticTriggers": [
      "masking transparan",
      "alpha channel halus",
      "pinggiran rapi transparan",
      "feathered edge alpha"
    ],
    "negativeTriggers": [],
    "conflicts": [
      "/backgroundlock"
    ],
    "compatibleWith": [
      "/bgremove",
      "/facelock",
      "/outfit"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan sebagai pelengkap /bgremove untuk helai rambut tipis.",
    "whenNotToUse": "Tidak diperlukan jika latar belakang tidak transparan.",
    "functionGroup": "TRANSPARENCY_ALPHA",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/alpha-mask",
      "/cutout-subject"
    ],
    "relationships": [
      {
        "code": "/bgremove",
        "relationType": "DIRECTLY_RELATED",
        "reason": "Masking alpha channel presisi tinggi pada tepi rambut."
      }
    ]
  },
  {
    "code": "/object-remove",
    "name": "Selective Object Inpainting & Removal",
    "category": "OBJECT_EDITING",
    "target": "OBJECT_EDITING",
    "description": "Menghapus objek pengganggu, watermark, kabel, atau noda yang tidak diinginkan dari foto secara mulus.",
    "semanticTriggers": [
      "hapus objek",
      "hilangkan noda",
      "hapus benda",
      "bersihkan gangguan",
      "remove object",
      "inpaint remove"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/backgroundlock",
      "/enhance"
    ],
    "priority": "HIGH",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan untuk menghapus objek yang merusak estetika foto.",
    "whenNotToUse": "Jangan gunakan jika tidak ada objek spesifik yang ingin dihilangkan.",
    "functionGroup": "OBJECT_REMOVAL",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/inpaint-remove",
      "/erase-object"
    ],
    "relationships": [
      {
        "code": "/backgroundlock",
        "relationType": "COMPATIBLE",
        "reason": "Menghapus objek tanpa menggeser sisa pemandangan latar."
      }
    ]
  },
  {
    "code": "/object-add",
    "name": "Context-Aware Prop & Object Insertion",
    "category": "OBJECT_EDITING",
    "target": "OBJECT_EDITING",
    "description": "Menambahkan objek pendukung (misal kacamata, cangkir kopi, tas) yang berbaur secara harmonis dengan cahaya gambar.",
    "semanticTriggers": [
      "tambah objek",
      "pegang cangkir",
      "pakai kacamata",
      "tambahkan benda",
      "add object"
    ],
    "negativeTriggers": [],
    "conflicts": [],
    "compatibleWith": [
      "/facelock",
      "/outfit"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "DISARANKAN",
    "whenToUse": "Gunakan saat user meminta menyisipkan aksesori atau properti ke foto.",
    "whenNotToUse": "Jangan gunakan jika user meminta gambar bersih minimalis.",
    "functionGroup": "OBJECT_ADD",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/insert-prop",
      "/place-object"
    ],
    "relationships": [
      {
        "code": "/enhance",
        "relationType": "QUALITY_RELATED",
        "reason": "Menyesuaikan bayangan objek baru dengan cahaya sekitar."
      }
    ]
  },
  {
    "code": "/cinematic",
    "name": "Cinematic Mood & Volumetric Lighting",
    "category": "STYLE_EFFECT",
    "target": "STYLE_EFFECT",
    "description": "Memberikan sentuhan sinematik ala film layar lebar dengan pencahayaan volumetrik dramatis dan palet warna filmic.",
    "semanticTriggers": [
      "gaya sinematik",
      "nuansa film",
      "cinematic lighting",
      "film look",
      "dramatis",
      "suasana film"
    ],
    "negativeTriggers": [
      "foto asli polos",
      "flat photo"
    ],
    "conflicts": [
      "/rawphoto"
    ],
    "compatibleWith": [
      "/enhance",
      "/facelock",
      "/colorgrade"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk mendapatkan kesan dramatis sinematik berkelas bioskop.",
    "whenNotToUse": "Jangan gunakan jika user mensyaratkan foto polos seperti jepretan mentah kamera biasa.",
    "functionGroup": "STYLE_CINEMATIC",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/movie-look",
      "/film-still"
    ],
    "relationships": [
      {
        "code": "/ar 16:9",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Menyempurnakan komposisi layar lebar sinematik."
      },
      {
        "code": "/cooltone",
        "relationType": "CONTEXTUAL",
        "reason": "Memberikan palet warna teal and orange khas perfilman."
      }
    ]
  },
  {
    "code": "/vintage",
    "name": "Vintage 35mm Analog Film Aesthetic",
    "category": "STYLE_EFFECT",
    "target": "STYLE_EFFECT",
    "description": "Memberikan tekstur grain film 35mm retro, kehangatan analog, dan warna nostalgia khas kamera klasik.",
    "semanticTriggers": [
      "retro",
      "vintage",
      "kamera analog",
      "film 35mm",
      "grain vintage",
      "nostalgia"
    ],
    "negativeTriggers": [
      "foto modern tajam",
      "clean digital"
    ],
    "conflicts": [
      "/rawphoto",
      "/denoise"
    ],
    "compatibleWith": [
      "/colorgrade"
    ],
    "priority": "LOW",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk gaya estetika foto jadul retro yang hangat.",
    "whenNotToUse": "Jangan gunakan saat user membutuhkan ketajaman ultra jernih modern.",
    "functionGroup": "STYLE_VINTAGE",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/retro-film",
      "/analog-35mm"
    ],
    "relationships": [
      {
        "code": "/warmtone",
        "relationType": "CONTEXTUAL",
        "reason": "Nuansa nostalgia hangat film analog."
      }
    ]
  },
  {
    "code": "/rawphoto",
    "name": "Authentic RAW Photographic Character",
    "category": "CAMERA_PHOTO",
    "target": "CAMERA_PHOTO",
    "description": "Mencegah tampilan over-processed atau filter kartun berlebihan, menghasilkan tekstur kulit realistis dengan grain sensor alami kamera profesional.",
    "semanticTriggers": [
      "foto asli",
      "raw photo",
      "seperti jepretan kamera",
      "tekstur kulit nyata",
      "realistic camera",
      "natural photography",
      "bukan kartun"
    ],
    "negativeTriggers": [
      "kartun",
      "anime",
      "vektor",
      "lukisan",
      "3d render"
    ],
    "conflicts": [
      "/cinematic",
      "/vintage"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance",
      "/sharpen"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk memastikan hasil generasi terlihat seperti foto kamera sungguhan tanpa filter berlebihan.",
    "whenNotToUse": "Jangan gunakan jika tujuan pengguna adalah gaya ilustrasi atau lukisan art.",
    "functionGroup": "CAMERA_RAW",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/raw-sensor",
      "/dslr-photo"
    ],
    "relationships": [
      {
        "code": "/sharpen",
        "relationType": "QUALITY_RELATED",
        "reason": "Menonjolkan ketajaman alami sensor kamera tanpa efek buatan."
      }
    ]
  },
  {
    "code": "/bokeh",
    "name": "f/1.4 Shallow Depth of Field & Optical Bokeh",
    "category": "CAMERA_PHOTO",
    "target": "CAMERA_PHOTO",
    "description": "Meniru optik bukaan lensa lebar f/1.4 dengan titik-titik lingkaran bokeh artistik pada latar belakang.",
    "semanticTriggers": [
      "bokeh",
      "lensa f1.4",
      "shallow depth of field",
      "lingkaran cahaya blur",
      "fokus dangkal"
    ],
    "negativeTriggers": [
      "fokus menyeluruh",
      "semua tajam"
    ],
    "conflicts": [
      "/sharpen"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance"
    ],
    "priority": "MEDIUM",
    "recommendationLevel": "OPSIONAL",
    "whenToUse": "Gunakan untuk potret mewah dengan titik cahaya latar belakang membulat lembut.",
    "whenNotToUse": "Jangan gunakan untuk foto landscape di mana seluruh pemandangan harus tajam.",
    "functionGroup": "CAMERA_BOKEH",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/f1-4-bokeh",
      "/shallow-dof"
    ],
    "relationships": [
      {
        "code": "/closeup",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Efek bokeh latar belakang membulat lembut pada portrait dekat."
      }
    ]
  },
  {
    "code": "/outpaint",
    "name": "AI Canvas Outpainting & Expansion",
    "category": "CANVAS_RATIO",
    "target": "Bidang & Batas Kanvas Foto",
    "description": "Memperluas dimensi bidang gambar di luar batas kanvas asli (AI Outpainting & Frame Extension) secara koheren dan mulus.",
    "semanticTriggers": [
      "memperluas foto",
      "perluas foto",
      "perluas kanvas",
      "perlebar foto",
      "perlebar gambar",
      "perpanjang foto",
      "outpaint",
      "outpainting",
      "uncrop",
      "expand canvas",
      "canvas extension",
      "extend frame"
    ],
    "negativeTriggers": [
      "jangan outpaint",
      "crop",
      "potong foto",
      "persempit foto"
    ],
    "conflicts": [
      "/crop"
    ],
    "compatibleWith": [
      "/facelock",
      "/enhance",
      "/sharpen",
      "/ar 16:9",
      "/ar 9:16",
      "/fullbody"
    ],
    "priority": "HIGH",
    "recommendationLevel": "WAJIB",
    "whenToUse": "Gunakan untuk memperlebar atau memperluas latar belakang foto melampaui batas frame asli tanpa merusak subjek tengah.",
    "whenNotToUse": "Jangan gunakan jika ingin memotong (crop) atau memfokuskan framing lebih rapat pada objek tertentu.",
    "functionGroup": "CANVAS_OUTPAINT",
    "preferredRepresentative": true,
    "status": "CORE",
    "source": "CORE",
    "equivalentTo": [
      "/expandcanvas",
      "/uncrop",
      "/canvas-extension"
    ],
    "relationships": [
      {
        "code": "/fullbody",
        "relationType": "COMPOSITION_RELATED",
        "reason": "Outpainting sering digunakan untuk memperlihatkan seluruh tubuh atau komposisi lingkungan sekitar."
      }
    ]
  }
];

/**
 * Intelligent Semantic Search & Scoring Utility
 * Memahami variasi bahasa, trigger semantik, target, dan negative intent.
 */
export function matchShorthandScore(item, queryText) {
  if (!queryText || typeof queryText !== 'string' || !queryText.trim()) return 1;

  const q = queryText.toLowerCase().trim();
  const code = item.code.toLowerCase();
  const name = item.name.toLowerCase();
  const target = item.target.toLowerCase();
  const category = item.category.toLowerCase();
  const desc = item.description.toLowerCase();

  // 1. Direct code exact match (highest priority)
  if (code === q || code === `/${q}`) return 100;
  if (code.includes(q)) return 75;

  // 2. Exact match on semantic trigger
  if (item.semanticTriggers && item.semanticTriggers.some(t => t.toLowerCase() === q)) {
    return 95;
  }

  // 3. Check negative triggers
  if (item.negativeTriggers) {
    for (const nt of item.negativeTriggers) {
      const ntl = nt.toLowerCase();
      const idx = q.indexOf(ntl);
      if (idx !== -1) {
        const ntStartsWithNegation = /^(?:jangan|tidak|tanpa|bukan)\s+/i.test(ntl);
        const prefix = q.slice(0, idx).trim();
        const endsWithNegation = /(?:jangan|tidak|tanpa|bukan)(?:\s+\w{0,8})?\s*$/i.test(prefix);

        if (ntStartsWithNegation || !endsWithNegation) {
          return -50;
        }
      }
    }
  }

  // 4. Exact phrase match or close match in semanticTriggers
  if (item.semanticTriggers) {
    for (const t of item.semanticTriggers) {
      const tl = t.toLowerCase();
      const idx = q.indexOf(tl);
      if (idx !== -1) {
        // If trigger does not start with negation but in prompt it is preceded by negation, skip it
        const prefix = q.slice(0, idx).trim();
        const isPrecededByNegation = /(?:jangan|tidak|tanpa|bukan)(?:\s+\w{0,8})?\s*$/i.test(prefix);
        const triggerStartsWithNegation = /^(?:jangan|tidak|tanpa|bukan)\s+/i.test(tl);

        if (!isPrecededByNegation || triggerStartsWithNegation) {
          return 85;
        }
      } else if (tl.includes(q)) {
        return 80;
      }
    }
  }

  // 5. Token overlap matching for semanticTriggers (ignoring common stop words)
  const STOP_WORDS = new Set(['jangan', 'tidak', 'tanpa', 'bukan', 'tetapi', 'tapi', 'dan', 'yang', 'untuk', 'dengan', 'dari', 'ke', 'di', 'ini', 'itu', 'pada']);
  const queryTokens = q.split(/\s+/).filter(tok => tok.length > 2 && !STOP_WORDS.has(tok));
  let tokenMatchCount = 0;

  for (const trigger of item.semanticTriggers || []) {
    const triggerLower = trigger.toLowerCase();
    const matchesAllTokens = queryTokens.length > 0 && queryTokens.every(tok => triggerLower.includes(tok));
    if (matchesAllTokens) return 75;

    const matchedSome = queryTokens.filter(tok => triggerLower.includes(tok)).length;
    if (matchedSome > tokenMatchCount) tokenMatchCount = matchedSome;
  }

  if (tokenMatchCount > 1) return 40 + tokenMatchCount * 5;

  // 6. Name, Target, Category, and Description matching
  if (name.includes(q)) return 50;
  if (target.includes(q) || category.includes(q)) return 40;
  if (desc.includes(q)) return 30;

  return 0;
}

/**
 * Filter catalog by category, target, recommendation level, and semantic search
 */
export function filterCatalogKnowledgeBase(catalog, {
  category = 'ALL',
  target = 'ALL',
  recommendationLevel = 'ALL',
  searchQuery = ''
} = {}) {
  const filtered = catalog.filter(item => {
    // Category filter
    if (category !== 'ALL' && item.category !== category) return false;

    // Target filter
    if (target !== 'ALL' && item.target !== target) return false;

    // Recommendation level filter
    if (recommendationLevel !== 'ALL' && item.recommendationLevel !== recommendationLevel) return false;

    return true;
  });

  if (searchQuery && searchQuery.trim()) {
    const scored = [];
    for (const item of filtered) {
      const score = matchShorthandScore(item, searchQuery);
      if (score > 0) {
        scored.push({ item, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.item);
  }

  return filtered;
}
