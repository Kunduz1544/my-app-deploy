export default function StatCard({ title, amount, color }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: color,
      borderRadius: '12px',
      padding: '14px',
      color: '#fff'
    }}>
      <div style={{ fontSize: '13px', opacity: 0.9 }}>{title}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{amount}</div>
    </div>
  );
}
