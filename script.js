let currentSlide = 0;

    function showSlide(sobre_mi) {
        const slides = document.querySelectorAll('.slide');
        if (sobre_mi >= slides.length) {
            currentSlide = 0;
        } else if (sobre_mi < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = sobre_mi;
        }
        const offset = -currentSlide * 100; // Calcula el desplazamiento
        document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
    }

    function changeSlide(direction) {
        showSlide(currentSlide + direction);
    }

    // Muestra la primera diapositiva al cargar
    showSlide(currentSlide);
