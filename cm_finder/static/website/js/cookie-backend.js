NCN_CONFIG = {
    '29839': 6,
    '59430': 3
}
VISITED_COOKIE_NAME = 'visited_pages'

function markVisited(number) {
    // Get existing visited pages from cookies
    let visited = getCookie(VISITED_COOKIE_NAME);
    let visitedPages = visited ? visited.split(',') : [];

    // Avoid duplicates
    if (!visitedPages.includes(number)) {
        visitedPages.push(number);
        setCookie(VISITED_COOKIE_NAME, visitedPages.join(',')); // expires in 30 days
    }
}

function getClassNumber() {
    const url = window.location.href;
    const match = url.match(/\/cm_finder\/classes\/([^\/]+)/);
    // const match = url.match(/\/localhost:8000\/classes\/([^\/]+)\/index\.html/);

    return match[1];
}

function getVisited(number) {
    // Get existing visited pages from cookies
    let visited = getCookie(VISITED_COOKIE_NAME);
    let visitedPages = visited ? visited.split(',') : [];

    // Avoid duplicates
    return visitedPages.includes(number);
}

// Helper: Read cookie by name
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// Helper: Set a cookie
function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}


function outlineRows(n, undo) {
    const table = document.getElementById('mainTable');
    const rows = table.getElementsByTagName('tr');
    const style = '4px solid #881c1c';
    const lastRow = n + 1;

    const headerCells = rows[0].children;

    if (undo) {
        // Remove header cell bottom borders
        for (let cell of headerCells) {
            cell.style.borderBottom = '';
        }

        // Remove added border styles from rows
        for (let i = 0; i < lastRow; i++) {
            rows[i].style.borderTop = '';
            rows[i].style.borderBottom = '';
            rows[i].style.borderLeft = '';
            rows[i].style.borderRight = '';
            rows[i].style.fontWeight = '';
        }
    } else {
        // Add header cell bottom borders
        for (let cell of headerCells) {
            cell.style.borderBottom = style;
        }

        // Apply outline styles
        for (let i = 0; i < lastRow; i++) {
            let outline = '';

            if (i === 0 || i === 1) {
                outline = `border-top: ${style}; border-right: ${style}; border-left: ${style}`;
            } else if (i === lastRow - 1) {
                outline = `border-bottom: ${style}; border-right: ${style}; border-left: ${style}`;
            } else {
                outline = `border-left: ${style}; border-right: ${style};`;
            }

            rows[i].style.cssText += outline;
            rows[i].style.fontWeight = 'bold';
        }
    }
}


// Enable CSS which highlight new classmates / unhighlight new classmates
function tryClassHighlight() {
    let classNumber = getClassNumber();
    let visited = getVisited(classNumber)

    if (classNumber in NCN_CONFIG) {
        let highlightNum = NCN_CONFIG[classNumber]
        // if already visited, then also should undo
        outlineRows(highlightNum, visited)
        markVisited(classNumber)
    }
}

function tryMainHighlight() {
    let ids = Object.keys(NCN_CONFIG)
    
    ids.forEach(id => {
        let ele = document.getElementById(id)
        let textNode = ele.querySelector('.card-text')
        // does it exist on this page
        if (ele !== null) {
            // if it's not visited yet, update style
            if (!getVisited(id)) {
                ele.style.cssText += 'border-color: #881c1c;'
                textNode.innerHTML = `<strong>${NCN_CONFIG[id]} New Classmates</strong>`
            } else {
                // remove style we might have added
                ele.style.borderColor = ''
                textNode.innerHTML = 'No New Classmates'
            }
        }
    })
}

function addClassLogic() {
    let added = getCookie('added_class')

    // easier to delete than create
    if (!added) {
        document.getElementById('term_1247').remove()
    }
}

function trigger() {
    let url = window.location.href
    // individual class page
    if (url.includes('classes')) {
        tryClassHighlight()
    } else {
        // does highlighting for NCN
        tryMainHighlight()

        // updates page if they added class already
        addClassLogic()
    }
}

window.addEventListener("pageshow", trigger)