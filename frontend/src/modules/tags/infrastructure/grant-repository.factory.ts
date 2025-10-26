export const createTagRepository = async () => {
  if (import.meta.env.VITE_USE_LOCAL_REPOSITORIES === "true") {
    const { LocalStorageTagRepository } = await import("./local-storage-tag.repository");
    return LocalStorageTagRepository;
  }

  const { ApiTagRepository } = await import("./api-tag.repository");
  return ApiTagRepository;
};
