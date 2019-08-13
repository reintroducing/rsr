import css from './App.scss';
import {hot} from 'react-hot-loader/root';
import React from 'react';

function App() {
    return (
        <div className={css.container}>
            <p>rSR App created successfully!</p>
        </div>
    );
}

export default hot(App);
