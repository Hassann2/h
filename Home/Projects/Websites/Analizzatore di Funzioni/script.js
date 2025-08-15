document.addEventListener('DOMContentLoaded', function(){
    const functionInput = document.getElementById('function-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');

    setTimeout(() =>{
        analyzeFunction();
    }, 500);

    analyzeBtn.addEventListener('click', analyzeFunction);
    functionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeFunction();
        }
    });

    function analyzeFunction(){
        const functionStr = functionInput.value.trim();
        if (!functionStr) {
            showError("Inserisci una funzione valida.");
            return;
        }

        try{
          // Parse the function to check if it's valid
          const parsedFunction = math.parse(functionStr);
          const compiledFunction = parsedFunction.compile();
          
          // Hide error message if previously shown
          errorMessage.style.display = 'none';
          
          // Show loading indicator
          loading.style.display = 'block';
          
          // Use setTimeout to allow the UI to update before heavy calculations
          setTimeout(() => {
              try {
                  performAnalysis(functionStr);
                  loading.style.display = 'none';
              } catch (error) {
                  loading.style.display = 'none';
                  showError("Errore durante l'analisi: " + error.message);
              }
          }, 100);  
        }catch(error){
            showError("Funzione non valida: " + error.message);
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loading.style.display = 'none';
    }

    function performAnalysis(functionStr) {
        // Get x range from inputs
        const xMin = parseFloat(xMinInput.value) || -10;
        const xMax = parseFloat(xMaxInput.value) || 10;
        
        // Plot the function
        plotFunction(functionStr, xMin, xMax);
        
        // Analyze the function
        analyzeDomain(functionStr);
        analyzeRange(functionStr, xMin, xMax);
        analyzeSign(functionStr, xMin, xMax);
        findIntersections(functionStr);
        calculateLimits(functionStr);
        findAsymptotes(functionStr);
        studyFunction(functionStr);
        findExtrema(functionStr, xMin, xMax);
        calculateDerivative(functionStr);
        studyDerivative(functionStr, xMin, xMax);
    }

    function plotFunction(functionStr, xMin, xMax){
        try{
            // Generate points for the function
            const step = (xMax - xMin) / 1000;
            const x = [];
            const y = [];
            
            const scope = {};
            const compiledFunction = math.compile(functionStr);

            for (let i = xMin; i <= xMax; i += step) {
                scope.x = i;
                try {
                    const value = compiledFunction.evaluate(scope);
                    if (isFinite(value)) {
                        x.push(i);
                        y.push(value);
                    }
                } catch (e) {
                    // Skip points where the function is undefined
                }
            }

            // Calculate derivative for plotting
            const derivative = math.derivative(math.parse(functionStr), 'x').toString();
            const xDeriv = [];
            const yDeriv = [];
            
            const compiledDerivative = math.compile(derivative);
            
            for (let i = xMin; i <= xMax; i += step) {
                scope.x = i;
                try {
                    const value = compiledDerivative.evaluate(scope);
                    if (isFinite(value)) {
                        xDeriv.push(i);
                        yDeriv.push(value);
                    }
                } catch (e) {
                    // Skip points where the derivative is undefined
                }
            }

            // Create the plot
            const data = [
                {
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'f(x) = ' + functionStr,
                    line: {
                        color: '#4361ee',
                        width: 3
                    }
                },
                {
                    x: xDeriv,
                    y: yDeriv,
                    type: 'scatter',
                    mode: 'lines',
                    name: "f'(x)",
                    line: {
                        color: '#f72585',
                        width: 2,
                        dash: 'dash'
                    }
                }
            ];

            const layout = {
                title: 'Grafico della funzione e della sua derivata',
                xaxis: {
                    title: 'x',
                    zeroline: true,
                    zerolinecolor: '#888',
                    zerolinewidth: 1
                },
                yaxis: {
                    title: 'y',
                    zeroline: true,
                    zerolinecolor: '#888',
                    zerolinewidth: 1
                },
                legend: {
                    x: 0,
                    y: 1,
                    traceorder: 'normal',
                    font: {
                        family: 'Poppins',
                        size: 12,
                        color: '#000'
                    },
                    bgcolor: '#fff',
                    bordercolor: '#ddd',
                    borderwidth: 1
                },
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50,
                    pad: 4
                },
                hovermode: 'closest',
                plot_bgcolor: '#f8f9fa',
                paper_bgcolor: '#fff'
            };

            Plotly.newPlot('function-graph', data, layout);
        }catch (error) {
            document.getElementById('function-graph').innerHTML = 
                `<div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--error);">
                    Errore nel disegnare il grafico: ${error.message}
                </div>`;
        }
    }

    function analyzeDomain(functionStr){
        const domainResult = document.getElementById('domain-result');

        try{
            let domainDescription = "";
            
            // Check for common functions with restricted domains
            if (functionStr.includes('log(') || functionStr.includes('ln(')) {
                domainDescription = "Il dominio è limitato ai valori positivi dell'argomento del logaritmo.";
                
                // Try to extract the argument of the logarithm
                const logMatch = functionStr.match(/log\((.*?)\)/);
                const lnMatch = functionStr.match(/ln\((.*?)\)/);
                
                if (logMatch || lnMatch) {
                    const arg = logMatch ? logMatch[1] : lnMatch[1];
                    domainDescription += `<div class="step-explanation">
                        <p>Per la funzione logaritmica, l'argomento ${arg} deve essere positivo:</p>
                        <p class="math">\\[ ${arg} > 0 \\]</p>
                    </div>`;
                }
            }else if(functionStr.includes('sqrt(') || functionStr.includes('√')){
                domainDescription = "Il dominio è limitato ai valori non negativi dell'argomento della radice quadrata.";
                
                // Try to extract the argument of the square root
                const sqrtMatch = functionStr.match(/sqrt\((.*?)\)/);
                if (sqrtMatch) {
                    const arg = sqrtMatch[1];
                    domainDescription += `<div class="step-explanation">
                        <p>Per la radice quadrata, l'argomento ${arg} deve essere non negativo:</p>
                        <p class="math">\\[ ${arg} \\geq 0 \\]</p>
                    </div>`;
                }
            }else if (functionStr.includes('1/') || functionStr.includes('/')) {
                domainDescription = "Il dominio esclude i valori che rendono il denominatore uguale a zero.";
                
                // Try to identify denominators
                if (functionStr.includes('1/')) {
                    const denomMatch = functionStr.match(/1\/([^+\-*/]+)/);
                    if (denomMatch) {
                        const denom = denomMatch[1];
                        domainDescription += `<div class="step-explanation">
                            <p>Per la frazione, il denominatore ${denom} non può essere zero:</p>
                            <p class="math">\\[ ${denom} \\neq 0 \\]</p>
                        </div>`;
                    }
                }
            }else {
                domainDescription = "Il dominio è l'insieme dei numeri reali ℝ.";
                domainDescription += `<div class="step-explanation">
                    <p>La funzione non presenta restrizioni sul dominio, quindi è definita per tutti i valori reali di x.</p>
                    <p class="math">\\[ D_f = \\mathbb{R} \\]</p>
                </div>`;
            }

            domainResult.innerHTML = domainDescription;
            
            // Render math expressions
            if (window.MathJax) {
                MathJax.typeset([domainResult]);
            }
        }catch (error) {
            domainResult.innerHTML = `Errore nell'analisi del dominio: ${error.message}`;
        }
    }

    function analyzeRange(functionStr, xMin, xMax) {
        const rangeResult = document.getElementById('range-result');
        
        try {
            let rangeDescription = "";
            
            // Check for common functions with specific ranges
            if (functionStr.includes('sin(') || functionStr.includes('cos(')) {
                rangeDescription = "Il codominio è limitato all'intervallo [-1, 1].";
                rangeDescription += `<div class="step-explanation">
                    <p>Le funzioni trigonometriche seno e coseno hanno valori compresi tra -1 e 1:</p>
                    <p class="math">\\[ -1 \\leq f(x) \\leq 1 \\]</p>
                </div>`;
            } else if (functionStr.includes('tan(')) {
                rangeDescription = "Il codominio è l'insieme dei numeri reali ℝ.";
                rangeDescription += `<div class="step-explanation">
                    <p>La funzione tangente può assumere qualsiasi valore reale:</p>
                    <p class="math">\\[ C_f = \\mathbb{R} \\]</p>
                </div>`;
            } else if (functionStr.includes('e^') || functionStr.includes('exp(')) {
                rangeDescription = "Il codominio è l'insieme dei numeri reali positivi (0, +∞).";
                rangeDescription += `<div class="step-explanation">
                    <p>La funzione esponenziale naturale assume solo valori positivi:</p>
                    <p class="math">\\[ f(x) > 0 \\quad \\forall x \\in \\mathbb{R} \\]</p>
                </div>`;
            } else if (functionStr.includes('log(') || functionStr.includes('ln(')) {
                rangeDescription = "Il codominio è l'insieme dei numeri reali ℝ.";
                rangeDescription += `<div class="step-explanation">
                    <p>La funzione logaritmica può assumere qualsiasi valore reale:</p>
                    <p class="math">\\[ C_f = \\mathbb{R} \\]</p>
                </div>`;
            } else {
                // For polynomial and rational functions, estimate the range
                const scope = {};
                const compiledFunction = math.compile(functionStr);
                
                // Sample the function at many points to estimate the range
                const step = (xMax - xMin) / 500;
                let minY = Infinity;
                let maxY = -Infinity;
                
                for (let x = xMin; x <= xMax; x += step) {
                    scope.x = x;
                    try {
                        const y = compiledFunction.evaluate(scope);
                        if (isFinite(y)) {
                            minY = Math.min(minY, y);
                            maxY = Math.max(maxY, y);
                        }
                    } catch (e) {
                        // Skip points where the function is undefined
                    }
                }
                
                if (isFinite(minY) && isFinite(maxY)) {
                    // Round to 2 decimal places for display
                    minY = Math.round(minY * 100) / 100;
                    maxY = Math.round(maxY * 100) / 100;
                    
                    rangeDescription = `Nell'intervallo [${xMin}, ${xMax}], il codominio è approssimativamente [${minY}, ${maxY}].`;
                    rangeDescription += `<div class="step-explanation">
                        <p>Questo è un'approssimazione basata sui valori calcolati nell'intervallo specificato.</p>
                        <p>Per determinare il codominio esatto, è necessario studiare il comportamento della funzione su tutto il suo dominio.</p>
                    </div>`;
                } else {
                    rangeDescription = "Non è possibile determinare il codominio con precisione nell'intervallo specificato.";
                }
            }
            
            rangeResult.innerHTML = rangeDescription;
            
            // Render math expressions
            if (window.MathJax) {
                MathJax.typeset([rangeResult]);
            }
            
        } catch (error) {
            rangeResult.innerHTML = `Errore nell'analisi del codominio: ${error.message}`;
        }
    }

    function analyzeSign(functionStr, xMin, xMax) {
        const signResult = document.getElementById('sign-result');
        
        try {
            // Compile the function
            const compiledFunction = math.compile(functionStr);
            const scope = {};
            
            // Find zeros of the function (where f(x) = 0)
            const zeros = findZeros(functionStr, xMin, xMax);
            
            let signAnalysis = "";
            
            if (zeros.length === 0) {
                // Check the sign at one point
                scope.x = (xMin + xMax) / 2;
                const value = compiledFunction.evaluate(scope);
                
                if (value > 0) {
                    signAnalysis = `La funzione è sempre positiva nell'intervallo [${xMin}, ${xMax}].`;
                } else if (value < 0) {
                    signAnalysis = `La funzione è sempre negativa nell'intervallo [${xMin}, ${xMax}].`;
                } else {
                    signAnalysis = `La funzione è zero nell'intervallo [${xMin}, ${xMax}].`;
                }
            } else {
                // Sort zeros
                zeros.sort((a, b) => a - b);
                
                signAnalysis = "La funzione cambia segno nei seguenti punti:<br>";
                signAnalysis += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                zeros.forEach(zero => {
                    signAnalysis += `<li>x = ${zero.toFixed(4)}</li>`;
                });
                
                signAnalysis += `</ul><br>`;
                
                // Analyze sign in each interval
                signAnalysis += "Studio del segno negli intervalli:<br>";
                signAnalysis += `<div class="step-explanation">`;
                
                // Check intervals between zeros
                const intervals = [xMin, ...zeros, xMax];
                
                for (let i = 0; i < intervals.length - 1; i++) {
                    const start = intervals[i];
                    const end = intervals[i + 1];
                    const midpoint = (start + end) / 2;
                    
                    scope.x = midpoint;
                    let value;
                    try {
                        value = compiledFunction.evaluate(scope);
                    } catch (e) {
                        value = null;
                    }
                    
                    if (value !== null) {
                        const sign = value > 0 ? "positiva" : "negativa";
                        signAnalysis += `<p>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione ${sign}</p>`;
                    } else {
                        signAnalysis += `<p>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione non definita</p>`;
                    }
                }
                
                signAnalysis += `</div>`;
            }
            
            signResult.innerHTML = signAnalysis;
            
        } catch (error) {
            signResult.innerHTML = `Errore nell'analisi del segno: ${error.message}`;
        }
    }

    function findZeros(functionStr, xMin, xMax) {
        const zeros = [];
        const step = (xMax - xMin) / 1000;
        const compiledFunction = math.compile(functionStr);
        const scope = {};
        
        // Look for sign changes
        let prevValue = null;
        
        for (let x = xMin; x <= xMax; x += step) {
            scope.x = x;
            let value;
            
            try {
                value = compiledFunction.evaluate(scope);
            } catch (e) {
                prevValue = null;
                continue;
            }
            
            if (prevValue !== null) {
                // Check for sign change or zero crossing
                if ((prevValue * value <= 0) && (Math.abs(value) < 1e-10 || Math.abs(prevValue) < 1e-10 || prevValue * value < 0)) {
                    // Refine the zero using binary search
                    const zero = findZeroByBisection(compiledFunction, x - step, x, 1e-10);
                    if (zero !== null) {
                        // Check if this zero is not too close to an existing one
                        const isDuplicate = zeros.some(z => Math.abs(z - zero) < 1e-6);
                        if (!isDuplicate) {
                            zeros.push(zero);
                        }
                    }
                }
            }
            
            prevValue = value;
        }
        
        return zeros;
    }

    function findZeroByBisection(compiledFunction, left, right, tolerance) {
        const scope = {};
        let leftValue, rightValue, midValue;
        
        // Check if the function actually changes sign in this interval
        scope.x = left;
        try {
            leftValue = compiledFunction.evaluate(scope);
        } catch (e) {
            return null;
        }
        
        scope.x = right;
        try {
            rightValue = compiledFunction.evaluate(scope);
        } catch (e) {
            return null;
        }
        
        // If both values have the same sign and neither is close to zero, there's no zero crossing
        if (leftValue * rightValue > 0 && Math.abs(leftValue) > tolerance && Math.abs(rightValue) > tolerance) {
            return null;
        }
        
        // If one of the endpoints is very close to zero, return it
        if (Math.abs(leftValue) < tolerance) return left;
        if (Math.abs(rightValue) < tolerance) return right;
        
        // Perform bisection
        for (let i = 0; i < 50; i++) {
            const mid = (left + right) / 2;
            scope.x = mid;
            
            try {
                midValue = compiledFunction.evaluate(scope);
            } catch (e) {
                // If the midpoint is undefined, try to narrow the interval
                if (i < 10) {
                    // Try moving left
                    right = mid;
                    continue;
                } else {
                    return null;
                }
            }
            
            if (Math.abs(midValue) < tolerance) {
                return mid;
            }
            
            if (leftValue * midValue < 0) {
                right = mid;
                rightValue = midValue;
            } else {
                left = mid;
                leftValue = midValue;
            }
            
            if (right - left < tolerance) {
                return (left + right) / 2;
            }
        }
        
        return (left + right) / 2;
    }

    function findIntersections(functionStr) {
        const intersectionsResult = document.getElementById('intersections-result');
        
        try {
            // Find x-axis intersections (zeros of the function)
            const xMin = parseFloat(xMinInput.value) || -10;
            const xMax = parseFloat(xMaxInput.value) || 10;
            const zeros = findZeros(functionStr, xMin, xMax);
            
            // Find y-axis intersection (value at x = 0)
            let yIntersection = null;
            try {
                const compiledFunction = math.compile(functionStr);
                const scope = { x: 0 };
                yIntersection = compiledFunction.evaluate(scope);
            } catch (e) {
                // Function not defined at x = 0
            }
            
            let intersectionsText = "";
            
            // X-axis intersections
            if (zeros.length > 0) {
                intersectionsText += "Intersezioni con l'asse x (f(x) = 0):<br>";
                intersectionsText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                zeros.forEach(zero => {
                    intersectionsText += `<li>x = ${zero.toFixed(4)}</li>`;
                });
                
                intersectionsText += `</ul><br>`;
                
                intersectionsText += `<div class="step-explanation">
                    <p>Per trovare le intersezioni con l'asse x, risolviamo l'equazione:</p>
                    <p class="math">\\[ ${functionStr} = 0 \\]</p>
                </div>`;
            } else {
                intersectionsText += "Nessuna intersezione con l'asse x nell'intervallo specificato.<br><br>";
            }
            
            // Y-axis intersection
            if (yIntersection !== null && isFinite(yIntersection)) {
                intersectionsText += `Intersezione con l'asse y: (0, ${yIntersection.toFixed(4)})<br>`;
                intersectionsText += `<div class="step-explanation">
                    <p>Per trovare l'intersezione con l'asse y, calcoliamo f(0):</p>
                    <p class="math">\\[ f(0) = ${yIntersection.toFixed(4)} \\]</p>
                </div>`;
            } else {
                intersectionsText += "La funzione non è definita all'origine (x = 0).<br>";
            }
            
            intersectionsResult.innerHTML = intersectionsText;
            
            // Render math expressions
            if (window.MathJax) {
                MathJax.typeset([intersectionsResult]);
            }
            
        } catch (error) {
            intersectionsResult.innerHTML = `Errore nel calcolo delle intersezioni: ${error.message}`;
        }
    }

    function calculateLimits(functionStr) {
        const limitsResult = document.getElementById('limits-result');
        
        try {
            const compiledFunction = math.compile(functionStr);
            const scope = {};
            
            // Check for special functions to provide analytical limits
            let limitsText = "";
            
            // Analyze limits at infinity
            if (functionStr.includes('e^x') || functionStr.includes('exp(x)')) {
                limitsText += "Limiti all'infinito:<br>";
                limitsText += "lim<sub>x→+∞</sub> f(x) = +∞<br>";
                limitsText += "lim<sub>x→-∞</sub> f(x) = 0<br><br>";
            } else if (functionStr.includes('ln(x)') || functionStr.includes('log(x)')) {
                limitsText += "Limiti all'infinito:<br>";
                limitsText += "lim<sub>x→+∞</sub> f(x) = +∞<br>";
                limitsText += "lim<sub>x→0+</sub> f(x) = -∞<br><br>";
            } else {
                // For polynomial functions, determine the degree and leading coefficient
                let isPolynomial = true;
                let degree = 0;
                let leadingCoeff = 1;
                
                try {
                    // Try to expand the expression to check if it's a polynomial
                    const expanded = math.simplify(functionStr).toString();
                    
                    // Simple check for polynomial degree (this is a heuristic)
                    if (expanded.includes('x^')) {
                        const matches = expanded.match(/x\^(\d+)/g);
                        if (matches) {
                            const degrees = matches.map(m => parseInt(m.substring(2)));
                            degree = Math.max(...degrees);
                            
                            // Try to extract leading coefficient (simplified approach)
                            const leadingTermRegex = new RegExp(`([+-]?\\s*\\d*\\.?\\d*)\\s*\\*?\\s*x\\^${degree}`);
                            const leadingTermMatch = expanded.match(leadingTermRegex);
                            
                            if (leadingTermMatch && leadingTermMatch[1]) {
                                const coeff = leadingTermMatch[1].trim();
                                if (coeff === "" || coeff === "+") {
                                    leadingCoeff = 1;
                                } else if (coeff === "-") {
                                    leadingCoeff = -1;
                                } else {
                                    leadingCoeff = parseFloat(coeff);
                                }
                            }
                        }
                    } else if (expanded.includes('x')) {
                        degree = 1;
                    }
                } catch (e) {
                    isPolynomial = false;
                }
                
                if (isPolynomial && degree > 0) {
                    limitsText += "Limiti all'infinito (analisi polinomiale):<br>";
                    
                    if (degree % 2 === 0) {
                        // Even degree
                        if (leadingCoeff > 0) {
                            limitsText += "lim<sub>x→+∞</sub> f(x) = +∞<br>";
                            limitsText += "lim<sub>x→-∞</sub> f(x) = +∞<br><br>";
                        } else {
                            limitsText += "lim<sub>x→+∞</sub> f(x) = -∞<br>";
                            limitsText += "lim<sub>x→-∞</sub> f(x) = -∞<br><br>";
                        }
                    } else {
                        // Odd degree
                        if (leadingCoeff > 0) {
                            limitsText += "lim<sub>x→+∞</sub> f(x) = +∞<br>";
                            limitsText += "lim<sub>x→-∞</sub> f(x) = -∞<br><br>";
                        } else {
                            limitsText += "lim<sub>x→+∞</sub> f(x) = -∞<br>";
                            limitsText += "lim<sub>x→-∞</sub> f(x) = +∞<br><br>";
                        }
                    }
                    
                    limitsText += `<div class="step-explanation">
                        <p>Analisi del limite per un polinomio di grado ${degree} con coefficiente principale ${leadingCoeff}:</p>
                        <p>Per i polinomi, il comportamento all'infinito è determinato dal termine di grado più alto.</p>
                    </div>`;
                } else {
                    // Numerical approximation of limits
                    limitsText += "Limiti (approssimazione numerica):<br>";
                    
                    // Approximate limit as x approaches positive infinity
                    let posInfLimit = "indeterminato";
                    try {
                        const x1 = 1000;
                        const x2 = 10000;
                        scope.x = x1;
                        const y1 = compiledFunction.evaluate(scope);
                        scope.x = x2;
                        const y2 = compiledFunction.evaluate(scope);
                        
                        if (isFinite(y1) && isFinite(y2)) {
                            if (Math.abs(y2 - y1) < 0.1) {
                                posInfLimit = y2.toFixed(4);
                            } else if (y2 > y1 && y2 > 1000) {
                                posInfLimit = "+∞";
                            } else if (y2 < y1 && y2 < -1000) {
                                posInfLimit = "-∞";
                            }
                        }
                    } catch (e) {
                        // Error in evaluation
                    }
                    
                    // Approximate limit as x approaches negative infinity
                    let negInfLimit = "indeterminato";
                    try {
                        const x1 = -1000;
                        const x2 = -10000;
                        scope.x = x1;
                        const y1 = compiledFunction.evaluate(scope);
                        scope.x = x2;
                        const y2 = compiledFunction.evaluate(scope);
                        
                        if (isFinite(y1) && isFinite(y2)) {
                            if (Math.abs(y2 - y1) < 0.1) {
                                negInfLimit = y2.toFixed(4);
                            } else if (y2 > y1 && y2 > 1000) {
                                negInfLimit = "+∞";
                            } else if (y2 < y1 && y2 < -1000) {
                                negInfLimit = "-∞";
                            }
                        }
                    } catch (e) {
                        // Error in evaluation
                    }
                    
                    limitsText += `lim<sub>x→+∞</sub> f(x) = ${posInfLimit}<br>`;
                    limitsText += `lim<sub>x→-∞</sub> f(x) = ${negInfLimit}<br><br>`;
                    
                    limitsText += `<div class="step-explanation">
                        <p>Questi limiti sono approssimazioni numeriche basate sulla valutazione della funzione per valori molto grandi di x.</p>
                    </div>`;
                }
            }
            
            // Find potential points of discontinuity
            const xMin = parseFloat(xMinInput.value) || -10;
            const xMax = parseFloat(xMaxInput.value) || 10;
            const discontinuities = findDiscontinuities(functionStr, xMin, xMax);
            
            if (discontinuities.length > 0) {
                limitsText += "Punti di discontinuità:<br>";
                limitsText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                discontinuities.forEach(x => {
                    limitsText += `<li>x = ${x.toFixed(4)}</li>`;
                });
                
                limitsText += `</ul><br>`;
                
                // For each discontinuity, try to compute left and right limits
                limitsText += "Limiti nei punti di discontinuità:<br>";
                
                discontinuities.forEach(x => {
                    let leftLimit = "indeterminato";
                    let rightLimit = "indeterminato";
                    
                    try {
                        // Left limit
                        scope.x = x - 0.0001;
                        const leftValue = compiledFunction.evaluate(scope);
                        if (isFinite(leftValue)) {
                            leftLimit = leftValue.toFixed(4);
                        } else if (leftValue > 1e10) {
                            leftLimit = "+∞";
                        } else if (leftValue < -1e10) {
                            leftLimit = "-∞";
                        }
                        
                        // Right limit
                        scope.x = x + 0.0001;
                        const rightValue = compiledFunction.evaluate(scope);
                        if (isFinite(rightValue)) {
                            rightLimit = rightValue.toFixed(4);
                        } else if (rightValue > 1e10) {
                            rightLimit = "+∞";
                        } else if (rightValue < -1e10) {
                            rightLimit = "-∞";
                        }
                    } catch (e) {
                        // Error in evaluation
                    }
                    
                    limitsText += `x = ${x.toFixed(4)}:<br>`;
                    limitsText += `lim<sub>x→${x.toFixed(2)}<sup>-</sup></sub> f(x) = ${leftLimit}<br>`;
                    limitsText += `lim<sub>x→${x.toFixed(2)}<sup>+</sup></sub> f(x) = ${rightLimit}<br><br>`;
                });
            }
            
            limitsResult.innerHTML = limitsText;
            
        } catch (error) {
            limitsResult.innerHTML = `Errore nel calcolo dei limiti: ${error.message}`;
        }
    }

    function findDiscontinuities(functionStr, xMin, xMax) {
        const discontinuities = [];
        const compiledFunction = math.compile(functionStr);
        const scope = {};
        const step = (xMax - xMin) / 1000;
        
        let lastValue = null;
        let lastX = null;
        
        for (let x = xMin; x <= xMax; x += step) {
            scope.x = x;
            let value;
            
            try {
                value = compiledFunction.evaluate(scope);
            } catch (e) {
                // Function not defined at this point
                // Check if it's defined just before and after
                if (lastX !== null) {
                    try {
                        scope.x = x + step;
                        const nextValue = compiledFunction.evaluate(scope);
                        
                        // If both sides are defined, this is a potential discontinuity
                        if (isFinite(lastValue) && isFinite(nextValue)) {
                            discontinuities.push(x);
                        }
                    } catch (e2) {
                        // Next point also undefined
                    }
                }
                
                lastValue = null;
                lastX = x;
                continue;
            }
            
            if (lastValue !== null) {
                // Check for sudden large changes in value
                if (isFinite(value) && isFinite(lastValue)) {
                    const change = Math.abs(value - lastValue);
                    const avgMagnitude = (Math.abs(value) + Math.abs(lastValue)) / 2;
                    
                    if (change > 100 * avgMagnitude && change > 100) {
                        // This is a potential discontinuity
                        const midpoint = (x + lastX) / 2;
                        discontinuities.push(midpoint);
                    }
                } else if (isFinite(value) !== isFinite(lastValue)) {
                    // One value is finite and the other is not
                    const midpoint = (x + lastX) / 2;
                    discontinuities.push(midpoint);
                }
            }
            
            lastValue = value;
            lastX = x;
        }
        
        // Remove duplicates and sort
        return [...new Set(discontinuities)].sort((a, b) => a - b);
    }

    function findAsymptotes(functionStr) {
        const asymptotesResult = document.getElementById('asymptotes-result');
        
        try {
            let asymptotesText = "";
            
            // Find vertical asymptotes (discontinuities)
            const xMin = parseFloat(xMinInput.value) || -10;
            const xMax = parseFloat(xMaxInput.value) || 10;
            const discontinuities = findDiscontinuities(functionStr, xMin, xMax);
            
            // Check which discontinuities are vertical asymptotes
            const verticalAsymptotes = [];
            const compiledFunction = math.compile(functionStr);
            const scope = {};
            
            discontinuities.forEach(x => {
                let isAsymptote = false;
                
                try {
                    // Check left side
                    scope.x = x - 0.0001;
                    const leftValue = compiledFunction.evaluate(scope);
                    
                    // Check right side
                    scope.x = x + 0.0001;
                    const rightValue = compiledFunction.evaluate(scope);
                    
                    // If either side approaches infinity, it's an asymptote
                    if (!isFinite(leftValue) || !isFinite(rightValue) || 
                        Math.abs(leftValue) > 1e10 || Math.abs(rightValue) > 1e10) {
                        isAsymptote = true;
                    }
                } catch (e) {
                    // If evaluation fails, it might be an asymptote
                    isAsymptote = true;
                }
                
                if (isAsymptote) {
                    verticalAsymptotes.push(x);
                }
            });
            
            // Find horizontal asymptotes
            let horizontalAsymptotes = [];
            
            // Check limit as x approaches positive infinity
            let posInfLimit = null;
            try {
                scope.x = 1000;
                const y1 = compiledFunction.evaluate(scope);
                scope.x = 10000;
                const y2 = compiledFunction.evaluate(scope);
                
                if (isFinite(y1) && isFinite(y2) && Math.abs(y2 - y1) < 0.1) {
                    posInfLimit = (y1 + y2) / 2;
                    horizontalAsymptotes.push(posInfLimit);
                }
            } catch (e) {
                // Error in evaluation
            }
            
            // Check limit as x approaches negative infinity
            let negInfLimit = null;
            try {
                scope.x = -1000;
                const y1 = compiledFunction.evaluate(scope);
                scope.x = -10000;
                const y2 = compiledFunction.evaluate(scope);
                
                if (isFinite(y1) && isFinite(y2) && Math.abs(y2 - y1) < 0.1) {
                    negInfLimit = (y1 + y2) / 2;
                    if (posInfLimit === null || Math.abs(posInfLimit - negInfLimit) > 0.1) {
                        horizontalAsymptotes.push(negInfLimit);
                    }
                }
            } catch (e) {
                // Error in evaluation
            }
            
            // Remove duplicates from horizontal asymptotes
            horizontalAsymptotes = [...new Set(horizontalAsymptotes)];
            
            // Display results
            if (verticalAsymptotes.length > 0) {
                asymptotesText += "Asintoti verticali:<br>";
                asymptotesText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                verticalAsymptotes.forEach(x => {
                    asymptotesText += `<li>x = ${x.toFixed(4)}</li>`;
                });
                
                asymptotesText += `</ul><br>`;
                
                asymptotesText += `<div class="step-explanation">
                    <p>Gli asintoti verticali si verificano nei punti in cui la funzione tende all'infinito.</p>
                    <p>Questi punti corrispondono spesso a valori che rendono il denominatore uguale a zero.</p>
                </div>`;
            } else {
                asymptotesText += "Nessun asintoto verticale trovato nell'intervallo specificato.<br><br>";
            }
            
            if (horizontalAsymptotes.length > 0) {
                asymptotesText += "Asintoti orizzontali:<br>";
                asymptotesText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                horizontalAsymptotes.forEach(y => {
                    asymptotesText += `<li>y = ${y.toFixed(4)}</li>`;
                });
                
                asymptotesText += `</ul><br>`;
                
                asymptotesText += `<div class="step-explanation">
                    <p>Gli asintoti orizzontali rappresentano il valore a cui la funzione tende quando x si avvicina all'infinito.</p>
                    <p>Sono determinati calcolando il limite della funzione per x che tende a +∞ o -∞.</p>
                </div>`;
            } else {
                asymptotesText += "Nessun asintoto orizzontale trovato.<br><br>";
            }
            
            // Check for oblique asymptotes (simplified approach)
            if (horizontalAsymptotes.length === 0) {
                asymptotesText += "Possibili asintoti obliqui: analisi non disponibile in questa versione.<br>";
                asymptotesText += `<div class="step-explanation">
                    <p>Gli asintoti obliqui hanno la forma y = mx + q e si verificano quando il limite del rapporto f(x)/x tende a un valore finito m ≠ 0 per x → ±∞.</p>
                </div>`;
            }
            
            asymptotesResult.innerHTML = asymptotesText;
            
            // Render math expressions
            if (window.MathJax) {
                MathJax.typeset([asymptotesResult]);
            }
            
        } catch (error) {
            asymptotesResult.innerHTML = `Errore nell'analisi degli asintoti: ${error.message}`;
        }
    }

    function studyFunction(functionStr) {
        const functionStudyResult = document.getElementById('function-study-result');
        
        try {
            let studyText = "";
            
            // Calculate derivative
            const derivative = math.derivative(math.parse(functionStr), 'x').toString();
            
            // Find critical points (where derivative is zero)
            const xMin = parseFloat(xMinInput.value) || -10;
            const xMax = parseFloat(xMaxInput.value) || 10;
            const criticalPoints = findZeros(derivative, xMin, xMax);
            
            // Find inflection points (where second derivative is zero)
            const secondDerivative = math.derivative(math.parse(derivative), 'x').toString();
            const inflectionPoints = findZeros(secondDerivative, xMin, xMax);
            
            // Analyze monotonicity
            studyText += "Analisi della monotonia:<br>";
            
            if (criticalPoints.length === 0) {
                // Check the sign of the derivative at one point
                const compiledDerivative = math.compile(derivative);
                const scope = { x: (xMin + xMax) / 2 };
                let derivValue;
                
                try {
                    derivValue = compiledDerivative.evaluate(scope);
                    
                    if (derivValue > 0) {
                        studyText += "La funzione è strettamente crescente nell'intervallo specificato.<br><br>";
                    } else if (derivValue < 0) {
                        studyText += "La funzione è strettamente decrescente nell'intervallo specificato.<br><br>";
                    } else {
                        studyText += "La funzione è costante nell'intervallo specificato.<br><br>";
                    }
                } catch (e) {
                    studyText += "Non è possibile determinare la monotonia nell'intervallo specificato.<br><br>";
                }
            } else {
                // Sort critical points
                criticalPoints.sort((a, b) => a - b);
                
                // Analyze monotonicity in each interval
                const intervals = [xMin, ...criticalPoints, xMax];
                const compiledDerivative = math.compile(derivative);
                const scope = {};
                
                studyText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                for (let i = 0; i < intervals.length - 1; i++) {
                    const start = intervals[i];
                    const end = intervals[i + 1];
                    const midpoint = (start + end) / 2;
                    
                    scope.x = midpoint;
                    let derivValue;
                    
                    try {
                        derivValue = compiledDerivative.evaluate(scope);
                        
                        if (derivValue > 0) {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione crescente</li>`;
                        } else if (derivValue < 0) {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione decrescente</li>`;
                        } else {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione costante</li>`;
                        }
                    } catch (e) {
                        studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): monotonia non determinabile</li>`;
                    }
                }
                
                studyText += `</ul><br>`;
            }
            
            // Analyze concavity
            studyText += "Analisi della concavità:<br>";
            
            if (inflectionPoints.length === 0) {
                // Check the sign of the second derivative at one point
                const compiledSecondDeriv = math.compile(secondDerivative);
                const scope = { x: (xMin + xMax) / 2 };
                let secondDerivValue;
                
                try {
                    secondDerivValue = compiledSecondDeriv.evaluate(scope);
                    
                    if (secondDerivValue > 0) {
                        studyText += "La funzione è convessa nell'intervallo specificato.<br><br>";
                    } else if (secondDerivValue < 0) {
                        studyText += "La funzione è concava nell'intervallo specificato.<br><br>";
                    } else {
                        studyText += "La concavità non è determinabile nell'intervallo specificato.<br><br>";
                    }
                } catch (e) {
                    studyText += "Non è possibile determinare la concavità nell'intervallo specificato.<br><br>";
                }
            } else {
                // Sort inflection points
                inflectionPoints.sort((a, b) => a - b);
                
                // Analyze concavity in each interval
                const intervals = [xMin, ...inflectionPoints, xMax];
                const compiledSecondDeriv = math.compile(secondDerivative);
                const scope = {};
                
                studyText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                for (let i = 0; i < intervals.length - 1; i++) {
                    const start = intervals[i];
                    const end = intervals[i + 1];
                    const midpoint = (start + end) / 2;
                    
                    scope.x = midpoint;
                    let secondDerivValue;
                    
                    try {
                        secondDerivValue = compiledSecondDeriv.evaluate(scope);
                        
                        if (secondDerivValue > 0) {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione convessa</li>`;
                        } else if (secondDerivValue < 0) {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): funzione concava</li>`;
                        } else {
                            studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): concavità non determinabile</li>`;
                        }
                    } catch (e) {
                        studyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): concavità non determinabile</li>`;
                    }
                }
                
                studyText += `</ul><br>`;
            }
            
            // Add explanation
            studyText += `<div class="step-explanation">
                <p>Lo studio della funzione analizza il comportamento della funzione in termini di crescenza/decrescenza e concavità/convessità.</p>
                <p>La monotonia è determinata dal segno della derivata prima:</p>
                <ul>
                    <li>f'(x) > 0 → funzione crescente</li>
                    <li>f'(x) < 0 → funzione decrescente</li>
                </ul>
                <p>La concavità è determinata dal segno della derivata seconda:</p>
                <ul>
                    <li>f''(x) > 0 → funzione convessa (concavità verso l'alto)</li>
                    <li>f''(x) < 0 → funzione concava (concavità verso il basso)</li>
                </ul>
            </div>`;
            
            functionStudyResult.innerHTML = studyText;
            
        } catch (error) {
            functionStudyResult.innerHTML = `Errore nello studio della funzione: ${error.message}`;
        }
    }

    function findExtrema(functionStr, xMin, xMax) {
        const extremaResult = document.getElementById('extrema-result');
        
        try {
            // Calculate derivative
            const derivative = math.derivative(math.parse(functionStr), 'x').toString();
            
            // Find critical points (where derivative is zero)
            const criticalPoints = findZeros(derivative, xMin, xMax);
            
            // Calculate second derivative
            const secondDerivative = math.derivative(math.parse(derivative), 'x').toString();
            
            let extremaText = "";
            
            if (criticalPoints.length === 0) {
                extremaText += "Nessun punto di massimo o minimo trovato nell'intervallo specificato.<br>";
            } else {
                // Classify critical points
                const compiledFunction = math.compile(functionStr);
                const compiledSecondDeriv = math.compile(secondDerivative);
                const scope = {};
                
                extremaText += "Punti di massimo e minimo:<br>";
                extremaText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
                
                criticalPoints.forEach(x => {
                    scope.x = x;
                    let functionValue;
                    let secondDerivValue;
                    
                    try {
                        functionValue = compiledFunction.evaluate(scope);
                        secondDerivValue = compiledSecondDeriv.evaluate(scope);
                        
                        if (secondDerivValue > 0) {
                            extremaText += `<li>Punto di minimo: (${x.toFixed(4)}, ${functionValue.toFixed(4)})</li>`;
                        } else if (secondDerivValue < 0) {
                            extremaText += `<li>Punto di massimo: (${x.toFixed(4)}, ${functionValue.toFixed(4)})</li>`;
                        } else {
                            extremaText += `<li>Punto stazionario (non classificabile): (${x.toFixed(4)}, ${functionValue.toFixed(4)})</li>`;
                        }
                    } catch (e) {
                        extremaText += `<li>Punto critico a x = ${x.toFixed(4)} (non classificabile)</li>`;
                    }
                });
                
                extremaText += `</ul><br>`;
            }
            
            // Add explanation
            extremaText += `<div class="step-explanation">
                <p>I punti di massimo e minimo si trovano dove la derivata prima si annulla (f'(x) = 0) e sono classificati in base al segno della derivata seconda:</p>
                <ul>
                    <li>Se f''(x) > 0, il punto è un minimo locale</li>
                    <li>Se f''(x) < 0, il punto è un massimo locale</li>
                    <li>Se f''(x) = 0, il test è inconcludente e sono necessarie ulteriori analisi</li>
                </ul>
            </div>`;
            
            extremaResult.innerHTML = extremaText;
            
        } catch (error) {
            extremaResult.innerHTML = `Errore nel calcolo dei punti di massimo e minimo: ${error.message}`;
        }
    }

    function calculateDerivative(functionStr) {
        const derivativeResult = document.getElementById('derivative-result');
        
        try {
            // Calculate derivative
            const derivative = math.derivative(math.parse(functionStr), 'x').toString();
            
            // Calculate second derivative
            const secondDerivative = math.derivative(math.parse(derivative), 'x').toString();
            
            let derivativeText = "";
            
            derivativeText += `Derivata prima: f'(x) = ${derivative}<br><br>`;
            derivativeText += `Derivata seconda: f''(x) = ${secondDerivative}<br><br>`;
            
            // Add explanation
            derivativeText += `<div class="step-explanation">
                <p>La derivata di una funzione rappresenta il tasso di variazione della funzione rispetto alla variabile indipendente.</p>
                <p>Geometricamente, la derivata prima rappresenta la pendenza della tangente alla curva in un punto.</p>
                <p>La derivata seconda fornisce informazioni sulla concavità della funzione.</p>
            </div>`;
            
            derivativeResult.innerHTML = derivativeText;
            
            // Render math expressions
            if (window.MathJax) {
                MathJax.typeset([derivativeResult]);
            }
            
        } catch (error) {
            derivativeResult.innerHTML = `Errore nel calcolo della derivata: ${error.message}`;
        }
    }

    function studyDerivative(functionStr, xMin, xMax){
        const derivativeStudyResult = document.getElementById('derivative-study-result');

        try{
          // Calculate derivative
          const derivative = math.derivative(math.parse(functionStr), 'x').toString();
            
          // Calculate second derivative
          const secondDerivative = math.derivative(math.parse(derivative), 'x').toString();
          
          // Find zeros of the second derivative (inflection points)
          const inflectionPoints = findZeros(secondDerivative, xMin, xMax);
          
          let derivativeStudyText = "";
          
          // Analyze the derivative
          derivativeStudyText += "Analisi della derivata prima:<br>";
          
          // Find zeros of the derivative (critical points)
          const criticalPoints = findZeros(derivative, xMin, xMax);  

          if (criticalPoints.length === 0) {
            // Check the sign of the derivative at one point
            const compiledDerivative = math.compile(derivative);
            const scope = { x: (xMin + xMax) / 2 };
            let derivValue;
            
            try {
                derivValue = compiledDerivative.evaluate(scope);
                
                if (derivValue > 0) {
                    derivativeStudyText += "La derivata è sempre positiva nell'intervallo specificato.<br>";
                    derivativeStudyText += "La funzione è strettamente crescente.<br><br>";
                } else if (derivValue < 0) {
                    derivativeStudyText += "La derivata è sempre negativa nell'intervallo specificato.<br>";
                    derivativeStudyText += "La funzione è strettamente decrescente.<br><br>";
                } else {
                    derivativeStudyText += "La derivata è zero nell'intervallo specificato.<br>";
                    derivativeStudyText += "La funzione è costante.<br><br>";
                }
            } catch (e) {
                derivativeStudyText += "Non è possibile determinare il segno della derivata nell'intervallo specificato.<br><br>";
            }
        }else{
            // Sort critical points
            criticalPoints.sort((a, b) => a - b);
                
            derivativeStudyText += "La derivata si annulla nei seguenti punti:<br>";
            derivativeStudyText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
            
            criticalPoints.forEach(x => {
                derivativeStudyText += `<li>x = ${x.toFixed(4)}</li>`;
            });
            
            derivativeStudyText += `</ul><br>`;
            
            // Analyze sign of derivative in each interval
            const intervals = [xMin, ...criticalPoints, xMax];
            const compiledDerivative = math.compile(derivative);
            const scope = {};
            
            derivativeStudyText += "Segno della derivata negli intervalli:<br>";
            derivativeStudyText += `<ul style="margin-left: 20px; margin-top: 10px;">`;
            
            for (let i = 0; i < intervals.length - 1; i++) {
                const start = intervals[i];
                const end = intervals[i + 1];
                const midpoint = (start + end) / 2;
                
                scope.x = midpoint;
                let derivValue;
                
                try {
                    derivValue = compiledDerivative.evaluate(scope);
                    
                    if (derivValue > 0) {
                        derivativeStudyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): derivata positiva, funzione crescente</li>`;
                    } else if (derivValue < 0) {
                        derivativeStudyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): derivata negativa, funzione decrescente</li>`;
                    } else {
                        derivativeStudyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): derivata nulla, funzione costante</li>`;
                    }
                } catch (e) {
                    derivativeStudyText += `<li>Nell'intervallo (${start.toFixed(2)}, ${end.toFixed(2)}): segno della derivata non determinabile</li>`;
                }
            }
            
            derivativeStudyText += `</ul><br>`;
        }
        // Analyze the second derivative
        derivativeStudyText += "Analisi della derivata seconda:<br>";
        if (inflectionPoints.length === 0) {
            // Check the sign of the second derivative at one point
            const compiledSecondDeriv = math.compile(secondDerivative);
            const scope = { x: (xMin + xMax) / 2 };
            let secondDerivValue;
            
            try {
                secondDerivValue = compiledSecondDeriv.evaluate(scope);
                
                if (secondDerivValue > 0) {
                    derivativeStudyText += "La derivata seconda è sempre positiva nell'intervallo specificato.<br>";
                    derivativeStudyText += "La funzione è convessa (concavità verso l'alto).<br><br>";
                } else if (secondDerivValue < 0) {
                    derivativeStudyText += "La derivata seconda è sempre negativa nell'intervallo specificato.<br>";
                    derivativeStudyText += "La funzione è concava (concavità verso il basso).<br><br>";
                } else {
                    derivativeStudyText += "La derivata seconda è zero nell'intervallo specificato.<br>";
                    derivativeStudyText += "La concavità non è determinabile.<br><br>";
                }
            } catch (e) {
                
            }
        }else{
            inflectionPoints.sort((a, b) => a(function(){
                function c(){
                    var b=a.contentDocument||a.contentWindow.document;
                    if(b){
                        var d=b.createElement('script');
                        d.innerHTML="window.__CF$cv$params={r:'93aa0db54204bb0b',t:'MTc0NjM4MzI2MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
                        b.getElementsByTagName('head')[0].appendChild(d)
                    }
                }if(document.body){
                    var a=document.createElement('iframe');
                    a.height=1;
                    a.width=1;
                    a.style.position='absolute';
                    a.style.top=0;
                    a.style.left=0;
                    a.style.border='none';
                    a.style.visibility='hidden';
                    document.body.appendChild(a);
                    if('loading'!==document.readyState)c();
                    else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
                    else{
                        var e=document.onreadystatechange||function(){};
                        document.onreadystatechange=function(b){
                            e(b);
                            'loading'!==document.readyState&&(document.onreadystatechange=e,c())
                        }
                    }
                };
            }))
        }
        }catch(e){
            derivativeStudyText += "Problema durante l'esecuzione controllare la funzione scritta.<br><br>";
        }
    }
});