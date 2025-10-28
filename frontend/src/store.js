import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice.jsx'
// import channelsReducer from './slices/channelsSlice.jsx'
// import messagesReducer from './slices/messagesSlice.jsx'


const store = configureStore({
    reducer: {
        auth: authReducer,
        // channels: channelsReducer,
        // messages: messagesReducer,
    },
})

export default store