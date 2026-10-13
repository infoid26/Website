"use strict";

const faqSearchInput = document.getElementById("faq-search");
const faqResetButton = document.getElementById("faq-reset");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const faqSections = Array.from(document.querySelectorAll(".faq-section"));
const faqResultsCount = document.getElementById("faq-results-count");
const faqEmptyState = document.getElementById("faq-empty");

// Numbers are presentation only: restart at 01 for every category.
// IDs are stable and independent of the order of the questions.
function numberFaqQuestions() {
    for (const section of faqSections) {
        section.querySelectorAll(".faq-item").forEach((item, index) => {
            const numberElement = item.querySelector(".faq-number");
            if (numberElement) numberElement.textContent = String(index + 1).padStart(2, "0");
        });
    }
}

function normalizeFaqText(text) {
    return text.toLocaleLowerCase("ro").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function updateFaqResults() {
    const searchText = normalizeFaqText(faqSearchInput.value);
    let visibleCount = 0;

    for (const item of faqItems) {
        const matchesText = normalizeFaqText(item.textContent).includes(searchText);
        item.hidden = !matchesText;
        if (!item.hidden) visibleCount++;
    }

    for (const section of faqSections) {
        section.hidden = !Array.from(section.querySelectorAll(".faq-item")).some(item => !item.hidden);
    }

    faqResultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? "întrebare afișată" : "întrebări afișate"}`;
    faqEmptyState.hidden = visibleCount !== 0;
    faqResetButton.hidden = faqSearchInput.value.length === 0;
}

// Open a question when its descriptive ID appears in the URL.
function openFaqFromHash() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    const item = faqItems.find(question => question.id === hash);
    if (!item) return;

    if (faqSearchInput.value) {
        faqSearchInput.value = "";
        updateFaqResults();
    }

    item.open = true;
    window.requestAnimationFrame(() => item.scrollIntoView({ block: "start" }));
}

faqSearchInput.addEventListener("input", updateFaqResults);
faqResetButton.addEventListener("click", function () {
    faqSearchInput.value = "";
    updateFaqResults();
    faqSearchInput.focus();
});
window.addEventListener("hashchange", openFaqFromHash);

// Keep the URL shareable whenever a question is expanded.
faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
        if (item.open) history.replaceState(null, "", `#${item.id}`);
    });
});

numberFaqQuestions();
updateFaqResults();
openFaqFromHash();
