function filterByTag(tag) {
    const cards = document.querySelectorAll(".card");
    for (const card of cards) {
        const tags = card.getAttribute("data-tags");
        const tagList = tags.split(" ");

        if (tagList.includes(tag)) {
            card.parentElement.classList.remove("hidden");
        } else {
            card.parentElement.classList.add("hidden");
        }
    }
}

//get all filter links
const filters = document.querySelectorAll(".filter");
const hash = window.location.hash.substr(1);

for (const filter of filters) {
    filter.addEventListener("click", function (event) {
        event.preventDefault();
        for (const f of filters) {
            f.classList.remove("active");
        }
        this.classList.add("active");
        filterByTag(this.getAttribute("data-filter"));
        window.location.hash = this.getAttribute("data-filter");
    });
}

for (const filter of filters) {
    const dataFilter = filter.getAttribute("data-filter");
    if (hash === dataFilter) {
        for (const f of filters) {
            f.classList.remove("active");
        }
        filter.classList.add("active");
        filterByTag(dataFilter);
    }
}