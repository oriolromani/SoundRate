let map;
let marker;

function initMap(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });

    map.addListener('click', function (event) {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
        });
    }
    document.getElementById('location').value = JSON.stringify({
        lat: location.lat(),
        lng: location.lng()
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api-key')
        .then(response => response.json())
        .then(data => {
            initMap(data.apiKey);
        });

    const stars = document.querySelectorAll('.rating .fa-star');
    stars.forEach(star => {
        star.addEventListener('click', (event) => {
            const value = event.currentTarget.getAttribute('data-value');
            document.getElementById('rating').value = value;
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('selected');
            }
        });
    });
});

document.getElementById('equipment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const equipment = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        rating: document.getElementById('rating').value,
        comment: document.getElementById('comment').value,
    };

    fetch('/equipments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipment),
    }).then(response => {
        if (response.status === 201) {
            alert('Equipment rated successfully!');
            document.getElementById('equipment-form').reset();
            if (marker) marker.setMap(null);
            document.querySelectorAll('.rating .fa-star').forEach(star => star.classList.remove('selected'));
        } else {
            alert('Failed to rate equipment.');
        }
    });
});
