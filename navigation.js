const nav = document.querySelector(".nav");
const logo = nav.querySelector(".logo");
const menu = nav.querySelector(".menu");

const ranges = [...logo.querySelector("a").childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return range;
    });

function updateNav() {
    const tail = logo.querySelector(".logo-tail");
    const compact = tail &&
        getComputedStyle(tail).animationName === "shorten-logo";

    const logoWidth = compact
        ? ranges.reduce((total, range) =>
            total + range.getBoundingClientRect().width, 0)
        : logo.getBoundingClientRect().width;

    const menuWidth = [...menu.children].reduce((total, item) => {
        const style = getComputedStyle(item);
        return total + item.getBoundingClientRect().width
            + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }, 0);

    const gap = parseFloat(getComputedStyle(nav).columnGap) || 0;
    nav.classList.toggle("is-stacked",
        logoWidth + menuWidth + gap > nav.getBoundingClientRect().width);
}

const observer = new ResizeObserver(() => requestAnimationFrame(updateNav));
[nav, logo, menu, ...menu.children].forEach(element => observer.observe(element));
matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", updateNav);
updateNav();