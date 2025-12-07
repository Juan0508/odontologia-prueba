document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.querySelector('#tabla-solicitudes tbody');
  const modal = document.getElementById('modal-editar');
  const inputFecha = document.getElementById('editar-fecha');
  const inputHora = document.getElementById('editar-hora');
  const btnGuardar = document.getElementById('guardar-cambios');
  const btnCancelar = document.getElementById('cancelar');
  const logoutBtn = document.getElementById('logout');

  let solicitudes = [];
  let solicitudSeleccionada = null;

  const API_URL = 'http://localhost:3000'; // Asegúrate de que tu servidor corra aquí

  // ---------------------------
  // 🔄 Cargar todas las solicitudes
  // ---------------------------
  async function cargarSolicitudes() {
    try {
      const res = await fetch(`${API_URL}/api/solicitudes`);
      solicitudes = await res.json();

      tabla.innerHTML = '';

      if (!solicitudes.length) {
        tabla.innerHTML = `<tr><td colspan="9">No hay solicitudes registradas</td></tr>`;
        return;
      }

      solicitudes.forEach(solicitud => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${solicitud.id}</td>
          <td>${solicitud.nombre}</td>
          <td>${solicitud.cedula}</td>
          <td>${solicitud.email}</td>
          <td>${solicitud.telefono}</td>
          <td>${solicitud.servicio}</td>
          <td>${solicitud.fecha_visita ? new Date(solicitud.fecha_visita).toLocaleDateString() : ''}</td>
          <td>${solicitud.hora_visita ? solicitud.hora_visita : ''}</td>
          <td>
            <button class="btn-edit" data-id="${solicitud.id}">Editar</button>
            <button class="btn-delete" data-id="${solicitud.id}">Eliminar</button>
          </td>
        `;
        tabla.appendChild(tr);
      });

    } catch (error) {
      console.error('❌ Error al cargar solicitudes:', error);
      tabla.innerHTML = `<tr><td colspan="9">Error al cargar solicitudes</td></tr>`;
    }
  }

  // ---------------------------
  // ✏️ Editar solicitud
  // ---------------------------
  tabla.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const id = e.target.dataset.id;
      solicitudSeleccionada = solicitudes.find(s => s.id == id);
      if (!solicitudSeleccionada) return;

      inputFecha.value = solicitudSeleccionada.fecha_visita
        ? new Date(solicitudSeleccionada.fecha_visita).toISOString().split('T')[0]
        : '';
      inputHora.value = solicitudSeleccionada.hora_visita ? solicitudSeleccionada.hora_visita : '';
      modal.style.display = 'block';
    }

    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.dataset.id;
      eliminarSolicitud(id);
    }
  });

  btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none';
    solicitudSeleccionada = null;
  });

  btnGuardar.addEventListener('click', async () => {
    if (!solicitudSeleccionada || !solicitudSeleccionada.id) return;

    const nuevaFecha = inputFecha.value;
    const nuevaHora = inputHora.value;

    try {
      const res = await fetch(`${API_URL}/api/solicitar-visita/${solicitudSeleccionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha_visita: nuevaFecha, hora_visita: nuevaHora })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      modal.style.display = 'none';
      solicitudSeleccionada = null;
      cargarSolicitudes();

    } catch (error) {
      console.error('❌ Error al actualizar solicitud:', error);
      alert('Error al actualizar la solicitud: ' + error.message);
    }
  });

  // ---------------------------
  // 🗑️ Eliminar solicitud
  // ---------------------------
  async function eliminarSolicitud(id) {
    if (!id) {
      alert('❌ ID inválido. No se puede eliminar la solicitud.');
      console.error('ID inválido:', id);
      return;
    }

    if (!confirm('¿Seguro que quieres eliminar esta solicitud?')) return;

    try {
      const res = await fetch(`/api/solicitar-visita/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      cargarSolicitudes();

    } catch (error) {
      console.error('❌ Error al eliminar solicitud:', error);
      alert('Error al eliminar la solicitud: ' + error.message);
    }
  }

  // ---------------------------
  // 🔒 Logout
  // ---------------------------
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '/login.html';
  });

  // ---------------------------
  // 🔄 Inicializar tabla al cargar
  // ---------------------------
  cargarSolicitudes();
});
