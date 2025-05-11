const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convertBtn');

let imageFiles = [];

imageInput.addEventListener('change', (e) => {
    preview.innerHTML = '';
    imageFiles = Array.from(e.target.files);

    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

convertBtn.addEventListener('click', async () => {
    if (imageFiles.length === 0) {
        alert('Please upload at least one image.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const imageDataUrl = await readFileAsDataURL(file);

        const img = new Image();
        img.src = imageDataUrl;

        await new Promise(resolve => {
            img.onload = () => {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;

                if (i > 0) pdf.addPage();
                const format = file.type === 'image/png' ? 'PNG' : 'JPEG';
                pdf.addImage(img, format, 0, 0, imgWidth, imgHeight);
                
                resolve();
            };
        });
    }

    pdf.save('converted.pdf');
});

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

// Reset button functionality
document.getElementById('backBtn').addEventListener('click', () => {
    imageInput.value = '';       // Clear file input
    preview.innerHTML = '';      // Clear image previews
    imageFiles = [];             // Clear file array
});
  
  