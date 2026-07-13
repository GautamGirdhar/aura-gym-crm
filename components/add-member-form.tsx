"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
}

interface Props {
  branches: Branch[];
}

export default function AddMemberForm({ branches }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    plan: "",
    joinDate: "",
    amountPaid: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        throw new Error("Failed to add member");
      }

      toast.success("Member added successfully.");

      // Reset only after successful save
      setFormData({
        name: "",
        gender: "",
        phone: "",
        plan: "",
        joinDate: "",
        amountPaid: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Member</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Member Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Plan</option>
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="HALF_YEARLY">Half Yearly</option>
          <option value="YEARLY">Yearly</option>
        </select>

        <select
          name="branchId"
          className="w-full border rounded-lg p-3"
          required
        >
          <option value="">Select Branch</option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="amountPaid"
          placeholder="Amount Paid"
          value={formData.amountPaid}
          onChange={handleChange}
          min="0"
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full p-3 cursor-pointer rounded bg-black text-white hover:opacity-90 transition"
        >
          Add Member
        </button>
      </form>
    </div>
  );
}
