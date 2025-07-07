document.addEventListener('DOMContentLoaded', () => {
    const memoriesGrid = document.getElementById('memories-grid');
    const modal = document.getElementById('memory-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');
    const prevImgBtn = document.getElementById('prev-img');
    const nextImgBtn = document.getElementById('next-img');
    const imgCounter = document.getElementById('img-counter');

    const imageViewer = document.getElementById('image-viewer');
    const viewerImg = document.getElementById('viewer-img');
    const closeViewerBtn = document.querySelector('.close-viewer-button');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomLevel = document.getElementById('zoom-level');
    const zoomMenu = document.getElementById('zoom-menu');
    const resetZoomBtn = document.getElementById('reset-zoom');

    let currentMemoryImages = [];
    let currentImageIndex = 0;
    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    const fallbackImage = 'images/error/error.jpg';

    function setImageWithFallback(imgElement, src) {
        imgElement.src = src;
        imgElement.onerror = () => {
            if (imgElement.src !== fallbackImage) {
                imgElement.src = fallbackImage;
                imgElement.onerror = () => {
                    const p = document.createElement('p');
                    p.textContent = '图片加载失败';
                    imgElement.parentNode.replaceChild(p, imgElement);
                };
            } else {
                const p = document.createElement('p');
                p.textContent = '图片加载失败';
                imgElement.parentNode.replaceChild(p, imgElement);
            }
        };
    }

    // Populate memories
    memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        
        const img = document.createElement('img');
        // Use the 'src' property of the first image object
        setImageWithFallback(img, memory.images[0].src);
        img.alt = memory.title;

        const content = document.createElement('div');
        content.className = 'memory-card-content';
        content.innerHTML = `
            <h3>${memory.title}</h3>
            <p>${memory.date}</p>
            <p>${memory.description.substring(0, 50)}...</p>
        `;

        card.appendChild(img);
        card.appendChild(content);

        card.addEventListener('click', () => openModal(index));
        memoriesGrid.appendChild(card);
    });

    function openModal(index) {
        const memory = memories[index];
        currentMemoryImages = memory.images;
        currentImageIndex = 0;
        updateModalImage();

        modalTitle.textContent = memory.title;
        modalDate.textContent = memory.date;
        modalDescription.textContent = memory.description;
        modal.classList.add('show');
    }

    function updateModalImage() {
        modalImg.style.opacity = '0';
        setTimeout(() => {
            // Use the 'src' property of the current image object
            setImageWithFallback(modalImg, currentMemoryImages[currentImageIndex].src);
            imgCounter.textContent = `${currentImageIndex + 1} / ${currentMemoryImages.length}`;
            modalImg.style.opacity = '1';
        }, 300);
    }

    closeButton.onclick = () => modal.classList.remove('show');
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove('show');
        }
    };

    prevImgBtn.onclick = () => {
        currentImageIndex = (currentImageIndex - 1 + currentMemoryImages.length) % currentMemoryImages.length;
        updateModalImage();
    };

    nextImgBtn.onclick = () => {
        currentImageIndex = (currentImageIndex + 1) % currentMemoryImages.length;
        updateModalImage();
    };

    // Image Viewer Logic
    modalImg.onclick = () => {
        viewerImg.src = modalImg.src;
        imageViewer.classList.add('show');
    };

    closeViewerBtn.onclick = () => {
        imageViewer.classList.remove('show');
        // Reset zoom and position when closing
        setTimeout(() => {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            applyZoom();
        }, 300); // Match transition duration
    };

    function applyZoom() {
        if (currentZoom <= 1) {
            translateX = 0;
            translateY = 0;
        }
        viewerImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
        viewerImg.style.cursor = currentZoom > 1 ? 'grab' : 'pointer';
    }

    zoomInBtn.onclick = () => {
        currentZoom += 0.1;
        applyZoom();
    };

    zoomOutBtn.onclick = () => {
        currentZoom = Math.max(0.1, currentZoom - 0.1);
        applyZoom();
    };

    resetZoomBtn.onclick = () => {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyZoom();
    };

    zoomLevel.onclick = () => {
        zoomMenu.style.display = zoomMenu.style.display === 'block' ? 'none' : 'block';
    };

    zoomMenu.onclick = (e) => {
        if (e.target.dataset.zoom) {
            currentZoom = parseFloat(e.target.dataset.zoom);
            applyZoom();
            zoomMenu.style.display = 'none';
        }
    };

    viewerImg.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            viewerImg.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            viewerImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            viewerImg.style.cursor = 'grab';
        }
    });

    // Touch events for mobile drag
    viewerImg.addEventListener('touchstart', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
            viewerImg.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            viewerImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
        }
    }, { passive: false });

    window.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            viewerImg.style.cursor = 'grab';
        }
    });
});