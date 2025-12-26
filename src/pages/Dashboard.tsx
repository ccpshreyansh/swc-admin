import { useNavigate } from "react-router-dom";
import {
  FaTags,
  FaBoxOpen,
  FaUser,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";

const cards = [
  {
    title: "Manage Categories",
    icon: <FaTags className="text-3xl text-indigo-500" />,
    path: "/categories",
    desc: "Add, update & delete jewellery categories",
  },
  {
    title: "Products",
    icon: <FaBoxOpen className="text-3xl text-indigo-500" />,
    path: "/products",
    desc: "Add products & map with categories",
  },
  {
    title: "New Products",
    icon: <FaBoxOpen className="text-3xl text-indigo-500" />,
    path: "/newProduct",
    desc: "Add new products & map with categories",
  },
  {
    title: "Investment Plans",
    icon: <FaChartLine className="text-3xl text-indigo-500" />,
    path: "/investment",
    desc: "Create & manage gold investment plans",
  },
  {
    title: "Investment Users",
    icon: <FaUsers className="text-3xl text-indigo-500" />,
    path: "/investment-users",
    desc: "Manage investment plans payments",
  },
  {
    title: "Users",
    icon: <FaUser className="text-3xl text-indigo-500" />,
    path: "/users",
    desc: "View all customers",
  },
  {
    title: "Partners",
    icon: <FaUsers className="text-3xl text-indigo-500" />,
    path: "/partners",
    desc: "View all partners",
  },{
    title: "Rates",
    icon: <FaChartLine className="text-3xl text-indigo-500" />,
    path: "/rates",
    desc: "View all partners",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const shopConfig = { shopName: "Jewellery Shop" };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <GiDiamondRing className="text-4xl text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Jewellery App Admin
            </h1>
            <p className="text-gray-500">{shopConfig?.shopName}</p>
          </div>
        </div>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-start gap-4"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
