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
  getSessionStorage();
  initFilters();
  bindEvents();
  
  // 3. Initial Render
  performSort();
  syncVisibility();
  
  // Update icons if sort was loaded from storage
  const activeBtn = Array.from(sortButtons).find(btn => btn.dataset.sortKey === sortState.sortKey);
  if (activeBtn) updateSortIcons(activeBtn);
}

/**
 * Persistence Logic
 */
function getSessionStorage() {
  const savedSort = sessionStorage.getItem('sortState');
  if (savedSort) {
    Object.assign(sortState, JSON.parse(savedSort));
  }
}

function setSessionStorage() {
  sessionStorage.setItem('sortState', JSON.stringify(sortState));
  
  const filterState = Array.from(filterGroups).map(group => ({
    key: group.dataset.filterKey,
    checked: getCheckedValues(group)
  }));
  sessionStorage.setItem('filterState', JSON.stringify(filterState));
}

/**
 * Initialization Logic
 */
function initFilters() {
  const savedFilters = JSON.parse(sessionStorage.getItem('filterState') || "[]");

  filterGroups.forEach(group => {
    const key = group.dataset.filterKey;
    const values = getUniqueValues(key);
    const savedForGroup = savedFilters.find(f => f.key === key)?.checked;

    const checkboxesHtml = values.map(val => {
      // Respect saved state, otherwise default to checked
      const isChecked = savedForGroup ? savedForGroup.includes(val) : true;
      return renderCheckbox(val, isChecked);
    }).join('');

    group.insertAdjacentHTML('beforeend', checkboxesHtml);
  });
}

function getUniqueValues(key) {
  return [...new Set(items.map(el => el.dataset[key]))].sort();
}

function renderCheckbox(val, isChecked) {
  return `
    <label>
      <input type="checkbox" value="${val}" ${isChecked ? 'checked' : ''}>
      ${val}
    </label>
  `;
}

/**
 * Event Binding
 */
function bindEvents() {
  bindSortEvents();
  bindFilterEvents();
}

function bindSortEvents() {
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      handleSortClick(btn);
      setSessionStorage();
    });
  });
}

function bindFilterEvents() {
  filterGroups.forEach(group => {
    // Listen for checkbox changes
    group.addEventListener('change', () => {
      syncVisibility();
      setSessionStorage();
    });

    // Listen for All/None button clicks (Event Delegation)
    group.addEventListener('click', (e) => {
      const action = e.target.dataset.selectAction;
      if (!action) return;

      toggleGroupCheckboxes(group, action === 'all');
      syncVisibility();
      setSessionStorage();
    });
  });
}

/**
 * Sorting & Filtering Logic
 */
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

function toggleGroupCheckboxes(group, shouldCheck) {
  group.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = shouldCheck;
  });
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
