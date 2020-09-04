const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const searchCountElement = document.querySelector('#search-count');

// class which extents from Error
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// function to send http request
function sendHttpRequest(method, url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'json';

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error('Something went wrong!'));
            }
        };

        xhr.onerror = function() {
            reject(new Error('Failed to send request!'));
        };

        xhr.send();
    });

    return promise;
}

// function which update DOM after getting the http response
async function fetchPosts(url) {
    try {
        // try block
        const responseData = await sendHttpRequest('GET', url);

        const listOfSearchPosts = responseData;

        // eslint-disable-next-line no-prototype-builtins
        if (!listOfSearchPosts.hasOwnProperty('included')) {
            searchCountElement.textContent =
                'the search result failed and count is undefined!';
            alert('Enter valid search query!');
        } else {
            if (
                listOfSearchPosts.included.length !== undefined ||
                listOfSearchPosts.included.length !== null
            ) {
                searchCountElement.textContent =
                    'the job search count is :' + listOfSearchPosts.included.length;
            } else {
                alert('Undefined length!'); // Invalid data: No field: name
            }
            let i = 0;
            for (i = 0; i < listOfSearchPosts.included.length; ++i) {
                const post = listOfSearchPosts.included[i];
                const postEl = document.importNode(postTemplate.content, true);
                postEl.querySelector('h2').textContent = post.attributes.title;
                postEl.querySelector('h3').textContent =
                    'Requirements: ' + post.attributes.requirements;
                postEl.querySelector('p').textContent =
                    'Responsibilities: ' + post.attributes.responsibilities;
                postEl.querySelector('h4').textContent =
                    'City: ' + post.attributes.company.city;
                postEl.querySelector('li').id = post.id;
                listElement.append(postEl);
            }
        }
    } catch (error) {
        // catch block
        if (error instanceof ValidationError) {
            alert('Invalid data: ' + error.message); // invalid data
        } else if (error instanceof SyntaxError) {
            alert('JSON Syntax Error: ' + error.message); // syntax error
        } else {
            throw error; // unknown error, rethrow it (**)
        }
    }
}

// function to clear job search list
function clearJobSearchList() {
    var ul = document.querySelector('.posts');
    var listLength = ul.children.length;
    let i = 0;

    for (i = 0; i < listLength; i++) {
        ul.removeChild(ul.children[0]);
    }
}

// event listener for submit button
// eslint-disable-next-line arrow-parens

document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearJobSearchList();
        const value = event.currentTarget.querySelector('#title').value;
        const url = 'https://api.joblocal.de/v4/search-jobs';
        const finalURL = url + '?search.query=' + value + '';

        fetchPosts(finalURL);
    });
});

module.exports = {
    sendHttpRequest,
    ValidationError,
};