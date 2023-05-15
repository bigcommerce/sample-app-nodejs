import { FetchMock } from 'jest-fetch-mock';
import { createAppExtension, getAppExtensions } from '@lib/appExtensions';

const customGlobal: any = global;

const { Response } = jest.requireActual('node-fetch');

customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchResponse = Response;

const fetchMock = customGlobal.fetch as FetchMock;

describe('App Extensions', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('createAppExtension should return a new App Extension request body', async () => {
        const requestBody = await createAppExtension();

        expect(requestBody).toEqual(
            expect.objectContaining({
                query: expect.any(String),
                variables: expect.any(Object),
            })
        );

        expect(requestBody.variables.input).toEqual(
            expect.objectContaining({
                context: 'PANEL',
                model: 'PRODUCTS',
                url: expect.any(String),
            })
        );
    });

    test('getAppExtensions should return an App Extensions request body', async () => {
        const requestBody = await getAppExtensions();

        expect(requestBody).toEqual(
            expect.objectContaining({
                query: expect.any(String),
            })
        );
    });
});
