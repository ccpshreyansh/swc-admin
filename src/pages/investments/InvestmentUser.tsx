import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Firestore,
} from "firebase/firestore";
import { getShopDb } from "../../firebase/dynamicFirebase";

export interface PaymentEntry {
  month: string;
  amount: string;
  date: string;
  accountName: string;
  remark?: string;
}

export interface Investment {
  id?: string;
  planName: string;
  userMobile: string;
  createdAt?: any;
  paymentHistory?: PaymentEntry[];
}

interface Props {
  shopId?: string;
}

const AllInvestments: React.FC<Props> = ({ shopId }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [accountName, setAccountName] = useState("");
  const [remark, setRemark] = useState("");

  const getCollectionRef = (): ReturnType<typeof collection> => {
    const db: Firestore | null = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return collection(db, "investments");
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
    return timestamp;
  };

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(getCollectionRef());
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Investment[];
      setInvestments(data);
    } catch (err) {
      console.error("Error fetching investments:", err);
      alert("Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!month || !amount || !date || !accountName || !selectedInvestment?.id) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const updatedEntry: PaymentEntry = { month, amount, date, accountName, remark };
      const db = getShopDb(shopId);
      if (!db) throw new Error("Shop DB not initialized");
      const investmentRef = doc(db, "investments", selectedInvestment.id);
      const newHistory = [...(selectedInvestment.paymentHistory || []), updatedEntry];
      await updateDoc(investmentRef, { paymentHistory: newHistory });

      alert("✅ Payment history updated successfully");

      setModalVisible(false);
      setMonth(""); setAmount(""); setDate(""); setAccountName(""); setRemark("");
      fetchInvestments();
    } catch (err) {
      console.error(err);
      alert("Failed to update payment history");
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading all investments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 All Investments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{item.planName}</h3>
              <p className="text-gray-500 text-sm">User: {item.userMobile}</p>
              <p className="text-gray-500 text-sm">Date: {formatDate(item.createdAt)}</p>

              <h4 className="mt-3 font-semibold text-gray-700">Payment History:</h4>
              {item.paymentHistory && item.paymentHistory.length > 0 ? (
                <div className="mt-1 space-y-2">
                  {item.paymentHistory.map((entry, index) => (
                    <div key={index} className="border rounded-md p-2 bg-gray-50">
                      <p>{entry.month} - ₹{entry.amount}</p>
                      <p>Date: {formatDate(entry.date)}</p>
                      <p>By: {entry.accountName}</p>
                      {entry.remark && <p className="text-gray-500 text-sm">Note: {entry.remark}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-1">No payments yet</p>
              )}
            </div>

            <button
              onClick={() => { setSelectedInvestment(item); setModalVisible(true); }}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              + Update Payment
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Payment Entry</h2>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Date (DD/MM/YYYY)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setModalVisible(false)}
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

export default AllInvestments;
