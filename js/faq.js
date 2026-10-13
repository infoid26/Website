"use strict";

const faqSearchInput = document.getElementById("faq-search");
const faqResetButton = document.getElementById("faq-reset");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const faqSections = Array.from(document.querySelectorAll(".faq-section"));
const faqFilterButtons = Array.from(document.querySelectorAll(".faq-filter"));
const faqResultsCount = document.getElementById("faq-results-count");
const faqEmptyState = document.getElementById("faq-empty");
let faqSelectedCategory = "all";

function normalizeFaqText(text) {
    return text.toLocaleLowerCase("ro").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function updateFaqResults() {
    const searchText = normalizeFaqText(faqSearchInput.value);
    let visibleCount = 0;

    for (const item of faqItems) {
        const matchesCategory = faqSelectedCategory === "all" || item.dataset.category === faqSelectedCategory;
        const matchesText = normalizeFaqText(item.textContent).includes(searchText);
        item.hidden = !(matchesCategory && matchesText);
        if (!item.hidden) visibleCount++;
    }

    for (const section of faqSections) {
        section.hidden = !Array.from(section.querySelectorAll(".faq-item")).some(item => !item.hidden);
    }

    faqResultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? "întrebare afișată" : "întrebări afișate"}`;
    faqEmptyState.hidden = visibleCount !== 0;
    faqResetButton.hidden = faqSearchInput.value.length === 0;
}

faqSearchInput.addEventListener("input", updateFaqResults);
faqResetButton.addEventListener("click", function () {
    faqSearchInput.value = "";
    updateFaqResults();
    faqSearchInput.focus();
});

for (const button of faqFilterButtons) {
    button.addEventListener("click", function () {
        faqSelectedCategory = button.dataset.filter;
        for (const filterButton of faqFilterButtons) {
            const isActive = filterButton === button;
            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        }
        updateFaqResults();
    });
}

updateFaqResults();
