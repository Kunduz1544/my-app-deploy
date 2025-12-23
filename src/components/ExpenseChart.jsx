import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"];

export default function ExpenseChart({ data }) {
  return (
    <div style={{
      height: 220,
      background: "#fff",
      borderRadius: 12,
      padding: 10,
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
    }}>
      <h4 style={{ textAlign: "center", marginBottom: 10 }}>
        Чыгымдар (категориялар)
      </h4>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
