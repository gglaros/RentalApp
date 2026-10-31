import { createContext, useState, useCallback, useContext } from "react";
import UserContext from "../context/UserContext";
import { propertiesApi } from "../api/properties";

const PropertyContext = createContext();

function PropertyProvider({ children }) {
  const { fetchProfile } = useContext(UserContext);
  const [properties, setProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);

  const fetchProperties = useCallback(async () => {
    try {
      setProperties(await propertiesApi.listAll());
    } catch (error) {
      console.error("Failed to fetch properties", error);
    }
  }, []);

  const fetchApprovedProperties = useCallback(async (filters = {}) => {
    try {
      const data = await propertiesApi.listApproved(filters);
      setApprovedProperties(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch properties", error);
      return null;
    }
  }, []);

  const deleteProperty = useCallback(async (id) => {
    try {
      await propertiesApi.remove(id);
    } catch (error) {
      console.error("Failed to delete property", error);
    }
    fetchProfile();
  }, [fetchProfile]);

  const addProperty = useCallback(async (formData) => {
    const data = await propertiesApi.create(formData);
    await fetchProfile();
    return data;
  }, [fetchProfile]);

  const getProperty = useCallback((id) => propertiesApi.get(id), []);

  const updateProperty = useCallback(async (id, fields) => {
    const data = await propertiesApi.update(id, fields);
    await fetchProfile();
    return data;
  }, [fetchProfile]);

  const uploadImages = useCallback((id, files) => propertiesApi.uploadImages(id, files), []);
  const deleteImage = useCallback((id, imageId) => propertiesApi.deleteImage(id, imageId), []);
  const setCoverImage = useCallback((id, imageId) => propertiesApi.setCover(id, imageId), []);

  const valueToShare = {
    deleteProperty,
    addProperty,
    fetchProperties,
    fetchApprovedProperties,
    getProperty,
    updateProperty,
    uploadImages,
    deleteImage,
    setCoverImage,
    approvedProperties,
    properties,
  };

  return (
    <PropertyContext.Provider value={valueToShare}>
      {children}
    </PropertyContext.Provider>
  );
}

export { PropertyProvider };
export default PropertyContext;
