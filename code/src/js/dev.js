import {enableSave} from './save';

if (ENV_DEV) {
  console.log('Environment: Development');
  document.querySelector('.save-buttons').classList.remove('hidden');
  enableSave();
} else { // if env === prod
  console.log('Environment: Production');
}
