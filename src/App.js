import './App.css';
import { Routes ,Route } from 'react-router-dom';
import Home from './home';
import MyView from './model-viewer/viewer'
import Uploadt from './Uploadt';
import ViewerWebIFC from './model-viewer/viewer-ifc';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route path="/model-viewer/:id" element={<MyView/>} />
      {/* <Route path="/model-viewer/:id" element={<ViewerWebIFC/>} /> */}
      <Route path="/upload" element={<Uploadt/>} />
    </Routes>
  );
}

export default App;

