/* @refresh reload */
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import App from './App';
import './app.css';

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/groups/:groupId" component={App} />
      <Route path="/search" component={App} />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
// /* @refresh reload */
// import { render } from 'solid-js/web';
// import { Route, Router } from '@solidjs/router';
// import App from './App';
// import './app.css';
// import PageWrapper from './components/PageWrapper';

// render(
//   () => (
//     <Router>
//       <Route path="/" component={PageWrapper}>
//         <Route path="/" component={App} />
//         <Route path="/groups/:groupId" component={App} />
//         <Route path="/search" component={App} />
//       </Route>
//     </Router>
//   ),
//   document.getElementById('root') as HTMLElement
// );
