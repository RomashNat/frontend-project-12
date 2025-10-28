const apiPath = '/api/v1'

export default {
    loginPath: () => [apiPath, 'login'].join('/'),
    getChannelsPath: () => [apiPath, 'channels'].join('/'),
    addMessagePath: () => [apiPath, 'messages'].join('/'),
}