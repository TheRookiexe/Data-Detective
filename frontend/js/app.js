const menuItems = document.querySelectorAll('.menu-item');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('real-file-input');
const fileNameDisplay = document.getElementById('selected-file-name');
const fileDelBtn = document.getElementById('delete-file-btn');
const submitBtn = document.getElementById('submit-btn');

// overview render vars
const overviewDiv = document.getElementById('overview-div');
const fileName = document.getElementById('file-name');
const rows = document.getElementById('row');
const columns = document.getElementById('columns');
const numeric = document.getElementById('num');
const text_type = document.getElementById('str');
const tableBody = document.getElementById("dataTypesBody");

// Quality render vars
const qualityDiv = document.getElementById('quality-div');
const completenessPct = document.getElementById('completness-pct');
const duplicatedRows = document.getElementById('duplicated-rows');
const memoryUsage = document.getElementById('memory-usage');
const missingValTableBody = document.getElementById('missing-values-body');

// findings render vars
const findingsDiv = document.getElementById('findings-div');
const completenessPctIns = document.getElementById('completeness-pct-ins');
const duplicatedRowsIns = document.getElementById('duplicated-rows-ins');
const missingValsIns = document.getElementById('missing-vals-ins');
const numericColsIns = document.getElementById('numeric-cols-ins');

// recommendations render vars
const recommendationsDiv = document.getElementById('recommendations-div');
const suggestionsContainer = document.getElementById('suggestions-container');

// visualizations render var 
const visualizationsDiv = document.getElementById('visualizations-div');
const visCont = document.getElementById('vis-div');


uploadBtn.addEventListener('click', function(){
    fileInput.click();
});

fileInput.addEventListener('change', function(e){
    if (fileInput.files.length>0){
        e.stopPropagation();
        // console.log(fileInput.files);
        fileNameDisplay.textContent = ' Selected: '+fileInput.files[0].name;
        fileNameDisplay.style.display = 'block';
        fileDelBtn.style.display = 'block';
        submitBtn.style.display = 'inline-flex'

    } else {
        resetFileSection();
    }   
});

fileDelBtn.addEventListener('click', function(e){
    e.stopPropagation();
    resetFileSection();
})

let analysisResult = null;
submitBtn.addEventListener('click', async(e)=>{
    e.stopPropagation();
    if (fileInput.files.length === 0) {
        return;
    }
    submitBtn.disabled = true;
    const formInput = new FormData();
    formInput.append('file', fileInput.files[0])
    submitBtn.textContent = "ANALYZING...";
    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            body: formInput
        });

        if (!response.ok) {
            throw new Error(`Http Error: ${response.status}`);
        }

        const result = await response.json();
        analysisResult = result;
        const numeric_col_count = analysisResult.findings.data.numeric_columns_percentage.count
        
        // console.log("this is response:");
        // console.log(result);

        submitBtn.textContent = "ANALYZED";
        renderOverview(analysisResult.overview, numeric_col_count);
        renderQuality(analysisResult.quality);
        renderFindings(analysisResult.findings);
        renderRecommendations(analysisResult.recommendations);
        renderVisualizations(analysisResult.visualizations);

    } catch (error) {

        console.error(error);
        submitBtn.textContent = "FAILED";

    } finally {

        submitBtn.disabled = false;

    }
    
});

function renderOverview(overview, numeric_col_count){
    overviewDiv.style.display = 'block';
    // console.log(overview);
    const totalColumns = overview.columns ?? 0;
    fileName.textContent = overview.filename || 'N/A';
    rows.textContent = overview.rows ?? 0;
    columns.textContent = totalColumns;
    numeric.textContent = numeric_col_count;
    text_type.textContent = (totalColumns-numeric_col_count);
    
    //columns table render 
    if (!tableBody) return;
    tableBody.innerHTML = "";
    const dataTypes = overview.data_types;
    console.log(dataTypes);
    dataTypes.forEach((item) => {
        const tr = document.createElement("tr");

        const colTd = document.createElement("td");
        colTd.textContent = item.column ?? 'N/A';

        const typeTd = document.createElement("td");
        typeTd.textContent = item.data_type ?? 'N/A';

        tr.appendChild(colTd);
        tr.appendChild(typeTd);
        tableBody.appendChild(tr);
    });

    overviewDiv.scrollIntoView({
        behavior: "smooth"
    });

}

function renderQuality(quality){
    qualityDiv.style.display = 'block';
    // console.log(quality);
    completenessPct.textContent = quality.dataset_completeness ?? 0;
    duplicatedRows.textContent = quality.duplicated_rows ?? 0;
    memoryUsage.textContent = quality.memory_usage_mb+' MB' ?? 0;
    
    // missing value table render
    if (!missingValTableBody) return;
    missingValTableBody.innerHTML = "";
    const missingVals = quality.missing_values;
    missingVals.forEach((item) => {
        const tr = document.createElement('tr');

        const colTd = document.createElement('td');
        colTd.textContent = item.column ?? 'N/A';

        const missingTd = document.createElement('td');
        missingTd.textContent = item.missing ?? 'N/A';

        const pctTd = document.createElement('td');
        pctTd.textContent = item.percentage ?? 'N/A';

        if(item.percentage>70){
            tr.style.backgroundColor = '#D0342C';
        }

        if(item.percentage>10 && item.percentage<70){
            tr.style.backgroundColor = 'orange'
        }

        tr.appendChild(colTd);
        tr.appendChild(missingTd);
        tr.appendChild(pctTd);
        missingValTableBody.appendChild(tr);
    });

}   

function renderFindings(findings){
    findingsDiv.style.display = 'block';
    // console.log(findings.insights);
    completenessPctIns.textContent = findings.insights[0] ?? 'N/A';
    duplicatedRowsIns.textContent = findings.insights[1] ?? 'N/A';
    missingValsIns.textContent = findings.insights[2] ?? 'N/A';
    numericColsIns.textContent = findings.insights[3] ?? 'N/A';
}

function renderRecommendations(recommendations){
    recommendationsDiv.style.display = 'block';
    // console.log(recommendations.suggestions);
    reccs = recommendations.suggestions;
    suggestionsContainer.innerHTML = "";
    reccs.forEach((item) => {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.id = 'suggestion-div';
        const recImg = document.createElement('img');
        recImg.id = 'recc-img';
        recImg.src = '../assets/icons/lightbulb-solid-full.svg'
        const recPara = document.createElement('p');
        recPara.id = 'recc-para';
        recPara.textContent = item ?? 'N/A';

        suggestionsContainer.appendChild(suggestionsDiv);
        suggestionsDiv.appendChild(recImg);
        suggestionsDiv.appendChild(recPara);
    });

}

function renderVisualizations(visualizations) {

    visualizationsDiv.style.display = 'block';

    if (!visCont) return;

    visCont.innerHTML = "";

    visualizations.vis.forEach((visualization) => {

        if (visualization.type === "histogram") {

            renderHistogram(visCont, visualization);

        } else if (visualization.type === "bar") {

            renderBarChart(visCont, visualization);

        } else if (visualization.type === "identifier") {

            renderIdentifier(visCont, visualization);

        } else if (visualization.type === "high_cardinality") {

            renderHighCardinality(visCont, visualization);
        }
    });
}


function renderHistogram(visCont, visualization) {

    const card = document.createElement("div");
    card.className = "visualization-card";

    const header = document.createElement("div");
    header.className = "visualization-header";

    const title = document.createElement("p");
    title.className = "visualization-title";
    title.textContent = visualization.column;

    const type = document.createElement("span");
    type.className = "visualization-type";
    type.textContent = "Histogram";

    header.appendChild(title);
    header.appendChild(type);

    const meta = document.createElement("p");
    meta.className = "visualization-meta";
    meta.textContent = `${visualization.unique_values} unique values`;

    const chart = document.createElement("div");
    chart.className = "visualization-chart";

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(chart);

    visCont.appendChild(card);

    const trace = {
        x: visualization.data.bins,
        y: visualization.data.counts,
        type: "bar"
    };

    const layout = {
        title: "Distribution",
        xaxis: {
            title: visualization.column
        },
        yaxis: {
            title: "Frequency"
        },
        margin: {
            t: 50,
            r: 20,
            b: 60,
            l: 60
        },
        autosize: true
    };

    Plotly.newPlot(chart, [trace], layout, {
        responsive: true,
        displayModeBar: false
    });
}


function renderBarChart(visCont, visualization) {

    const card = document.createElement("div");
    card.className = "visualization-card";

    const header = document.createElement("div");
    header.className = "visualization-header";

    const title = document.createElement("p");
    title.className = "visualization-title";
    title.textContent = visualization.column;

    const type = document.createElement("span");
    type.className = "visualization-type";
    type.textContent = "Bar Chart";

    header.appendChild(title);
    header.appendChild(type);

    const meta = document.createElement("p");
    meta.className = "visualization-meta";
    meta.textContent = `${visualization.unique_values} unique values`;

    const chart = document.createElement("div");
    chart.className = "visualization-chart";

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(chart);

    visCont.appendChild(card);

    const trace = {
        x: visualization.data.labels,
        y: visualization.data.values,
        type: "bar"
    };

    const layout = {
        title: "Distribution",
        xaxis: {
            title: visualization.column
        },
        yaxis: {
            title: "Count"
        },
        margin: {
            t: 50,
            r: 20,
            b: 70,
            l: 60
        },
        autosize: true
    };

    Plotly.newPlot(chart, [trace], layout, {
        responsive: true,
        displayModeBar: false
    });
}


function renderIdentifier(visCont, visualization) {

    const card = document.createElement("div");

    card.className = "visualization-card";

    card.innerHTML = `
        <div class="visualization-header">

            <p class="visualization-title">
                ${visualization.column}
            </p>

            <span class="visualization-type">
                Identifier
            </span>

        </div>

        <p class="visualization-meta">
            ${visualization.unique_values} unique values
        </p>

        <div class="visualization-info">

            <p class="visualization-info-title">
                Identifier column
            </p>

            <p class="visualization-info-text">
                This column appears to be an identifier
                and is not suitable for visualization.
            </p>

        </div>
    `;

    visCont.appendChild(card);
}


function renderHighCardinality(visCont, visualization) {

    const card = document.createElement("div");

    card.className = "visualization-card";

    card.innerHTML = `
        <div class="visualization-header">

            <p class="visualization-title">
                ${visualization.column}
            </p>

            <span class="visualization-type">
                High Cardinality
            </span>

        </div>

        <p class="visualization-meta">
            ${visualization.unique_values} unique values
        </p>

        <div class="visualization-info">

            <p class="visualization-info-title">
                Too many unique values
            </p>

            <p class="visualization-info-text">
                A standard chart may be difficult
                to interpret for this column.
            </p>

        </div>
    `;

    visCont.appendChild(card);
}


// helper functions
function resetFileSection(){
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileDelBtn.style.display = 'none';
    fileNameDisplay.style.display = 'none';
    submitBtn.style.display = 'none';
    qualityDiv.style.display = 'none';
    overviewDiv.style.display = 'none';
}


const sections = document.querySelectorAll('#home-div, #overview-div, #quality-div, #findings-div, #recommendations-div, #visualizations-div');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        let targetId = this.textContent.trim().toLowerCase() + '-div';
        
        if (targetId === 'welcome-div') {
            targetId = 'home-div';
        }

        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const observerOptions = {
    root: null, 
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.id;
            menuItems.forEach(item => {
                const itemText = item.textContent.trim().toLowerCase();
                const isMatch = (currentId === 'home-div' && itemText === 'welcome') || 
                                (currentId === `${itemText}-div`);

                if (isMatch) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));