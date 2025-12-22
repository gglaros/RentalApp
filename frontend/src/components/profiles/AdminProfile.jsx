import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import AdminContext from "../../context/AdminContext";
import axios from "axios";

export const AdminProfile = () => {
  
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { deleteProperty,fetchProperties,properties} = useContext(PropertyContext);
  const {getAllApps} = useContext(AdminContext);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");


  useEffect(() => {
   fetchProperties(token);
  }, [refresh]);
  
  const handleDelete = async (id,token) => {
    await deleteProperty(id, token);
    setRefresh(prev => !prev); 
  };
  
 const getApps = async (token) => {
  await getAllApps(token);
 } ;


  return (
    <div className=" container rounded-b-3xl p-6">
      <div className="flex flex-col justify-center items-center w-full ">
        <div>
          <h2 className="text-3xl mb-3  ">User Profile</h2>
        </div>

        <h2 className="text-2xl  w-70 border-2 rounded-2xl mb-5">
          Name:{" "}
          <span className="text-purple-500">{userProfile.first_name}</span>
        </h2>

        <h2 className="text-2xl w-80 border-2 rounded-2xl mb-1">
          Email: <span className="text-purple-500">{userProfile.email}</span>
        </h2>

        <h2 className="text-2xl w-80 border-2 rounded-2xl mb-1">
          Role: <span className="text-purple-500">{userProfile.role}</span>
        </h2>

        <div className="flex ">
          <h2 className="text-2xl w-80 border-2 rounded-2xl mb-1 mt-2">
            Apps :
            <button
                  type="button"
                  className="w-[100px]  mt-2 relative bottom-1.4  rounded-2xl text-2xl bg-green-500 text-black  border-2"
                  onClick={() => {
                    getApps(token)
                  }}>
                  see apps
                </button>
          </h2>
        </div>
      </div>

      <table className="w-full border-4 mt-2 rounded-2xl text-xl ">
        <thead>
          <tr>
            <th>Address</th>
            <th>Price</th>
            <th>Description</th>
            <th>Square Feet</th>
            <th>Year Built</th>
            <th>Status</th>
            <th>Action</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {properties?.map((property, index) => (
            <tr className="border-4" key={property.id || index}>
              <td>{property.address}</td>
              <td>{property.price}</td>
              <td>{property.description}</td>
              <td>{property.square_feet}</td>
              <td>{property.year_built}</td>
              <td>{property.status}</td>
              <td>{property.owner?.email}</td>
              <td>
                <button
                  type="button"
                  className="w-[100px]  mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2"
                  onClick={() => {
                    handleDelete(property.id,token)
                  }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};
