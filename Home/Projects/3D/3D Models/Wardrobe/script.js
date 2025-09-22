(()=>{
    const modelViewer = document.querySelector('#neutral-demo');
    const checkbox = document.querySelector('#neutral');

    checkbox.addEventListener('change', ()=>{
        modelViewer.environmentImage = checkbox.checked ? '' : 'legacy';
    });
})();
