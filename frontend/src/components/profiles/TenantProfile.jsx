import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import TenantContext from "../../context/TenantContext";
import axios from "axios";

export const TenantProfile = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const {fetchApprovedProperties,approvedProperties} = useContext(PropertyContext)
  const {makeApp,message} = useContext(TenantContext);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  if (token != null) {
    useEffect(() => {
      // fetchProfile();
      fetchApprovedProperties();
    }, []);
  }


  return (
    <>
    {
      message && (
        <p className="text-red-500 text-lg mt-2">{message}</p>
      )}
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

        <h2 className="text-lg md:text-xl lg:text-2xl w-full md:w-80 border-2 rounded-2xl p-2 mb-2">
         Role:{" "}
       <span className="text-purple-500">{userProfile.role}</span>
      </h2>

        <div className="flex ">
          <h2 className="text-2xl w-80 border-2 rounded-2xl mb-1 mt-2">
            Apps :
            <button
              className=" w-[120px] rounded-2xl text-2xl bg-green-500 text-black border-2 ml-20"
              onClick={() => navigate("/TenantApps")}
            >
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
            <th>Owner email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {approvedProperties?.map((property, index) => (
            <tr className="border-4" key={property.id || index}>
              <td>{property.address}</td>
              <td>{property.price}</td>
              <td>{property.description}</td>
              <td>{property.square_feet}</td>
              <td>{property.year_built}</td>
              <td>{property.owner.email}</td>
              
              <td>
              <button type="button" className="rounded-2xl text-xl md:text-2xl w-32 md:w-40 mt-3 bg-green-500 text-black border-2"
               onClick={() => makeApp(property.id,token)}>
               make app
              </button>

              <button type="button" className="w-[130px]  mt-2 relative bottom-1.4  rounded-2xl text-2xl bg-blue-500 text-black  border-2"
            onClick={() => {navigate('/Edit') } }>Edit profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
     
    </div>
    </>
  );
};
