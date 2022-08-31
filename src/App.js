import './App.css';
import { Routes ,Route } from 'react-router-dom';
import Home from './home';
import MyView from './model-viewer/viewer'
import Uploadt from './Uploadt';
import OnlyViewer from './model-viewer/onlyViewer';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route path="/model-viewer/:id" element={<MyView/>} />
      {/* <Route path="/model-viewer/:id" element={<ViewerWebIFC/>} /> */}
      <Route path="/upload" element={<Uploadt/>} />

      <Route path="/onlyviewer/:id" element={<OnlyViewer/>} />
    </Routes>
  );
}

export default App;

