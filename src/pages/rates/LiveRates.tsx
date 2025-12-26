import React, { useEffect, useState } from "react";
import {
  addMetalRates,
  getMetalRates,
  updateMetalRates,
  deleteMetalRates,
} from "../../service/liveRateService";

type Rates = {
  gold24k: number | string;
  gold22k: number | string;
  gold18k: number | string;
  gold14k: number | string;
  silver: number | string;
};

const MetalRatesAdmin: React.FC = () => {
  const [rates, setRates] = useState<Rates>({
    gold24k: "",
    gold22k: "",
    gold18k: "",
    gold14k: "",
    silver: "",
  });

  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH RATES ---------------- */
  const fetchRates = async () => {
    try {
      const data = await getMetalRates();
      if (data) {
        const normalized: Rates = {
          gold24k: data.gold24k ?? "",
          gold22k: data.gold22k ?? "",
          gold18k: data.gold18k ?? "",
          gold14k: data.gold14k ?? "",
          silver: data.silver ?? "",
        };
        setRates(normalized);
        setIsExisting(true);
      } else {
        setIsExisting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch metal rates");
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  /* ---------------- SAVE / UPDATE ---------------- */
  const handleSave = async () => {
    setLoading(true);
    try {
      const numericRates: Rates = {
        gold24k: +rates.gold24k,
        gold22k: +rates.gold22k,
        gold18k: +rates.gold18k,
        gold14k: +rates.gold14k,
        silver: +rates.silver,
      };

      if (isExisting) {
        await updateMetalRates(numericRates);
        alert("✅ Metal rates updated successfully!");
      } else {
        await addMetalRates(numericRates);
        alert("✅ Metal rates added successfully!");
        setIsExisting(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save metal rates");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete all metal rates?")) return;

    try {
      await deleteMetalRates();
      setRates({
        gold24k: "",
        gold22k: "",
        gold18k: "",
        gold14k: "",
        silver: "",
      });
      setIsExisting(false);
      alert("🗑️ Metal rates deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete metal rates");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          💎 Metal Rates Admin
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(rates).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                {key.toUpperCase()}
              </label>
              <input
                type="number"
                value={rates[key as keyof Rates]}
                onChange={(e) =>
                  setRates({ ...rates, [key]: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                placeholder="Enter rate"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading
              ? "Saving..."
              : isExisting
              ? "Update Rates"
              : "Add Rates"}
          </button>

          {isExisting && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Delete Rates
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetalRatesAdmin;
