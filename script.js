document.addEventListener('DOMContentLoaded', function() {
    // DOM elementleri
    const jokeElement = document.getElementById('joke');
    const newJokeBtn = document.getElementById('new-joke-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const loadingElement = document.getElementById('loading');
    const factCounter = document.getElementById('fact-counter');
    const shareBtn = document.querySelector('.share-btn');
    
    // Değişkenler
    let jokeCount = 0;
    let lastJoke = '';
    let favorites = [];
    
    // Chuck Norris API'den şaka getiren fonksiyon
    async function getRandomJoke() {
        try {
            loadingElement.style.display = 'block';
            jokeElement.textContent = 'Şaka yükleniyor...';
            
            // Görsel güncelle
            fetchRandomImage();
            
            // Animasyonları yenile
            refreshAnimations();
            
            // API çağrısını yap
            const response = await fetch('https://api.chucknorris.io/jokes/random');
            
            if (!response.ok) {
                throw new Error('API yanıt vermedi');
            }
            
            const data = await response.json();
            
            // Tekrar eden şakadan kaçın
            if (data.value === lastJoke && jokeCount > 0) {
                // Tekrar dene
                getRandomJoke();
                return;
            }
            
            // Şakayı göster
            lastJoke = data.value;
            jokeElement.textContent = data.value;
            
            // Şaka sayacını güncelle
            jokeCount++;
            factCounter.textContent = `${jokeCount} şaka görüntülendi`;
        } catch (error) {
            console.error('API hatası:', error);
            jokeElement.textContent = 'Chuck Norris o kadar güçlü ki şu anda API\'yi yumruklayıp dışarı çıktı! Lütfen birazdan tekrar deneyin.';
        } finally {
            loadingElement.style.display = 'none';
        }
    }
    
    // Chuck Norris görseli
    function fetchRandomImage() {
        // Chuck Norris'in avatarını kullan
        const imageElement = document.getElementById('chuck-image');
        
        // API'den gelen resmi kullan ve boyutunu artır
        imageElement.src = 'chucknorris.png';
        
        // Resmi biraz daha güzel göstermek için CSS'i ayarla
        imageElement.style.maxWidth = '250px';
        imageElement.style.margin = '0 auto';
    }
    
    // Animasyonları yenile
    function refreshAnimations() {
        document.querySelector('.image-container').classList.remove('fade-in');
        document.querySelector('.joke-container').classList.remove('fade-in');
        
        setTimeout(() => {
            document.querySelector('.image-container').classList.add('fade-in');
            document.querySelector('.joke-container').classList.add('fade-in');
        }, 10);
    }
    
    // Favorilere ekleme fonksiyonu
    function toggleFavorite() {
        const currentJoke = jokeElement.textContent;
        
        if (favorites.includes(currentJoke)) {
            // Favorilerden çıkar
            favorites = favorites.filter(joke => joke !== currentJoke);
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i> Favorilere Ekle';
            favoriteBtn.style.backgroundColor = '#ffd60a';
            
            // Bildirim
            showNotification('Favorilerden çıkarıldı!', 'warning');
        } else {
            // Favorilere ekle
            favorites.push(currentJoke);
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i> Favorilerden Çıkar';
            favoriteBtn.style.backgroundColor = '#e63946';
            
            // Bildirim
            showNotification('Favorilere eklendi!', 'success');
        }
    }
    
    // Bildirimleri gösterme fonksiyonu
    function showNotification(message, type) {
        // Eğer daha önce bildirim varsa kaldır
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // CSS animasyonu ekle
        notification.style.animation = 'slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards';
        
        // Sayfaya ekle
        document.body.appendChild(notification);
        
        // 3 saniye sonra bildirim otomatik kaybolur
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Paylaşma fonksiyonu
    function shareJoke() {
        const currentJoke = jokeElement.textContent;
        
        // Paylaşım seçenekleri diyaloğu oluştur
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
            <div class="share-content">
                <h3>Şakayı Paylaş</h3>
                <p>${currentJoke}</p>
                <div class="share-options">
                    <button class="share-option" data-platform="facebook"><i class="fab fa-facebook"></i> Facebook</button>
                    <button class="share-option" data-platform="twitter"><i class="fab fa-twitter"></i> Twitter</button>
                    <button class="share-option" data-platform="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                    <button class="share-option" data-platform="copy"><i class="fas fa-copy"></i> Kopyala</button>
                </div>
                <button class="close-dialog">Kapat</button>
            </div>
        `;
        
        // Sayfaya ekle
        document.body.appendChild(dialog);
        
        // Diyaloğu kapatma işlevi
        dialog.querySelector('.close-dialog').addEventListener('click', () => {
            dialog.remove();
        });
        
        // Dışarı tıklama ile kapatma
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
        
        // Paylaşım platformları işlevleri
        dialog.querySelectorAll('.share-option').forEach(button => {
            button.addEventListener('click', () => {
                const platform = button.getAttribute('data-platform');
                const jokeText = encodeURIComponent(`Chuck Norris Şakası: ${currentJoke}`);
                
                switch (platform) {
                    case 'facebook':
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=https://chucknorrisjokes.com&quote=${jokeText}`, '_blank');
                        break;
                    case 'twitter':
                        window.open(`https://twitter.com/intent/tweet?text=${jokeText}`, '_blank');
                        break;
                    case 'whatsapp':
                        window.open(`https://wa.me/?text=${jokeText}`, '_blank');
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(currentJoke).then(() => {
                            showNotification('Şaka panoya kopyalandı!', 'success');
                            dialog.remove();
                        });
                        break;
                }
            });
        });
    }
    
    // Event listeners
    newJokeBtn.addEventListener('click', getRandomJoke);
    favoriteBtn.addEventListener('click', toggleFavorite);
    shareBtn.addEventListener('click', shareJoke);
    
    // Klavye kısayolları
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            getRandomJoke();
        }
    });
    
    // Sayfa yüklendiğinde ilk şakayı getir
    getRandomJoke();
});