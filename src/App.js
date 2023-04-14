import Layout from 'components/layout'
import Theme from 'components/template/Theme'
import appConfig from 'configs/app.config'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import '../src/app.css'
import history from './history'
import './locales'
import mockServer from './mock'
import store, { persistor } from './store'

const environment = process.env.NODE_ENV

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (environment !== 'production' && appConfig.enableMock) {
    mockServer({ environment })
}

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter history={history}>
                    <Theme>
                        <Layout />
                    </Theme>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}

export default App
