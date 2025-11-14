const apiPath = '/api/v1'

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  getChannelsPath: () => [apiPath, 'channels'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  channelPath: id => [apiPath, 'channels', id].join('/'),
  addMessagePath: () => [apiPath, 'messages'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
}
