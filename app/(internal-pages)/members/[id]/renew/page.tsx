"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function RenewMemberPage({ params }: Props) {
  const router = useRouter();

  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    plan: "",
    amount: "",
  });

  params.then((data) => setMemberId(data.id));

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

    setLoading(true);

    try {
      const response = await fetch(`/api/members/${memberId}/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Membership renewed successfully");

      router.push(`/members/${memberId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to renew membership");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Renew Membership</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <input
          type="number"
          name="amount"
          placeholder="Amount Paid"
          value={formData.amount}
          onChange={handleChange}
          min="0"
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Renewing..." : "Renew Membership"}
        </button>
      </form>
    </div>
  );
}
