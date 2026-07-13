"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Branch {
  id: string;
  name: string;
}

interface Props {
  branches: Branch[];
}

export default function MemberFilters({ branches }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/members?${params.toString()}`);
  };

  return (
    <div className="grid md:grid-cols-6 gap-4 mb-8">
      <input
        placeholder="Search name or phone"
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => updateFilter("search", e.target.value)}
        className="border rounded-lg p-3"
      />

      <select
        defaultValue={searchParams.get("plan") || ""}
        onChange={(e) => updateFilter("plan", e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="">All Plans</option>
        <option value="MONTHLY">Monthly</option>
        <option value="QUARTERLY">Quarterly</option>
        <option value="HALF_YEARLY">Half Yearly</option>
        <option value="YEARLY">Yearly</option>
      </select>

      <select
        defaultValue={searchParams.get("gender") || ""}
        onChange={(e) => updateFilter("gender", e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="">All Genders</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>

      <select
        name="branch"
        defaultValue={searchParams.get("branch") ?? ""}
        className="border rounded-lg px-3 py-2"
      >
        <option value="">All Branches</option>

        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("status") || ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="EXPIRING">Expiring Soon</option>
        <option value="EXPIRED">Expired</option>
      </select>

      <select
        defaultValue={searchParams.get("sort") || "asc"}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="asc">Expiry Ascending</option>

        <option value="desc">Expiry Descending</option>
      </select>

      <button
        onClick={() => router.push("/members")}
        className="bg-red-500 text-white rounded-lg px-4"
      >
        Clear Filters
      </button>
    </div>
  );
}
