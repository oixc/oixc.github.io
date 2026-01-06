// Configuration & State
const sortState = {
  sortKey: 'alg',
  ascending: true
};

const collator = new Intl.Collator(undefined, { 
  numeric: true, 
  sensitivity: 'base' 
});

// Cache variables that will be populated on init
let container, items, sortButtons, filterGroups;

function init() {
  // 1. Map the DOM elements
  container = document.getElementById("algContainer");
  items = Array.from(container.children);
  sortButtons = document.querySelectorAll(".sort-btn");
  filterGroups = document.querySelectorAll(".filter-group");

  // 2. Setup UI
  initFilters();
  bindEvents();
  performSort();
  syncVisibility();
}

function initFilters() {
  filterGroups.forEach(group => {
    const key = group.dataset.filterKey;
    const values = getUniqueValues(key);
    group.insertAdjacentHTML('beforeend', renderCheckboxes(values));
  });
}

function getUniqueValues(key) {
  return [...new Set(items.map(el => el.dataset[key]))].sort();
}

function renderCheckboxes(values) {
  return values.map(val => `
    <label>
      <input type="checkbox" value="${val}" checked>
      ${val}
    </label>
  `).join('');
}

function bindEvents() {
  bindSortEvents();
  bindFilterEvents();
}

function bindSortEvents() {
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => handleSortClick(btn));
  });
}

function bindFilterEvents() {
  filterGroups.forEach(group => {
    group.addEventListener('change', syncVisibility);
  });
}

function handleSortClick(btn) {
  const newKey = btn.dataset.sortKey;
  updateSortState(newKey);
  updateSortIcons(btn);
  performSort();
  syncVisibility();
}

function updateSortState(newKey) {
  if (sortState.sortKey === newKey) {
    sortState.ascending = !sortState.ascending;
  } else {
    sortState.sortKey = newKey;
    sortState.ascending = true;
  }
}

function updateSortIcons(activeBtn) {
  sortButtons.forEach(btn => delete btn.dataset.dir);
  activeBtn.dataset.dir = sortState.ascending ? "asc" : "desc";
}

function performSort() {
  items.sort((a, b) => {
    const valA = a.dataset[sortState.sortKey] || "";
    const valB = b.dataset[sortState.sortKey] || "";
    return sortState.ascending 
      ? collator.compare(valA, valB) 
      : collator.compare(valB, valA);
  });
  
  applyOrder();
}

function applyOrder() {
  items.forEach((el, index) => {
    el.style.order = index;
  });
}

function syncVisibility() {
  items.forEach(el => {
    el.hidden = !matchesAllFilters(el);
  });
}

function matchesAllFilters(el) {
  return Array.from(filterGroups).every(group => {
    const key = group.dataset.filterKey;
    const activeValues = getCheckedValues(group);
    return activeValues.includes(el.dataset[key]);
  });
}

function getCheckedValues(group) {
  return Array.from(group.querySelectorAll('input:checked'))
    .map(cb => cb.value);
}

// Start the application
init();
