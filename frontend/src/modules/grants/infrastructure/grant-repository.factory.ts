export const createGrantRepository = async () => {
  if (import.meta.env.VITE_USE_LOCAL_REPOSITORIES === "true") {
    const { LocalStorageGrantRepository } = await import("./local-storage-grant.repository");
    return LocalStorageGrantRepository;
  }

  const { ApiGrantRepository } = await import("./api-grant.repository");
  return ApiGrantRepository;
};
