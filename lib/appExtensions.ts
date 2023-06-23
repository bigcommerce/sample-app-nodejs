export const createAppExtension = async ({ accessToken, storeHash }: { accessToken: string, storeHash: string }) => {
    const response = await fetch(
        `https://${process.env.API_URL}/stores/${storeHash}/graphql`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "x-auth-token": accessToken,
          },
          body: JSON.stringify(createAppExtensionMutation()),
        }
    );

    const { errors } = await response.json();
  
    if (errors && errors.length > 0) {
      throw new Error(errors[0]?.message);
    }
}

//  Builds the GraphQL mutation required to create a new App Extension
export function createAppExtensionMutation() {
    const body = {
        query: `
        mutation AppExtension($input: CreateAppExtensionInput!) {
            appExtension {
                createAppExtension(input: $input) {
                appExtension {
                    id
                    context
                    label {
                    defaultValue
                    locales {
                        value
                        localeCode
                        }
                    }
                    model
                    url
                    }
                }
            }
        }`,
        variables: {
            input: {
                context: 'PANEL',
                model: 'PRODUCTS',
                url: '/productAppExtension/${id}',
                label: {
                    defaultValue: 'View Inside Sample App',
                    locales: [
                        {
                            value: 'View Inside Sample App',
                            localeCode: 'en-US',
                        },
                        {
                            value: 'Ver dentro de la aplicación de muestra',
                            localeCode: 'es-ES',
                        },
                    ],
                },
            },
        },
    };

    const requestBody = {
        query: body.query,
        variables: body.variables,
    };

    return requestBody;
}

// Builds the GraphQL query required to retrieve all App Extensions installed on a store
export function getAppExtensions() {
    const body = {
        query: `
            query {
                store {
                    appExtensions {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }`,
    };

    return body;
}
