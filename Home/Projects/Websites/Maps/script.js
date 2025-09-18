class AutocompleteManager {
	constructor() {
		this.apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
		this.debounceDelay = 300;
		this.currentHighlighted = -1;
		this.suggestions = [];
		this.init();
	}
	init() {
		this.addressInput = document.getElementById('address');
		this.suggestionsContainer = document.getElementById('suggestions');
		this.sendButton = document.getElementById('send');
		this.locationButton = document.getElementById('location');
		this.mapElement = document.getElementById('map');
		this.mapPlaceholder = document.getElementById('mapPlaceholder');
		this.errorMessage = document.getElementById('errorMessage');
		this.setupEventListeners();
	}
	setupEventListeners() {
		// Setup autocomplete for address input
		this.setupAutocomplete();
		// Send button click
		this.sendButton.addEventListener('click', () => this.showOnMap());
		// Location button click
		this.locationButton.addEventListener('click', () => this.getCurrentLocation());
		// Enter key press
		this.addressInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' && this.currentHighlighted === -1) {
				this.showOnMap();
			}
		});
		// Close suggestions when clicking outside
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.input-wrapper')) {
				this.hideSuggestions();
			}
		});
		// Handle window resize
		window.addEventListener('resize', this.handleResize.bind(this));
	}
	handleResize() {
		// Adjust UI elements on resize if needed
		this.hideSuggestions();
	}
	setupAutocomplete() {
		let debounceTimeout;
		this.addressInput.addEventListener('input', (e) => {
			clearTimeout(debounceTimeout);
			const query = e.target.value.trim();
			if (query.length < 2) {
				this.hideSuggestions();
				return;
			}
			debounceTimeout = setTimeout(() => {
				this.fetchSuggestions(query);
			}, this.debounceDelay);
		});
		this.addressInput.addEventListener('keydown', (e) => {
			this.handleKeyNavigation(e);
		});
		this.addressInput.addEventListener('blur', () => {
			// Small delay to allow click on suggestion
			setTimeout(() => {
				if (!this.suggestionsContainer.contains(document.activeElement)) {
					this.hideSuggestions();
				}
			}, 150);
		});
	}
	// Get current location using Geolocation API
	getCurrentLocation() {
		this.clearError();
		this.setLoading(this.locationButton, true);
		if (!navigator.geolocation) {
			this.showError('La geolocalizzazione non è supportata dal tuo browser');
			this.setLoading(this.locationButton, false);
			return;
		}
		// Request high accuracy for mobile devices
		const options = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 0
		};
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.showLocationOnMap(position.coords);
				this.setLoading(this.locationButton, false);
			},
			(error) => {
				this.handleLocationError(error);
				this.setLoading(this.locationButton, false);
			},
			options
		);
	}
	// Show location on map
	showLocationOnMap(coords) {
		const {
			latitude,
			longitude
		} = coords;
		const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=${this.apiKey}&zoom=15`;
		this.displayMap(mapUrl);
		// Reverse geocoding to get address
		this.getAddressFromCoords(latitude, longitude);
	}
	// Get address from coordinates using reverse geocoding
	async getAddressFromCoords(lat, lng) {
		try {
			const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`);
			const data = await response.json();
			if (data.status === 'OK' && data.results.length > 0) {
				const address = data.results[0].formatted_address;
				this.addressInput.value = address;
			}
		} catch (error) {
			console.error('Error in reverse geocoding:', error);
		}
	}
	// Handle geolocation errors
	handleLocationError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				this.showError('Permesso di geolocalizzazione negato. Abilita la geolocalizzazione nelle impostazioni del browser.');
				break;
			case error.POSITION_UNAVAILABLE:
				this.showError('Impossibile ottenere la posizione. Verifica la connessione e il GPS.');
				break;
			case error.TIMEOUT:
				this.showError('Timeout nella richiesta di geolocalizzazione. Riprova.');
				break;
			default:
				this.showError('Errore sconosciuto nella geolocalizzazione.');
				break;
		}
	}
	async fetchSuggestions(query) {
		try {
			this.showLoadingState();
			// Use Google Places Autocomplete API for better results
			const data = await this.getGoogleSuggestions(query);
			this.displaySuggestions(data);
		} catch (error) {
			console.error('Error fetching suggestions:', error);
			this.showError('Unable to load suggestions. Please try again.');
			this.hideSuggestions();
		}
	}
	showLoadingState() {
		this.suggestionsContainer.innerHTML = '<div class="suggestion-item loading"><div class="suggestion-icon">🔍</div> Searching worldwide...</div>';
		this.showSuggestions();
	}
	// Use Google Places Autocomplete API
	async getGoogleSuggestions(query) {
		try {
			// Use Google Places Autocomplete API without country restrictions
			const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode&key=${this.apiKey}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
				console.warn('Google Places API returned status:', data.status);
				return {
					predictions: []
				};
			}
			if (data.status === 'ZERO_RESULTS') {
				return {
					predictions: []
				};
			}
			const predictions = data.predictions.map(prediction => ({
				description: prediction.description,
				place_id: prediction.place_id
			}));
			return {
				predictions
			};
		} catch (error) {
			console.error('Error fetching Google suggestions:', error);
			// Fallback to OpenStreetMap if Google fails
			return this.getOpenStreetMapSuggestions(query);
		}
	}
	// Fallback to OpenStreetMap
	async getOpenStreetMapSuggestions(query) {
		try {
			const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'GlobalMapsAutocompleteApp/1.0'
				}
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			const predictions = data.map(item => ({
				description: this.formatOpenStreetMapResult(item),
				place_id: `osm_${item.place_id}`
			}));
			return {
				predictions
			};
		} catch (error) {
			console.error('Error fetching OpenStreetMap suggestions:', error);
			return {
				predictions: []
			};
		}
	}
	formatOpenStreetMapResult(item) {
		const address = item.address || {};
		// Try to create a readable address
		if (address.road && address.house_number) {
			return `${address.road} ${address.house_number}, ${address.city || address.town || address.village || address.municipality || ''}, ${address.country || ''}`;
		} else if (address.road) {
			return `${address.road}, ${address.city || address.town || address.village || address.municipality || ''}, ${address.country || ''}`;
		} else {
			// Fallback to display name
			const parts = item.display_name.split(',');
			if (parts.length > 3) {
				return `${parts[0]}, ${parts[1]}, ${parts[parts.length-1]}`;
			}
			return item.display_name;
		}
	}
	displaySuggestions(data) {
			if (!data.predictions || data.predictions.length === 0) {
				this.suggestionsContainer.innerHTML = '<div class="suggestion-item"><div class="suggestion-icon">❌</div> No results found</div>';
				this.showSuggestions();
				return;
			}
			this.suggestions = data.predictions;
			this.currentHighlighted = -1;
			this.suggestionsContainer.innerHTML = '';
			data.predictions.forEach((prediction, index) => {
						const item = document.createElement('div');
						item.className = 'suggestion-item';
						item.dataset.index = index;
						item.tabIndex = 0;
						const suggestionText = prediction.description;
						const parts = suggestionText.split(',');
						const main = parts[0].trim();
						const secondary = parts.slice(1).join(',').trim();
						item.innerHTML = `
                <div class="suggestion-icon">📍</div>
                <div class="suggestion-text">
                    <div class="suggestion-main">${this.highlightMatch(main, this.addressInput.value)}</div>
                    ${secondary ? `<div class="suggestion-secondary">${secondary}</div>` : ''}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestionText);
            });
            
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.selectSuggestion(suggestionText);
                }
            });
            
            this.suggestionsContainer.appendChild(item);
        });
        
        this.showSuggestions();
    }
    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    handleKeyNavigation(e) {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentHighlighted = Math.min(this.currentHighlighted + 1, items.length - 1);
                this.updateHighlight(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.currentHighlighted = Math.max(this.currentHighlighted - 1, -1);
                this.updateHighlight(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentHighlighted >= 0) {
                    const selectedSuggestion = this.suggestions[this.currentHighlighted];
                    this.selectSuggestion(selectedSuggestion.description);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                this.addressInput.blur();
                break;
        }
    }
    updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === this.currentHighlighted);
            if (index === this.currentHighlighted) {
                item.focus();
            }
        });
    }
    selectSuggestion(description) {
        this.addressInput.value = description;
        this.hideSuggestions();
        this.currentHighlighted = -1;
    }
    showSuggestions() {
        this.suggestionsContainer.style.display = 'block';
    }
    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.currentHighlighted = -1;
    }
    showOnMap() {
        const address = this.addressInput.value.trim();
        
        if (!address) {
            this.showError('Please enter an address');
            return;
        }
        
        this.clearError();
        this.setLoading(this.sendButton, true);
        
        const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(address)}&key=${this.apiKey}`;
        
        setTimeout(() => {
            this.displayMap(mapUrl);
            this.setLoading(this.sendButton, false);
        }, 500);
    }
    displayMap(url) {
        this.mapElement.src = url;
        this.mapElement.style.display = 'block';
        this.mapPlaceholder.style.display = 'none';
    }
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('visible');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.clearError();
        }, 5000);
    }
    clearError() {
        this.errorMessage.classList.remove('visible');
    }
    setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AutocompleteManager();
});
