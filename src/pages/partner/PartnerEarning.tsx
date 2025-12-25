import React, { useState } from "react";
import { doc, getDoc, updateDoc, setDoc, Firestore } from "firebase/firestore";
import { getShopDb } from "../../firebase/dynamicFirebase";

interface EarningEntry {
  billAmount: number;
  earningAmount: number;
  date: string;
  remark?: string;
}

interface PartnerData {
  name?: string;
  mobile: string;
  totalEarning: number;
  history: EarningEntry[];
}

interface Props {
  shopId?: string;
}

const PartnerEarning: React.FC<Props> = ({ shopId }) => {
  const [mobile, setMobile] = useState("");
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [billAmount, setBillAmount] = useState("");
  const [earningAmount, setEarningAmount] = useState("");
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");

  const getCollectionRef = (): Firestore => {
    const db = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return db;
  };

  const fetchPartner = async () => {
    if (!mobile) return alert("Enter mobile number");
    try {
      setLoading(true);
      const ref = doc(getCollectionRef(), "partnerusers", mobile);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        let data = snap.data() as PartnerData;
        data.history = data.history || [];
        data.history.sort((a, b) => new Date(b.date.split("/").reverse().join("-")).getTime() - new Date(a.date.split("/").reverse().join("-")).getTime());
        setPartnerData(data);
      } else {
        alert("Partner not found in database.");
        setPartnerData(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch partner");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!billAmount || !earningAmount || !date) {
      alert("Fill all required fields!");
      return;
    }

    const billAmtNum = Number(billAmount);
    const earnAmtNum = Number(earningAmount);
    if (isNaN(billAmtNum) || isNaN(earnAmtNum)) return alert("Amounts must be numbers");

    const newEntry: EarningEntry = { billAmount: billAmtNum, earningAmount: earnAmtNum, date, remark };

    try {
      const ref = doc(getCollectionRef(), "partnerusers", mobile);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { name: "", mobile, totalEarning: earnAmtNum, history: [newEntry] });
      } else {
        const prev = snap.data().history || [];
        const total = (snap.data().totalEarning || 0) + earnAmtNum;
        await updateDoc(ref, { history: [...prev, newEntry], totalEarning: total });
      }

      alert("Earning updated successfully!");
      setModalVisible(false);
      setBillAmount(""); setEarningAmount(""); setDate(""); setRemark("");
      fetchPartner();
    } catch (err) {
      console.error(err);
      alert("Failed to update earnings");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Partner Earnings</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Partner Mobile Number"
          className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          onClick={fetchPartner}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {partnerData && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">📌 Partner Details</h3>
          <p>Name: {partnerData.name || "Not Set"}</p>
          <p>Mobile: {partnerData.mobile}</p>
          <p className="font-semibold mt-2">Total Earning: ₹{partnerData.totalEarning || 0}</p>

          <h4 className="mt-4 font-semibold">Earning History</h4>
          {partnerData.history.length > 0 ? (
            <div className="mt-2 space-y-2">
              {partnerData.history.map((h, i) => (
                <div key={i} className="border rounded-md p-2 bg-gray-50">
                  <p>Bill: ₹{h.billAmount}</p>
                  <p>Earning: ₹{h.earningAmount}</p>
                  <p>Date: {h.date}</p>
                  {h.remark && <p className="text-gray-500 text-sm">Note: {h.remark}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-2">No earning entries yet.</p>
          )}

          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => setModalVisible(true)}
          >
            + Add Earning
          </button>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Add Partner Earning</h3>

            <div className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Bill Amount"
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
              <input
                type="number"
                placeholder="Earning Amount"
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={earningAmount}
                onChange={(e) => setEarningAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Date (DD/MM/YYYY)"
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Remark (optional)"
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => setModalVisible(false)}
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

export default PartnerEarning;
