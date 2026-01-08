const SORT_KEYS = {
  RANDOM: 'random',
  DEFAULT: 'alg'
};

const sortState = {
  sortKey: SORT_KEYS.DEFAULT,
  ascending: true
};

const collator = new Intl.Collator(undefined, { 
  numeric: true, 
  sensitivity: 'base' 
});

// Cache variables that will be populated on init
let container, items, sortButtons, filterGroups;

function init() {
  container = document.getElementById("algContainer");
  items = Array.from(container.children);
  sortButtons = document.querySelectorAll(".sort-btn");
  filterGroups = document.querySelectorAll(".filter-group");

  getSessionStorage();
  initFilters();
  bindEvents();
  
  performSort();
  syncVisibility();
  
  const activeBtn = Array.from(sortButtons).find(btn => btn.dataset.sortKey === sortState.sortKey);
  if (activeBtn) updateSortIcons(activeBtn);
}

/**
 * Persistence Logic
 */
function getStorageKey(suffix) {
  return `${window.location.pathname}_${suffix}`;
}

const STORAGE_KEYS = {
  SORT: getStorageKey('sort_state'),
  FILTER: getStorageKey('filter_state')
}
function getSessionStorage() {
  const savedSort = sessionStorage.getItem(STORAGE_KEYS.SORT);
  if (savedSort) {
    Object.assign(sortState, JSON.parse(savedSort));
  }
}

function setSessionStorage() {
  sessionStorage.setItem(STORAGE_KEYS.SORT, JSON.stringify(sortState));
  
  const filterState = Array.from(filterGroups).map(group => ({
    key: group.dataset.filterKey,
    checked: getCheckedValues(group)
  }));
  sessionStorage.setItem(STORAGE_KEYS.FILTER, JSON.stringify(filterState));
}

/**
 * Initialization Logic
 */
function initFilters() {
  const savedFilters = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.FILTER) || "[]");

  filterGroups.forEach(group => {
    const key = group.dataset.filterKey;
    const values = getUniqueValues(key);
    const savedForGroup = savedFilters.find(f => f.key === key)?.checked;

    const checkboxesHtml = values.map(val => {
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
    group.addEventListener('change', () => {
      syncVisibility();
      setSessionStorage();
    });

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
  
  if (sortState.sortKey !== SORT_KEYS.RANDOM) {
    activeBtn.dataset.dir = sortState.ascending ? "asc" : "desc";
  }
}

function toggleGroupCheckboxes(group, shouldCheck) {
  group.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = shouldCheck;
  });
}

function performSort() {
  if (sortState.sortKey === SORT_KEYS.RANDOM) {
    shuffleItems();
  } else {
    items.sort((a, b) => {
      const valA = a.dataset[sortState.sortKey] || "";
      const valB = b.dataset[sortState.sortKey] || "";
      return sortState.ascending 
        ? collator.compare(valA, valB) 
        : collator.compare(valB, valA);
    });
  }
  applyOrder();
}

function shuffleItems() {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
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

init();
