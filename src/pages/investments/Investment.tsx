import React, { useEffect, useState } from "react";
import {
  fetchInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from "../../service/investmentPlan";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

interface InvestmentPlan {
  id?: string;
  name: string;
  tenure: string;
  amount: string;
  details?: string;
  terms?: string;
}

const InvestmentScreen: React.FC = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<InvestmentPlan>({
    name: "",
    tenure: "",
    amount: "",
    details: "",
    terms: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const data = await fetchInvestments();
    setPlans(data);
    setLoading(false);
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.tenure || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateInvestment(editingId, form);
        setEditingId(null);
      } else {
        await addInvestment(form);
      }
      setForm({ name: "", tenure: "", amount: "", details: "", terms: "" });
      loadPlans();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setForm(plan);
    setEditingId(plan.id!);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      await deleteInvestment(id);
      loadPlans();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Investment Plans</h1>
        <button
          onClick={() => setModalVisible(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FiPlus /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                <p className="text-gray-500 text-sm">Tenure: {plan.tenure}</p>
                <p className="text-gray-500 text-sm">Amount: {plan.amount}</p>
                {plan.details && <p className="text-gray-500 text-sm">Details: {plan.details}</p>}
                {plan.terms && <p className="text-gray-500 text-sm">Terms: {plan.terms}</p>}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id!)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? "Update Plan" : "Add Investment Plan"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Investment Plan Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tenure"
                value={form.tenure}
                onChange={(e) => setForm({ ...form, tenure: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Details"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Terms & Conditions"
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                {editingId ? "Update Plan" : "Add Plan"}
              </button>
              <button
                onClick={() => {
                  setModalVisible(false);
                  setForm({ name: "", tenure: "", amount: "", details: "", terms: "" });
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentScreen;
