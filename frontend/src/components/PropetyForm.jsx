import { useState,useEffect,useCallback,useContext } from "react";
import { useNavigate } from "react-router-dom";
import  PropertyContext  from "../context/PropertyContext";
import { useForm } from "react-hook-form";
import axios from "axios"; 

export const PropertyForm = () => {

    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [unit_number, setUnitNumber] = useState("");
    const [square_feet, setsQuareFeet] = useState("");
    const [year_built, setYearBuilt] = useState("");
    const { addProperty } = useContext(PropertyContext);

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const newProperty = {
          address,
          price,
          description,
          unit_number,
          square_feet,
          year_built
        };
    
        addProperty(newProperty,token);
        navigate("/profile")
      };

    return (
        <div className="container  flex items-center justify-center bg-background text-foreground ">
         <form onSubmit={handleSubmit} className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
           <h1 className="text-3xl text-center">Property form</h1>
 
           <div className="flex flex-col text-left">
             <label>address</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
             placeholder="address"
             value={address}
             onChange={(e) => setAddress(e.target.value)}
             required
             ></input>
           </div>

           <div className="flex flex-col text-left">
             <label>price</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
             placeholder="price"
             value={price}
             onChange={(e) => setPrice(e.target.value)}
             required
             ></input>
           </div>


           <div className="flex flex-col text-left">             
             <label>description</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
             placeholder="description"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             required
             > </input>
           </div>

           <div className="flex flex-col text-left">
             <label>unit_number</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
             placeholder="unit_number"
             value={unit_number}
             onChange={(e) => setUnitNumber(e.target.value)}
             required
             ></input>
           </div>
 
           <div className="flex flex-col text-left">
             <label className="mb-1">square_feet</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background"
             placeholder="square_feet"
             value={square_feet}
             onChange={(e) => setsQuareFeet(e.target.value)}
             required
             ></input>
           </div>


           <div className="flex flex-col text-left">
             <label className="mb-1">year_built</label>
             <input type="text"
             className="px-3 py-2 rounded-md border bg-background"
             placeholder="year_built"
             value={year_built}
             onChange={(e) => setYearBuilt(e.target.value)}
             required
             ></input>
           </div>

          <button type="submit" className="w-full  py-2 text-xl text-black  rounded-md bg-primary hover:bg-red-200 transition" >Submit </button>     
         </form>
        </div>
 
     )



}