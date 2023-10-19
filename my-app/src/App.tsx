import { Provider } from 'react-redux';
import './App.css';
import FullPage from './Home';
import store from './filesystem/redux/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <FullPage/>
      </Provider>
    </div>
  );
}

export default App;
