import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Dashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [lowThreshold, setLowThreshold] = useState(50);
    const [excessThreshold, setExcessThreshold] = useState(100);
    const storeEmail = localStorage.getItem("storeEmail");

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/inventory?storeEmail=${storeEmail}`);
                setInventory(response.data);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        fetchInventoryData();
    }, [storeEmail]);
    

    // Separate inventory based on stock levels
    const lowStock = inventory.filter(item => item.quantity < lowThreshold);
    const excessStock = inventory.filter(item => item.quantity > excessThreshold);

    // Prepare data for charts
    const chartLabels = inventory.map(item => item.title);
    const chartData = inventory.map(item => item.quantity);

    const barData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Item Quantities",
                data: chartData,
                backgroundColor: "rgba(75, 192, 192)",
                borderColor: "rgba(75, 192, 192)",
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        plugins: {
            legend: {
                labels: {
                    color: "#fff",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white",
                },
            },
            y: {
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.2)",
                },
            },
        },
    };

    const lineData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Item Quantities",
                data: chartData,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };

    const pieData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Inventory Distribution",
                data: chartData,
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue rounded-md px-5 pb-2 overflow-hidden overflow-y-auto">
            <div className="sticky top-0 w-full bg-mlsa-bg pb-1">
                <div className="font-bold flex items-center justify-between py-3">
                    <div className="text-white text-lg">Dashboard</div>
                </div>
                <hr className="border-none h-1 bg-mlsa-sky-blue mb-4" />
            </div>

            {/* Analytics Section */}
            <div className="text-white">
                {inventory.length > 0 ? (
                    <div className="flex flex-col w-full items-center gap-3">
                        {/* Bar Chart */}
                        <div className="bg-mlsa-dark w-full p-4 rounded-md shadow-md border-2 border-mlsa-sky-blue">
                            <h3 className="text-lg font-bold mb-2">Item Quantities</h3>
                            <Bar data={barData} options={barOptions} />
                        </div>
                        {/* Line Chart */}
                        <div className="bg-mlsa-dark w-full p-4 rounded-md shadow-md border-2 border-mlsa-sky-blue">
                            <h3 className="text-lg font-bold mb-2">Stock Trends</h3>
                            <Line data={lineData} options={barOptions} />
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-mlsa-dark w-full p-4 rounded-md shadow-md border-2 border-mlsa-sky-blue">
                            <h3 className="text-lg font-bold mb-2">Stock Distribution</h3>
                            <Pie data={pieData} options={barOptions} />
                        </div>
                    </div>
                ) : (
                    <p>No inventory data available.</p>
                )}
            </div>

            {/* Low Stock & Excess Stock Sections */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2 text-white">Low Stock Items</h2>
                {lowStock.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {lowStock.map((item) => (
                            <li key={item._id} className="text-red-400">
                                {item.title} - {item.quantity} left
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-green-400">No low stock items.</p>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2 text-white">Excess Stock Items</h2>
                {excessStock.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {excessStock.map((item) => (
                            <li key={item._id} className="text-green-400">
                                {item.title} - {item.quantity} in stock
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-green-400">No excess stock items.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;