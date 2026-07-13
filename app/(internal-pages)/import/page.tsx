"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Download, Loader2 } from "lucide-react";

interface ImportError {
  phone: string;
  reason: string;
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: ImportError[];
}

export default function ImportMembersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please upload an Excel file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/import-members", {
        method: "POST",
        body: formData,
      });

      const data: {
        success: boolean;
        imported?: number;
        skipped?: number;
        errors?: ImportError[];
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Import failed.");
        return;
      }

      toast.success(`${data.imported ?? 0} members imported successfully.`);
      setResult({
        imported: data.imported ?? 0,
        skipped: data.skipped ?? 0,
        errors: data.errors ?? [],
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while importing members.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Import Members</h1>

          <p className="text-gray-500 mt-2">
            Upload an Excel file to import members in bulk.
          </p>
        </div>

        <a
          href="/templates/aura-gym-template.xlsx"
          className="
    flex items-center gap-2
    px-5 py-3
    rounded-xl
    border
    hover:bg-gray-100
    transition
  "
        >
          <Download size={18} />
          Download Template
        </a>
      </div>

      <div className="border rounded-2xl p-8 bg-white">
        <div
          className="
            border-2 border-dashed rounded-2xl
            p-10 text-center
          "
        >
          <div className="flex justify-center mb-4">
            <Upload size={50} />
          </div>

          <h2 className="text-2xl font-semibold mb-2">Upload Excel File</h2>

          <p className="text-gray-500 mb-6">Supported formats: .xlsx, .xls</p>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="excel-upload"
          />

          <label
            htmlFor="excel-upload"
            className="
              inline-block
              bg-black text-white
              px-6 py-3
              rounded-xl
              cursor-pointer
            "
          >
            Choose File
          </label>

          {file && (
            <div className="mt-6 flex justify-center">
              <div
                className="
                  flex items-center gap-3
                  border rounded-xl
                  px-4 py-3
                "
              >
                <FileSpreadsheet size={24} />

                <div className="text-left">
                  <p className="font-medium">{file.name}</p>

                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="
              mt-8
              w-full
              bg-black
              text-white
              py-4
              rounded-xl
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex justify-center items-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Importing Members...
              </>
            ) : (
              "Import Members"
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Required Excel Columns</h2>

        {result && (
          <div className="mt-8 border rounded-2xl p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6">Import Summary</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4">
                <p className="text-gray-500">Imported</p>
                <p className="text-3xl font-bold text-green-600">
                  {result.imported}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-gray-500">Skipped</p>
                <p className="text-3xl font-bold text-red-600">
                  {result.skipped}
                </p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Skipped Members</h3>

                <div className="space-y-3">
                  {result.errors.map((error) => (
                    <div
                      key={`${error.phone}-${error.reason}`}
                      className="
                border border-red-200
                bg-red-50
                rounded-xl
                p-4
              "
                    >
                      <p className="font-medium">{error.phone}</p>

                      <p className="text-red-600 text-sm">{error.reason}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["name", "phone", "gender", "plan", "joinDate", "amountPaid"].map(
            (column) => (
              <div
                key={column}
                className="
                border rounded-lg
                p-3 text-center
                font-medium
              "
              >
                {column}
              </div>
            ),
          )}
        </div>

        <div className="mt-6 text-gray-600 space-y-2">
          <p>• Phone numbers must be unique.</p>
          <p>• Gender values: MALE or FEMALE.</p>
          <p>• Plan values: MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY.</p>
          <p>• Expiry date will be calculated automatically.</p>
        </div>
      </div>
    </div>
  );
}
