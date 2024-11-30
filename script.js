function processImage() {
    const username = document.getElementById('username').value;
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');
    const watermarkColor = document.getElementById('watermarkColor').value;
    const fileFormat = document.getElementById('fileFormat').value;

    if (!username) {
        alert('Please enter a username');
        return;
    }

    if (!imageInput.files || !imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const file = imageInput.files[0];
    const img = new Image();
    img.onload = function() {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Setup watermark text
        const text = username;
        const fontSize = Math.max(20, img.width / 30);
        ctx.font = `${fontSize}px Arial`;
        
        // Measure text for spacing
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize;
        
        // Calculate spacing between watermarks
        const spacingX = textWidth * 2;
        const spacingY = textHeight * 2;
        
        // Convert hex color to rgba
        const r = parseInt(watermarkColor.substr(1,2), 16);
        const g = parseInt(watermarkColor.substr(3,2), 16);
        const b = parseInt(watermarkColor.substr(5,2), 16);
        
        // Set watermark style with selected color
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        
        // Save the current context state
        ctx.save();
        
        // Rotate canvas by 30 degrees
        ctx.rotate(-30 * Math.PI / 180);
        
        // Calculate bounds for full coverage including rotated edges
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        const startX = -diagonal;
        const endX = diagonal;
        const startY = -diagonal;
        const endY = diagonal;
        
        // Draw repeating watermarks
        for (let y = startY; y < endY; y += spacingY) {
            for (let x = startX; x < endX; x += spacingX) {
                ctx.fillText(text, x, y);
            }
        }
        
        // Restore the context state
        ctx.restore();

        // Show canvas and download button
        canvas.style.display = 'block';
        downloadLink.style.display = 'block';
        
        // Set file extension based on format
        const extension = fileFormat.split('/')[1];
        downloadLink.href = canvas.toDataURL(fileFormat);
        downloadLink.download = `watermarked_image.${extension}`;
    };

    img.src = URL.createObjectURL(file);
}

// Theme switching functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Handle theme toggle
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

initTheme();
