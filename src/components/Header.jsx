function Header({ title }) {
  return (
    <header style={{
      padding: '15px',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #6200ee, #3700b3)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '22px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      {title}
    </header>
  );
}

export default Header;
