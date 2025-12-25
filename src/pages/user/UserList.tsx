import React, { useEffect, useState } from "react";
import { collection, getDocs, Firestore } from "firebase/firestore";
import { getShopDb } from "../../firebase/dynamicFirebase"; // dynamic DB

export interface UserProfile {
  name?: string;
  city?: string;
}

export interface User {
  id: string;
  mobile?: string;
  gender?: string;
  pin?: string;
  createdAt?: any;
  profile?: UserProfile;
}

interface Props {
  shopId?: string;
}

const UserList: React.FC<Props> = ({ shopId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const getCollectionRef = (): ReturnType<typeof collection> => {
    const db: Firestore | null = getShopDb(shopId);
    if (!db) throw new Error("Shop DB not initialized");
    return collection(db, "users");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(getCollectionRef());
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatDate = (createdAt: any) => {
    if (!createdAt) return "-";
    if (createdAt.toDate) return new Date(createdAt.toDate()).toLocaleString();
    return new Date(createdAt).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          className="px-3 py-2 mr-4 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          onClick={() => window.history.back()}
        >
          &#8592;
        </button>
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
      </div>

      {/* User List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{user.profile?.name || "No Name"}</h3>
              <span className="text-sm text-gray-500">{user.profile?.city || "-"}</span>
            </div>

            <div className="space-y-2 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{user.mobile || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚥</span>
                <span>{user.gender || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔑</span>
                <span>PIN: {user.pin || "-"}</span>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Created: {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
