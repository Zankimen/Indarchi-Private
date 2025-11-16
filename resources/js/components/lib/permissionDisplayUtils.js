/**
 * Permission Display Utility
 * Centralized mapping for permission display names
 */

const PERMISSION_DISPLAY_NAMES = {
  // Dashboard Access
  "dashboard.view": "Akses Dashboard",

  // Role Management (Dashboard Global)
  "dashboard.role.view": "Lihat Daftar Peran",
  "dashboard.role.manage": "Kelola Peran",

  // Worker Management (Dashboard Global)
  "dashboard.worker.view": "Lihat Daftar Pekerja",
  "dashboard.worker.manage": "Kelola Pekerja",

  // Project Management (Dashboard Global)
  "dashboard.project.view": "Lihat Daftar Proyek",
  "dashboard.project.fullview": "Lihat Detail Lengkap Proyek",
  "dashboard.project.manage": "Kelola Proyek",
  "dashboard.project.can.be.added": "Dapat Ditambahkan ke Proyek",

  // Project Local - Project Management
  "project.project.view": "Lihat Detail Proyek (Lokal)",
  "project.project.manage": "Kelola Proyek (Lokal)",

  // Project Local - Worker Management
  "project.worker.view": "Lihat Anggota Proyek",
  "project.worker.manage": "Kelola Anggota Proyek",

  // Project Local - Role Management
  "project.role.view": "Lihat Peran Proyek",
  "project.role.manage": "Kelola Peran Proyek",
};

/**
 * Get display name for a permission
 * @param {string} permissionName - Technical permission name
 * @returns {string} Human-readable display name
 */
export const getPermissionDisplayName = (permissionName) => {
  return PERMISSION_DISPLAY_NAMES[permissionName] || permissionName;
};

/**
 * Get permission with display name
 * @param {Object} permission - Permission object with name, id, etc
 * @returns {Object} Permission object with added display_name
 */
export const withDisplayName = (permission) => {
  return {
    ...permission,
    display_name: getPermissionDisplayName(permission.name),
  };
};

/**
 * Transform array of permissions to include display names
 * @param {Array} permissions - Array of permission objects
 * @returns {Array} Array with display names added
 */
export const withDisplayNames = (permissions) => {
  return permissions.map(withDisplayName);
};

export default {
  getPermissionDisplayName,
  withDisplayName,
  withDisplayNames,
};
