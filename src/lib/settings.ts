import { getSettings } from "./services/setting";

export const checkMaintenance = async () => {
  const settings = await getSettings();
  const isMaintenanceActive = settings?.data?.some(
    (item) => item.type === "maintenance" && item.status === "ACTIVE",
  );
  return !!isMaintenanceActive;
};
