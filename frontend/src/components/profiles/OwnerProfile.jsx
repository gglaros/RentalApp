import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import OwnerAppCotext from "../../context/OwnerAppContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export const OwnerProfile = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { deleteProperty } = useContext(PropertyContext);
  const {makeApp,deleteApp,message,getRequests} = useContext(OwnerAppCotext)

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

 
  return (
    <>
    {
      message && (
      <p className="text-red-500 text-lg mt-2">{message}</p>
  )}
    <div className="container flex flex-col items-center rounded-b-3xl p-4 md:p-6">
  <div className="flex flex-col justify-center items-center w-full">
    <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3">
      User Profile
    </h2>

    <h2 className="text-lg md:text-xl lg:text-2xl flex justify-center w-full md:w-80 border-2 rounded-2xl p-2 mb-5">
      Name:{" "}
      <span className="text-purple-500 ml-2">{userProfile.first_name}</span>
    </h2>

    <h2 className="text-lg md:text-xl lg:text-2xl w-full md:w-80 border-2 rounded-2xl p-2 mb-2">
      Email:{" "}
      <span className="text-purple-500">{userProfile.email}</span>
    </h2>

    <h2 className="text-lg md:text-xl lg:text-2xl w-full md:w-80 border-2 rounded-2xl p-2 mb-2">
      Role:{" "}
      <span className="text-purple-500">{userProfile.role}</span>
    </h2>

    <div className="flex">
      <h2 className="text-lg md:text-xl lg:text-2xl w-full border-2 rounded-2xl p-2 mt-2 flex items-center justify-between">
      
        <button
          className="w-[100px] md:w-[120px] rounded-2xl text-lg md:text-xl bg-green-500 text-black border-2"
          onClick={() => navigate("/ownerApps")}>
          see apps
        </button>

        <button
          className="w-[100px] md:w-[120px] rounded-2xl text-lg md:text-xl bg-green-500 text-black border-2"
          onClick={() => navigate("/ownerRequests")}>
          see requests
        </button>

        <button type="button" className="w-[130px]  mt-2 relative bottom-1.4  rounded-2xl text-2xl bg-blue-500 text-black  border-2"
            onClick={() => {navigate('/Edit') } }>Edit profile</button>
      </h2>
    </div>


   
  </div>

  

  {/* Table Wrapper for mobile scroll */}
  <div className="container overflow-x-auto mt-4">
  <h2 className="text-3xl mt-2"> My  properties</h2>
    <table className="w-full border-4 rounded-2xl text-sm md:text-base lg:text-lg">
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
        {userProfile.properties?.map((property, index) => (
          <tr className="border-4" key={property.id || index}>
            <td>{property.address}</td>
            <td>{property.price}</td>
            <td>{property.description}</td>
            <td>{property.square_feet}</td>
            <td>{property.year_built}</td>
            <td>{property.status}</td>
            <td>
              <button
                type="button"
                className=" md:w-[100px] mt-3 rounded-2xl text-base md:text-xl bg-red-500 text-black border-2"
                onClick={() => deleteProperty(property.id, token)}>
                Delete
              </button>

              
            </td>
            <td>
              <button
                type="button"
                className=" md:w-[100px] mt-3 rounded-2xl text-base md:text-xl bg-blue-500 text-black border-2"
                onClick={() => makeApp(property.id,token)}>make app</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button
    type="button"
    className="rounded-2xl text-xl md:text-2xl w-32 md:w-40 mt-3 bg-green-500 text-black border-2"
    onClick={() => navigate("/propertyform")}>
    Add Property
  </button>

  
</div>

</>
  );
};
