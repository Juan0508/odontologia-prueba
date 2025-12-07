document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    console.log('🔐 Intentando login:', { username });

    try {
      const res = await fetch('http://localhost:3000/login', { // <-- ruta corregida
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // <-- coincidir con server
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem('usuario', JSON.stringify(result.usuario));
        window.location.href = '/admin.html'; // asegúrate de que admin.html existe
      } else {
        alert('❌ ' + result.message);
      }

    } catch (err) {
      console.error('❌ Error en login:', err);
      alert('Hubo un error al iniciar sesión.');
    }
  });
});
