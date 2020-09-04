const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');


function sendHttpRequest(method, url /* , data */ ) {
    // const promise = new Promise((resolve, reject) => {
    // const xhr = new XMLHttpRequest();
    // xhr.setRequestHeader('Content-Type', 'application/json');

    // xhr.open('GET', url);
    // xhr.responseType = 'json';

    // xhr.onload = function() {
    //     if (xhr.status >= 200 && xhr.status > 300) {
    //         resolve(xhr.response);
    //     } else {
    //         reject(new Error("Something went wrong!"));
    //     }
    // };

    // xhr.onerror = function() {
    //     reject(new Error("Failed to send request!"));
    // }

    // xhr.send();

    //});

    // return promise;

    return fetch(url, {
        method: method
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Server-Side: something went wrong!');
            });
        }
    }).catch(error => {
        throw new Error("Something went wrong!");
    });
}

async function fetchPosts(url /* , data */ ) {
    try {
        const responseData = await sendHttpRequest('GET', url /* , data */ );

        const listOfSearchPosts = responseData;

        for (const post of listOfSearchPosts.included) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.attributes.title;
            postEl.querySelector('h3').textContent = "Requirements: " + post.attributes.requirements;
            postEl.querySelector('p').textContent = "Responsibilities: " + post.attributes.responsibilities;
            postEl.querySelector('h4').textContent = "City: " + post.attributes.company.city;
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl);
        }
    } catch (error) {
        alert(error.message);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const postEl = document.importNode(postTemplate.content, true);
    postEl.querySelector('h2').textContent = "";
    postEl.querySelector('h3').textContent = "";
    postEl.querySelector('p').textContent = "";
    postEl.querySelector('h4').textContent = "";

    const value = event.currentTarget.querySelector('#title').value;
    const url = 'https://api.joblocal.de/v4/search-jobs';
    const finalURL = url + "?search.query=" + value + "";
    const data = "?search.query=" + value + "";

    fetchPosts(finalURL /* , data */ );
})