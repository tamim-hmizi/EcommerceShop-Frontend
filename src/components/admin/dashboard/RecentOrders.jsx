import React from 'react';
import { FiAlertCircle } from "react-icons/fi";

const RecentOrders = ({ recentOrders, pendingOrders }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Recent Orders</h3>
        <div className="flex items-center">
          <span className="badge badge-primary">{pendingOrders} pending</span>
        </div>
      </div>
      <div className="overflow-hidden">
        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors rounded-lg">
                <div>
                  <p className="font-medium">#{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.totalPrice.toLocaleString()}</p>
                  <span className={`badge badge-sm ${
                    order.status.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status.toLowerCase() === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiAlertCircle className="mx-auto h-8 w-8 mb-2" />
            No recent orders
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
