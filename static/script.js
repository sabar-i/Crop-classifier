document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result');
    const labelText = document.getElementById('label');
    const uploadedImageContainer = document.getElementById('uploaded-image-container');
    const uploadedImage = document.getElementById('uploaded-image');
    const welcomeImageContainer = document.getElementById('welcome-image-container');

    // Hide the uploaded image container and result container by default
    uploadedImageContainer.style.display = 'none';
    resultContainer.style.display = 'none';

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/api/predict', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const prediction = data[0];
                const label = data[1];
                resultText.textContent = `Prediction: ${prediction}`;
                labelText.textContent = `Label: ${label}`;
                resultContainer.style.display = 'block';

                // Display the uploaded image
                const file = fileInput.files[0];
                const reader = new FileReader();

                if (file) {
                    // Only display the uploaded image if a file is selected
                    reader.onload = function (event) {
                        uploadedImage.src = event.target.result;
                        uploadedImageContainer.style.display = 'block';
                        uploadedImage.style.display='block';

                        // Add border to the uploaded image
                        uploadedImage.style.border = '1px solid #ccc';
                    };
                    reader.readAsDataURL(file);
                } else {
                    // If no file is selected, hide the uploaded image container
                    uploadedImageContainer.style.display = 'none';
                }

                // Hide the welcome image container
                welcomeImageContainer.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                resultText.textContent = 'Error occurred during prediction.';
                labelText.textContent = '';
                resultContainer.style.display = 'block';
                uploadedImageContainer.style.display = 'none';
                welcomeImageContainer.style.display = 'none';
            });
    });

    // Add an event listener to the file input to hide the uploaded image container
    fileInput.addEventListener('change', function () {
        uploadedImageContainer.style.display = 'none';
        welcomeImageContainer.style.display = 'none';
    });
});

