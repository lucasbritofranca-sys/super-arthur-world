import { bootstrap } from './app/bootstrap';
import './style.css';
const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('missing_app_root');
const dispose = bootstrap(root);
if (import.meta.hot) import.meta.hot.dispose(dispose);
