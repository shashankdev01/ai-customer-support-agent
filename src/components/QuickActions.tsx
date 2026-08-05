import {
  BadgeDollarSign,
  PackageSearch,
  FileText,
  CircleHelp,
} from "lucide-react";

const actions = [
  {
    title: "Refund Request",
    subtitle: "Get help with refunds",
    icon: BadgeDollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Track My Order",
    subtitle: "Check order status",
    icon: PackageSearch,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Return Policy",
    subtitle: "View return guidelines",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Product Help",
    subtitle: "Get product support",
    icon: CircleHelp,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function QuickActions() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-5 px-10 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${action.color}`}
            >
              <Icon size={26} />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                {action.title}
              </h3>

              <p className="text-sm text-gray-500">
                {action.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}