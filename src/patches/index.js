/**
 * V3 Patches Index & Auto-Registration
 */

import { globalPatchManager } from './patchManager.js';
import { v3CorePatch } from './v3CorePatch.js';
import { kamusPatch } from './kamusPatch.js';

// Registrasi patch standar V3
globalPatchManager.registerPatch(v3CorePatch);
globalPatchManager.registerPatch(kamusPatch);

export { globalPatchManager, v3CorePatch, kamusPatch };
