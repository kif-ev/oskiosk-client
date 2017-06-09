export const ConfigLoader = new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './oskiosk.json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
        }
        else {
            reject("Cannot load configuration...");
        }
    };
    xhr.send();
});