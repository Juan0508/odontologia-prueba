
document.addEventListener('DOMContentLoaded', () => {
    // Formateo automático de cédula
    document.getElementById('cedula').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Solo números
        
        // Formatear: ###-#######-#
        if (value.length > 3 && value.length <= 10) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 10) {
            value = value.slice(0, 3) + '-' + value.slice(3, 10) + '-' + value.slice(10, 11);
        }
        
        e.target.value = value;
    });

    // Formateo automático de teléfono (opcional)
    document.getElementById('telefono').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Solo números
        
        // Formatear: ###-###-####
        if (value.length > 3 && value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
        
        e.target.value = value;
    });

    // Formulario de solicitud
    const form = document.getElementById('solicitar-visita-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById('nombre').value,
            cedula: document.getElementById('cedula').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            servicio: document.getElementById('servicio').value,
            fecha_visita: document.getElementById('fecha_visita').value,
            hora_visita: document.getElementById('hora_visita').value
        };

        console.log('📤 Enviando datos:', data);

        try {
            const res = await fetch('/api/solicitar-visita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

const result = await res.json();
    alert(result.message);
    form.reset();
} catch (err) {
    console.error('Error enviando la solicitud:', err);
    alert('Hubo un error al enviar la solicitud.');
}
    });
});
