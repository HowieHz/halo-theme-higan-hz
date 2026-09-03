import "./styles.css";

interface UserPermission {
  uiPermissions?: string[];
}

const editButton = document.querySelector<HTMLAnchorElement>("[data-page-edit-button]");

if (editButton) {
  void fetch("/apis/api.console.halo.run/v1alpha1/users/-/permissions")
    .then(async (response) => {
      if (!response.ok) {
        return;
      }

      const permission = (await response.json()) as UserPermission;
      if (permission.uiPermissions?.includes("system:singlepages:manage")) {
        editButton.hidden = false;
      }
    })
    .catch(() => {
      // Keep the edit entry hidden when the permission request fails.
    });
}
