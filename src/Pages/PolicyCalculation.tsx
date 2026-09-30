import React, { useState } from "react";
import "./policy.css";
// import { useNavigate } from "react-router-dom";
import { getCompletedAge } from "../utils/date";
import { useNavigate } from "react-router-dom";
const UserForm = () => {
  interface FormErrors {
    // name?: string;
    // email?: string;
    // phone?: string;
    // gender?: string;
    // dob?: string;
    // password?: string;
    err?: string;
  }
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const dobconvert = parsedUser.dob.split("T")[0];
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dob: dobconvert ? dobconvert : "",
    gender: "",
    sumAssured: "",
    modalPremium: "",
    premiumFrequency: "",
    pt: "",
    ppt: "",
  });
  const [newErrors, setNewErrors] = useState<FormErrors>({});
  // const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("formData");
    const ppt = Number(formData.ppt);
    const pt = Number(formData.pt);
    const modalPremium = Number(formData.modalPremium);
    const sumAssured = Number(formData.sumAssured);
    const completeage = getCompletedAge(formData.dob);
    const validationErrors: FormErrors = {};
    //Age Validation (Min: 23, Max: 56)
    if (completeage <= 23 || completeage >= 56 || !formData.dob) {
      validationErrors.err = "age should be between 23 to 56";
      setNewErrors(validationErrors);
      return;
    }
    // 2. PPT Validation (Min: 5, Max: 10)
    if (isNaN(ppt) || ppt < 5 || ppt > 10) {
      validationErrors.err =
        "Premium Payment Term (PPT) must be between 5 and 10 years.";
      setNewErrors(validationErrors);
      return;
    }

    // 3. PT Validation (Min: 10, Max: 20)
    if (isNaN(pt) || pt < 10 || pt > 20) {
      validationErrors.err =
        "Policy Term (PT) must be between 10 and 20 years.";
      setNewErrors(validationErrors);
      return;
    }
    // 4. PT > PPT Validation
    if (!isNaN(pt) && !isNaN(ppt) && pt <= ppt) {
      validationErrors.err =
        "Policy Term (PT) must be strictly greater than Premium Payment Term (PPT).";
    }

    // 5. Premium Validation (Min: 10,000, Max: 50,000)
    if (isNaN(modalPremium) || modalPremium < 10000 || modalPremium > 50000) {
      validationErrors.err = "Premium must be between ₹10,000 and ₹50,000.";
    }

    // 6. Sum Assured Validation
    // Minimum requirement: Greater than or equal to 10 times Modal Premium OR ₹5,000,000 (whichever minimum threshold applies)
    const minRequiredSA = Math.min(10 * modalPremium, 5000000);
    if (isNaN(sumAssured) || sumAssured < minRequiredSA) {
      validationErrors.err = `Sum Assured must be at least ₹${minRequiredSA.toLocaleString("en-IN")}.`;
    }

    // If validation fails, display errors and stop submission
    if (validationErrors.err) {
      setNewErrors(validationErrors);

      return;
    }
    setNewErrors({});
    localStorage.setItem("formData", JSON.stringify(formData));
    navigate("/illustration");
    // console.log("Form Data:", formData);
    try {
      const response = await fetch("/api/illustrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ppt,
          pt,
          modalPremium,
          sumAssured,
          calculatedAge: completeage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save illustration.");
      }

      const data = await response.json();
      console.log("ILLustration created ", data);
      // alert("Illustration created successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      // alert("An error occurred while saving the illustration.");
    }
    // Later you can send this to Express API
    // axios.post("http://localhost:5000/api/user", formData);
  };

  // const handleclick = (e: React.FormEvent) => {
  //   e.preventDefault();
  // };

  return (
    <div className="form-container">
      <h2>Policy Details</h2>
      <h4 style={{ color: "red" }}>{newErrors.err ? newErrors.err : ""}</h4>

      <form onSubmit={handleSubmit}>
        {/* DOB */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sum Assured */}
        <div className="form-group">
          <label>Sum Assured</label>
          <input
            type="number"
            name="sumAssured"
            value={formData.sumAssured}
            onChange={handleChange}
            placeholder="Enter Sum Assured"
            required
          />
        </div>

        {/* Modal Premium */}
        <div className="form-group">
          <label>Modal Premium</label>
          <input
            type="number"
            name="modalPremium"
            value={formData.modalPremium}
            onChange={handleChange}
            placeholder="Enter Modal Premium"
            required
          />
        </div>

        {/* Premium Frequency */}
        <div className="form-group">
          <label>Premium Frequency</label>
          <select
            name="premiumFrequency"
            value={formData.premiumFrequency}
            onChange={handleChange}
            required
          >
            <option value="">Select Frequency</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* PT */}
        <div className="form-group">
          <label>PT (Policy Term)</label>
          <input
            type="number"
            name="pt"
            value={formData.pt}
            onChange={handleChange}
            placeholder="Enter Policy Term"
            required
          />
        </div>

        {/* PPT */}
        <div className="form-group">
          <label>PPT (Premium Paying Term)</label>
          <input
            type="number"
            name="ppt"
            value={formData.ppt}
            onChange={handleChange}
            placeholder="Enter Premium Paying Term"
            required
          />
        </div>

        <button type="submit">Go to Illustrate</button>
      </form>
    </div>
  );
};

export default UserForm;
