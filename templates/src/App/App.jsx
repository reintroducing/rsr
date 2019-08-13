import css from './App.scss';
import {hot} from 'react-hot-loader/root';
import React from 'react';

function App() {
    return (
        <div className={css.container}>
            App
        </div>
    );
}

export default hot(App);
