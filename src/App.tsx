import { useOrderSystem } from "./hooks/useOrderSystem";
import "./App.css";

function App() {
  const { orders, bots, addOrder, addBot, removeBot } = useOrderSystem();

  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const completedOrders = orders.filter((order) => order.status === "COMPLETE");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => addOrder("NORMAL")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Normal Order
          </button>
          <button
            onClick={() => addOrder("VIP")}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            New VIP Order
          </button>
          <button
            onClick={addBot}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Bot
          </button>
          <button
            onClick={removeBot}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            - Bot
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">PENDING</h2>
            <div className="space-y-2">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded ${
                    order.type === "VIP" ? "bg-purple-100" : "bg-blue-100"
                  }`}
                >
                  <div className="font-semibold">
                    {order.type} Order #{order.id}
                  </div>
                  {order.botId && (
                    <div className="text-sm text-gray-600">
                      Processing by Bot #{order.botId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">COMPLETE</h2>
            <div className="space-y-2">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded ${
                    order.type === "VIP" ? "bg-purple-100" : "bg-blue-100"
                  }`}
                >
                  <div className="font-semibold">
                    {order.type} Order #{order.id}
                  </div>
                  <div className="text-sm text-gray-600">
                    Completed by Bot #{order.botId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Bots</h2>
          <div className="grid grid-cols-4 gap-4">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className={`p-4 rounded ${
                  bot.isIdle ? "bg-gray-200" : "bg-yellow-200"
                }`}
              >
                <div className="font-semibold">Bot #{bot.id}</div>
                <div className="text-sm text-gray-600">
                  {bot.isIdle
                    ? "Idle"
                    : `Processing Order #${bot.currentOrderId}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
