import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'index.scss';
import React from 'react';
import {render} from 'react-dom';
import App from 'app/App';

render(<App />, document.querySelector('.root'));
