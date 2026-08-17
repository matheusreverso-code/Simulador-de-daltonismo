/*
  Simulador de Daltonismo — JavaScript puro para VS Code
  Sem framework, sem npm e sem backend.
*/

const colorPalette = [
  { name: "Vermelho", hex: "#FF0000" },
  { name: "Verde", hex: "#00FF00" },
  { name: "Azul", hex: "#0000FF" },
  { name: "Amarelo", hex: "#FFFF00" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Ciano", hex: "#00FFFF" },
  { name: "Laranja", hex: "#FFA500" },
  { name: "Rosa", hex: "#FFC0CB" }
];

const colorBlindnessTypes = [
  {
    id: "normal",
    name: "Visão Normal",
    description: "Como a maioria das pessoas enxerga as cores.",
    prevalence: "Referência geral",
    filterId: "none"
  },
  {
    id: "protanopia",
    name: "Protanopia",
    description: "Deficiência de vermelho: dificuldade para diferenciar vermelho, verde e amarelo.",
    prevalence: "Cerca de 1% dos homens",
    filterId: "filter-protanopia"
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    description: "Deficiência de verde: altera principalmente a percepção de verdes e vermelhos.",
    prevalence: "Cerca de 1% dos homens",
    filterId: "filter-deuteranopia"
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    description: "Deficiência de azul: dificulta a diferenciação entre azul, verde e amarelo.",
    prevalence: "Forma rara, em homens e mulheres",
    filterId: "filter-tritanopia"
  },
  {
    id: "achromatopsia",
    name: "Acromatopsia",
    description: "Monocromacia completa: percepção sem cores, em escala de cinza.",
    prevalence: "Forma muito rara",
    filterId: "filter-achromatopsia"
  },
  {
    id: "protanomaly",
    name: "Protanomalia",
    description: "Anomalia leve de vermelho: uma forma menos intensa de protanopia.",
    prevalence: "Cerca de 0,6% dos homens",
    filterId: "filter-protanomaly"
  },
  {
    id: "deuteranomaly",
    name: "Deuteranomalia",
    description: "Anomalia leve de verde: uma forma menos intensa de deuteranopia.",
    prevalence: "Cerca de 0,4% dos homens",
    filterId: "filter-deuteranomaly"
  },
  {
    id: "tritanomaly",
    name: "Tritanomalia",
    description: "Anomalia leve de azul: uma forma menos intensa de tritanopia.",
    prevalence: "Forma muito rara",
    filterId: "filter-tritanomaly"
  },
  {
    id: "achromatomaly",
    name: "Acromatomalia",
    description: "Monocromacia incompleta: percepção de cores reduzida, mas não ausente.",
    prevalence: "Forma rara",
    filterId: "filter-achromatomaly"
  }
];

const typeGrid = document.querySelector("#typeGrid");
const originalPalette = document.querySelector("#originalPalette");
const simulatedPalette = document.querySelector("#simulatedPalette");
const simulatedBlock = document.querySelector("#simulatedBlock");
const simulatedTypeLabel = document.querySelector("#simulatedTypeLabel");
const selectedTitle = document.querySelector("#selectedTitle");
const selectedDescription = document.querySelector("#selectedDescription");
const selectedPrevalence = document.querySelector("#selectedPrevalence");
const simulateButton = document.querySelector("#simulateButton");
const resetButton = document.querySelector("#resetButton");
const simulationStatus = document.querySelector("#simulationStatus");

let selectedType = colorBlindnessTypes[0];

function createSwatch(color) {
  const swatch = document.createElement("article");
  swatch.className = "swatch";
  swatch.innerHTML = `
    <div class="swatch-color" style="background-color: ${color.hex}" aria-label="Amostra ${color.name}"></div>
    <div class="swatch-copy">
      <span class="swatch-name">${color.name}</span>
      <span class="swatch-hex">${color.hex}</span>
    </div>
  `;
  return swatch;
}

function renderPalette(container) {
  container.replaceChildren(...colorPalette.map(createSwatch));
}

function renderTypeCards() {
  typeGrid.replaceChildren(
    ...colorBlindnessTypes.map((type) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "type-card";
      button.dataset.typeId = type.id;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `
        <span>
          <strong>${type.name}</strong>
          <span>${type.description}</span>
        </span>
        <span class="card-meta"><span aria-hidden="true">◉</span>${type.prevalence}</span>
      `;
      button.addEventListener("click", () => selectType(type.id));
      return button;
    })
  );
}

function selectType(typeId) {
  selectedType = colorBlindnessTypes.find((type) => type.id === typeId) || colorBlindnessTypes[0];

  document.querySelectorAll(".type-card").forEach((card) => {
    const isSelected = card.dataset.typeId === selectedType.id;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });

  selectedTitle.textContent = selectedType.name;
  selectedDescription.textContent = selectedType.description;
  selectedPrevalence.textContent = selectedType.prevalence;
  simulatedTypeLabel.textContent = selectedType.name;
  simulationStatus.textContent = `Você selecionou ${selectedType.name}. Clique em “Clique e veja” para aplicar a simulação.`;

  if (!simulatedBlock.hidden) {
    applySimulation();
  }
}

function applySimulation() {
  simulatedPalette.style.filter = selectedType.filterId === "none" ? "none" : `url(#${selectedType.filterId})`;
  simulatedBlock.hidden = false;
  simulateButton.hidden = true;
  resetButton.hidden = false;
  simulationStatus.textContent = `Simulação ativa: ${selectedType.name}. Compare os nomes e os códigos hexadecimais com as amostras transformadas.`;
}

function resetSimulation() {
  simulatedPalette.style.filter = "none";
  simulatedBlock.hidden = true;
  simulateButton.hidden = false;
  resetButton.hidden = true;
  simulationStatus.textContent = `Selecione um tipo e clique em “Clique e veja” para aplicar a simulação.`;
}

renderTypeCards();
renderPalette(originalPalette);
renderPalette(simulatedPalette);
selectType("normal");
resetButton.hidden = true;
simulateButton.addEventListener("click", applySimulation);
resetButton.addEventListener("click", resetSimulation);
