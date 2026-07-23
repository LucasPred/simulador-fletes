// Matriz base oficial FADEEAC - Junio 2026
const costMatrix = [
    { name: "Peajes", weight: 2.16, increase: 3.09 },
    { name: "Lubricantes", weight: 2.50, increase: 4.00 },
    { name: "Seguros", weight: 4.26, increase: 1.00 },
    { name: "Gastos Generales", weight: 4.49, increase: 2.06 },
    { name: "Costo Financiero", weight: 5.11, increase: 1.76 },
    { name: "Reparaciones", weight: 5.21, increase: 3.02 },
    { name: "Neumáticos", weight: 8.35, increase: 2.96 },
    { name: "Material Rodante", weight: 12.23, increase: 1.69 },
    { name: "Patentes y Tasas", weight: 3.61, increase: 0.00 },
    { name: "Otros Rubros (Personal/Combustible)", weight: 52.08, increase: 2.46 }
];

// Captura de variables en pantalla
const baseBudgetInput = document.getElementById('baseBudget');
const routeSelect = document.getElementById('routeSelect');
const realTonsInput = document.getElementById('realTons');
const agreedRateInput = document.getElementById('agreedRate');
const costTableBody = document.getElementById('costTableBody');
const kpiPrevision = document.getElementById('kpiPrevision');
const kpiFadeeac = document.getElementById('kpiFadeeac');
const kpiDeviation = document.getElementById('kpiDeviation');

// Formato de moneda local (Pesos Argentinos)
const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
});

function calculateMetrics() {
    const baseBudget = parseFloat(baseBudgetInput.value) || 0;
    let totalPrevision = 0;
    costTableBody.innerHTML = '';
    
    // Renderizado de filas de costos
    costMatrix.forEach(item => {
        const itemExpense = (baseBudget * item.weight) / 100;
        const itemPrevision = (itemExpense * item.increase) / 100;
        totalPrevision += itemPrevision;

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-700/30 transition-colors";
        row.innerHTML = `
            <td class="p-4 font-sans text-slate-300">${item.name}</td>
            <td class="p-4 text-center text-slate-400">${item.weight.toFixed(2)}%</td>
            <td class="p-4 text-right">${formatter.format(itemExpense)}</td>
            <td class="p-4 text-center text-emerald-400">+${item.increase.toFixed(2)}%</td>
            <td class="p-4 text-right text-amber-400 font-bold">${formatter.format(itemPrevision)}</td>
        `;
        costTableBody.appendChild(row);
    });

    // Fila de sumatoria final
    const totalRow = document.createElement('tr');
    totalRow.className = "bg-slate-900/80 font-bold border-t border-slate-600";
    totalRow.innerHTML = `
        <td class="p-4 font-sans text-white">TOTAL GENERAL MATRIZ</td>
        <td class="p-4 text-center text-white">100.00%</td>
        <td class="p-4 text-right text-white">${formatter.format(baseBudget)}</td>
        <td class="p-4 text-center text-emerald-400">+1.81%</td>
        <td class="p-4 text-right text-amber-400 text-base">${formatter.format(totalPrevision)}</td>
    `;
    costTableBody.appendChild(totalRow);

    // Lógica para revisar desvíos de tarifas comerciales
    const selectedOption = routeSelect.options[routeSelect.selectedIndex];
    const fadeeacRatePerTon = parseFloat(selectedOption.getAttribute('data-tn'));
    const tons = parseFloat(realTonsInput.value) || 0;
    const agreedRate = parseFloat(agreedRateInput.value) || 0;

    const totalFadeeacRefValue = fadeeacRatePerTon * tons;
    const totalAgreedValue = agreedRate * tons;
    const rateDeviation = totalAgreedValue - totalFadeeacRefValue;

    // Actualización de KPIs interactivos en pantalla
    kpiPrevision.innerText = formatter.format(totalPrevision);
    kpiFadeeac.innerText = formatter.format(totalFadeeacRefValue);
    kpiDeviation.innerText = formatter.format(rateDeviation);
    
    // Alerta visual de desvíos (Verde: OK / Rojo: Pérdida o tarifa baja)
    if (rateDeviation >= 0) {
        kpiDeviation.className = "text-2xl font-black text-emerald-400 font-mono mt-1";
    } else {
        kpiDeviation.className = "text-2xl font-black text-rose-500 font-mono mt-1";
    }
}

// Monitoreo de cambios en tiempo real
[baseBudgetInput, routeSelect, realTonsInput, agreedRateInput].forEach(element => {
    element.addEventListener('input', calculateMetrics);
    element.addEventListener('change', calculateMetrics);
});

// Ejecución inicial
calculateMetrics();
