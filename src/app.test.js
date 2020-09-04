const { sendHttpRequest } = require('./app');
const { ValidationError } = require('./app');

test('should return response data', () => {
    const value = '';
    const url = 'https://api.joblocal.de/v4/search-jobs';
    const finalURL = url + '?search.query=' + value + '';
    const httpVerb = 'GET';

    const responseData = sendHttpRequest(httpVerb, finalURL);

    expect(responseData).toBeTruthy();
});

test('the response data to be undefined', () => {
    const value = '111';
    const url = 'https://api.joblocal.de/v4/search-jobs';
    const finalURL = url + '?search.query=' + value + '';
    const httpVerb = 'GET';

    expect(sendHttpRequest(httpVerb, finalURL).included).not.toBeNull();
});

test('the response data to be undefined', () => {
    const value = 'city=Hamburg';
    const url = 'https://api.joblocal.de/v4/search-jobs';
    const finalURL = url + '?search.query=' + value + '';
    const httpVerb = 'GET';

    expect(sendHttpRequest(httpVerb, finalURL)).not.toBeUndefined();
});

describe('Validate Error', () => {
    test('are not semantically the same', () => {
        expect(new ValidationError('Error')).not.toStrictEqual({
            name: 'ValidateError',
        });
    });
});