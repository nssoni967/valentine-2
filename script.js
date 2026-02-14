gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- AUDIO MANAGERS ---
    const bgMusic = document.getElementById('bg-music');
    const hoverSound = document.getElementById('hover-sound');
    const specialSong = document.getElementById('special-song');
    
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    
    const playSpecialBtn = document.getElementById('play-special-btn');
    const diskIcon = document.querySelector('.player-disk');
    const playIcon = document.querySelector('.play-icon');
    const playerCard = document.querySelector('.player-card');

    // Default volume for Background Music
    const BASE_VOLUME = 0.5;
    bgMusic.volume = BASE_VOLUME;

    // State to track if special song is playing
    let isSpecialPlaying = false;

    // --- 1. START EXPERIENCE ---
    startBtn.addEventListener('click', () => {
        gsap.to(startScreen, {
            opacity: 0, 
            duration: 1, 
            onComplete: () => {
                startScreen.style.display = 'none';
                bgMusic.play().catch(e => console.log("BG Play Error:", e));
                triggerAnimations();
            }
        });
    });

    // --- 2. SMART HOVER AUDIO (DUCKING) ---
    const hoverElements = document.querySelectorAll('.hover-audio');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Only duck BG music if the special song is NOT playing
            if (!isSpecialPlaying) {
                // Fade out BG music quickly
                gsap.to(bgMusic, { volume: 0, duration: 0.5 });
            }
            
            // Play hover sound
            let chime = hoverSound.cloneNode();
            chime.volume = 0.3;
            chime.play().catch(e => console.log("Hover Error:", e));
        });

        el.addEventListener('mouseleave', () => {
            // Only bring BG music back if special song is NOT playing
            if (!isSpecialPlaying) {
                // Fade BG music back in
                gsap.to(bgMusic, { volume: BASE_VOLUME, duration: 1 });
            }
        });
    });

    // --- 3. PLAYER LOGIC ---
    playSpecialBtn.addEventListener('click', () => {
        if(isSpecialPlaying) {
            // STOP SPECIAL -> RESUME BG
            gsap.to(specialSong, { volume: 0, duration: 1, onComplete: () => {
                specialSong.pause();
                playIcon.innerText = "▶";
                diskIcon.classList.remove('playing');
                playerCard.classList.remove('playing');
            }});
            
            // Resume BG Music
            bgMusic.play();
            gsap.to(bgMusic, { volume: BASE_VOLUME, duration: 1 });
            
        } else {
            // STOP BG -> PLAY SPECIAL
            gsap.to(bgMusic, { volume: 0, duration: 1, onComplete: () => bgMusic.pause() });
            
            specialSong.volume = 0;
            specialSong.play();
            gsap.to(specialSong, { volume: 1, duration: 1 });
            
            playIcon.innerText = "⏸";
            diskIcon.classList.add('playing');
            playerCard.classList.add('playing');
        }
        isSpecialPlaying = !isSpecialPlaying;
    });

    // --- 4. ANIMATIONS ---
    function triggerAnimations() {
        gsap.from(".img-left", { x: -50, y: -20, opacity: 0, rotation: -20, duration: 1, delay: 0.2 });
        gsap.from(".img-right", { x: 50, y: -20, opacity: 0, rotation: 20, duration: 1, delay: 0.4 });
        gsap.from(".names-title", { scale: 0.5, opacity: 0, duration: 1, delay: 0.8, ease: "back.out(1.5)" });
        
        gsap.from(".envelope-card", { y: 50, opacity: 0, duration: 1.2, delay: 1, ease: "power2.out" });

        // Animate all timeline blocks on scroll
        const blocks = gsap.utils.toArray('.timeline-block');
        blocks.forEach(block => {
            gsap.from(block, {
                scrollTrigger: { trigger: block, start: "top 85%" },
                y: 50, opacity: 0, duration: 0.8
            });
        });
        
        gsap.from(".player-card", {
            scrollTrigger: { trigger: ".player-card", start: "top 90%" },
            scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.2)"
        });
    }
});