
export const select = (_, el = document) => el.querySelector(_);
export const create = (_, el = document.body) => {
    var created = document.createElement(_);
    el.appendChild(created);
    return created;
};
export const wait = (t) => new Promise((_) => setTimeout(_, t * 1000));