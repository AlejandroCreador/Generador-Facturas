// Lógica para cambiar el modo día/noche
const toggleThemeButton = document.getElementById('toggle-theme');
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    toggleThemeButton.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '🌞';
});

// Lógica para cambiar el idioma (Español/Inglés)
const toggleLangButton = document.getElementById('toggle-lang');
let currentLang = 'es'; // Idioma por defecto

toggleLangButton.addEventListener('click', () => {
    if (currentLang === 'es') {
        currentLang = 'en';
        toggleLangButton.textContent = '🇺🇸'; // Bandera del Reino Unido
        translateToEnglish();
    } else {
        currentLang = 'es';
        toggleLangButton.textContent = '🇪🇸'; // Bandera de España
        translateToSpanish();
    }
});

function translateToEnglish() {
    document.querySelector('h1').textContent = 'Invoice Generator';
    document.querySelector('label[for="client-name"]').textContent = 'Client Name';
    document.querySelector('label[for="client-nif"]').textContent = 'Client NIF/CIF';
    document.querySelector('label[for="client-address"]').textContent = 'Client Address';
    document.querySelector('label[for="client-email"]').textContent = 'Client Email';
    document.querySelector('label[for="company-name"]').textContent = 'Company Name';
    document.querySelector('label[for="company-nif"]').textContent = 'Company NIF/CIF';
    document.querySelector('label[for="company-address"]').textContent = 'Company Address';
    document.querySelector('label[for="company-email"]').textContent = 'Company Email';
    document.querySelector('h2').textContent = 'Client Details';
    document.querySelector('h2:nth-of-type(2)').textContent = 'Issuer Details';
    document.getElementById('generate-pdf').textContent = 'Generate Invoice';
    document.getElementById('add-item').textContent = 'Add Item';
    document.querySelector('h3').textContent = `Total: ${document.getElementById('total-amount').textContent} €`;
}

function translateToSpanish() {
    document.querySelector('h1').textContent = 'Generador de Facturas';
    document.querySelector('label[for="client-name"]').textContent = 'Nombre del Cliente';
    document.querySelector('label[for="client-nif"]').textContent = 'NIF/CIF del Cliente';
    document.querySelector('label[for="client-address"]').textContent = 'Dirección del Cliente';
    document.querySelector('label[for="client-email"]').textContent = 'Correo Electrónico';
    document.querySelector('label[for="company-name"]').textContent = 'Nombre de la Empresa';
    document.querySelector('label[for="company-nif"]').textContent = 'NIF/CIF de la Empresa';
    document.querySelector('label[for="company-address"]').textContent = 'Dirección de la Empresa';
    document.querySelector('label[for="company-email"]').textContent = 'Correo Electrónico del Emisor';
    document.querySelector('h2').textContent = 'Detalles del Cliente';
    document.querySelector('h2:nth-of-type(2)').textContent = 'Detalles del Emisor';
    document.getElementById('generate-pdf').textContent = 'Generar Factura';
    document.getElementById('add-item').textContent = 'Añadir Artículo';
    document.querySelector('h3').textContent = `Total: ${document.getElementById('total-amount').textContent} €`;
}

// Variables globales para los artículos y el total
const items = [];
let totalAmount = 0;

// Función para mostrar los artículos en la interfaz
function updateItemList() {
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = ''; // Limpiar la lista de artículos

    // Crear un listado de todos los artículos añadidos
    items.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('item-row');
        itemRow.style.display = 'flex'; // Para que los elementos queden alineados horizontalmente
        itemRow.style.justifyContent = 'space-between'; // Espaciado entre el texto y la "X"
        itemRow.style.alignItems = 'center'; // Alinear verticalmente los elementos
        itemRow.innerHTML = `
            <span>${index + 1}. ${item.name} (x${item.quantity}) - ${item.price} €/unidad - Total: ${item.total.toFixed(2)} €</span>
            <button class="delete-item" style="border:none; background:none; color:red; cursor:pointer; font-size:16px; padding:0;" data-index="${index}">❌</button>
        `;
        itemList.appendChild(itemRow);
    });

    // Actualizar el total en la interfaz
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2) + " €";

    // Añadir eventos para eliminar los artículos
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteItem);
    });
}

// Función para eliminar un artículo
function deleteItem(event) {
    const itemIndex = event.target.getAttribute('data-index');
    const removedItem = items.splice(itemIndex, 1)[0]; // Eliminar el artículo del array
    totalAmount -= removedItem.total; // Restar el total del artículo eliminado
    updateItemList(); // Actualizar la lista visual y el total
}

// Función para añadir un artículo
document.getElementById('add-item').addEventListener('click', () => {
    const itemName = document.querySelector('.item-name').value;
    const itemQuantity = parseInt(document.querySelector('.item-quantity').value, 10);
    const itemPrice = parseFloat(document.querySelector('.item-price').value);

    if (itemName && itemQuantity && itemPrice) {
        const itemTotal = itemQuantity * itemPrice;
        totalAmount += itemTotal;

        // Añadir el artículo al array de artículos
        items.push({
            name: itemName,
            quantity: itemQuantity,
            price: itemPrice,
            total: itemTotal
        });

        // Actualizar la lista de artículos visualmente
        updateItemList();

        // Limpiar los campos de entrada
        document.querySelector('.item-name').value = '';
        document.querySelector('.item-quantity').value = '';
        document.querySelector('.item-price').value = '';
    } else {
        alert("Por favor, completa todos los campos del artículo antes de añadir otro.");
    }
});

// Función para generar el PDF con un diseño mejorado
document.getElementById('generate-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const clientName = document.getElementById('client-name').value;
    const clientAddress = document.getElementById('client-address').value;
    const companyName = document.getElementById('company-name').value;
    const companyAddress = document.getElementById('company-address').value;

    // Encabezado de la factura
    doc.setFontSize(18);
    doc.text('Factura', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Cliente: ${clientName}`, 20, 40);
    doc.text(`Dirección: ${clientAddress}`, 20, 50);
    doc.text(`Empresa: ${companyName}`, 20, 60);
    doc.text(`Dirección Empresa: ${companyAddress}`, 20, 70);
    
    // Encabezado de los artículos
    doc.setFontSize(14);
    doc.text('Artículos', 20, 90);
    
    let yPos = 100;

    doc.setFontSize(12);
    doc.text('Artículo', 20, yPos);
    doc.text('Cantidad', 80, yPos);
    doc.text('Precio', 130, yPos);
    doc.text('Total', 170, yPos);
    yPos += 10;

    // Listar los artículos en el PDF
    items.forEach(item => {
        doc.text(`${item.name}`, 20, yPos);
        doc.text(`${item.quantity}`, 80, yPos);
        doc.text(`${item.price} €`, 130, yPos);
        doc.text(`${item.total.toFixed(2)} €`, 170, yPos);
        yPos += 10;
    });

    // Mostrar el total en el PDF
    doc.setFontSize(14);
    doc.text(`Total: ${totalAmount.toFixed(2)} €`, 170, yPos + 10);

    // Guardar el PDF
    doc.save('factura.pdf');
});

// Función para enviar el PDF por correo electrónico
function sendEmail() {
    const pdfBlob = generatePDF(); // Generar el PDF
    const toEmail = document.getElementById('client-email').value; // Correo electrónico del destinatario

    // Crear un FormData para enviar el PDF y el correo
    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'factura.pdf');
    formData.append('toEmail', toEmail);

    // Enviar la solicitud POST al servidor para enviar el correo
    fetch('/send-email', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message); // Mostrar mensaje de éxito o error
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Añadir evento al botón de enviar por correo
document.getElementById('send-email').addEventListener('click', sendEmail);
