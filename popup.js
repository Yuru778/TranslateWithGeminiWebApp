document.addEventListener('DOMContentLoaded', () => {
  const lengthSlider = document.getElementById('lengthSlider');
  const minLengthInput = document.getElementById('minLength');
  const maxLengthInput = document.getElementById('maxLength');
  const currentLengthDisplay = document.getElementById('currentLengthDisplay');

  // Default settings
  const defaults = {
    sliderValue: 50,
    minLength: 200,
    maxLength: 600
  };

  // Load settings
  chrome.storage.local.get(['summarySettings'], (result) => {
    const settings = result.summarySettings || defaults;
    lengthSlider.value = settings.sliderValue;
    minLengthInput.value = settings.minLength;
    maxLengthInput.value = settings.maxLength;
    updateDisplay();
  });

  // Update display and save on change
  function updateDisplay() {
    const min = parseInt(minLengthInput.value, 10);
    const max = parseInt(maxLengthInput.value, 10);
    const percentage = parseInt(lengthSlider.value, 10);
    
    // Calculate target length based on slider percentage
    // Linear interpolation: min + (max - min) * (percentage / 100)
    const targetLength = Math.round(min + (max - min) * (percentage / 100));
    
    currentLengthDisplay.textContent = targetLength;
    
    // Add pulse animation
    currentLengthDisplay.classList.remove('pulse');
    void currentLengthDisplay.offsetWidth; // Trigger reflow
    currentLengthDisplay.classList.add('pulse');
  }

  function saveSettings() {
    const settings = {
      sliderValue: parseInt(lengthSlider.value, 10),
      minLength: parseInt(minLengthInput.value, 10),
      maxLength: parseInt(maxLengthInput.value, 10)
    };
    chrome.storage.local.set({ summarySettings: settings }, () => {
      console.log('Settings saved:', settings);
    });
  }

  // Event listeners
  lengthSlider.addEventListener('input', () => {
    updateDisplay();
    saveSettings();
  });

  minLengthInput.addEventListener('change', () => {
    updateDisplay();
    saveSettings();
  });

  maxLengthInput.addEventListener('change', () => {
    updateDisplay();
    saveSettings();
  });

  // Custom Spinner Logic
  document.querySelectorAll('.spin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isUp = btn.classList.contains('up');
      const step = 1; // Default step
      
      let val = parseInt(input.value, 10) || 0;
      
      if (isUp) {
        val += step;
      } else {
        val -= step;
      }
      
      // Enforce min/max attributes if present
      const min = parseInt(input.getAttribute('min'), 10);
      const max = parseInt(input.getAttribute('max'), 10);
      
      if (!isNaN(min) && val < min) val = min;
      if (!isNaN(max) && val > max) val = max;
      
      input.value = val;
      
      // Trigger change event to update settings
      input.dispatchEvent(new Event('change'));
    });
  });
});
